/**
 * Regenerates the two images the root README opens with, from the running
 * documentation site.
 *
 * They are screenshots of the real site rather than drawn artwork so that a
 * component, a token or the component count cannot drift from what the README
 * shows — the same reason the site's prop tables are parsed rather than typed.
 *
 *   pnpm --filter @misoto22/folio-docs dev        # in one shell
 *   node apps/docs/scripts/shoot-readme-images.mjs # in another
 *
 * Point it elsewhere with DOCS_URL=https://ui.misoto22.com.
 */

import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const BASE = process.env.DOCS_URL ?? 'http://localhost:4023'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../assets')

const SHOTS = [
  {
    name: 'hero',
    path: '/',
    // The page's own header: the wordmark, the sentence, and the three actions.
    selector: 'main header',
    // The site's sticky chrome overlaps anything captured near the top of the
    // page, so the breathing room goes on the element rather than on a clip.
    style: 'main header { padding: 56px 64px; border-bottom: none }',
  },
  {
    name: 'preview',
    path: '/templates/dashboard',
    // The dashboard template — twelve primitives composed into one screen.
    // `data-fluid-frame` is the frame's own hook; its parent is the bordered
    // board, which is what should be photographed.
    selector: 'div:has(> [data-fluid-frame])',
  },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()

for (const shot of SHOTS) {
  for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 1100 },
      deviceScaleFactor: 2,
    })
    // The site picks its mode from `prefers-color-scheme` when the visitor has
    // never chosen one, so emulating the media query is enough — no need to
    // reach into the page and set `data-mode` by hand.
    //
    // Animations mid-flight photograph as half-drawn components.
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
    await page.goto(BASE + shot.path, { waitUntil: 'networkidle' })
    if (shot.style) await page.addStyleTag({ content: shot.style })

    const target = page.locator(shot.selector)
    if ((await target.count()) !== 1) {
      throw new Error(`${shot.name}: ${await target.count()} matches for ${shot.selector}`)
    }

    // Web fonts and the token stylesheet both settle after first paint.
    await page.waitForTimeout(1200)

    const file = `${OUT}/${shot.name}-${colorScheme}.png`
    await target.screenshot({ path: file })
    console.log(`wrote ${file}`)
    await page.close()
  }
}

await browser.close()
