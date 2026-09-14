import { describe, expect, it } from 'vitest'
import { SEARCH_TERMS } from '../haystack'
import { COMPONENTS } from '../registry'

/**
 * cmdk renders an item's keywords into the DOM.
 *
 * Passing prose therefore does not just make the palette's index bigger — it
 * puts that prose into the text content of every page on the site. The first
 * version of this fed it every prop description and leaked forty thousand
 * characters of documentation into `document.body.innerText`, which broke text
 * queries across the whole suite before anyone noticed what it meant for a
 * reader using a screen reader.
 */
describe('palette search terms', () => {
  it('covers every component', () => {
    const missing = COMPONENTS.filter((entry) => !SEARCH_TERMS.get(entry.slug)?.length)
    expect(missing.map((entry) => entry.slug)).toEqual([])
  })

  it('carries prop names, so a search for one finds its component', () => {
    expect(SEARCH_TERMS.get('table')).toContain('sortDirection')
    expect(SEARCH_TERMS.get('button')).toContain('asChild')
  })

  it('indexes fields inside structured website props as short tokens', () => {
    const terms = SEARCH_TERMS.get('collection') ?? []
    expect(terms).toContain('ReactNode')
    expect(terms).toContain('hint')
    expect(terms.some((term) => term.includes('{'))).toBe(false)
  })

  it('carries tokens, never sentences', () => {
    for (const [slug, terms] of SEARCH_TERMS) {
      const prose = terms.filter((term) => term.length > 60 || /[.。]\s/.test(term))
      expect(prose, `${slug} passes prose to the palette`).toEqual([])
    }
  })
})
