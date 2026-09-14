import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { STORAGE_KEYS } from '../src/lib/storage-keys'
import { ROUTES } from './routes'

/**
 * The site at phone width.
 *
 * Everything else in this suite runs at a desktop viewport, which is how a page
 * that scrolls sideways on a phone shipped: nothing was looking. These are the
 * two failures that are invisible on a laptop and total on a phone — a page
 * wider than the screen, and a control too small to hit.
 */
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

test('no page is wider than the phone it is read on', async ({ page }) => {
  // One test rather than one per route, because the check is a loop of
  // navigations and paying browser startup a hundred and seventy times to
  // parallelise it costs more than it saves. The consequence is that the time
  // budget has to SCALE with the site: a fixed 30 s passed until the charts
  // entry added forty pages, and then failed on CI while still passing on a
  // warm laptop — the least useful way for a suite to break.
  test.setTimeout(Math.max(60_000, ROUTES.length * 1_500))

  const wide: { route: string; over: number; culprit: string }[] = []

  for (const route of ROUTES) {
    await page.goto(route)
    const result = await page.evaluate(() => {
      const width = document.documentElement.clientWidth
      const over = Math.round(document.documentElement.scrollWidth - width)
      if (over <= 1) return null
      // A table or a code block scrolling INSIDE its own box is the design;
      // only something dragging the document sideways counts.
      const scrolls = (element: Element) => {
        for (let node = element.parentElement; node; node = node.parentElement) {
          if (/auto|scroll/.test(getComputedStyle(node).overflowX)) return true
        }
        return false
      }
      const culprit = [...document.querySelectorAll('body *')].find((element) => {
        const box = element.getBoundingClientRect()
        return box.width > 0 && box.right > width + 1 && !scrolls(element)
      })
      return { over, culprit: (culprit?.className ?? '').toString().slice(0, 70) }
    })
    if (result) wide.push({ route, ...result })
  }

  expect(wide).toEqual([])
})

test('every control in the top bar can be hit with a thumb', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Switch to the (light|dark) theme/ })).toBeVisible()

  // `size="sm"` is 36px, which the Button docs are explicit about being under
  // the pointer-target floor. The bar overrides it on a coarse pointer.
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('header a, header button')]
      // Zero-sized means `hidden` at this width, not an unhittable control.
      .filter((element) => {
        const box = element.getBoundingClientRect()
        return box.height > 0 && box.height < 44
      })
      .map((element) => element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '?'),
  )
  expect(small).toEqual([])
})

test('the copy control is reachable without a hover', async ({ page }) => {
  await page.goto('/')
  const copy = page.getByRole('button', { name: /Copy the snippet/ }).first()

  // It is revealed by `group-hover` on a mouse. A touch screen has no hover, so
  // the control simply did not exist there.
  await expect(copy).toBeVisible()
  const box = (await copy.boundingBox())!
  expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44)
})

test('the drawer opens, closes, and carries the index of the open section', async ({ page }) => {
  await page.goto('/components/button/')
  await expect(page.getByRole('button', { name: /Switch to the (light|dark) theme/ })).toBeVisible()

  // The rail IS the nav now. It used to be an `<aside>` with a second `<nav>`
  // inside it — two landmarks for one column — and the shell hand-rolled the
  // drawer around them; the package's Sidebar is both.
  const nav = page.getByRole('navigation', { name: 'Documentation' })
  const aside = nav

  // Closed means unreachable, not merely off-screen: `inert` is what takes its
  // sixty links out of the tab order and out of the accessibility tree. A
  // translate alone left them all in front of the page the reader was on.
  await expect(aside).toHaveAttribute('inert', '')
  expect((await aside.boundingBox())!.x).toBeLessThan(0)

  await page.getByRole('button', { name: 'Open the navigation' }).click()
  await expect(aside).not.toHaveAttribute('inert', '')
  // The open section's own tree, and only that. The four sections used to be
  // repeated at the top of the drawer, because they live in the masthead on a
  // desktop and had nowhere to go on a phone. They have their own strip under
  // the masthead now, so opening the drawer gives the reader the index they
  // asked for rather than four rows of something else in front of it.
  //
  // The row for the page being read, by `aria-current` rather than by the name
  // of a link. This used to look for an "All components" row the rail put at
  // the top of every component group whether anyone wanted it or not; that row
  // is gone, and asserting the current page is here is the claim the test was
  // making all along — the drawer carries the INDEX OF THE OPEN SECTION, and
  // the open section is the one holding the reader.
  await expect(nav.locator('a[aria-current="page"]')).toBeVisible()
  await expect(aside.getByRole('link', { name: 'Templates' })).toHaveCount(0)

  // Polled: the drawer slides in on --duration-slow, and reading the box once
  // catches it mid-travel.
  await expect.poll(async () => Math.round((await aside.boundingBox())!.x)).toBe(0)
  const drawer = (await aside.boundingBox())!
  expect(drawer.x + drawer.width).toBeLessThanOrEqual(391)

  // The scrim carries the same name, so this names the control inside the drawer.
  await aside.getByRole('button', { name: 'Close the navigation' }).click()
  await expect(aside).toHaveAttribute('inert', '')
})

test('the four sections are reachable without opening the drawer', async ({ page }) => {
  await page.goto('/components/button/')
  const strip = page.getByRole('navigation', { name: 'Sections' })

  // Visible on arrival: the whole point is that a reader on a component page
  // can SEE that templates and themes exist without going looking for them.
  await expect(strip).toBeVisible()
  for (const name of ['Docs', 'Components', 'Templates', 'Themes']) {
    await expect(strip.getByRole('link', { name, exact: true })).toBeVisible()
  }
  await expect(strip.getByRole('link', { name: 'Components', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  // Sticky, not scrolled away. A strip that leaves with the first screen, on a
  // drawer that no longer carries the sections, would strand the middle of a
  // long page with no way across the site.
  await page.evaluate(() => window.scrollTo(0, 2000))
  await expect.poll(async () => Math.round((await strip.boundingBox())!.y)).toBe(64)

  // Whatever the labels measure in a given language, they overflow INTO the
  // strip rather than dragging the document sideways. The sweep at the top of
  // this file is what enforces the second half; this is the first.
  await expect(strip).toHaveCSS('overflow-x', 'auto')
  const box = (await strip.boundingBox())!
  expect(box.x + box.width).toBeLessThanOrEqual(391)

  await strip.getByRole('link', { name: 'Themes', exact: true }).click()
  await expect(page).toHaveURL(/\/themes\/$/)
})

test('the overlays fit the screen they open on', async ({ page }) => {
  await page.goto('/components/button/')
  await expect(page.getByRole('button', { name: /Switch to the (light|dark) theme/ })).toBeVisible()

  const fits = async (name: string) => {
    const box = (await page.getByRole('dialog').first().boundingBox())!
    expect(box.x, `${name} escapes the left edge`).toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width, `${name} escapes the right edge`).toBeLessThanOrEqual(391)
  }

  await page.getByRole('button', { name: /Search/ }).first().click()
  await fits('the palette')
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: 'Theme', exact: true }).click()
  await fits('the theme panel')
})

/**
 * axe at phone width.
 *
 * The full sweep runs at a desktop viewport, and the DOM is the same at both —
 * so this is not a second copy of it. It is a handful of routes where the
 * RESPONSIVE layout changes what is rendered: the shell swaps a column for a
 * drawer, the example canvas reflows, the templates change their grid.
 */
const RESPONSIVE = ['/', '/components/app-shell/', '/components/table/', '/templates/dashboard/']

for (const theme of ['light', 'dark'] as const) {
  for (const route of RESPONSIVE) {
    test(`${theme}: ${route} has no axe violations on a phone`, async ({ page }) => {
      await page.addInitScript(
        ({ key, value }) => {
          try {
            window.localStorage.setItem(key, value)
          } catch {
            // A storage-blocked context still gets the attribute below.
          }
        },
        { key: STORAGE_KEYS.mode, value: theme },
      )
      await page.goto(route)
      await expect(page.locator('html')).toHaveAttribute('data-mode', theme)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze()

      const summary = results.violations
        .map((v) => `${v.id} (${v.impact}) — ${v.help}\n    ${v.nodes[0]?.target.join(' ')}`)
        .join('\n')
      expect(results.violations, summary).toEqual([])
    })
  }
}
