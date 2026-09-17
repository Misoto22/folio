/**
 * Parses the package's `CHANGELOG.md` into the structure the changelog page
 * renders.
 *
 * A tolerant parser rather than a Markdown library, and deliberately: the file
 * has three shapes and all of them are headings, bullets and paragraphs.
 * Pulling in a Markdown pipeline to read two heading levels would be a
 * dependency and a sanitiser for no reading the page could not already do.
 *
 * The three shapes, newest first:
 *
 *   release-please  `## [0.17.0](…/compare/…) (2026-09-18)`, `### Features`,
 *               and one bullet per commit carrying the attribution at the END:
 *               `… ([#120](…/issues/120)) ([abc1234](…/commit/…))`.
 *   changesets  `## 0.3.0`, `### Minor Changes`, and one bullet per changeset
 *               carrying `[#21](…) [`sha`](…) Thanks [@who](…)! - ` before the
 *               first word, then an indented body that is itself a small
 *               document — paragraphs and a nested list.
 *   hand-written  the pre-1.0 history, `## 0.1.0 — 2026-09-05` with `### Added`
 *               and flat bullets.
 *
 * All three are read, and the older two are read because the file still holds
 * them: release-please prepends, so every entry written under changesets stays
 * exactly where it is and would otherwise drop off the page the day the first
 * release-please entry lands.
 *
 * Both files are read, package file first, so the page shows every release
 * rather than whichever file somebody remembered to point at. That is the
 * defect this replaces: the generator read the repository ROOT changelog, which
 * stopped at 0.1.0 the moment the package file took over — so the site's
 * "what's new" silently froze two releases ago.
 *
 * The attribution is lifted out of the sentence and kept as data, whichever end
 * of the line it sits at. It is useful (the pull request is where the argument
 * is) and it is not part of the sentence; leaving the changesets form inline
 * meant every entry began with the same eleven words of boilerplate before
 * saying anything, and leaving release-please's inline ends every entry with
 * two bare parenthesised links.
 *
 * Anything it does not recognise becomes a paragraph, so a future entry cannot
 * silently vanish from the page.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

/**
 * The version a `## …` heading names, and the date beside it if it carries one.
 *
 * Three heading shapes, one per tool that has written this file:
 *
 *   `## [0.17.0](…/compare/v0.16.0...v0.17.0) (2026-09-18)`  release-please
 *   `## 0.3.0`                                               changesets
 *   `## 0.1.0 — 2026-09-05`                                  hand-written
 *
 * release-please's compare link is dropped rather than kept. The page links
 * each entry to the pull request that shipped it, which is where the argument
 * is; a diff of four hundred files under the version number is not something a
 * reader of a changelog asked for.
 */
function parseVersionHeading(line) {
  const text = line.replace(/^##\s+/, '').trim()

  const linked = /^\[([^\]]+)\]\([^)]*\)\s*/.exec(text)
  const leading = linked ?? /^(\S+)\s*/.exec(text)
  const version = leading?.[1]?.trim() ?? text
  const rest = leading ? text.slice(leading[0].length).trim() : ''

  // `— 2026-09-05` (hand-written) and `(2026-09-18)` (release-please).
  const date = /^[—–-]\s*(.+)$/.exec(rest)?.[1] ?? /^\((.+)\)$/.exec(rest)?.[1]
  return { version: version || text, date: date?.trim() }
}

/**
 * The entry's sentence, with its attribution lifted out and kept as data.
 *
 * Two shapes, at opposite ends of the line, because the file holds entries from
 * two release tools:
 *
 *   changesets      `[#21](url) [`sha`](url) Thanks [@who](url)! - Real sentence.`
 *   release-please  `Real sentence. ([#21](url)) ([abc1234](url))`
 *
 * Both name the same thing and neither is part of the sentence. The commit link
 * release-please adds is dropped: it and the pull-request link point at one
 * change, and the page has one slot for it.
 *
 * A commit that reached `main` without a pull request has the commit link and
 * no `#N`, so the number is optional and the sentence is still cleaned.
 */
function liftAttribution(text) {
  const prefix =
    /^\[#(\d+)\]\(([^)]+)\)\s*(?:\[`[^`]+`\]\([^)]+\)\s*)?(?:Thanks\s+\[@[^\]]+\]\([^)]+\)!)?\s*-\s*/
  const prefixed = prefix.exec(text)
  if (prefixed) {
    return { text: text.slice(prefixed[0].length), pr: Number(prefixed[1]), prUrl: prefixed[2] }
  }

  const suffix = /\s*(?:\(\[#(\d+)\]\(([^)]+)\)\)\s*)?\(\[[0-9a-f]{7,40}\]\([^)]+\)\)\s*$/
  const suffixed = suffix.exec(text)
  if (!suffixed) return { text }
  const sentence = text.slice(0, suffixed.index).trim()
  if (!suffixed[1]) return { text: sentence }
  return { text: sentence, pr: Number(suffixed[1]), prUrl: suffixed[2] }
}

/** Release dates, from the tags the release workflow pushed. Absent is fine. */
function tagDates() {
  try {
    const out = execFileSync(
      'git',
      ['for-each-ref', '--format=%(refname:short) %(creatordate:short)', 'refs/tags'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
    const dates = new Map()
    for (const line of out.split('\n')) {
      const [ref, date] = line.trim().split(/\s+/)
      if (!ref || !date) continue
      // `<package>@0.3.0` and `v0.3.0` both reduce to `0.3.0`. A tag keeps the
      // package name it was cut under, before or after the Folio rename, so
      // the version is read from after the last `@` and the name is ignored.
      const version = ref.replace(/^.*@/, '').replace(/^v/, '')
      if (/^\d+\.\d+\.\d+/.test(version)) dates.set(version, date)
    }
    return dates
  } catch {
    // A shallow clone, or no git at all. The page renders without dates.
    return new Map()
  }
}

/**
 * One `CHANGELOG.md` → releases.
 *
 * @param {string} path
 * @returns {{version: string, date?: string, sections: {title: string, items: object[]}[]}[]}
 */
function parseFile(path) {
  const lines = readFileSync(path, 'utf8').split('\n')

  const releases = []
  let release
  let section
  /** The bullet currently open at the top level, whose indented body follows. */
  let item
  /**
   * Whether a blank line has closed the entry's HEADLINE.
   *
   * Changesets wraps a long first sentence onto a second, indented line with no
   * blank line between. Treating that as the start of the body split the
   * headline in two — "Fix the interactions that were drawn but not wired, and
   * give selection" as the title and "something that moves." as its first
   * paragraph. Until the first blank line, an indented line is still the title.
   */
  let inHeadline = false
  /** The block inside that body still being written into. */
  let block
  let paragraph = []

  const ensureSection = (title) => {
    if (!release) return { items: [] }
    let found = release.sections.find((candidate) => candidate.title === title)
    if (!found) {
      found = { title, items: [] }
      release.sections.push(found)
    }
    section = found
    return found
  }

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim()
    paragraph = []
    if (!text || !release) return
    ;(section ?? ensureSection('')).items.push({ kind: 'paragraph', text })
  }

  const closeItem = () => {
    flushParagraph()
    item = undefined
    block = undefined
    inHeadline = false
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('## ')) {
      closeItem()
      release = { ...parseVersionHeading(line), sections: [] }
      section = undefined
      releases.push(release)
      continue
    }

    if (line.startsWith('### ')) {
      closeItem()
      ensureSection(line.replace(/^###\s+/, '').trim())
      continue
    }

    // A top-level bullet opens an entry. Anything indented under it is that
    // entry's body, which is why the indent test comes first.
    if (/^[-*]\s+/.test(line)) {
      closeItem()
      item = { kind: 'item', ...liftAttribution(line.replace(/^[-*]\s+/, '').trim()), body: [] }
      block = undefined
      inHeadline = true
      ;(section ?? ensureSection('')).items.push(item)
      continue
    }

    if (line.trim() === '') {
      // A blank line ends the current block but not the entry: a changeset body
      // is several paragraphs, and joining them was what turned every entry on
      // the page into one unbroken wall.
      block = undefined
      inHeadline = false
      if (!item) flushParagraph()
      continue
    }

    if (item && /^\s+/.test(raw)) {
      const body = raw.trim()
      if (inHeadline && !/^[-*]\s+/.test(body)) {
        item.text = `${item.text} ${body}`
        continue
      }
      inHeadline = false
      const nested = /^[-*]\s+/.exec(body)
      if (nested) {
        block = { kind: 'bullet', text: body.slice(nested[0].length) }
        item.body.push(block)
        continue
      }
      if (block) block.text = `${block.text} ${body}`
      else {
        block = { kind: 'paragraph', text: body }
        item.body.push(block)
      }
      continue
    }

    closeItem()
    if (release) paragraph.push(line.trim())
  }
  closeItem()

  // An entry with nothing under it should not carry an empty array into JSON.
  for (const entry of releases) {
    for (const part of entry.sections) {
      for (const row of part.items) if (row.body?.length === 0) delete row.body
    }
  }

  return releases
}

/**
 * Every release the repository knows about, newest first.
 *
 * @param {string[]} paths changelog files, most authoritative first
 */
export function extractChangelog(paths) {
  const dates = tagDates()
  const seen = new Set()
  const releases = []
  for (const path of paths) {
    if (!existsSync(path)) continue
    for (const release of parseFile(path)) {
      if (seen.has(release.version)) continue
      seen.add(release.version)
      const date = release.date ?? dates.get(release.version)
      releases.push(date ? { ...release, date } : release)
    }
  }
  return releases
}
