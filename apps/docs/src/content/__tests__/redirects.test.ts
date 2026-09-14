import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseRedirects, redirectFor } from '../../../scripts/redirects.mjs'
import { GROUPS } from '../registry'
import { ROUTES } from '../routes'

const APP = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const RULES = parseRedirects(readFileSync(join(APP, 'public', '_redirects'), 'utf8'))

/**
 * Every family the retired Patterns section published a page for, as it shipped.
 *
 * Written out rather than read from the registry, because these addresses are
 * history. A family added later never had a /patterns/ page; a family RENAMED
 * later is exactly the change that strands an old link, and a list derived from
 * the registry would follow the rename and pass.
 */
const RETIRED_SLUGS = [
  'actions',
  'collection',
  'contact',
  'content',
  'conversation',
  'evidence',
  'media',
  'metrics',
  'music',
  'portfolio',
  'portfolio-index',
  'reading',
  'recovery',
  'search-palette',
  'site-navigation',
  'site-shell',
  'timeline',
]

const PREFIXES = ['', '/zh']

/** One hop. The fragment is split off: the browser keeps it and no server sees it. */
function follow(path: string) {
  const redirect = redirectFor(RULES, path)
  if (!redirect) return undefined
  const [pathname, fragment] = redirect.location.split('#')
  return { status: redirect.status, pathname, fragment }
}

describe('the retired Patterns section', () => {
  const retired = PREFIXES.flatMap((prefix) => [
    `${prefix}/patterns/`,
    `${prefix}/patterns`,
    ...RETIRED_SLUGS.flatMap((slug) => [`${prefix}/patterns/${slug}/`, `${prefix}/patterns/${slug}`]),
  ])

  it.each(retired)('sends %s permanently to a page the site still publishes', (path) => {
    const target = follow(path)
    expect(target, `${path} has no redirect`).toBeDefined()
    expect(target!.status).toBe(301)
    expect(ROUTES).toContain(target!.pathname)
  })

  it('sends each family to its own page, in the language it was asked for in', () => {
    for (const prefix of PREFIXES) {
      for (const slug of RETIRED_SLUGS) {
        expect(follow(`${prefix}/patterns/${slug}/`)?.pathname).toBe(`${prefix}/components/${slug}/`)
      }
    }
  })

  it('sends the section index to the Website group of the catalogue', () => {
    // The index's group headings are anchored at the group name, lower-cased.
    for (const prefix of PREFIXES) {
      const target = follow(`${prefix}/patterns/`)
      expect(target?.pathname).toBe(`${prefix}/components/`)
      expect(target?.fragment).toBe('website')
      expect(GROUPS.map((group) => group.toLowerCase())).toContain(target?.fragment)
    }
  })

  it('publishes nothing under the retired path', () => {
    expect(ROUTES.filter((route) => /^\/(zh\/)?patterns\//.test(route))).toEqual([])
  })

  it('claims no page the site publishes', () => {
    // Pages follows a redirect whether or not a file matches, so a rule that
    // reached a live page would take that page off the site without an error.
    expect(ROUTES.filter((route) => redirectFor(RULES, route))).toEqual([])
  })

  it('reaches no further than one segment past the section', () => {
    expect(redirectFor(RULES, '/patterns/collection/llms.txt')).toBeUndefined()
    expect(redirectFor(RULES, '/zh/patterns/collection/extra/')).toBeUndefined()
  })
})

describe('the _redirects reader', () => {
  it('takes the first rule that matches', () => {
    const rules = parseRedirects('/a/ /first/ 301\n/:slug/ /second/:slug/ 302')
    expect(redirectFor(rules, '/a/')).toEqual({ location: '/first/', status: 301 })
    expect(redirectFor(rules, '/b/')).toEqual({ location: '/second/b/', status: 302 })
  })

  it('defaults to 302 and carries a splat through', () => {
    const rules = parseRedirects('# a comment\n\n/old/* /new/:splat')
    expect(redirectFor(rules, '/old/x/y/')).toEqual({ location: '/new/x/y/', status: 302 })
  })

  it('rejects a rule it would otherwise misread', () => {
    expect(() => parseRedirects('/only-a-source')).toThrow(/malformed/)
    expect(() => parseRedirects('/a /b 301 extra')).toThrow(/malformed/)
    expect(() => parseRedirects('/a /b 200')).toThrow(/not a redirect status/)
  })
})
