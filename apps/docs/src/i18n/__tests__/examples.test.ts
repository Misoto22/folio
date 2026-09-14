import '@/__tests__/jsdom-layout'
import { render, screen } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import examplesJson from '@/generated/examples.json'
import type { ExampleData } from '@/lib/docs'
import { ComponentPage } from '@/views/ComponentPage'
import { fingerprint } from '../api-hash'
import { COMPONENTS } from '@/content/registry'
import { EXAMPLE_ZH, exampleCopy, exampleTitle } from '../examples'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) =>
    createElement('a', { href }, children),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/zh/components/button/',
  notFound: () => {
    throw new Error('notFound')
  },
}))

/** Every example description the pages print, keyed the way the canvas keys it. */
const ENGLISH = new Map<string, string>()
for (const [dir, list] of Object.entries(examplesJson as unknown as Record<string, ExampleData[]>)) {
  for (const example of list) {
    if (example.description) ENGLISH.set(`${dir}/${example.id}`, example.description)
  }
}

/**
 * Nothing asserted that an example description had a translation, which is how
 * 316 English sentences reached `/zh` under Chinese headings without anyone
 * noticing: the page falls back to the English, so a missing translation looks
 * exactly like a page that renders fine.
 *
 * These are what make that loud. The first two are the coverage the fallback
 * hides; the third is the drift the fallback cannot see, since a translation
 * whose English has been rewritten still renders — it just says something that
 * stopped being true.
 */
describe('the Chinese example descriptions', () => {
  it('translates every description the pages print', () => {
    const missing = [...ENGLISH.keys()].filter((key) => !EXAMPLE_ZH[key])
    expect(missing).toEqual([])
  })

  it('translates nothing that no longer exists', () => {
    // A renamed or deleted example file leaves its translation behind, and an
    // orphan is the half of the pair that never fails on its own.
    const orphans = Object.keys(EXAMPLE_ZH).filter((key) => !ENGLISH.has(key))
    expect(orphans).toEqual([])
  })

  it.each([...ENGLISH.keys()])('is still current for %s', (key) => {
    // The fingerprint is of the English this was translated from. A mismatch
    // means the doc block above `export function Example` moved and the Chinese
    // did not.
    expect(EXAMPLE_ZH[key]!.hash).toBe(fingerprint(ENGLISH.get(key)!))
  })

  it('carries no markdown, because these render into a bare <p>', () => {
    // The descriptions do not go through `<Prose>`. A backtick or a pair of
    // asterisks reaches the page as literal characters, which is a bug four of
    // the English sentences shipped with before it was fixed.
    const marked = Object.entries(EXAMPLE_ZH)
      .filter(([, copy]) => /`|\*\*|^\s*[-*] |\]\(/.test(copy.zh))
      .map(([key]) => key)

    expect(marked).toEqual([])
  })

  it('uses Chinese punctuation rather than ASCII substitutes', () => {
    // A comma or full stop hard against a Han character is the tell: the
    // sentence was typed with an English keyboard layout and reads wrong at
    // the width these paragraphs are set to.
    const ascii = Object.entries(EXAMPLE_ZH)
      .filter(([, copy]) => /[一-鿿][,.;:!?]|[,.;:!?][一-鿿]/.test(copy.zh))
      .map(([key]) => key)

    expect(ascii).toEqual([])
  })
})

describe('exampleCopy', () => {
  const key = 'Button/02-sizes'
  const english = ENGLISH.get(key)!

  it('returns the Chinese for a locale that has one', () => {
    expect(exampleCopy('zh', key, english)).toBe(EXAMPLE_ZH[key]!.zh)
  })

  it('leaves an English reader with the English', () => {
    expect(exampleCopy('en', key, english)).toBe(english)
  })

  it('falls back to the English rather than to nothing', () => {
    // Both ways a translation can be absent: a key nobody has translated, and
    // a description the page prints for an example that has no entry at all.
    expect(exampleCopy('zh', 'Button/99-invented', english)).toBe(english)
  })

  it('falls back to the English when the source has been rewritten', () => {
    // The test above fails the build on this, but a build that somehow shipped
    // a stale entry must still show English a reader can follow rather than a
    // confident Chinese sentence about behaviour that changed.
    expect(exampleCopy('zh', key, `${english} And one more clause.`)).toBe(
      `${english} And one more clause.`,
    )
  })

  it('reflows without counting as a change', () => {
    // The doc block is wrapped to the example file's column and the page sets
    // its own measure, so the author's line breaks are not content.
    expect(fingerprint('one two\n   three')).toBe(fingerprint('one two three'))
  })
})

/**
 * The map being complete is only half of it.
 *
 * A full translation table that no page reads is the same page a Chinese reader
 * had before — so this renders the real component and asserts on what comes out
 * of it, rather than on what `exampleCopy` would have returned had anyone asked.
 */
describe('a component page in Chinese', () => {
  const key = 'Button/02-sizes'

  it('prints the Chinese under the example, not the English', async () => {
    render(await ComponentPage({ locale: 'zh', slug: 'button' }))

    expect(screen.getByText(EXAMPLE_ZH[key]!.zh)).toBeInTheDocument()
    expect(screen.queryByText(ENGLISH.get(key)!)).not.toBeInTheDocument()
  })

  it('leaves an English reader with the English', async () => {
    render(await ComponentPage({ locale: 'en', slug: 'button' }))

    expect(screen.getByText(ENGLISH.get(key)!)).toBeInTheDocument()
    expect(screen.queryByText(EXAMPLE_ZH[key]!.zh)).not.toBeInTheDocument()
  })
})

/**
 * The headings, which are the half no mechanism could see.
 *
 * `generate.mjs` derives them from the filename — `02-fill-variants` becomes
 * `fill variants` — so they are not prose anyone wrote, are not in `messages.ts`
 * and are not JSX for `untranslated-chrome.test.ts` to find. The contents rail
 * on `/zh` therefore listed `default`, `brush` and `value labels` under 示例 for
 * as long as the site has existed, and every check passed.
 *
 * The catalogue is being translated a group at a time, so this guards it two
 * ways: a finished group may not regress, and the untranslated remainder may
 * only get smaller. A budget rather than a list of 235 keys, because a list
 * that long is a file nobody re-reads and a diff nobody can review.
 */
describe('the Chinese example headings', () => {
  const GROUP_BY_DIR = new Map(COMPONENTS.map((entry) => [entry.dir, entry.group]))
  const groupOf = (key: string) => GROUP_BY_DIR.get(key.slice(0, key.indexOf('/')))

  /** Groups whose headings are all translated. Add one when its batch lands. */
  const TRANSLATED_GROUPS = new Set(['Charts', 'Data', 'Website'])

  /**
   * How many headings are still English. It may only go down — raise nothing,
   * ever; lower it as batches land.
   */
  const UNTITLED_BUDGET = 235

  const untitled = [...ENGLISH.keys()].filter((key) => !EXAMPLE_ZH[key]?.title)

  it('has finished the groups it says it has finished', () => {
    const behind = untitled.filter((key) => TRANSLATED_GROUPS.has(groupOf(key) ?? ''))
    expect(behind).toEqual([])
  })

  it('leaves no more English headings than the budget allows', () => {
    expect(untitled.length).toBeLessThanOrEqual(UNTITLED_BUDGET)
  })

  it('translates no heading for an example that no longer exists', () => {
    const orphans = Object.entries(EXAMPLE_ZH)
      .filter(([key, copy]) => copy.title && !ENGLISH.has(key))
      .map(([key]) => key)
    expect(orphans).toEqual([])
  })

  it('writes headings in Chinese, not in transliterated English', () => {
    const notHan = Object.entries(EXAMPLE_ZH)
      .filter(([, copy]) => copy.title && !/[\u4e00-\u9fff]/.test(copy.title))
      .map(([key]) => key)
    expect(notHan).toEqual([])
  })
})

describe('exampleTitle', () => {
  it('returns the Chinese heading for a locale that has one', () => {
    expect(exampleTitle('zh', 'BarChart/06-brush', 'brush')).toBe('区间选择条')
  })

  it('leaves an English reader with the English', () => {
    expect(exampleTitle('en', 'BarChart/06-brush', 'brush')).toBe('brush')
  })

  it('falls back to the English while a group is still untranslated', () => {
    // The heading is derived from the filename, so the fallback is always a
    // readable label rather than a gap — which is exactly why nobody noticed.
    expect(exampleTitle('zh', 'Button/01-variants', 'variants')).toBe('variants')
  })
})
