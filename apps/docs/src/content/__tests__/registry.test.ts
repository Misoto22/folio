import { describe, expect, it } from 'vitest'
import { COMPONENTS, GROUPS, groupedComponents } from '../registry'
import propsJson from '@/generated/props.json'
import examplesJson from '@/generated/examples.json'
import { EXAMPLES } from '@/generated/example-registry'

const SOURCE_DIRS = new Set(Object.keys(propsJson))
const EXAMPLE_DIRS = examplesJson as Record<string, { id: string }[]>

/**
 * The registry is the one hand-written file on this site, which makes it the
 * one file that can fall out of step with the package. Every failure below is
 * a page that would have rendered blank, or a component that would have been
 * silently missing from the index — neither of which is visible in a build log.
 */
describe('component registry', () => {
  it('points every entry at a real component directory', () => {
    const missing = COMPONENTS.filter((entry) => !SOURCE_DIRS.has(entry.dir))
    expect(missing.map((entry) => entry.dir)).toEqual([])
  })

  it('documents every component the package ships', () => {
    // The package's own source is the authority on what exists. A new component
    // that nobody added to the registry has no page, and nothing else notices.
    const documented = new Set(COMPONENTS.map((entry) => entry.dir))
    const undocumented = [...SOURCE_DIRS].filter((dir) => !documented.has(dir))
    expect(undocumented).toEqual([])
  })

  it('gives every component at least one example', () => {
    const withoutExamples = COMPONENTS.filter(
      (entry) => (EXAMPLE_DIRS[entry.dir] ?? []).length === 0,
    )
    expect(withoutExamples.map((entry) => entry.name)).toEqual([])
  })

  it('registers every example in the generated import map', () => {
    const dangling: string[] = []
    for (const [dir, list] of Object.entries(EXAMPLE_DIRS)) {
      for (const example of list) {
        const key = `${dir}/${example.id}`
        if (!EXAMPLES[key]) dangling.push(key)
      }
    }
    expect(dangling).toEqual([])
  })

  it('uses unique slugs', () => {
    const slugs = COMPONENTS.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only cross-links to components that exist', () => {
    const slugs = new Set(COMPONENTS.map((entry) => entry.slug))
    const broken = COMPONENTS.flatMap((entry) =>
      (entry.related ?? []).filter((slug) => !slugs.has(slug)).map((slug) => `${entry.slug} → ${slug}`),
    )
    expect(broken).toEqual([])
  })

  it('places every entry in a declared group', () => {
    const declared = new Set<string>(GROUPS)
    expect(COMPONENTS.filter((entry) => !declared.has(entry.group))).toEqual([])
    // And the grouping loses nothing on the way to the sidebar.
    const grouped = groupedComponents().flatMap((section) => section.entries)
    expect(grouped).toHaveLength(COMPONENTS.length)
  })

  it('lists the website compositions as a group of the catalogue', () => {
    // They had a section of their own at /patterns/, filtered out of every list
    // this file exports. Charts and Diagrams ship from separate entry points
    // too and were never split off; this holds Website to the same shape.
    const website = groupedComponents().find((section) => section.group === 'Website')
    expect(website?.entries.length).toBeGreaterThan(0)
    expect(new Set(website?.entries.map((entry) => entry.entry))).toEqual(
      new Set(['@misoto22/folio/website']),
    )
  })
})

// The foundations pages moved to their own file — `__tests__/foundations.test.ts`.
// They are no longer all token pages (`getting-started` and `agents` carry prose
// and name no category), so "every page has a category" stopped being true and
// the replacement checks routes, categories, cross-links and snippets instead.
