import { expect, test } from '@playwright/test'
import { LEGACY_KEY_PAIRS, STORAGE_KEYS } from '../src/lib/storage-keys'

/**
 * A returning reader's saved preferences survive the move to the `folio-` keys.
 *
 * The unit test runs the pre-paint script against jsdom; this runs the export
 * that ships, where the only thing that matters is what the document looks like
 * before anything paints. A preference that is applied correctly on hydration
 * but not before it is the white flash the inline script exists to prevent, and
 * the reader sees that as the site forgetting them.
 */

interface Painted {
  mode?: string
  accent?: string
  radius?: string
}

declare global {
  interface Window {
    __painted?: Record<string, Painted>
  }
}

test('a legacy dark theme is on the document before the first paint, and copied forward', async ({ page }) => {
  const seeds: [string, string][] = [
    [LEGACY_KEY_PAIRS.mode[0], 'dark'],
    [LEGACY_KEY_PAIRS.accent[0], 'cobalt'],
    [LEGACY_KEY_PAIRS.theme[0], JSON.stringify({ radius: 'sharp' })],
  ]

  await page.addInitScript((entries) => {
    for (const [key, value] of entries) window.localStorage.setItem(key, value)

    const record = (moment: string) => {
      const data = document.documentElement.dataset
      window.__painted = {
        ...window.__painted,
        [moment]: { mode: data.mode, accent: data.accent, radius: data.radius },
      }
    }
    // A browser cannot paint a body that has not been parsed, so the moment
    // `<body>` enters the tree is the earliest a flash could be seen — well
    // before DOMContentLoaded, and before any of React's async chunks.
    const observer = new MutationObserver(() => {
      if (!document.body) return
      record('body')
      observer.disconnect()
    })
    observer.observe(document, { childList: true, subtree: true })
    document.addEventListener('DOMContentLoaded', () => record('domcontentloaded'), { once: true })
  }, seeds)

  await page.goto('/components/button/')

  const painted = await page.evaluate(() => window.__painted)
  const expected: Painted = { mode: 'dark', accent: 'cobalt', radius: 'sharp' }
  expect(painted?.body, 'the document when <body> was parsed').toEqual(expected)
  expect(painted?.domcontentloaded, 'the document at DOMContentLoaded').toEqual(expected)

  const stored = await page.evaluate(
    (keys) => Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)])),
    [STORAGE_KEYS.mode, STORAGE_KEYS.accent, STORAGE_KEYS.theme, LEGACY_KEY_PAIRS.mode[0]],
  )
  expect(stored).toEqual({
    [STORAGE_KEYS.mode]: 'dark',
    [STORAGE_KEYS.accent]: 'cobalt',
    [STORAGE_KEYS.theme]: JSON.stringify({ radius: 'sharp' }),
    // Left in place, so a revert of the rename still reads it.
    [LEGACY_KEY_PAIRS.mode[0]]: 'dark',
  })
})

/**
 * `SidebarProvider` reads its key after mount, never before paint, so nothing of
 * its own ever looks at the legacy name. The pre-paint copy is its whole
 * migration, and this is the check that the copy lands before the read.
 */
test('a rail put away under the legacy key stays put away', async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.setItem(key, 'closed'), LEGACY_KEY_PAIRS.sidebar[0])

  await page.goto('/components/button/')

  await expect(page.getByRole('button', { name: 'Show the sidebar' })).toBeVisible()
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEYS.sidebar))
    .toBe('closed')
})
