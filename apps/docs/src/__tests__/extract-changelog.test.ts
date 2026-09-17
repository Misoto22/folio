import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { extractChangelog } from '../../scripts/extract-changelog.mjs'

/**
 * What the changelog page can read.
 *
 * `packages/design/CHANGELOG.md` holds entries from three tools now — the
 * hand-written pre-1.0 history, the changesets years, and release-please from
 * 0.16.1 on — because release-please PREPENDS, so nothing older ever moves. A
 * parser that stopped understanding one of them would not fail; it would file
 * those releases as paragraphs with no version, and they would quietly vanish
 * from the page. So all three are read here, from fixtures rather than from the
 * repository's own file, which has no release-please entry in it yet.
 *
 * The release-please fixture is not written by hand. It is the literal output
 * of `DefaultChangelogNotes` at release-please 17.6.0, the version pinned by
 * the action this repository calls, for the six sections in
 * `release-please-config.json` — including the `⚠ BREAKING CHANGES` block it
 * adds itself, whose bullets carry no attribution at all.
 */

const RELEASE_PLEASE = `# Changelog

## [0.17.0](https://github.com/Misoto22/folio/compare/v0.16.0...v0.17.0) (2026-09-18)


### ⚠ BREAKING CHANGES

* every class is renamed.

### Features

* **button:** add a loading state ([#120](https://github.com/Misoto22/folio/issues/120)) ([abc1234](https://github.com/Misoto22/folio/commit/abc1234def5678))
* drop the m22 prefix ([#123](https://github.com/Misoto22/folio/issues/123)) ([ddd4444](https://github.com/Misoto22/folio/commit/ddd4444eee5555))


### Bug Fixes

* stop the rail collapsing to zero width ([#121](https://github.com/Misoto22/folio/issues/121)) ([bbb2222](https://github.com/Misoto22/folio/commit/bbb2222ccc3333))


### Refactoring

* **tokens:** fold the ramp into one factor ([eee5555](https://github.com/Misoto22/folio/commit/eee5555fff6666))

## 0.16.1 (2026-09-17)


### Bug Fixes

* clip the accent bar to the row ([#119](https://github.com/Misoto22/folio/issues/119)) ([111aaaa](https://github.com/Misoto22/folio/commit/111aaaabbbbcccc))
`

const CHANGESETS = `# @misoto22/folio

## 0.15.0

### Minor Changes

- [#98](https://github.com/Misoto22/folio/pull/98) [\`0a1b2c3\`](https://github.com/Misoto22/folio/commit/0a1b2c3) Thanks [@Misoto22](https://github.com/Misoto22)! - A headline that wraps
  onto a second line.

  A paragraph of the body.

  - A bullet, whose own continuation
    is indented under it.

## 0.1.0 — 2026-09-05

### Added

- The first eleven primitives.
`

const scratch = mkdtempSync(join(tmpdir(), 'extract-changelog-'))
afterAll(() => rmSync(scratch, { recursive: true, force: true }))

/** One fixture on disk, because the parser reads files and not strings. */
function fixture(name: string, body: string): string {
  const path = join(scratch, name)
  writeFileSync(path, body)
  return path
}

interface Block {
  kind: string
  text: string
}
interface Item {
  kind: string
  text: string
  pr?: number
  prUrl?: string
  body?: Block[]
}
interface Release {
  version: string
  date?: string
  sections: { title: string; items: Item[] }[]
}

const RP = extractChangelog([fixture('rp.md', RELEASE_PLEASE)]) as unknown as Release[]
const CS = extractChangelog([fixture('cs.md', CHANGESETS)]) as unknown as Release[]

describe('a release-please changelog', () => {
  it('reads the linked heading as a version and a date', () => {
    expect(RP.map((release) => [release.version, release.date])).toEqual([
      ['0.17.0', '2026-09-18'],
      ['0.16.1', '2026-09-17'],
    ])
  })

  it('keeps the sections in the order the file lists them', () => {
    expect(RP[0]!.sections.map((section) => section.title)).toEqual([
      '⚠ BREAKING CHANGES',
      'Features',
      'Bug Fixes',
      'Refactoring',
    ])
  })

  it('lifts the trailing attribution out of the sentence', () => {
    const [first, second] = RP[0]!.sections[1]!.items
    expect(first).toEqual({
      kind: 'item',
      text: '**button:** add a loading state',
      pr: 120,
      prUrl: 'https://github.com/Misoto22/folio/issues/120',
    })
    expect(second!.text).toBe('drop the m22 prefix')
  })

  it('cleans a commit that reached main without a pull request', () => {
    // No `#N` to lift, but the commit link is still not part of the sentence.
    expect(RP[0]!.sections[3]!.items[0]).toEqual({
      kind: 'item',
      text: '**tokens:** fold the ramp into one factor',
    })
  })

  it('leaves a breaking-change bullet alone, which carries no attribution', () => {
    expect(RP[0]!.sections[0]!.items[0]).toEqual({
      kind: 'item',
      text: 'every class is renamed.',
    })
  })
})

describe('the entries release-please prepends above', () => {
  it('still reads the changesets shape, headline, body and all', () => {
    const [entry] = CS[0]!.sections[0]!.items
    expect(CS[0]!.version).toBe('0.15.0')
    expect(CS[0]!.sections[0]!.title).toBe('Minor Changes')
    expect(entry!.text).toBe('A headline that wraps onto a second line.')
    expect(entry!.pr).toBe(98)
    expect(entry!.body?.map((block) => block.text)).toEqual([
      'A paragraph of the body.',
      'A bullet, whose own continuation is indented under it.',
    ])
  })

  it('still reads the hand-written shape and its em-dash date', () => {
    expect(CS[1]!.version).toBe('0.1.0')
    expect(CS[1]!.date).toBe('2026-09-05')
    expect(CS[1]!.sections[0]!.title).toBe('Added')
  })
})
