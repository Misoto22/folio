import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  HEADLINE_LIMIT,
  headlineOf,
  pendingChangesets,
  problems,
} from '../../../../.changeset/shape.mjs'

/**
 * `DESIGN-CHANGELOG-001`, tested where the changelog is already tested.
 *
 * The rule lives in `.changeset/shape.mjs` and the `changeset` job in `pr.yml`
 * runs that same file, so there is one definition rather than a script and a
 * copy of its regexes in YAML. What is worth testing is the reading — where
 * this thinks a headline ends — because that is the half a wrapped line, a
 * backtick or a blank line can silently change.
 *
 * The last case runs it over the repository's own pending changesets. A rule
 * that only ever sees fixtures is a rule nobody notices has drifted off the
 * corpus it was written for.
 */

const CHANGESETS = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../.changeset')

/** A changeset, as it is actually written: frontmatter, then prose. */
function changeset(body: string): string {
  return `---\n'@misoto22/folio': minor\n---\n\n${body}\n`
}

describe('where a changeset headline ends', () => {
  it('is the first paragraph, not the first line', () => {
    expect(headlineOf(changeset('A headline that wraps\nonto a second line.\n\nThe body.'))).toBe(
      'A headline that wraps onto a second line.',
    )
  })

  it('stops at the blank line', () => {
    expect(headlineOf(changeset('The entry.\n\nDetail that is not the entry.'))).toBe('The entry.')
  })

  it('is nothing at all without frontmatter', () => {
    expect(headlineOf('Just prose, which is not a changeset.\n')).toBeNull()
  })
})

describe('the shape rule', () => {
  it('accepts one long sentence, because this voice writes them', () => {
    const headline =
      '`Sidebar` — a navigation rail down the side of an application, with the control that hides it living on the thing it hides.'
    expect(headline.length).toBeGreaterThan(100)
    expect(problems(changeset(headline))).toEqual([])
  })

  it('refuses a second sentence in the entry', () => {
    const found = problems(changeset('The entry. And its reasoning, which belongs below.'))
    expect(found).toHaveLength(1)
    expect(found[0]).toContain('more than one sentence')
  })

  it('does not read a period inside backticks as a sentence break', () => {
    expect(problems(changeset('`color(display-p3 …)` and `Sidebar.tsx` both round-trip.'))).toEqual(
      [],
    )
  })

  it('refuses a paragraph, however single its sentence', () => {
    const found = problems(changeset(`${'word '.repeat(HEADLINE_LIMIT)}end.`))
    expect(found.some((p: string) => p.includes('characters'))).toBe(true)
  })

  it('refuses a markdown heading and a list item, which changesets adds itself', () => {
    expect(problems(changeset('## What changed'))[0]).toContain('markdown heading')
    expect(problems(changeset('- What changed.'))[0]).toContain('list item')
  })
})

describe("this repository's own pending changesets", () => {
  it('are all in shape', () => {
    const offenders = pendingChangesets(CHANGESETS).flatMap((file: string) =>
      problems(readFileSync(file, 'utf8')).map((p: string) => `${join(file)}: ${p}`),
    )
    expect(offenders).toEqual([])
  })
})
