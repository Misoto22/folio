import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import changelog from '@/generated/changelog.json'
import { extractChangelog } from '../../../scripts/extract-changelog.mjs'
import { CHANGELOG_ZH } from '../changelog'
import { fingerprint } from '../api-hash'

interface Block { text: string }
interface Item { text: string; body?: Block[] }
interface Release { sections: { title: string; items: Item[] }[] }

/** Every English string a set of releases prints, by its fingerprint. */
function englishOf(releases: Release[]): Map<string, string> {
  const strings = new Map<string, string>()
  for (const release of releases) {
    for (const section of release.sections) {
      if (section.title) strings.set(fingerprint(section.title), section.title)
      for (const item of section.items) {
        strings.set(fingerprint(item.text), item.text)
        for (const block of item.body ?? []) strings.set(fingerprint(block.text), block.text)
      }
    }
  }
  return strings
}

/** Highest bump first, and the `### …` heading changesets writes for each. */
const BUMPS = ['major', 'minor', 'patch'] as const
type Bump = (typeof BUMPS)[number]

/** The largest bump a changeset's frontmatter asks for, across every package. */
function highestBump(frontmatter: string): Bump {
  let highest: Bump = 'patch'
  for (const line of frontmatter.split('\n')) {
    const match = /:\s*['"]?(major|minor|patch)['"]?\s*$/.exec(line.trim())
    const bump = match?.[1] as Bump | undefined
    if (bump && BUMPS.indexOf(bump) < BUMPS.indexOf(highest)) highest = bump
  }
  return highest
}

/**
 * The changelog `changeset version` is about to write, as a changelog file.
 *
 * A changeset IS the entry's body already. All `changeset version` does to it
 * is prefix the first line with the attribution and indent every later line two
 * spaces under the bullet — which is exactly the shape `extract-changelog.mjs`
 * reads back. So rebuild that shape and hand it to the real parser, rather than
 * reading the same markdown a second way here: a second reading would drift
 * from the first, and the whole point is that the two agree on where one string
 * ends and the next begins. The attribution is left off because the parser
 * lifts it straight back out again.
 */
function pendingChangelog(dir: string): string {
  const grouped = new Map<Bump, string[]>()
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith('.md')) continue
    const source = readFileSync(join(dir, name), 'utf8')
    // No frontmatter means it is not a changeset — `README.md` lives here too.
    const front = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source)
    if (!front) continue
    const body = source.slice(front[0].length).trim()
    if (!body) continue
    const [headline = '', ...rest] = body.split('\n')
    const entry = [`- ${headline}`, ...rest.map((line) => (line.trim() ? `  ${line}` : ''))]
    const bump = highestBump(front[1] ?? '')
    grouped.set(bump, [...(grouped.get(bump) ?? []), entry.join('\n')])
  }

  const lines = ['## 0.0.0-pending', '']
  for (const bump of BUMPS) {
    const entries = grouped.get(bump)
    if (!entries) continue
    lines.push(`### ${bump[0]!.toUpperCase()}${bump.slice(1)} Changes`, '')
    for (const entry of entries) lines.push(entry, '')
  }
  return lines.join('\n')
}

/** The English those changesets will add, read back through the real parser. */
function pendingEnglish(dir: string): Map<string, string> {
  if (!existsSync(dir)) return new Map()
  const scratch = mkdtempSync(join(tmpdir(), 'changelog-pending-'))
  try {
    const file = join(scratch, 'CHANGELOG.md')
    writeFileSync(file, pendingChangelog(dir))
    return englishOf(extractChangelog([file]) as unknown as Release[])
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
}

/**
 * The repository's `.changeset/`, five directories above this file. Resolved
 * from a path and not `new URL(…, import.meta.url)`, which Vite rewrites into
 * an asset URL it then serves over http.
 */
const CHANGESETS = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../.changeset')

const ENGLISH = englishOf(changelog as unknown as Release[])
const PENDING = pendingEnglish(CHANGESETS)

/** The keys with no English behind them — neither shipped nor on its way. */
function orphans(keys: string[], pending: Map<string, string> = PENDING): string[] {
  return keys.filter((key) => !ENGLISH.has(key) && !pending.has(key))
}

/** A changeset directory holding one changeset, for the tests that need one. */
function fixture(body: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'changeset-fixture-'))
  const source = ['---', "'@misoto22/folio': minor", '---', '', ...body, ''].join('\n')
  writeFileSync(join(dir, 'a-pending-change.md'), source)
  return dir
}

/**
 * The changelog's translation is keyed by the fingerprint of the English, so
 * drift can only ever produce a fallback to English — never a stale sentence
 * presented as current. There is therefore nothing to enforce about coverage;
 * an untranslated line is a backlog item, not a bug.
 *
 * An ORPHAN is different. A translation whose English exists nowhere is either
 * a typo in the key or a line that was reworded, and in both cases the Chinese
 * it carries will never be shown again — so it is dead weight that reads as
 * work already done.
 *
 * "Nowhere" has to include the changesets, though, and that is the narrowing
 * this file exists to make. `CHANGELOG.md` gets a release's text only when
 * `changeset version` runs, so a translation written before the bump had no
 * English behind it yet and read as an orphan — while one written after the
 * bump had nowhere to live, the release branch being rebuilt from scratch on
 * every push to `main`. A translation written before its release ships is not
 * an orphan; it is early, and the changeset is the proof. Text that is in no
 * release and in no changeset is still an orphan, which is the half that keeps
 * this a gate rather than a hole.
 */
describe('the Chinese changelog', () => {
  it('translates nothing that is in neither the changelog nor a changeset', () => {
    expect(orphans(Object.keys(CHANGELOG_ZH))).toEqual([])
  })

  it('covers the releases the page leads with', () => {
    // Not every line, ever — but the current release being half-English would
    // be worse than no translation at all, so that much is a gate.
    const latest = (changelog as unknown as Release[])[0]!
    const strings = latest.sections.flatMap((section) => [
      section.title,
      ...section.items.flatMap((item) => [item.text, ...(item.body ?? []).map((b) => b.text)]),
    ])
    const missing = strings.filter((text) => text && !CHANGELOG_ZH[fingerprint(text)])
    expect(missing).toEqual([])
  })

  /**
   * THE SAME GATE, ONE STEP EARLIER, and the step is the whole point.
   *
   * The case above reads the released changelog, which on a feature branch is
   * the LAST release and is therefore always translated — so a pull request
   * adding a changeset and no Chinese was green, merged, and only then held the
   * release: the strings first appear in `CHANGELOG.md` on the Version Packages
   * pull request, which is where the failure surfaced. That happened twice on
   * the day this was written, at 42 strings and at 4, and each time somebody had
   * to go and find out why 0.9.0 had stopped.
   *
   * A changeset already says exactly what it is about to add. So ask it here,
   * on the branch that wrote it, where the person who can answer is still
   * looking. `verify` runs on every pull request, so this needs no new job:
   * the gate was in the right workflow and pointed at the wrong text.
   */
  it('covers the changesets that are about to become one', () => {
    const missing = [...PENDING.values()].filter((text) => !CHANGELOG_ZH[fingerprint(text)])
    expect(missing).toEqual([])
  })

  describe('the pending-changeset window', () => {
    it('reads a changeset the way the changelog will be read', () => {
      // Segmentation is the only thing that matters — `fingerprint` collapses
      // whitespace, so where one string ends and the next begins is the whole
      // of the agreement with `extract-changelog.mjs`.
      const dir = fixture([
        'A headline changesets will wrap',
        'onto a second line.',
        '',
        'A paragraph of the body.',
        '',
        '- A bullet, whose own continuation',
        '  is indented under it.',
      ])
      try {
        expect([...pendingEnglish(dir).values()]).toEqual([
          'Minor Changes',
          'A headline changesets will wrap onto a second line.',
          'A paragraph of the body.',
          'A bullet, whose own continuation is indented under it.',
        ])
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    })

    it('accepts a translation of English that only a changeset has', () => {
      const dir = fixture(['A line that no release has printed yet.'])
      try {
        const key = fingerprint('A line that no release has printed yet.')
        expect(orphans([key])).toEqual([key])
        expect(orphans([key], pendingEnglish(dir))).toEqual([])
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    })

    it('still reports a translation of English that exists nowhere', () => {
      const dir = fixture(['A line that no release has printed yet.'])
      try {
        const key = fingerprint('A line in no release and in no changeset.')
        expect(orphans([key], pendingEnglish(dir))).toEqual([key])
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    })
  })
})
