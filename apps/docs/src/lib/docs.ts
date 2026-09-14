import examplesJson from '@/generated/examples.json'
import propsJson from '@/generated/props.json'
import snippetsJson from '@/generated/snippets.json'
import tokensJson from '@/generated/tokens.json'
import templatesJson from '@/generated/templates.json'
import typesJson from '@/generated/types.json'
import catalog from '@/generated/catalog'

/**
 * The development warnings the package can emit, as the package reports them.
 *
 * Derived there and read here rather than listed on this side. A hand-kept copy
 * of another package's constants is a copy that goes stale the first time
 * someone adds a warning without thinking about the website — which is exactly
 * how this site came to describe a `data-accent` attribute the package did not
 * have at the time,
 * and how it spent two releases not mentioning these at all.
 */
export const WARNING_CODES: string[] = catalog.warningCodes

/**
 * The version of `@misoto22/folio` this build documents.
 *
 * Read out of the catalog the package emits at build time, for the same reason
 * the warning codes are: the landing page prints it, and a version typed into a
 * page is wrong from the next release onwards.
 */
export function packageVersion(): string {
  return catalog.version
}

/**
 * Typed access to what `scripts/generate.mjs` produced.
 *
 * The JSON is imported rather than read at request time — this site is a static
 * export, so every page is built once and the data is inlined by the bundler.
 * The casts here are the boundary: the generator has no types to share, so this
 * is the one file that asserts a shape, and everything downstream is checked.
 */

export interface PropRow {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

export interface ComponentExport {
  name: string
  description: string
  examples: string[]
  props: PropRow[]
  passthrough: string[]
  propsType?: string
  /** Set when the export is a re-exported primitive rather than a component. */
  reexport?: string
}

export interface ComponentSource {
  components: ComponentExport[]
  exportedTypes: { name: string; definition: string }[]
}

export interface ExampleData {
  id: string
  /** The heading, with the ordering prefix stripped. */
  title: string
  /**
   * What the example demonstrates and when to reach for it, read from the JSDoc
   * block above the file's `export function Example`.
   *
   * Optional because most examples do not carry one yet — the heading alone is
   * how this section has always read, and a page must not depend on prose that
   * is still being written.
   */
  description?: string
  snippet: string
  html: string
  /** What the block is written in, printed on the block itself. */
  lang: string
}

/** One token, as `@misoto22/folio` emits it. */
export interface TokenRecord {
  layer: 'tokens' | 'semantic'
  category: string
  light: string
  /** Absent when the token holds the same value in both themes. */
  dark?: string
  comment?: string
}

export interface TokenEntry {
  name: string
  value: string
  comment?: string
  category: string
}

const PROPS = propsJson as unknown as Record<string, ComponentSource>
const EXAMPLES = examplesJson as unknown as Record<string, ExampleData[]>
const SNIPPETS = snippetsJson as unknown as Record<string, HighlightedCode>
const TYPES = typesJson as unknown as Record<string, HighlightedCode>
const TEMPLATES_SOURCE = templatesJson as unknown as Record<string, HighlightedCode>
const TOKENS = tokensJson as unknown as Record<string, TokenRecord>

export function componentSource(dir: string): ComponentSource {
  return PROPS[dir] ?? { components: [], exportedTypes: [] }
}

export function componentExamples(dir: string): ExampleData[] {
  return EXAMPLES[dir] ?? []
}

export interface HighlightedCode {
  source: string
  html: string
  /** The language the block is written in. Printed on the block. */
  lang: string
}

/** A component's exported type aliases, highlighted at build time. */
export function componentTypes(dir: string): HighlightedCode | undefined {
  return TYPES[dir]
}

/** A template's own source, highlighted at build time. */
export function templateSource(id: string): HighlightedCode | undefined {
  return TEMPLATES_SOURCE[id]
}

/**
 * One standalone snippet: its markup, its raw text and its language.
 *
 * All three come out of the generator together. The raw text used to be read
 * back from `content/snippets.json` on this side, which meant the copy button
 * and the highlighted block were two reads of one file that could disagree
 * about whitespace; and the language was dropped entirely, so no block on the
 * site said what it was written in.
 */
export function snippet(id: string): HighlightedCode {
  const found = SNIPPETS[id]
  if (!found) throw new Error(`snippet "${id}" is not in content/snippets.json`)
  return found
}

/**
 * The steps on the radius ladder, for the landing page's figure band.
 *
 * Counted from the emitted tokens rather than written as a number, because the
 * number on that page was `4` in a string literal and the ladder has since
 * grown a step — which nothing would have caught.
 */
const RADIUS_LADDER = ['radius-xs', 'radius-sm', 'radius', 'radius-lg', 'radius-pill']
export function radiusSteps(): number {
  return RADIUS_LADDER.filter((name) => name in TOKENS).length
}

/**
 * Tokens for one foundations category, with the dark overrides alongside.
 *
 * Both CSS layers are merged: a reader looking for "colour" does not care
 * whether `--paper` came from the primitive file and `--background` from the
 * semantic one, only that both are colour and both are real.
 */
export function tokensByCategory(category: string): {
  rows: TokenEntry[]
  dark: Map<string, string>
} {
  const rows: TokenEntry[] = []
  const dark = new Map<string, string>()
  for (const [name, record] of Object.entries(TOKENS)) {
    if (record.category !== category) continue
    rows.push({ name, value: record.light, comment: record.comment, category: record.category })
    if (record.dark) dark.set(name, record.dark)
  }
  return { rows, dark }
}

/** How many tokens the system declares, for the landing page's figure band. */
export function tokenCount(): number {
  return Object.keys(TOKENS).length
}
