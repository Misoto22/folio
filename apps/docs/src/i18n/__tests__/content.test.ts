import { describe, expect, it } from 'vitest'
import { COMPONENTS, type ComponentEntry } from '@/content/registry'
import { fingerprint } from '../api-hash'
import { componentCopy, COMPONENTS_ZH, TEMPLATES_ZH, templateCopy } from '../content'
import { TEMPLATES } from '@/content/templates'
import { ACTIONS_ZH } from '../components-zh/actions'
import { FORMS_ZH } from '../components-zh/forms'
import { NAVIGATION_ZH } from '../components-zh/navigation'
import { OVERLAYS_ZH } from '../components-zh/overlays'
import { FEEDBACK_ZH } from '../components-zh/feedback'
import { DISPLAY_ZH } from '../components-zh/display'
import { SURFACES_ZH } from '../components-zh/surfaces'
import { DATA_ZH } from '../components-zh/data'
import { CHARTS_ZH } from '../components-zh/charts'
import { DIAGRAMS_ZH } from '../components-zh/diagrams'
import { WEBSITE_ZH } from '../components-zh/website'

/** The group files, in the order `content.ts` spreads them. */
const GROUP_FILES = {
  actions: ACTIONS_ZH,
  forms: FORMS_ZH,
  navigation: NAVIGATION_ZH,
  overlays: OVERLAYS_ZH,
  feedback: FEEDBACK_ZH,
  display: DISPLAY_ZH,
  surfaces: SURFACES_ZH,
  data: DATA_ZH,
  charts: CHARTS_ZH,
  diagrams: DIAGRAMS_ZH,
  website: WEBSITE_ZH,
}

/**
 * The Chinese catalogue is written by hand against a registry that moves.
 *
 * Everything here is a way the two fall out of step silently: a slug that no
 * longer exists translates nothing, and a keyboard list of the wrong length
 * pairs a Chinese sentence with the wrong key — which reads as a translation
 * rather than as a bug, and is therefore worse than no translation at all.
 */
describe('the Chinese catalogue', () => {
  // The entries used to be one object literal, and were split one group to a
  // file under `components-zh/` so that ten of them can be written at once.
  // The split is assembled by spreading, and spreading is silent: a slug in two
  // files loses the earlier copy without a word, and a group file left out of
  // the spread loses nine components the same way. Neither shows on the page —
  // the fallback prints English and the site looks merely untranslated.
  it('assembles every component from the group files', () => {
    expect(Object.keys(COMPONENTS_ZH)).toHaveLength(COMPONENTS.length)
  })

  it('lets no slug appear in two group files', () => {
    const owner = new Map<string, string>()
    const claimedTwice: string[] = []
    for (const [file, group] of Object.entries(GROUP_FILES)) {
      for (const slug of Object.keys(group)) {
        const first = owner.get(slug)
        if (first) claimedTwice.push(`${slug}: ${first} and ${file}`)
        else owner.set(slug, file)
      }
    }
    expect(claimedTwice).toEqual([])
    // And nothing was dropped between the files and the spread — which is the
    // other half of the same guarantee, and what catches a file left unimported.
    expect(owner.size).toBe(Object.keys(COMPONENTS_ZH).length)
  })

  it('translates only slugs that exist', () => {
    const slugs = new Set(COMPONENTS.map((entry) => entry.slug))
    expect(Object.keys(COMPONENTS_ZH).filter((slug) => !slugs.has(slug))).toEqual([])
  })

  it('gives every component a summary', () => {
    const missing = COMPONENTS.filter((entry) => !COMPONENTS_ZH[entry.slug]?.summary)
    expect(missing.map((entry) => entry.slug)).toEqual([])
  })

  it('gives every component a Chinese name', () => {
    // The sidebar prints `Button 按钮`, and a component with no name here is
    // simply an English word in a Chinese index. It went unnoticed for all
    // twenty chart and data primitives, because nothing in this file looked:
    // the summary was there, the page read as translated, and the one place
    // the gap showed was a list nobody diffs.
    const missing = COMPONENTS.filter((entry) => !COMPONENTS_ZH[entry.slug]?.name)
    expect(missing.map((entry) => entry.slug)).toEqual([])
  })

  it('bolds nothing, because these fields are printed as plain text', () => {
    // `api.ts` is rendered as markdown and this file is not, which is not
    // visible from inside either one — so `**…**` here reached the page as
    // literal asterisks, on nineteen lines, for as long as they had been there.
    //
    // The English never bolds either; it emphasises with CAPS, which Chinese
    // has no equivalent of. Every one of the nineteen turned out to carry its
    // emphasis structurally anyway — 不只是…是…, 却, a repeated noun — so the
    // markers were decoration on prose that did not need them.
    //
    // Backticks are deliberately NOT checked here. Those print literally too,
    // but they are in the English as well, so they are one defect in the
    // package's catalog rather than a translation that drifted.
    const marked: string[] = []
    for (const [slug, copy] of Object.entries(COMPONENTS_ZH)) {
      const strings = [
        copy.name,
        copy.summary?.[1],
        copy.when?.[1],
        ...(copy.accessibility ?? []).map((line) => line[1]),
        ...(copy.keyboard ?? []).map((line) => line[1]),
        ...(copy.practices ?? []).map((line) => line[1]),
        ...(copy.anatomy ?? []).flatMap((part) => [part.element, part.description]),
      ]
      if (strings.some((text) => text?.includes('**'))) marked.push(slug)
    }
    expect(marked).toEqual([])
  })

  it.each(COMPONENTS.filter((entry) => entry.keyboard?.length))(
    'pairs $slug keyboard rows one to one',
    (entry) => {
      // Positional, so a row added in English without one here would shift
      // every sentence below it onto the wrong key.
      const zh = COMPONENTS_ZH[entry.slug]?.keyboard
      expect(zh, `${entry.slug} has no Chinese keyboard rows`).toBeDefined()
      expect(zh).toHaveLength(entry.keyboard!.length)
    },
  )

  it.each(COMPONENTS.filter((entry) => entry.accessibility?.length))(
    'pairs $slug accessibility lines one to one',
    (entry) => {
      const zh = COMPONENTS_ZH[entry.slug]?.accessibility
      expect(zh, `${entry.slug} has no Chinese accessibility lines`).toBeDefined()
      expect(zh).toHaveLength(entry.accessibility!.length)
    },
  )

  // Anatomy and best practices arrived on every component page at once — 440
  // rows and 544 lines — and reached /zh in English without a single assertion
  // in this file noticing, because this file did not know the fields existed.
  // Nothing above them was wrong; they were simply outside what was checked.
  // These two are here so the next field cannot be added the same way.
  it.each(COMPONENTS.filter((entry) => entry.anatomy?.length))(
    'pairs $slug anatomy rows one to one [$group]',
    (entry) => {
      const zh = COMPONENTS_ZH[entry.slug]?.anatomy
      expect(zh, `${entry.slug} (${entry.group}) has no Chinese anatomy rows`).toBeDefined()
      expect(zh).toHaveLength(entry.anatomy!.length)
    },
  )

  it.each(COMPONENTS.filter((entry) => entry.practices?.length))(
    'pairs $slug practice lines one to one [$group]',
    (entry) => {
      // One list, do and don't together, in the English list's order — the
      // page filters the halves out of it. A missing line here does not merely
      // shift a sentence down; it can move one across the do/don't divide and
      // print a warning as advice.
      const zh = COMPONENTS_ZH[entry.slug]?.practices
      expect(zh, `${entry.slug} (${entry.group}) has no Chinese practice lines`).toBeDefined()
      expect(zh).toHaveLength(entry.practices!.length)
    },
  )

  /**
   * Every English string this catalogue translates, paired with the fingerprint
   * the Chinese beside it was written from.
   *
   * `hash` is undefined where nothing is translated — a slug with no entry, or
   * an entry that skipped `when`. Those already fall back to English and are
   * not what this is looking for. What it is looking for is a hash that IS
   * there and no longer matches.
   */
  function fingerprinted(entry: ComponentEntry) {
    const zh = COMPONENTS_ZH[entry.slug]
    const lines: { field: string; english: string; hash?: string }[] = [
      { field: 'summary', english: entry.summary, hash: zh?.summary?.[0] },
    ]
    if (entry.when) lines.push({ field: 'when', english: entry.when, hash: zh?.when?.[0] })
    entry.accessibility?.forEach((line, index) =>
      lines.push({
        field: `accessibility[${index}]`,
        english: line,
        hash: zh?.accessibility?.[index]?.[0],
      }),
    )
    entry.keyboard?.forEach((row, index) =>
      lines.push({ field: `keyboard[${index}]`, english: row.does, hash: zh?.keyboard?.[index]?.[0] }),
    )
    entry.anatomy?.forEach((row, index) =>
      lines.push({
        // One fingerprint for the row, over both halves — see `ComponentCopyZh`.
        field: `anatomy[${index}]`,
        english: `${row.element}\u0000${row.description}`,
        hash: zh?.anatomy?.[index]?.hash,
      }),
    )
    entry.practices?.forEach((row, index) =>
      lines.push({ field: `practices[${index}]`, english: row.text, hash: zh?.practices?.[index]?.[0] }),
    )
    return lines
  }

  // The four checks above are POSITIONAL, and length is all they can see. That
  // catches a row added or removed and is blind to one rewritten — which is the
  // failure that matters, because a rewritten English line leaves a Chinese
  // sentence that reads as a translation while saying something the English no
  // longer says, and in the cases this check first found, the opposite of it.
  //
  // Each translated line carries a fingerprint of the English it was made from,
  // the way `api.ts` does. Editing the catalog in the package now fails here
  // until the Chinese beside it is updated, and until it is, the page prints
  // English rather than the stale line — see `componentCopy`.
  it.each(COMPONENTS)('translates the English that is there now for $slug [$group]', (entry) => {
    const stale = fingerprinted(entry)
      .filter((line) => line.hash !== undefined && line.hash !== fingerprint(line.english))
      .map((line) => line.field)
    expect(stale).toEqual([])
  })

  it('prints English rather than a translation the English moved out from under', () => {
    // The fallback is the point of the fingerprint, so it is checked through
    // `componentCopy` — the function the pages actually call — rather than by
    // re-deriving the rule here.
    const entry = COMPONENTS.find((component) => (component.anatomy?.length ?? 0) > 1)!
    const englishRows = entry.anatomy!
    const copy = COMPONENTS_ZH[entry.slug]!
    const summary = copy.summary
    const anatomy = copy.anatomy!

    expect(componentCopy('zh', entry.slug).summary).not.toBe(entry.summary)
    try {
      copy.summary = ['00000000', '这句中文早就过期了']
      copy.anatomy = [{ hash: '00000000', element: '过期', description: '过期' }, ...anatomy.slice(1)]
      const resolved = componentCopy('zh', entry.slug)
      expect(resolved.summary).toBe(entry.summary)
      // The row falls back whole: an English noun beside a Chinese sentence is
      // the half-translated state the row-level hash exists to prevent.
      expect(resolved.anatomy?.[0]).toEqual({
        element: englishRows[0]!.element,
        description: englishRows[0]!.description,
      })
      // And only that row: its neighbour's fingerprint still matches.
      expect(resolved.anatomy?.[1]?.element).toBe(anatomy[1]!.element)
    } finally {
      copy.summary = summary
      copy.anatomy = anatomy
    }
  })

  it('writes both halves of every anatomy row', () => {
    // The element name is prose here ("Control box", "Live region"), not an
    // identifier, so a row with only a description is half-translated and
    // prints an English noun beside a Chinese sentence.
    const empty: string[] = []
    for (const [slug, copy] of Object.entries(COMPONENTS_ZH)) {
      for (const [index, part] of (copy.anatomy ?? []).entries()) {
        if (!part.element?.trim() || !part.description?.trim()) empty.push(`${slug}[${index}]`)
      }
    }
    expect(empty).toEqual([])
  })
})

/**
 * The template list had five of thirteen translated, and nothing said so.
 *
 * The component catalogue is covered field by field above; the templates were
 * not covered at all, so the eight added after the first five sat in English
 * in a Chinese index — beside the five that were not — and the only way to see
 * it was to open the page. Every field here is prose a reader reads, so every
 * one of them is required.
 *
 * Checked through `templateCopy` rather than against the table, for the same
 * reason the fallback above is: it is the function the pages call.
 */
describe('the Chinese templates', () => {
  it.each(TEMPLATES)('translates every field of $slug', (entry) => {
    const zh = templateCopy('zh', entry.slug)
    expect(
      (['name', 'summary', 'tests'] as const).filter((field) => !zh[field]),
    ).toEqual([])
  })

  it('translates nothing that is not a template', () => {
    // The other direction: a slug renamed in `templates.ts` leaves its Chinese
    // behind, and the page then falls back to English while the translation
    // sits in the file looking like work already done.
    const slugs = new Set(TEMPLATES.map((entry) => entry.slug))
    expect(Object.keys(TEMPLATES_ZH).filter((slug) => !slugs.has(slug))).toEqual([])
  })
})
