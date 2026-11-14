import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BRAND } from './brand'

const TOKENS = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'tokens.css'),
  'utf8',
)

/**
 * Collects declarations by theme rather than by position in the file.
 *
 * A first pass split the file at the dark selector, which quietly dropped every
 * token declared in a LATER `:root` block — the whole status scale, as it
 * happens, and the test then failed on the one thing it most needed to check.
 * Selector-based collection has no such ordering assumption: a block that
 * mentions `[data-mode='dark']` contributes to dark, anything else to light,
 * and both are read in document order so a later declaration wins the way CSS
 * would resolve it.
 */
function collect(theme: 'light' | 'dark'): Map<string, string> {
  const out = new Map<string, string>()
  // Comments carry braces and semicolons of their own; strip them first.
  const source = TOKENS.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const [, selector, body] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const isDark = selector.includes("[data-mode='dark']")
    if (isDark !== (theme === 'dark')) continue
    for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      out.set(name, value.trim())
    }
  }
  return out
}

const LIGHT = collect('light')
const DARK = collect('dark')

function token(theme: Map<string, string>, name: string): string {
  const value = theme.get(name)
  if (value === undefined) throw new Error(`token --${name} is not declared`)
  return value
}

/**
 * `brand.ts` exists because Satori, a web manifest and a build script cannot
 * read a custom property. That makes it a COPY, and a copy nothing checks goes
 * stale — which is exactly how this package shipped a warm-cream mirror of a
 * monochrome theme. This test is the check.
 */
describe('BRAND mirrors styles/tokens.css', () => {
  it.each([
    ['paper', 'light', 'paper'],
    ['paper-2', 'light', 'paperElevated'],
    ['ink', 'light', 'ink'],
    ['ink-2', 'light', 'body'],
    ['ink-3-aa', 'light', 'muted'],
    ['stone', 'light', 'stone'],
    ['rule', 'light', 'rule'],
    ['rule-2', 'light', 'ruleStrong'],
    ['feature-surface', 'light', 'feature'],
    ['ok', 'light', 'success'],
    ['warn', 'light', 'warning'],
    ['danger', 'light', 'danger'],
    ['paper', 'dark', 'paperDark'],
    ['ink', 'dark', 'inkDark'],
  ] as const)('--%s (%s) matches BRAND.%s', (name, theme, key) => {
    expect(BRAND[key]).toBe(token(theme === 'dark' ? DARK : LIGHT, name))
  })

  it('mirrors the photo ground, which does NOT swap with the theme', () => {
    // --on-photo names type over a photograph, and a photograph is dark in both
    // themes. If this ever equals --paper, the dark side has re-joined the swap.
    expect(token(DARK, 'on-photo')).toBe(BRAND.onDark)
    expect(BRAND.onDark).not.toBe(token(DARK, 'paper'))
  })

  it('expresses the photo scrim as the r,g,b tuple of light --ink', () => {
    const ink = token(LIGHT, 'ink').replace('#', '')
    const tuple = [0, 2, 4].map((i) => parseInt(ink.slice(i, i + 2), 16)).join(', ')
    expect(BRAND.scrimRgb).toBe(tuple)
  })

  it('declares every light colour token a dark counterpart, or deliberately not', () => {
    // The swap is the dark story. A colour that exists only in light is either
    // an oversight or one of the documented exceptions. The device colours are
    // the hardware's own and stay dark in both modes on purpose.
    const EXEMPT = new Set(['ink-3-aa', 'mist', 'clay-ink', 'shadow-offset', 'device-bezel', 'device-rim', 'device-island'])
    const colourish = /^(#|rgba?\(|color-mix)/
    const missing = [...LIGHT.entries()]
      .filter(([name, value]) => colourish.test(value) && !DARK.has(name) && !EXEMPT.has(name))
      .map(([name]) => name)
    expect(missing).toEqual([])
  })
})
