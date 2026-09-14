import { expect, test } from '@playwright/test'

test('compact records use the reading column when their optional index is absent', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/collection/')
  const example = page.locator('[data-example="Collection/01-searchable-records"]')
  const row = example.locator('.m22-record-link').first()
  const copy = row.locator('.m22-record-copy')
  await expect(copy.getByRole('heading', { name: 'A practice of attention' })).toBeVisible()
  const rowBounds = await row.boundingBox()
  const copyBounds = await copy.boundingBox()
  expect(rowBounds).not.toBeNull()
  expect(copyBounds).not.toBeNull()
  expect(copyBounds!.width).toBeGreaterThan(rowBounds!.width / 2)
})

test('site navigation is laid out against its preview rather than the window', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/site-navigation/')
  const frame = page.locator('[data-example="SiteNavigation/01-navigation-and-preferences"] [data-canvas="preview"]')
  const navigation = frame.locator('.m22-site-navigation')
  const language = navigation.getByRole('button', { name: 'Language' })
  await expect(language).toBeVisible()
  // `toBeVisible` ignores clipping, and clipping is the failure: a header as
  // wide as the window pushed its links and preferences past the card's edge.
  const frameBounds = (await frame.boundingBox())!
  const navigationBounds = (await navigation.boundingBox())!
  const languageBounds = (await language.boundingBox())!
  expect(navigationBounds.x).toBeGreaterThanOrEqual(frameBounds.x - 1)
  expect(navigationBounds.x + navigationBounds.width).toBeLessThanOrEqual(frameBounds.x + frameBounds.width + 1)
  expect(languageBounds.x + languageBounds.width).toBeLessThanOrEqual(frameBounds.x + frameBounds.width)
})

/** The computed outline on whatever currently has focus, with whether it is keyboard focus. */
const focusedOutline = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    const style = getComputedStyle(el)
    return { focusVisible: el.matches(':focus-visible'), style: style.outlineStyle, offset: style.outlineOffset }
  })

// The site-wide ring used to sit outside every cascade layer, so it beat the
// `outline-none` utility a primitive asks for and drew a clipped square around
// the Command input. Layered, the utility wins again.
test("a primitive's outline utility wins over the site-wide focus ring", async ({ page }) => {
  await page.goto('/zh/components/command/')
  const input = page.locator('[data-example="Command/01-inline"] input').first()
  await input.scrollIntoViewIfNeeded()
  await input.focus()
  expect(await focusedOutline(page)).toMatchObject({ focusVisible: true, style: 'none' })
})

test('website compositions keep the site-wide focus ring', async ({ page }) => {
  await page.goto('/patterns/collection/')
  const filter = page.locator('[data-example="Collection/01-searchable-records"] .m22-collection-filters > button').first()
  await filter.scrollIntoViewIfNeeded()
  await page.keyboard.press('Tab')
  await filter.focus()
  expect(await focusedOutline(page)).toMatchObject({ focusVisible: true, style: 'solid', offset: '3px' })
})

test('media detail return control retains its touch target after browser rounding', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 1000 })
  await page.goto('/components/media/')
  const example = page.locator('[data-example="Media/02-photograph-detail"]')
  const backLink = example.getByRole('link', { name: 'Back to field observations' })
  await expect(backLink).toBeVisible()
  const bounds = await backLink.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.width).toBeGreaterThanOrEqual(44)
  expect(bounds!.height).toBeGreaterThanOrEqual(44)
})

/**
 * The compositions had a section of their own at /patterns/ before they became
 * the Website group of the catalogue, and links to it are out in the world.
 * `serve-out.mjs` reads the same `_redirects` Cloudflare Pages does, so this is
 * the redirect production serves rather than a stand-in for it.
 */
test('an address from the retired Patterns section lands on the page that replaced it', async ({ page }) => {
  await page.goto('/patterns/collection/')
  await expect(page).toHaveURL(/\/components\/collection\/$/)
  // By name: the Collection example on the page renders a heading of its own.
  await expect(page.getByRole('heading', { level: 1, name: 'Collection', exact: true })).toBeVisible()

  await page.goto('/zh/patterns/')
  await expect(page).toHaveURL(/\/zh\/components\/#website$/)
  await expect(page.getByRole('heading', { name: '网站', exact: true })).toBeVisible()
})
