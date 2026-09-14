import { readFileSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const STYLES = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKAGE = join(STYLES, '..', '..')
const require = createRequire(import.meta.url)

/** Resolves an `@import` the way the Tailwind CLI does for this package. */
async function loadStylesheet(id: string, base: string) {
  const path = id.startsWith('.') ? resolve(base, id) : require.resolve(id === 'tailwindcss' ? 'tailwindcss/index.css' : id)
  return { path, base: dirname(path), content: await readFile(path, 'utf8') }
}

/**
 * A stylesheet entry compiled through Tailwind with every import inlined.
 *
 * The real compiler rather than a reading of the `@import` lines, because the
 * question is what a consumer receives — and that is whatever the compiler
 * reaches, however many files deep. No candidates are passed, so the output is
 * the entry's own rules without the utilities a source scan would add.
 */
async function compiled(entry: string): Promise<string> {
  const from = join(STYLES, entry)
  const compiler = await compile(readFileSync(from, 'utf8'), { base: STYLES, from, loadStylesheet })
  return compiler.build([])
}

interface Rule {
  /** One selector from the rule's list, whitespace collapsed. */
  selector: string
  /** The at-rules around it, outermost first — `['@layer base']`, or `[]` when unlayered. */
  within: string[]
}

/** Every style rule, one entry per selector in its list. */
function rules(css: string): Rule[] {
  const found: Rule[] = []
  const preludes: string[] = []
  let buffer = ''
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (char === '{') {
      // A statement at-rule (`@layer theme, base;`) ends with `;` and belongs
      // to no block, so only the text after the last one is this prelude.
      preludes.push(buffer.split(';').pop()!.trim().replace(/\s+/g, ' '))
      buffer = ''
    } else if (char === '}') {
      const prelude = preludes.pop() ?? ''
      buffer = ''
      if (!prelude || prelude.startsWith('@') || /^(from|to|[\d.]+%)(\s*,\s*(from|to|[\d.]+%))*$/.test(prelude)) continue
      const within = preludes.filter((outer) => outer.startsWith('@'))
      for (const part of prelude.split(/,(?![^(]*\))/)) found.push({ selector: part.trim(), within })
    } else {
      buffer += char
    }
  }
  return found
}

const selectors = (css: string) => rules(css).map((rule) => rule.selector)
const layered = (rule: Rule) => rule.within.some((outer) => outer.startsWith('@layer'))

/** Every declaration block whose selector list names `selector` exactly. */
function blocksFor(css: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(?:^|[;{}])\\s*([^;{}]*(?:^|,|\\s)${escaped}(?:,|\\s)[^;{}]*)\\{([^}]*)\\}`, 'gm')
  return [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(pattern)]
    .filter(([, list]) => list!.split(',').some((part) => part.trim() === selector))
    .map(([, , body]) => body!)
}

const classesIn = (list: string[]) => new Set(list.flatMap((selector) => selector.match(/\.folio-[\w-]+/g) ?? []))

/** The site-wide ring, in either spelling it has had. */
const isSiteRing = (selector: string) => /^:(is|where)\(a, button, input, textarea, select, summary, \[tabindex\]\):focus-visible$/.test(selector)

const core = await compiled('index.css')
const website = await compiled('website.css')
const base = await compiled('website-base.css')
/** The portable layers `styles.css` is built from, compiled one at a time. */
const layers = await Promise.all(['tokens.css', 'semantic.css', 'themes.css', 'article.css', 'keyframes.css'].map(compiled))

/**
 * `styles.css` is what an application that wants the primitives imports, and
 * it used to carry every website composition's rules — about 1,300 lines, some
 * of them aimed at the document rather than at a composition: the body's type
 * and ground, heading margins, a focus ring on every link and control, and a
 * restyle of every DropdownMenu. An admin console that never rendered a website
 * part received all of it.
 */
describe('the CSS entries', () => {
  it('keeps every website composition rule out of the core stylesheet', () => {
    const coreOwned = classesIn(layers.flatMap(selectors))
    const websiteOnly = [...classesIn(selectors(website))].filter((name) => !coreOwned.has(name))
    expect(websiteOnly.length).toBeGreaterThan(100)
    expect([...classesIn(selectors(core))].filter((name) => websiteOnly.includes(name))).toEqual([])
  })

  it('sets no document defaults from the core stylesheet', () => {
    expect(blocksFor(core, 'body')).toEqual([])
    expect(selectors(core).filter(isSiteRing)).toEqual([])
    expect(selectors(core).filter((selector) => selector.includes('[data-folio-menu]'))).toEqual([])
    // Tailwind's preflight resets headings to `inherit`; the website's 400 is a
    // choice about a page, and does not belong to an application's headings.
    expect(blocksFor(core, 'h1').filter((body) => /font-weight:\s*400/.test(body))).toEqual([])
  })

  it('still gives the core chart surface its keyboard focus ring', () => {
    expect(selectors(core)).toContain("[data-slot='chart'] svg.recharts-surface[tabindex]:focus-visible")
  })

  it('scopes every website.css rule to a composition class', () => {
    // `:root` holds the one custom property the compositions share, which is
    // inert until a rule reads it.
    const unscoped = selectors(website).filter((selector) => selector !== ':root' && !/\.folio-/.test(selector))
    expect(unscoped).toEqual([])
  })

  it('puts the document defaults in the opt-in website-base.css', () => {
    expect(blocksFor(base, 'body').join('')).toContain('font-size: clamp(15.5px, 1.05vw, 17px)')
    expect(blocksFor(base, 'h1').join('')).toContain('font-weight: 400')
    expect(selectors(base).filter(isSiteRing)).toHaveLength(1)
    expect(selectors(website).filter(isSiteRing)).toEqual([])
  })

  /**
   * An unlayered rule beats every layered one whatever its specificity, and
   * Tailwind's utilities are layered. The site-wide ring was unlayered, so the
   * `Command` input's `outline-none` lost to it and drew a clipped square in
   * every host that loaded the website styles. A document-wide rule has to be
   * layered; an unlayered one has to be scoped to a composition.
   */
  it('leaves utilities in charge wherever a website rule is not scoped to a composition', () => {
    expect(rules(base).length).toBeGreaterThan(0)
    expect(rules(base).filter((rule) => !rule.within.includes('@layer base')).map((rule) => rule.selector)).toEqual([])
    const unlayeredUnscoped = rules(website).filter((rule) => !layered(rule) && rule.selector !== ':root' && !/\.folio-/.test(rule.selector))
    expect(unlayeredUnscoped.map((rule) => rule.selector)).toEqual([])
  })

  it('publishes both website stylesheets as their own exports', () => {
    const manifest = JSON.parse(readFileSync(join(PACKAGE, 'package.json'), 'utf8'))
    expect(manifest.exports['./website.css']).toBe('./dist/website.css')
    expect(manifest.exports['./website-base.css']).toBe('./dist/website-base.css')
  })

  it('names every keyframe with the package prefix', () => {
    // An unprefixed `@keyframes pulse` replaces the one Tailwind's
    // `animate-pulse` reads, in every host that loads both.
    const names = readdirSync(STYLES)
      .filter((file) => file.endsWith('.css'))
      .flatMap((file) => [...readFileSync(join(STYLES, file), 'utf8').matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name]) => `${file}: ${name}`))
    expect(names.length).toBeGreaterThan(0)
    expect(names.filter((entry) => !/: folio-/.test(entry))).toEqual([])
  })
})
