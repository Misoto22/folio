import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-expect-error — a build script, run here for the surface it extracts.
import { extractProps } from '../../scripts/extract-props.mjs'
// @ts-expect-error — plain ESM data, typed by JSDoc rather than by a declaration.
import { ENTRY_POINTS } from '../../agent/catalog.mjs'
// @ts-expect-error — a build script, run here for the fact it derives.
import { themeAxes } from '../../scripts/theme-axes.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SKILL = join(ROOT, 'skills', 'folio-design')

interface PropRow {
  name: string
  required?: boolean
}
interface Part {
  name: string
  props?: PropRow[]
}
interface Source {
  components: Part[]
  exportedTypes?: { name: string }[]
}

// Every tree the skill sends agents to. A rule naming an identifier from a
// split entry would otherwise be unguarded, which is the exact failure this
// file exists to prevent.
const props = Object.assign(
  {},
  ...Object.values(ENTRY_POINTS as Record<string, string>).map((dir) =>
    extractProps(join(ROOT, 'src', dir)),
  ),
) as Record<string, Source>

const claims = JSON.parse(readFileSync(join(SKILL, 'evals', 'claims.json'), 'utf8')) as {
  naming: { use: string; avoid: string }[]
  exported: string[]
  requiredProps: { component: string; part: string; prop: string }[]
  optionalProps: { component: string; part: string; prop: string }[]
}

/** Every identifier a consumer can import: component parts, exported types, and lib. */
const EXPORTED = new Set<string>()
for (const source of Object.values(props)) {
  for (const part of source.components ?? []) EXPORTED.add(part.name)
  for (const type of source.exportedTypes ?? []) EXPORTED.add(type.name)
}
// The lib and token exports are re-exported by name rather than parsed out of a
// component directory, so they are read off each entry point's own barrel. The
// root's barrel is `src/index.ts`; a split entry's is `src/<dir>/index.ts`.
const BARRELS = Object.values(ENTRY_POINTS as Record<string, string>).map((dir) =>
  dir === 'components' ? 'index.ts' : join(dir, 'index.ts'),
)
for (const barrel of BARRELS) {
  for (const match of readFileSync(join(ROOT, 'src', barrel), 'utf8').matchAll(
    /export\s+(?:type\s+)?\{([^}]+)\}/g,
  )) {
    for (const name of match[1].split(',')) {
      const cleaned = name.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim()
      if (cleaned) EXPORTED.add(cleaned)
    }
  }
}
// `toast` is re-exported from the Toast module rather than from the entry point.
for (const match of readFileSync(join(ROOT, 'src', 'components', 'Toast', 'Toast.tsx'), 'utf8')
  .matchAll(/export\s+\{([^}]+)\}/g)) {
  for (const name of match[1].split(',')) EXPORTED.add(name.trim())
}

const evals = JSON.parse(readFileSync(join(SKILL, 'evals', 'evals.json'), 'utf8')) as {
  evals: {
    id: number
    prompt: string
    expected_output: string
    must_use: string[]
    must_not_contain: string[]
    expectations: string[]
  }[]
}

const RULES = readdirSync(join(SKILL, 'rules'))
  .map((file) => readFileSync(join(SKILL, 'rules', file), 'utf8'))
  .concat(readFileSync(join(SKILL, 'SKILL.md'), 'utf8'))
  .join('\n')

function part(componentDir: string, partName: string): Part | undefined {
  return props[componentDir]?.components?.find((candidate) => candidate.name === partName)
}

/**
 * The skill is documentation that an agent acts on without checking, which
 * makes a stale line in it worse than a stale line in a README: nobody reads
 * it and notices, and the wrong import lands in someone's project.
 *
 * So every claim it makes about the package is checked against the package.
 * A rename here fails the build rather than teaching the next agent an
 * identifier that no longer exists — and a habit name that later becomes a real
 * export fails too, because the rule telling agents to avoid it would then be
 * telling them to avoid something that works.
 */
describe('skill claims match the package', () => {
  it('exports everything the naming rules tell an agent to write', () => {
    const missing = claims.naming.filter((claim) => !EXPORTED.has(claim.use))
    expect(missing.map((claim) => claim.use)).toEqual([])
  })

  it('exports nothing the naming rules tell an agent to avoid', () => {
    const real = claims.naming.filter((claim) => EXPORTED.has(claim.avoid))
    expect(real.map((claim) => claim.avoid)).toEqual([])
  })

  it('still says all of it in the rules', () => {
    // A claim guarded here but deleted from the prose guards nothing: the agent
    // reads the prose, not this file.
    const unsaid = claims.naming.filter(
      (claim) => !RULES.includes(claim.use) || !RULES.includes(claim.avoid),
    )
    expect(unsaid.map((claim) => `${claim.avoid} → ${claim.use}`)).toEqual([])
  })

  it('exports every identifier the skill names as reachable', () => {
    expect(claims.exported.filter((name) => !EXPORTED.has(name))).toEqual([])
  })

  it('names every one of those in the rules', () => {
    expect(claims.exported.filter((name) => !RULES.includes(name))).toEqual([])
  })

  it('keeps required the props the accessibility rule promises are required', () => {
    const broken = claims.requiredProps.filter(
      (claim) => !part(claim.component, claim.part)?.props?.some(
        (row) => row.name === claim.prop && row.required,
      ),
    )
    expect(broken.map((claim) => `${claim.part}.${claim.prop}`)).toEqual([])
  })

  it('keeps optional the props the rules describe as optional', () => {
    const broken = claims.optionalProps.filter((claim) => {
      const row = part(claim.component, claim.part)?.props?.find((p) => p.name === claim.prop)
      return !row || row.required
    })
    expect(broken.map((claim) => `${claim.part}.${claim.prop}`)).toEqual([])
  })
})

describe('skill structure', () => {
  it('declares a name and a description in its frontmatter', () => {
    const skill = readFileSync(join(SKILL, 'SKILL.md'), 'utf8')
    const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)
    expect(frontmatter).not.toBeNull()
    expect(frontmatter?.[1]).toMatch(/^name: folio-design$/m)
    expect(frontmatter?.[1]).toMatch(/^description: \S/m)
  })

  it('links only to rule files that exist', () => {
    const skill = readFileSync(join(SKILL, 'SKILL.md'), 'utf8')
    const present = new Set(readdirSync(join(SKILL, 'rules')))
    const linked = [...skill.matchAll(/\]\(\.\/rules\/([\w-]+\.md)\)/g)].map((m) => m[1])
    expect(linked.length).toBeGreaterThan(0)
    expect(linked.filter((file) => !present.has(file))).toEqual([])
  })

  it('names every entry point a consumer has to import from', () => {
    // The skill is what a session carries before it has run anything, so a
    // specifier missing here is one an agent never learns exists — and every
    // chart it then writes imports from a barrel that does not export it.
    const skill = readFileSync(join(SKILL, 'SKILL.md'), 'utf8')
    const exports = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).exports
    const specifiers = Object.keys(exports)
      .filter((key) => !key.endsWith('.css') && !key.endsWith('.json'))
      .map((key) => (key === '.' ? '@misoto22/folio' : `@misoto22/folio${key.slice(1)}`))
    expect(specifiers.filter((specifier) => !skill.includes(specifier))).toEqual([])
  })

  it('describes exactly the theme axes the stylesheets define', () => {
    // This used to assert the opposite about one of them. `data-accent` was
    // documented for months while no selector defined it, so the fix was a
    // test that no skill file offered it — and when the axis then became real,
    // that test was a rule holding the documentation wrong in the other
    // direction. Comparing against the derived list is the version that
    // survives an axis arriving OR leaving: a skill an agent carries before it
    // has run anything cannot be a hand-kept copy of a stylesheet.
    //
    // Across the skill rather than in one file: `data-table-density` is set by
    // a prop and belongs beside `Table`, not in the theming table, and pinning
    // every axis to one page would be a rule about layout rather than about
    // coverage.
    const text = ['SKILL.md', ...readdirSync(join(SKILL, 'rules')).map((f) => `rules/${f}`)]
      .map((file) => readFileSync(join(SKILL, file), 'utf8'))
      .join('\n')
    const axes = Object.keys(themeAxes() as Record<string, string[]>)
    expect(axes.length).toBeGreaterThan(0)
    expect(axes.filter((axis) => !text.includes(`\`${axis}\``))).toEqual([])
  })

  it('denies no axis it also documents', () => {
    // The failure that produced the rule above, generalised: one file saying an
    // attribute does not exist while another offers it is worse than either,
    // because a reader believes whichever it reads first.
    const files = ['SKILL.md', ...readdirSync(join(SKILL, 'rules')).map((f) => `rules/${f}`)]
    const denials = files.filter((file) =>
      /(?:no|not a|never)\s+`?data-[a-z-]+`?\s+attribute/i.test(
        readFileSync(join(SKILL, file), 'utf8'),
      ),
    )
    expect(denials).toEqual([])
  })

  it('leaves no rule file unreferenced', () => {
    // An orphaned rule file is one an agent never loads, which is the same as
    // not having written it.
    const skill = readFileSync(join(SKILL, 'SKILL.md'), 'utf8')
    const rules = readdirSync(join(SKILL, 'rules'))
    expect(rules.filter((file) => !skill.includes(file) && !RULES.includes(file))).toEqual([])
  })

  it('expects only identifiers the package exports', () => {
    // An eval is a promise about what correct output looks like. One that
    // expects an identifier the package stopped exporting would fail a correct
    // agent and pass a wrong one, which is worse than having no eval at all.
    const unknown = evals.evals.flatMap((item) =>
      item.must_use.filter((name) => !EXPORTED.has(name)).map((name) => `#${item.id}: ${name}`),
    )
    expect(unknown).toEqual([])
  })

  it('forbids nothing the package actually exports', () => {
    // `must_not_contain` is mostly habit-names and raw Tailwind. If one of them
    // ever becomes a real export, the eval would be marking correct code wrong.
    const real = evals.evals.flatMap((item) =>
      item.must_not_contain
        .filter((text) => /^[A-Z][A-Za-z]+$/.test(text) && EXPORTED.has(text))
        .map((text) => `#${item.id}: ${text}`),
    )
    expect(real).toEqual([])
  })

  it('gives every eval a prompt, an expectation list and both guards', () => {
    const malformed = evals.evals.filter(
      (item) =>
        !item.prompt ||
        !item.expected_output ||
        item.expectations.length === 0 ||
        !Array.isArray(item.must_use) ||
        !Array.isArray(item.must_not_contain),
    )
    expect(malformed.map((item) => item.id)).toEqual([])
  })

  it('numbers evals uniquely', () => {
    const ids = evals.evals.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
