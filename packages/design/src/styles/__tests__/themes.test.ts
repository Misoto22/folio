import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const read = (file: string) => readFileSync(join(HERE, '..', file), 'utf8')

const THEMES = read('themes.css')
const TOKENS = read('tokens.css')
const SEMANTIC = read('semantic.css')
const INDEX = read('index.css')

const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')
const declared = (css: string) => new Set([...strip(css).matchAll(/--([\w-]+):/g)].map((m) => m[1]!))

/** Every rule in a stylesheet as `[selector list, declarations]`. */
const rules = (css: string) =>
  [...strip(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1]!.trim(), m[2]!] as const)

/** Every token declared by the rules whose selector list names `selector`. */
const movedBy = (css: string, selector: string) => {
  const moved = new Set<string>()
  for (const [selectors, body] of rules(css))
    if (selectors.split(',').some((one) => one.trim() === selector))
      for (const name of declared(body)) moved.add(name)
  return moved
}

/** Names `index.css` promotes into Tailwind's `@theme`, which a theme may also move. */
const THEME_LAYER = new Set([...strip(INDEX).matchAll(/--(font-[\w-]+):/g)].map((m) => m[1]!))

describe('themes.css', () => {
  /**
   * A theme re-points; it does not invent.
   *
   * A theme that introduced a token would be a second design system wearing
   * the first one's name: components read the token layer, so anything only a
   * theme defines is a value nothing consumes, and anything components had to
   * learn would make the theme a fork rather than a dressing.
   */
  it('only re-points tokens that already exist', () => {
    // Both layers count as "already exists". `tokens.css` owns values and
    // `semantic.css` owns roles, and the accent axis has to move a role: the
    // whole chain from --clay up to --accent-on-muted is declared on :root in
    // the semantic layer, so it computes there and a theme that re-points only
    // the primitive changes nothing at all. Reading one layer and not the
    // other would have failed a theme for naming a token the package ships.
    const known = new Set([...declared(TOKENS), ...declared(SEMANTIC)])
    const unknown = [...declared(THEMES)].filter(
      (name) => !known.has(name) && !THEME_LAYER.has(name),
    )
    expect(unknown).toEqual([])
  })

  /**
   * Nothing may be anchored to `:root`, or five themes could not share a page —
   * which is exactly what the themes page does.
   */
  it('scopes every rule to an attribute, never to the root', () => {
    const selectors = [...strip(THEMES).matchAll(/^([^{}]+)\{/gm)]
      .map((m) => m[1]!.trim())
      // An at-rule's prelude is a condition, not a selector: `@media
      // (forced-colors: active)` cannot name an attribute and the rules nested
      // inside it are matched on their own lines anyway.
      .filter((selector) => !selector.startsWith('@'))
    expect(selectors.length).toBeGreaterThan(0)
    for (const selector of selectors) {
      expect(selector, `"${selector}" must be attribute-scoped`).toMatch(/\[data-/)
      expect(selector, `"${selector}" must not anchor to :root`).not.toMatch(/:root/)
    }
  })

  /**
   * Law 8: dark is a value swap, not a second palette. Every surface a theme
   * moves has to move on both grounds, or the theme fails the moment someone
   * switches mode — the failure the two-block theme used to have.
   */
  it('gives every surface a dark value too', () => {
    const surfaces = [...strip(THEMES).matchAll(/\[data-surface='(\w+)'\]/g)].map((m) => m[1]!)
    for (const name of new Set(surfaces)) {
      expect(THEMES).toContain(`[data-mode='dark'][data-surface='${name}']`)
    }
  })

  /**
   * Law 8 per TOKEN, which is the claim the check above does not make.
   *
   * A dark block existing is not a dark block being complete. `warm` and `cool`
   * both had one and both restated only the three grounds in it, leaving
   * `--rule` and `--rule-2` set once, unqualified by mode — so the light
   * hairline rendered on the dark page at 14.86:1 and 15.82:1 against those
   * surfaces' own `--paper`, where the neutral dark rule sits at 1.42:1. Every
   * border and divider on the page came out near-white, and it did so silently:
   * the light hex simply keeps resolving on a ground it was never measured
   * against, which is the same failure the accent axis is guarded for.
   *
   * BOTH forms are checked, because they are not the same selector and an app
   * writes `data-mode` and its surface on the SAME element — where a descendant
   * selector matches nothing at all.
   */
  it('moves every token a surface moves on both grounds', () => {
    const names = new Set([...strip(THEMES).matchAll(/\[data-surface='(\w+)'\]/g)].map((m) => m[1]!))
    expect(names.size).toBeGreaterThan(1)
    for (const name of names) {
      const light = movedBy(THEMES, `[data-surface='${name}']`)
      expect(light.size, `[data-surface='${name}'] must move something`).toBeGreaterThan(0)
      for (const form of [
        `[data-mode='dark'][data-surface='${name}']`,
        `[data-mode='dark'] [data-surface='${name}']`,
      ]) {
        const dark = movedBy(THEMES, form)
        const missing = [...light].filter((token) => !dark.has(token))
        expect(missing, `${form} leaves the light value of --${missing.join(', --')} standing`)
          .toEqual([])
      }
    }
  })

  /**
   * Law 8 again, on the axis that carries the only hue the page itself is
   * allowed. An accent with a light value and no dark one fails contrast the
   * moment the reader switches mode, and it fails silently — the light hex
   * simply keeps rendering, on a ground it was never measured against.
   */
  it('gives every accent a dark value too', () => {
    const accents = [...strip(THEMES).matchAll(/\[data-accent='(\w+)'\]/g)].map((m) => m[1]!)
    expect(new Set(accents).size).toBeGreaterThan(1)
    for (const name of new Set(accents)) {
      expect(THEMES).toContain(`[data-mode='dark'][data-accent='${name}']`)
      expect(THEMES).toContain(`[data-mode='dark'] [data-accent='${name}']`)
    }
  })

  /**
   * The accent moves the pointer, and re-derives the chain hanging off it.
   *
   * `--accent: var(--red)` is declared on `:root` in `semantic.css`, so it is
   * substituted THERE — against the root's `--clay`. A theme that re-points
   * only `--clay` on a descendant changes nothing the descendant renders,
   * which is how a rail of eight themed previews all painted the accent of the
   * page around them.
   */
  it('re-derives the whole accent chain, not only its root pointer', () => {
    const block = /\[data-accent\]\s*\{([\s\S]*?)\n\}/.exec(strip(THEMES))?.[1]
    expect(block, "themes.css must carry a bare [data-accent] block").toBeDefined()
    for (const token of ['--red', '--on-red', '--accent', '--accent-foreground', '--accent-on-muted'])
      expect(block).toContain(`${token}:`)
  })

  /**
   * A browser remaps an element's own colours under forced colours and does
   * not reach inside an SVG or a `color-mix()`, so an accent survives there as
   * a hue the reader has asked not to see — and `[data-accent='moss']` matches
   * the element directly, which outranks anything the root merely offers.
   */
  it('collapses every accent to the system ink under forced colours', () => {
    const forced = /@media \(forced-colors: active\) \{([\s\S]*)$/.exec(strip(THEMES))?.[1]
    expect(forced).toMatch(/\[data-mode\] \[data-accent\]/)
    expect(forced).toMatch(/\[data-mode\]\[data-accent\]/)
    expect(forced).toContain('--clay: CanvasText;')
    expect(forced).toContain('--clay-ink: CanvasText;')
  })

  /**
   * The radius axis moves the FACTOR, never a step.
   *
   * Re-typing the steps is what let the ladder go out of proportion with
   * itself, and a corner nested inside another corner is only ever right while
   * the two stay in proportion. One number keeps every step — the pill
   * included — on the same ratio at every setting. The control ROLE is the one
   * other name a theme may set, and only to point it at a step, never at a
   * number.
   */
  it('themes the radius through the factor alone', () => {
    const touched = [...declared(THEMES)].filter((name) => name.startsWith('radius'))
    expect(touched).toEqual(['radius-factor', 'radius-control'])
    expect(THEMES).toMatch(/--radius-control:\s*var\(--radius-pill\);/)
  })
})

describe('the radius ladder', () => {
  const RADIUS_BLOCK = /:root,\s*\[data-radius\]\s*\{([\s\S]*?)\n\}/.exec(strip(TOKENS))?.[1]

  /**
   * Declared for `[data-radius]` as well as `:root`, or a themed subtree never
   * reaches its own factor: a custom property substitutes `var()` where it is
   * DECLARED, so a ladder written only on the root bakes the root's factor in.
   * The themes page puts five radii on five wrappers, which is the case this
   * guards.
   */
  it('is declared for a themed subtree, not only for the root', () => {
    expect(RADIUS_BLOCK, 'tokens.css must declare the ladder for :root AND [data-radius]')
      .toBeDefined()
  })

  it('derives every step from --radius-factor', () => {
    const steps = ['radius-xs', 'radius-sm', 'radius', 'radius-lg', 'radius-pill']
    for (const step of steps) {
      const value = new RegExp(`--${step}:\\s*([^;]+);`).exec(RADIUS_BLOCK!)?.[1]
      expect(value, `--${step} must be declared in the ladder block`).toBeDefined()
      expect(value, `--${step} must scale with the factor`).toContain('var(--radius-factor)')
    }
  })

  /**
   * The nesting law: two rounded edges separated by a gap are concentric only
   * when the inner radius is the outer minus the gap. Both directions are
   * named, so a surface never has to guess — and the subtracting one is
   * clamped, because a negative radius is not a square corner, it is an
   * invalid declaration that takes the whole rule down with it.
   */
  it('names both directions of the nesting law', () => {
    expect(RADIUS_BLOCK).toMatch(/--radius-row:\s*max\(0px,\s*calc\(var\(--radius-lg\)/)
    expect(RADIUS_BLOCK).toMatch(/--radius-frame:\s*calc\(var\(--radius-lg\)/)
  })

  /** The adding direction is gated, or a square theme keeps a rounded frame. */
  it('gates the adding direction so a square theme stays square', () => {
    expect(RADIUS_BLOCK).toContain('--radius-gate: min(1, var(--radius-factor))')
    expect(/--radius-frame:[^;]*var\(--radius-gate\)/.test(RADIUS_BLOCK!)).toBe(true)
  })
})

describe('the accent chart palette', () => {
  const block = (selector: string) =>
    new RegExp(`${selector}[^{]*\\{([\\s\\S]*?)\\n\\}`).exec(strip(THEMES))?.[1]

  const LIGHT = block("\\[data-chart-palette='accent'\\]")
  const DARK = block("\\[data-mode='dark'\\] \\[data-chart-palette='accent'\\]")

  /** `--series-N` → the lightness it pins, in series order. */
  const ladder = (css: string | undefined) =>
    Array.from({ length: 8 }, (_, i) => {
      const value = new RegExp(`--series-${i + 1}:\\s*([^;]+);`).exec(css ?? '')?.[1]
      return Number(/oklch\(from var\(--clay\)\s+([\d.]+)\s+c\s+h\)/.exec(value ?? '')?.[1])
    })

  it('declares both grounds', () => {
    expect(LIGHT, "themes.css must declare [data-chart-palette='accent']").toBeDefined()
    expect(DARK, 'the accent ramp must swap by value on the dark ground').toBeDefined()
  })

  /**
   * Every step comes out of `--clay`, or the value is a palette rather than a
   * derivation — and a consumer whose accent nobody here has seen would get
   * whichever five hues happened to be typed.
   */
  it('derives every step from the accent, never from a literal', () => {
    for (const css of [LIGHT, DARK]) {
      expect(css).not.toMatch(/--series-\d:\s*#/)
      expect(ladder(css).every((L) => Number.isFinite(L))).toBe(true)
    }
  })

  /**
   * Eight even steps, because the separation between two series here is
   * carried by lightness alone: one hue laddered eight ways has no second
   * dimension to spend, so an uneven rung is a pair of series that look alike.
   */
  it('spaces the ladder evenly on both grounds', () => {
    for (const css of [LIGHT, DARK]) {
      const sorted = [...ladder(css)].sort((a, b) => a - b)
      const steps = sorted.slice(1).map((L, i) => L - sorted[i]!)
      const span = Math.max(...steps) - Math.min(...steps)
      expect(span, `rungs are uneven: ${steps.map((s) => s.toFixed(3)).join(' ')}`)
        .toBeLessThan(0.002)
    }
  })

  /**
   * The weak end of each band is set by the worst HUE rather than the
   * prettiest. Measured across all 360 hues at maximum chroma: on paper the
   * weakest (green, ~144°) clears 3:1 up to L 0.640 and fails above it; on the
   * dark ground the weakest (violet, ~294°) clears it down to L 0.530. Moving
   * either bound outward ships a series a reader cannot see.
   */
  it('keeps both bands inside the contrast floor', () => {
    expect(Math.max(...ladder(LIGHT))).toBeLessThanOrEqual(0.64)
    expect(Math.min(...ladder(DARK))).toBeGreaterThanOrEqual(0.53)
  })

  /**
   * Adjacent INDICES sit four rungs apart, which is what the interleave is
   * for — and one better than the mono ramp's three. `--series-1` lands
   * mid-band rather than at the dark end, so a one-series chart paints in the
   * accent itself instead of in the accent's darkest possible shade; that is
   * the whole reason this value exists rather than being `mono` with a hue.
   */
  it('interleaves so neighbouring series are four rungs apart', () => {
    for (const css of [LIGHT, DARK]) {
      const rungs = [...ladder(css)].sort((a, b) => a - b)
      const position = (L: number) => rungs.findIndex((r) => r === L)
      const order = ladder(css).map(position)
      const gaps = order.slice(1).map((p, i) => Math.abs(p - order[i]!))
      expect(Math.min(...gaps), `interleave: ${order.join(' ')}`).toBeGreaterThanOrEqual(4)
    }
  })

  /**
   * `tokens.css` collapses the ramp to `CanvasText` on `:root`, and a palette
   * attribute outranks that — an element matching `[data-chart-palette]`
   * directly beats a value it only inherits, and beats it on source order at
   * the root itself. So a reader in forced colours who was on `chroma` kept
   * the eight hues, which is the setting ignored rather than honoured. The
   * restatement has to come after the palettes and match the specificity the
   * dark blocks use.
   */
  it('lets forced colours outrank every palette', () => {
    const forced = /@media \(forced-colors: active\) \{([\s\S]*)$/.exec(strip(THEMES))?.[1]
    expect(forced, 'themes.css must restate the forced-colours ramp').toBeDefined()
    for (let i = 1; i <= 8; i++) expect(forced).toContain(`--series-${i}: CanvasText;`)
    expect(forced).toContain('--series-track: Canvas;')
    expect(forced, 'must reach a palette scoped under [data-mode]')
      .toMatch(/\[data-mode\] \[data-chart-palette\]/)
    expect(forced).toMatch(/\[data-mode\]\[data-chart-palette\]/)
    expect(
      strip(THEMES).indexOf('@media (forced-colors: active)'),
      'the restatement only wins if it comes after the palettes',
    ).toBeGreaterThan(strip(THEMES).lastIndexOf("[data-chart-palette='accent']"))
  })
})
