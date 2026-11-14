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
const collection = readFileSync(join(ROOT, 'website-collection.css'), 'utf8')
const contact = readFileSync(join(ROOT, 'website-contact.css'), 'utf8')
const shell = readFileSync(join(ROOT, 'website-shell.css'), 'utf8')

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

  it('gives every filter pill a 44px hit box behind its 36px drawn marker', () => {
    expect(strip(controls)).toMatch(/\.folio-collection-filter \{[^}]*block-size: 44px;/)
    expect(strip(controls)).toMatch(/\.folio-collection-marker \{[^}]*block-size: 2\.25rem;/)
  })

  it('styles the collection bar from one sheet only', () => {
    for (const part of ['.folio-collection-controls', '.folio-collection-filters', '.folio-collection-search', '.folio-collection-count']) {
      expect(strip(collection)).not.toContain(part)
      expect(strip(controls)).toContain(part)
    }
  })

  it('keeps the bar to one row on a phone: the rail scrolls and the search folds to its icon', () => {
    expect(strip(controls)).toMatch(/\.folio-collection-filters \{[^}]*overflow-x: auto;/)
    expect(strip(controls)).toMatch(/\.folio-collection-search\[data-foldable\] \{ position: absolute;[^}]*inline-size: 44px;/)
  })
})

describe('contact', () => {
  it('lays the topic out as five tiles, three and two on a phone', () => {
    expect(strip(contact)).toContain(".folio-contact-topic[data-count='5'] { grid-template-columns: repeat(5, minmax(0, 1fr)); }")
    expect(strip(contact)).toContain(".folio-contact-topic[data-count='5'] .folio-contact-topic__tile:nth-child(n + 4) { grid-column: span 3; }")
  })

  it('stacks a full-width send button over the note on a phone', () => {
    expect(strip(contact)).toMatch(/@media \(max-width: 640px\)[\s\S]*\.folio-contact-form__actions \{ flex-direction: column;[\s\S]*\.folio-contact-form__submit \{ inline-size: 100%;/)
  })

  it('keeps contact fields at 16px so a phone does not zoom on focus', () => {
    expect(strip(contact)).toContain('.folio-contact-form__input, .folio-contact-form textarea { font-size: 1rem; }')
  })

  it('rings the map pin only when motion is welcome', () => {
    const { inside, outside } = motionBlocks(contact, 'no-preference')
    expect(inside).toContain('.folio-location-figure__marker::after { animation: folio-halo')
    expect(outside).not.toContain('folio-halo')
  })
})

describe('the phone menu', () => {
  it('unfolds from under the bar by clip-path rather than sliding a sheet over it', () => {
    expect(strip(shell)).toContain('@keyframes folio-navigation-unfold { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); } }')
    expect(strip(shell)).toMatch(/\.folio-site-navigation-sheet \{ position: fixed; inset: var\(--website-header-h, 3\.75rem\) 0 0;/)
    expect(strip(shell)).not.toContain('folio-navigation-down')
  })

  it('crossfades one toggle between Menu and X', () => {
    expect(strip(shell)).toContain(".folio-site-navigation-toggle[aria-expanded='true'] [data-glyph='close'] { opacity: 1; transform: none; }")
  })

  it('leaves the selected segment its on-ink colour', () => {
    expect(strip(shell)).toContain(".folio-site-preference-segment__item:not([data-indicator-active='true']) { color: var(--ink-2); }")
    expect(strip(shell)).not.toMatch(/\.folio-site-preference-segment__item \{[^}]*color:/)
  })

  it('takes the pill radius for the desk search trigger', () => {
    expect(strip(controls)).toMatch(/\.folio-site-navigation \.folio-navigation-search \{[^}]*border-radius: var\(--radius-pill\);/)
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


describe('dock pill and live latency bar', () => {
  it('stretches the measured pill to the shell so its visible face is the whole click target', () => {
    expect(strip(conversation)).toMatch(/\.folio-conversation-dock\[data-measured\] > \.folio-conversation-dock__pill \{[^}]*inline-size: 100%/)
  })

  it('draws the live latency fill in ink, never the stone of its own track', () => {
    expect(strip(evidence)).toMatch(/\.folio-evidence-durations__bar > span\.folio-evidence-durations__fill \{ background: var\(--ink\); \}/)
  })
})
