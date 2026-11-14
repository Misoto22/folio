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
const conversation = readFileSync(join(ROOT, 'website-conversation.css'), 'utf8')
const evidence = readFileSync(join(ROOT, 'website-evidence.css'), 'utf8')
const recovery = readFileSync(join(ROOT, 'website-recovery.css'), 'utf8')
const actions = readFileSync(join(ROOT, 'website-actions.css'), 'utf8')

const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** The bodies of every `@media` block whose condition contains `query`, and the sheet without any motion block. */
function motionBlocks(css: string, query: string): { inside: string; outside: string } {
  const text = strip(css)
  let inside = ''
  let outside = ''
  let cursor = 0
  for (const match of text.matchAll(/@media [^{]*\(prefers-reduced-motion: [a-z-]+\)[^{]*\{/g)) {
    const open = match.index! + match[0].length
    let depth = 1
    let end = open
    while (depth > 0 && end < text.length) {
      if (text[end] === '{') depth++
      else if (text[end] === '}') depth--
      end++
    }
    outside += text.slice(cursor, match.index)
    if (match[0].includes(query)) inside += text.slice(open, end - 1)
    cursor = end
  }
  return { inside, outside: outside + text.slice(cursor) }
}

describe('website interaction styles', () => {
  it('keeps editable compact fields at 16px on phone-sized viewports', () => {
    expect(controls).toMatch(/@media \(max-width: 40rem\)[\s\S]*\.folio-collection-search input,[\s\S]*\.folio-question-card form input \{ font-size: 1rem; \}/)
    expect(search).toMatch(/@media \(max-width: 40rem\)[\s\S]*\.folio-search-palette__field input \{ font-size: 1rem; \}/)
  })

  it('keeps the media-detail return control above 44px after browser rounding', () => {
    expect(media).toMatch(/\.folio-media-index-bar > :is\(a, button\) \{ min-inline-size: 44\.25px; min-block-size: 44\.25px; \}/)
  })

  it('gives the keyboard chart surface the shared visible focus ring', () => {
    // The chart ring ships with the core layers, so an application using the
    // charts keeps it without importing any website stylesheet.
    expect(keyframes).toContain("[data-slot='chart'] svg.recharts-surface[tabindex]:focus-visible")
    expect(keyframes).toContain('outline: var(--focus-w) solid var(--focus);')
    expect(base).toContain('outline: var(--focus-w) solid var(--website-focus, var(--focus));')
  })

  it('keeps compact collection filters wide enough for a thumb', () => {
    expect(controls).toContain('.folio-collection-filters>button { min-inline-size: 44px; min-block-size: 34px;')
  })
})

describe('ask motion under prefers-reduced-motion', () => {
  it('starts no conversation or evidence animation outside a motion block', () => {
    for (const css of [conversation, evidence]) {
      const { outside } = motionBlocks(css, 'reduce')
      expect(outside).not.toMatch(/(?<![\w-])animation:/)
    }
  })

  it('widens the hovered launcher only when motion is welcome', () => {
    const { inside, outside } = motionBlocks(conversation, 'no-preference')
    expect(inside).toContain('width: var(--folio-dock-pill-w-hover)')
    expect(outside).not.toContain('--folio-dock-pill-w-hover)')
  })

  it('snaps the dock open and swaps its parts by opacity alone', () => {
    const { inside } = motionBlocks(conversation, 'reduce')
    expect(inside).toMatch(/\.folio-conversation-dock, \.folio-conversation-dock\[data-open='true'\][^{]*\{ transition: opacity var\(--fast\) var\(--ease\)/)
    expect(inside).toMatch(/\.folio-question-composer__ring circle \+ circle, \.folio-conversation-sources li \{ transition: none; \}/)
    expect(inside).toContain('scale: none')
  })

  it('stills the reasoning line: no shimmer, no turning ring, no drawn check', () => {
    const { inside } = motionBlocks(evidence, 'reduce')
    expect(inside).toContain('.folio-reasoning__title[data-running] { background: none; color: var(--ink-3-aa); }')
    expect(inside).toContain('.folio-reasoning__check path { transition: none; }')
    expect(motionBlocks(evidence, 'no-preference').inside).toContain('animation: folio-reasoning-spin')
  })

  it('opens the palette by opacity alone and snaps its body height', () => {
    const { inside } = motionBlocks(search, 'reduce')
    expect(inside).toContain('animation: none !important')
    expect(inside).toContain('animation: folio-palette-fade var(--fast)')
    expect(inside).toContain('.folio-search-palette__body { transition: none; }')
  })
})

describe('loading pages', () => {
  it('fill the screen under the masthead, read from the one header height', () => {
    expect(controls).toContain('--website-header-h: 3.75rem;')
    expect(controls).toContain('.folio-site-navigation-inner { min-block-size: var(--website-header-h); }')
    expect(recovery).toContain('.folio-loading-page { min-block-size: calc(100svh - var(--website-header-h) - 1px); }')
  })
})

describe('the scroll control', () => {
  it('sits in the gutter beside the page column on a wide screen', () => {
    expect(actions).toMatch(/@media \(min-width: 64rem\) \{ \.folio-scroll-control \{ inset-inline-end: max\(1rem, calc\(\(100vw - var\(--w-page\)\) \/ 2 - 3\.5rem\)\); \} \}/)
  })
})

