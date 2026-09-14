import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { STORAGE_KEYS } from '../src/lib/storage-keys'
import { ROUTES } from './routes'

/**
 * axe, in a real browser, on every page — in both themes.
 *
 * This is where the half a jsdom suite cannot reach gets checked:
 *
 *   colour-contrast   needs layout and computed colour; jsdom has neither, so
 *                     a unit axe pass silently skips the single rule a
 *                     monochrome system is most likely to break.
 *   region            needs a whole document to ask whether content sits
 *                     inside a landmark.
 *   page-has-heading-one, landmark-one-main
 *                     are properties of a page, not of a component.
 *
 * Both themes, because the dark side is a value swap on the same token names.
 * A contrast ratio that clears AA on paper can fail on ink, and nothing in the
 * light-mode pass would notice.
 */
const THEMES = ['light', 'dark'] as const

/**
 * A component page hides half of itself behind a tab, and axe only sees what
 * is rendered.
 *
 * The Properties panel is where the interactive controls live — a switch, a
 * select and a stepper per steerable prop — so it is the half of the page
 * most likely to break a contrast or a naming rule, and it was the half
 * nothing swept. Clicking through costs one more axe run on a page that is
 * already loaded, not a second page load.
 */
const COMPONENT_ROUTE = /^\/(zh\/)?components\/[^/]+\/$/

async function setTheme(page: Page, theme: (typeof THEMES)[number]) {
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
}

/**
 * Resolves once nothing on the page is still moving.
 *
 * axe reads COMPUTED colour, and `folio-panel-in` opens at `opacity: 0`
 * (`packages/design/src/styles/keyframes.css`). A sweep that starts the instant
 * the tab is clicked therefore measures the panel's text part-way through its
 * fade: `--ink-3-aa` is `#5c5c5c`, axe read `#8f8f8f`, and the contrast failure
 * it reported belongs to a colour that exists for a tenth of a second and is
 * gone by the time anybody reads the page.
 *
 * Waiting on the animations rather than on a duration. A fixed sleep is a
 * slower suite that still flakes the first time a curve gets longer, and it
 * would be waiting for a number rather than for the thing the number describes.
 *
 * Two ways this could hang, and neither does. Animations that never end —
 * Spinner, the indeterminate Progress bar, the StatusDot halo, all declared
 * `infinite` — have a `finished` that never settles, so an infinite iteration
 * count is left out. And an element with nothing running resolves an empty
 * `Promise.all` immediately, which is also the reduced-motion case: the media
 * query at the foot of `keyframes.css` sets `animation: none` on
 * `[data-folio-animated]`, so there is no animation to find and no wait to serve.
 */
async function settle(page: Page) {
  await page.evaluate(async () => {
    // One frame first, or this asks the wrong question. A CSS animation does
    // not exist until the style recalculation that follows the commit that
    // mounted it, so `getAnimations()` called in the same turn as the click
    // returns an empty list and resolves instantly — leaving axe measuring the
    // very fade this is here to wait out. It only bites under load, which is
    // the worst way to find it: three different pages failed once each across
    // four full-suite runs and passed alone every time.
    await new Promise(requestAnimationFrame)

    const running = document
      .getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)

    // A cancelled animation REJECTS `finished`. Torn down mid-flight is still
    // "no longer painting a transient colour", which is the whole question here.
    await Promise.all(running.map((animation) => animation.finished.catch(() => {})))
  })
}

/** One axe pass over whatever is currently rendered, named so a failure says where. */
async function sweep(page: Page, where: string) {
  const results = await new AxeBuilder({ page })
    // `best-practice` as well as the WCAG sets. It is the same axe run —
    // no extra time — and it is the half that catches a heading order
    // that jumps a level, two landmarks sharing a name, and a column
    // header with no text. None of those fail a WCAG success criterion
    // and all of them make a page harder to navigate by ear.
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()

  const summary = results.violations
    .map(
      (violation) =>
        `${where}: ${violation.id} (${violation.impact}) — ${violation.help}\n` +
        violation.nodes.map((node) => `    ${node.target.join(' ')}`).join('\n'),
    )
    .join('\n')

  expect(results.violations, summary).toEqual([])
}

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    for (const route of ROUTES) {
      test(`${route} has no axe violations`, async ({ page }) => {
        await setTheme(page, theme)
        await page.goto(route)
        await expect(page.locator('main')).toBeVisible()
        // The inline theme script runs before paint; assert it actually did,
        // so a failure here is "the theme did not apply" rather than a
        // confusing pile of contrast violations.
        await expect(page.locator('html')).toHaveAttribute('data-mode', theme)

        await settle(page)
        await sweep(page, route)

        if (COMPONENT_ROUTE.test(route)) {
          // The tab is named in the reader's own language; match either.
          const properties = page.getByRole('tab', { name: /Properties|属性面板/ })
          await properties.click()
          // The same React commit that selects the tab mounts the panel that
          // animates, so this is what makes `settle` a wait rather than a
          // lookup that ran before there was anything to find.
          await expect(properties).toHaveAttribute('aria-selected', 'true')

          await settle(page)
          await sweep(page, `${route} (properties)`)
        }
      })
    }
  })
}
