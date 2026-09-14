import { describe, expect, it } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-expect-error — plain ESM data, typed by JSDoc rather than by a declaration.
import { AXIS_DEFAULTS, CATALOG, ENTRY_POINTS, GROUPS, slugOf } from '../../agent/catalog.mjs'
// @ts-expect-error — a build script, run here for the fact it derives.
import { themeAxes } from '../../scripts/theme-axes.mjs'

interface AnatomyPart {
  element: string
  required?: boolean
  description: string
}

interface Practice {
  // `kind` is the catalog's own union, widened here on purpose: typed as the
  // union, a check for a third value is dead code TypeScript removes, and this
  // file is reading data that no compiler saw.
  kind: string
  text: string
}

interface CatalogEntry {
  name: string
  group: string
  summary: string
  when?: string
  anatomy?: AnatomyPart[]
  practices?: Practice[]
  accessibility?: string[]
  keyboard?: { keys: string[]; does: string }[]
  related?: string[]
}

const entries = CATALOG as CatalogEntry[]
const groups = GROUPS as string[]
const axisDefaults = AXIS_DEFAULTS as Record<string, string>
const derivedAxes = themeAxes() as Record<string, string[]>

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const entryPoints = ENTRY_POINTS as Record<string, string>

/**
 * One tree per entry point. A tree's shared pieces live in `lib/` — lowercase,
 * which is how they are told apart from a component: every component directory
 * is a PascalCase name, and nothing else in any of the trees is.
 */
const componentDirs = (dir: string) =>
  readdirSync(join(SRC, dir))
    .filter((entry) => /^[A-Z]/.test(entry))
    .filter((entry) => statSync(join(SRC, dir, entry)).isDirectory())

/** Component name → the specifier it is imported from. */
const ENTRY_OF = new Map<string, string>()
for (const [specifier, dir] of Object.entries(entryPoints)) {
  for (const name of componentDirs(dir)) ENTRY_OF.set(name, specifier)
}

const SOURCE_DIRS = [...ENTRY_OF.keys()]

/**
 * The catalog is the one hand-written file in the package, which makes it the
 * one file that can fall out of step with the source beside it. It is also what
 * `scripts/emit-agent.mjs` turns into the offline documentation an agent reads,
 * so a wrong entry here is not a blank page — it is a confident answer about a
 * component that does not exist.
 *
 * The identity checks matter more than they look. `name` is the ONLY identifier
 * the catalog authors: the directory is the name and the site's slug is the
 * name in kebab-case, and both the emitter and the documentation site rely on
 * that. The moment one component breaks the rule, the derivation has to become
 * a third authored field everywhere, which is the duplication this replaced.
 */
describe('agent catalog', () => {
  it('names a real component directory for every entry', () => {
    const known = new Set(SOURCE_DIRS)
    expect(entries.filter((entry) => !known.has(entry.name)).map((entry) => entry.name)).toEqual([])
  })

  it('describes every component the package ships', () => {
    const described = new Set(entries.map((entry) => entry.name))
    expect(SOURCE_DIRS.filter((dir) => !described.has(dir))).toEqual([])
  })

  it('keeps the slug derivable from the name', () => {
    // Nothing reads this back — the point is that the derivation stays total,
    // because the site's URLs and every cross-link are built from it.
    const undeviable = entries.filter((entry) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slugOf(entry.name)))
    expect(undeviable.map((entry) => entry.name)).toEqual([])
  })

  it('uses unique names and unique slugs', () => {
    const names = entries.map((entry) => entry.name)
    expect(new Set(names).size).toBe(names.length)
    const slugs = names.map(slugOf)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('concatenates every group file, once each, in GROUPS order', () => {
    // The entries live one group to a file under `agent/catalog/` so that ten
    // people can write them at once; `catalog.mjs` puts them back together. That
    // is the seam this file did not have before. A group file left out of the
    // concatenation is a dozen components that quietly stop existing, and a
    // group reached twice is a heading that renders twice — neither of which any
    // other check here would notice, because every entry that IS present is
    // still perfectly well-formed.
    //
    // The count is written out on purpose. Adding a component means changing it,
    // which is the moment to look at the import list.
    expect(entries).toHaveLength(115)
    const runs = entries
      .map((entry) => entry.group)
      .filter((group, index, all) => group !== all[index - 1])
    expect(runs).toEqual(groups)
  })

  it('places every entry in a declared group', () => {
    const declared = new Set(groups)
    expect(entries.filter((entry) => !declared.has(entry.group)).map((entry) => entry.name)).toEqual(
      [],
    )
  })

  it('declares no empty group', () => {
    // An empty group renders a heading over nothing, in the sidebar and in the
    // emitted index alike.
    const used = new Set(entries.map((entry) => entry.group))
    expect(groups.filter((group) => !used.has(group))).toEqual([])
  })

  it('names an entry point that actually exports every component', () => {
    // The `Import:` line in `dist/agent/` is derived from this, and it is the
    // one line an agent pastes without checking. `AreaChart` under
    // `@misoto22/folio` does not render a blank page — it throws, because the
    // charts entry exists precisely so an app that renders a Badge never
    // resolves `recharts`. It shipped wrong once, in 0.6.0.
    const homeless = entries.filter((entry) => !ENTRY_OF.has(entry.name))
    expect(homeless.map((entry) => entry.name)).toEqual([])
  })

  it('builds every declared entry point from a real directory', () => {
    const missing = Object.entries(entryPoints).filter(([, dir]) => {
      try {
        return !statSync(join(SRC, dir)).isDirectory()
      } catch {
        return true
      }
    })
    expect(missing.map(([specifier]) => specifier)).toEqual([])
  })

  it('only cross-links to components that exist', () => {
    const slugs = new Set(entries.map((entry) => slugOf(entry.name)))
    const broken = entries.flatMap((entry) =>
      (entry.related ?? [])
        .filter((slug) => !slugs.has(slug))
        .map((slug) => `${slugOf(entry.name)} → ${slug}`),
    )
    expect(broken).toEqual([])
  })

  it('gives every entry a summary that is one line', () => {
    const bad = entries.filter((entry) => !entry.summary || entry.summary.includes('\n'))
    expect(bad.map((entry) => entry.name)).toEqual([])
  })

  it('gives every keyboard row at least one key and something it does', () => {
    const bad = entries.flatMap((entry) =>
      (entry.keyboard ?? [])
        .filter((row) => row.keys.length === 0 || !row.does)
        .map(() => entry.name),
    )
    expect(bad).toEqual([])
  })

  it('names every anatomy part and says what it is for', () => {
    // A part is what a reader points at. Half a row points at nothing, or
    // names something and leaves the reader to guess why it is there.
    const bad = entries.flatMap((entry) =>
      (entry.anatomy ?? [])
        .filter((part) => !part.element?.trim() || !part.description?.trim())
        .map((part) => `${entry.name}.${part.element || '?'}`),
    )
    expect(bad).toEqual([])
  })

  it('labels every practice do or dont, and gives it something to say', () => {
    // The emitter splits the list on `kind`. A third value is a judgement that
    // is written, shipped in the tarball, and rendered nowhere.
    const bad = entries.flatMap((entry) =>
      (entry.practices ?? [])
        .filter((practice) => !['do', 'dont'].includes(practice.kind) || !practice.text?.trim())
        .map((practice) => `${entry.name}: ${practice.kind}`),
    )
    expect(bad).toEqual([])
  })

  it('keeps both halves of every practice list', () => {
    // Half a table is worse than no table. A Do column on its own reads as the
    // whole judgement, and the failure the other half names goes unwritten —
    // which is exactly the state a half-filled entry ships in.
    const lopsided = entries
      .filter((entry) => (entry.practices ?? []).length > 0)
      .filter(
        (entry) =>
          !entry.practices?.some((practice) => practice.kind === 'do') ||
          !entry.practices?.some((practice) => practice.kind === 'dont'),
      )
    expect(lopsided.map((entry) => entry.name)).toEqual([])
  })

  it('fills both fields for Button, the entry the rest are written against', () => {
    // The reference entry: the one the other ninety-one are copied from, so it
    // is the one that has to still be complete when they are.
    const button = entries.find((entry) => entry.name === 'Button')
    expect(button?.anatomy?.length ?? 0).toBeGreaterThan(0)
    expect(button?.anatomy?.some((part) => part.required)).toBe(true)
    const kinds = (button?.practices ?? []).map((practice) => practice.kind)
    expect(kinds.filter((kind) => kind === 'do').length).toBeGreaterThanOrEqual(3)
    expect(kinds.filter((kind) => kind === 'dont').length).toBeGreaterThanOrEqual(2)
  })

  it('explains exactly the theme axes the stylesheets define', () => {
    // The half that cannot be derived is what an UNSET axis gives you, so that
    // half is authored — and this is what stops it describing an axis the CSS
    // does not have. It described `data-accent` for months while no selector
    // defined one, and an agent could set it all day. It defines one now, and
    // the table gained the row by failing here rather than by being remembered.
    expect(Object.keys(axisDefaults).sort()).toEqual(Object.keys(derivedAxes).sort())
  })

  it('finds a value for every axis', () => {
    // An axis with no values is a selector that was renamed out from under the
    // regex, which would silently shrink the emitted documentation.
    const empty = Object.entries(derivedAxes).filter(([, values]) => values.length === 0)
    expect(empty.map(([axis]) => axis)).toEqual([])
  })
})
