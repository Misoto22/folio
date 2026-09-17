import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import changelog from '@/generated/changelog.json'
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

/**
 * The repository root, five directories above this file. Resolved from a path
 * and not `new URL(…, import.meta.url)`, which Vite rewrites into an asset URL
 * it then serves over http.
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..')

/**
 * The section headings release-please is configured to write, which are English
 * the changelog will say and has not said yet.
 *
 * Read from `release-please-config.json` rather than listed here, so the two
 * cannot drift: rename a section there and its translation becomes an orphan
 * on the next run, which is the report you want. `⚠ BREAKING CHANGES` is not in
 * that file — release-please adds it itself, above every configured section,
 * whenever a commit carries a `!` or a `BREAKING CHANGE:` footer.
 */
function sectionHeadings(): string[] {
  const config = JSON.parse(readFileSync(resolve(ROOT, 'release-please-config.json'), 'utf8'))
  const sections: string[] = (config['changelog-sections'] ?? []).map(
    (section: { section: string }) => section.section,
  )
  return [...sections, '⚠ BREAKING CHANGES']
}

const ENGLISH = englishOf(changelog as unknown as Release[])
const HEADINGS = new Set(sectionHeadings().map((heading) => fingerprint(heading)))

/** The keys with no English behind them — nothing will ever print this. */
function orphans(keys: string[]): string[] {
  return keys.filter((key) => !ENGLISH.has(key) && !HEADINGS.has(key))
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
 * THIS USED TO BE THREE GATES AND IS NOW ONE, because the other two were about
 * a file that no longer exists. Under changesets the English of a release was
 * written before the release, in `.changeset/*.md`, so this file had to accept
 * a translation that no changelog backed yet and — separately — demand one for
 * every changeset about to ship, or the Version Packages pull request went red
 * at the last step and the release simply stopped, twice on the day that rule
 * was written. release-please writes an entry from the title of a pull request
 * that has already merged, so there is no window in which the English exists
 * and the release has not happened: nothing to pre-translate, and nothing a
 * branch could be asked to translate in advance.
 *
 * What replaces the demand is the fallback. An entry with no Chinese renders in
 * English on the Chinese page and the release ships — the trade this repository
 * makes everywhere else in `changelog.ts`, and did not make here only because a
 * changeset could be read ahead of time.
 */
describe('the Chinese changelog', () => {
  it('translates nothing the changelog will never say', () => {
    expect(orphans(Object.keys(CHANGELOG_ZH))).toEqual([])
  })

  it('has the section headings release-please writes', () => {
    // These are the one part of an entry the tool chooses rather than the
    // author, so they are the one part that can be translated up front — and
    // a Chinese page whose every release is headed "Bug Fixes" is not one.
    const missing = sectionHeadings().filter((heading) => !CHANGELOG_ZH[fingerprint(heading)])
    expect(missing).toEqual([])
  })
})
