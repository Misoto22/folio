import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'styles')
const controls = readFileSync(join(ROOT, 'website-controls.css'), 'utf8')
const search = readFileSync(join(ROOT, 'website-search.css'), 'utf8')
const base = readFileSync(join(ROOT, 'website-base.css'), 'utf8')
const keyframes = readFileSync(join(ROOT, 'keyframes.css'), 'utf8')
const media = readFileSync(join(ROOT, 'website-media.css'), 'utf8')

describe('website interaction styles', () => {
  it('keeps editable compact fields at 16px on phone-sized viewports', () => {
    expect(controls).toMatch(/@media \(max-width: 40rem\)[\s\S]*\.m22-collection-search input,[\s\S]*\.m22-question-card form input \{ font-size: 1rem; \}/)
    expect(search).toMatch(/@media \(max-width: 40rem\)[\s\S]*\.m22-search-palette__search input \{ font-size: 1rem; \}/)
  })

  it('keeps the media-detail return control above 44px after browser rounding', () => {
    expect(media).toMatch(/\.m22-media-index-bar > :is\(a, button\) \{ min-inline-size: 44\.25px; min-block-size: 44\.25px; \}/)
  })

  it('gives the keyboard chart surface the shared visible focus ring', () => {
    // The chart ring ships with the core layers, so an application using the
    // charts keeps it without importing any website stylesheet.
    expect(keyframes).toContain("[data-slot='chart'] svg.recharts-surface[tabindex]:focus-visible")
    expect(keyframes).toContain('outline: var(--focus-w) solid var(--focus);')
    expect(base).toContain('outline: var(--focus-w) solid var(--website-focus, var(--focus));')
  })

  it('keeps compact collection filters wide enough for a thumb', () => {
    expect(controls).toContain('.m22-collection-filters>button { min-inline-size: 44px; min-block-size: 34px;')
  })
})
