#!/usr/bin/env node
/**
 * The mechanical half of the Folio rename: `m22-` → `folio-`, `@misoto22/design`
 * → `@misoto22/folio`, and the GitHub slug. Everything a regex cannot judge —
 * i18n fingerprints, test expectations, prose that now reads wrong — is left to
 * the pull request that runs it.
 *
 * MODES (exactly one per run, in this order, one pull request each):
 *
 *   --slug     `Misoto22/misoto22-design` → `Misoto22/folio`. PR5, after the
 *              repository itself is renamed.
 *   --prefix   `m22-` → `folio-` where no letter, digit or `_` precedes it
 *              (classes, `data-m22-*`, `--m22-*`, keyframe names, the
 *              `<!--m22-figure:` marker), and `m22:palette` → `folio:palette`.
 *              PR3.
 *   --package  `@misoto22/design-docs` → `@misoto22/folio-docs`,
 *              `@misoto22/design[/subpath]` → `@misoto22/folio[/subpath]`,
 *              `misoto22-design-workspace` → `folio-workspace`, the bin and
 *              skill name `misoto22-design` → `folio-design`, and
 *              `Misoto22Design` → `Misoto22Folio`. PR4.
 *
 * ACTIONS:
 *
 *   --dry-run  (default) per-file hit counts, planned path renames, a total.
 *   --write    apply the edits, then `git mv` every tracked path whose name
 *              contains an old name, then count what is left.
 *   --check    THE ZERO-GREP OF RECORD: the mode's leftover pattern over the
 *              same file set, every hit listed, exit 1 if there is one. Use it
 *              instead of the rename plan's `git grep` lines, whose pathspecs
 *              drift from this skip list — `:!**\/CHANGELOG.md` does not
 *              exclude the root `CHANGELOG.md`, and the slug grep has no
 *              `:!scripts/codemods/**` — so they report hits that are not
 *              leftovers.
 *
 * OPTIONS: `--root <dir>` (default: the working directory) and `--skip <glob>`,
 * repeatable, which ADDS to the skip list below — the defaults protect history
 * and legacy data, so there is deliberately no flag that removes them.
 *
 * SAFETY RULES, each covered by `m22-to-folio.test.mjs`:
 *
 * - Only `git ls-files` output is touched: regular files, valid UTF-8, no NUL
 *   byte. Untracked files, symlinks, submodules and binaries are never read.
 * - Skipped in every mode: `**\/CHANGELOG.md` and
 *   `apps/docs/src/i18n/changelog.ts` (history), `pnpm-lock.yaml` (regenerated),
 *   `apps/docs/src/lib/storage-keys.ts` and its guard test
 *   `apps/docs/src/__tests__/storage-keys.test.ts` (the legacy `m22-*` keys must
 *   survive; either may be absent), `scripts/codemods/**` (this script and its
 *   fixtures), and build output (`dist/`, `out/`, `src/generated/`).
 *   `--package` also skips `.changeset/*.md`, which name the package a pending
 *   release was written against.
 * - Every file `.rulesync/managed-files.json` lists is harness-generated and
 *   hash-locked, so it is never edited, renamed, or counted as a leftover or a
 *   slug blocker. The run names the ones still holding an old name: rebuild
 *   them from their sources — `.rulesync/rules/50-project.md` and
 *   `.rulesync/rules.json`, which are NOT listed and so ARE rewritten — with
 *   rulesync. A repository without the manifest skips nothing extra.
 * - Allow-listed leftovers are masked before any rule runs: `op://` references,
 *   `*.misoto22.com` hosts and `misoto22-site`. The `@misoto22` scope and the
 *   `Misoto22` owner survive because no rule matches them on their own.
 * - Every rule is anchored on the left, so `portfolio`, `Portfolio` and `xm22-`
 *   are never matched. "folio" occurs inside "portfolio"; a bare pattern would
 *   eat it.
 * - `--package` refuses to plan or write while `Misoto22/misoto22-design` is
 *   still present in its file set: the slug is PR5's replacement and has to land
 *   first, or the generic `misoto22-design` rule and the slug rule end up mixed
 *   in one diff.
 * - Every rule's output falls outside every rule's input, so a second run
 *   replaces nothing.
 *
 * Usage: `node scripts/codemods/m22-to-folio.mjs --slug|--prefix|--package
 * [--dry-run|--write|--check] [--root <dir>] [--skip <glob>]...`
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from 'node:fs'
import { dirname, join, matchesGlob, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The replacement rules per mode, applied in order, and the zero-grep that
 * `--check` runs afterwards. The zero-grep is deliberately broader than the
 * rules: it is the rename plan's grep, so it also finds what no rule should
 * touch and a human has to look at.
 */
export const MODES = {
  slug: {
    rules: [
      { from: /(?<![A-Za-z0-9_-])([Mm]isoto22)\/misoto22-design(?![A-Za-z0-9_-])/g, to: '$1/folio' },
    ],
    leftover: /[Mm]isoto22\/misoto22-design/g,
    skip: [],
  },
  prefix: {
    rules: [
      { from: /(?<![A-Za-z0-9_])m22-/g, to: 'folio-' },
      { from: /(?<![A-Za-z0-9_])m22:palette/g, to: 'folio:palette' },
    ],
    leftover: /m22[-:]/g,
    skip: [],
  },
  package: {
    rules: [
      { from: /@misoto22\/design-docs(?![A-Za-z0-9_-])/g, to: '@misoto22/folio-docs' },
      { from: /@misoto22\/design(?![A-Za-z0-9_-])/g, to: '@misoto22/folio' },
      {
        from: /(?<![A-Za-z0-9_-])misoto22-design-workspace(?![A-Za-z0-9_-])/g,
        to: 'folio-workspace',
      },
      {
        from: /(?<![A-Za-z0-9_-])(?<![Mm]isoto22\/)misoto22-design(?![A-Za-z0-9_-])/g,
        to: 'folio-design',
      },
      { from: /(?<![A-Za-z0-9_])Misoto22Design(?![A-Za-z0-9_])/g, to: 'Misoto22Folio' },
    ],
    leftover: /@misoto22\/design|misoto22-design|Misoto22Design/g,
    skip: ['.changeset/*.md'],
  },
}

/** Content skipped in every mode. See the header for why each entry is here. */
export const DEFAULT_SKIP = [
  '**/CHANGELOG.md',
  'apps/docs/src/i18n/changelog.ts',
  'pnpm-lock.yaml',
  'apps/docs/src/lib/storage-keys.ts',
  'apps/docs/src/__tests__/storage-keys.test.ts',
  'scripts/codemods/**',
  '**/dist/**',
  '**/out/**',
  '**/src/generated/**',
]

/** Paths never renamed: this script's own directory and build output. */
const RENAME_SKIP = ['scripts/codemods/**', '**/dist/**', '**/out/**', '**/src/generated/**']

/** The harness manifest of generated, hash-locked files. */
const MANIFEST = '.rulesync/managed-files.json'

const REGENERATE_NOTE = `Harness-generated files (${MANIFEST}) are never edited. Regenerate them from the sources this run rewrites (.rulesync/rules/50-project.md, .rulesync/rules.json): pnpm --dir .rulesync install --ignore-workspace --frozen-lockfile && ./.rulesync/node_modules/.bin/rulesync generate`

/** Paths the harness manifest under `root` lists; none when it has no manifest. */
export function managedFiles(root) {
  const file = join(root, MANIFEST)
  if (!existsSync(file)) return []
  let payload
  try {
    payload = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    throw new Error(`${MANIFEST} is not valid JSON: ${error.message}`, { cause: error })
  }
  if (!Array.isArray(payload?.files)) throw new Error(`${MANIFEST} has no "files" list`)
  return payload.files.map((entry) => entry?.path).filter((path) => typeof path === 'string')
}

/** Spans no rule may touch, whatever mode is running. */
const PROTECTED = [/op:\/\/[^'"`\n)\]>]*/g, /(?:[A-Za-z0-9-]+\.)*misoto22\.com/g, /misoto22-site/g]

const MODE_FLAGS = { '--slug': 'slug', '--prefix': 'prefix', '--package': 'package' }
const ACTION_FLAGS = { '--dry-run': 'dry-run', '--write': 'write', '--check': 'check' }

function protectedSpans(text) {
  return PROTECTED.flatMap((re) =>
    [...text.matchAll(re)].map((m) => [m.index, m.index + m[0].length]),
  )
}

function overlaps(spans, start, end) {
  return spans.some(([from, to]) => start < to && end > from)
}

/** Every match of `re` in `text` that does not overlap an allow-listed span. */
export function unprotectedMatches(text, re) {
  const spans = protectedSpans(text)
  return [...text.matchAll(re)].filter((m) => !overlaps(spans, m.index, m.index + m[0].length))
}

/**
 * Apply one mode's rules to a string.
 *
 * @param {string} text
 * @param {'slug' | 'prefix' | 'package'} mode
 * @returns {{ text: string, count: number }} the rewritten text and how many
 *   replacements were made
 */
export function transform(text, mode) {
  let count = 0
  let out = text
  for (const rule of MODES[mode].rules) {
    const spans = protectedSpans(out)
    const single = new RegExp(rule.from.source)
    out = out.replace(rule.from, (match, ...rest) => {
      // No rule has named groups, so the offset is second to last.
      const offset = rest[rest.length - 2]
      if (overlaps(spans, offset, offset + match.length)) return match
      count += 1
      // Replaying the rule on the match alone expands `$1`; the anchors were
      // already satisfied against the full text.
      return match.replace(single, rule.to)
    })
  }
  return { text: out, count }
}

/** Whether a repository-relative path is left out of a mode's content edits. */
export function isSkipped(path, mode, extraSkip = []) {
  const globs = [...DEFAULT_SKIP, ...MODES[mode].skip, ...extraSkip]
  return globs.some((glob) => matchesGlob(path, glob))
}

/** The path a tracked file moves to in a mode; the same path when it stays. */
export function renamedPath(path, mode) {
  return transform(path, mode).text
}

function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${root}: ${result.stderr.trim()}`)
  }
  return result.stdout
}

/** Tracked regular files, as repository-relative paths. */
function trackedFiles(root) {
  return git(root, ['ls-files', '-s', '-z'])
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const tab = entry.indexOf('\t')
      return { mode: entry.slice(0, 6), path: entry.slice(tab + 1) }
    })
    .filter((entry) => entry.mode === '100644' || entry.mode === '100755')
    .map((entry) => entry.path)
}

/** A file's text, or null for anything that is not safely round-trippable UTF-8. */
function readText(file) {
  let buffer
  try {
    buffer = readFileSync(file)
  } catch (error) {
    // Tracked but deleted in the working tree: nothing to rewrite.
    if (error.code === 'ENOENT') return null
    throw error
  }
  if (buffer.includes(0)) return null
  const text = buffer.toString('utf8')
  return Buffer.from(text, 'utf8').equals(buffer) ? text : null
}

function* scannedFiles(root, mode, extraSkip) {
  for (const path of trackedFiles(root)) {
    if (isSkipped(path, mode, extraSkip)) continue
    const source = readText(join(root, path))
    if (source !== null) yield { path, source }
  }
}

function plannedRenames(root, mode, extraSkip, managed) {
  const tracked = trackedFiles(root)
  const existing = new Set(tracked)
  const renames = []
  for (const from of tracked) {
    if (managed.has(from)) continue
    if ([...RENAME_SKIP, ...extraSkip].some((glob) => matchesGlob(from, glob))) continue
    const to = renamedPath(from, mode)
    if (to === from) continue
    if (existing.has(to) || existsSync(join(root, to))) {
      throw new Error(`cannot rename ${from}: ${to} already exists`)
    }
    renames.push({ from, to })
  }
  return renames
}

/**
 * Everything a run would change, without changing it.
 *
 * @returns {{ root: string, mode: string, edits: { path: string, count: number,
 *   text: string }[], renames: { from: string, to: string }[], blockers: {
 *   path: string, count: number }[], regenerate: { path: string, count: number
 *   }[] }} `blockers` lists files still holding the GitHub slug, which
 *   `--package` refuses to run past; `regenerate` lists harness-generated files
 *   the rules would change, which are left for rulesync to rebuild
 */
export function plan({ root, mode, skip = [] }) {
  const managed = new Set(managedFiles(root))
  const edits = []
  const blockers = []
  const regenerate = []
  for (const { path, source } of scannedFiles(root, mode, skip)) {
    if (mode === 'package' && !managed.has(path)) {
      const slugs = unprotectedMatches(source, MODES.slug.leftover).length
      if (slugs > 0) blockers.push({ path, count: slugs })
    }
    const { text, count } = transform(source, mode)
    if (count === 0) continue
    if (managed.has(path)) regenerate.push({ path, count })
    else edits.push({ path, count, text })
  }
  const renames = plannedRenames(root, mode, skip, managed)
  return { root, mode, edits, renames, blockers, regenerate }
}

function removeEmptyDirectories(root, directory) {
  let current = directory
  while (current !== '.' && current !== '') {
    const absolute = join(root, current)
    if (!existsSync(absolute) || readdirSync(absolute).length > 0) return
    rmdirSync(absolute)
    current = dirname(current)
  }
}

/** Write a plan's edits, then move its paths with `git mv` so history follows. */
export function apply({ root, edits, renames }) {
  for (const { path, text } of edits) writeFileSync(join(root, path), text)
  for (const { from, to } of renames) {
    mkdirSync(dirname(join(root, to)), { recursive: true })
    git(root, ['mv', '--', from, to])
    removeEmptyDirectories(root, dirname(from))
  }
}

/**
 * The mode's zero-grep over its own file set: `{ path, line, text, managed }`
 * per hit, where `managed` marks a harness-generated file to regenerate rather
 * than a leftover.
 */
export function leftovers({ root, mode, skip = [] }) {
  const managed = new Set(managedFiles(root))
  const found = []
  for (const { path, source } of scannedFiles(root, mode, skip)) {
    const lines = source.split('\n')
    const seen = new Set()
    let lineStart = 0
    let line = 0
    for (const match of unprotectedMatches(source, MODES[mode].leftover)) {
      while (line < lines.length - 1 && match.index >= lineStart + lines[line].length + 1) {
        lineStart += lines[line].length + 1
        line += 1
      }
      if (seen.has(line)) continue
      seen.add(line)
      const text = lines[line].trim().slice(0, 160)
      found.push({ path, line: line + 1, text, managed: managed.has(path) })
    }
  }
  return found
}

class UsageError extends Error {}

/** Parse the command line; throws a usage error on anything ambiguous. */
export function parseArgs(argv) {
  const options = { modes: [], actions: [], root: process.cwd(), skip: [], help: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg in MODE_FLAGS) options.modes.push(MODE_FLAGS[arg])
    else if (arg in ACTION_FLAGS) options.actions.push(ACTION_FLAGS[arg])
    else if (arg === '--help' || arg === '-h') options.help = true
    else if (arg === '--root' || arg === '--skip') {
      const value = argv[i + 1]
      if (value === undefined || value.startsWith('--')) throw new UsageError(`${arg} needs a value`)
      if (arg === '--root') options.root = resolve(value)
      else options.skip.push(value)
      i += 1
    } else throw new UsageError(`unknown argument: ${arg}`)
  }
  if (options.help) return { ...options, mode: null, action: null }
  if (options.modes.length !== 1) throw new UsageError('pass exactly one of --slug, --prefix, --package')
  if (options.actions.length > 1) throw new UsageError('pass at most one of --dry-run, --write, --check')
  return { ...options, mode: options.modes[0], action: options.actions[0] ?? 'dry-run' }
}

function printPlan(result, action, io) {
  const total = result.edits.reduce((sum, edit) => sum + edit.count, 0)
  io.log(`m22-to-folio --${result.mode}: ${action} in ${result.root}`)
  for (const edit of [...result.edits].sort((a, b) => a.path.localeCompare(b.path))) {
    io.log(`  ${String(edit.count).padStart(5)}  ${edit.path}`)
  }
  for (const { from, to } of result.renames) io.log(`  rename  ${from} -> ${to}`)
  io.log(
    `${total} replacement(s) in ${result.edits.length} file(s); ${result.renames.length} path rename(s).`,
  )
  printRegenerate(result.regenerate.map((entry) => entry.path), io)
}

function printRegenerate(paths, io) {
  if (paths.length === 0) return
  for (const path of paths) io.log(`  regenerate  ${path}`)
  io.log(REGENERATE_NOTE)
}

function printRefusal(result, io) {
  io.error(`m22-to-folio --package: refusing to run.`)
  io.error(`The GitHub slug Misoto22/misoto22-design is still present in ${result.blockers.length} file(s):`)
  for (const { path, count } of result.blockers) io.error(`  ${String(count).padStart(5)}  ${path}`)
  io.error('Replace it first with `--slug --write` (PR5); --package runs only once it is gone.')
}

function runCheck(options, io) {
  const found = leftovers(options)
  const open = found.filter((hit) => !hit.managed)
  for (const { path, line, text } of open) io.log(`${path}:${line}: ${text}`)
  printRegenerate([...new Set(found.filter((hit) => hit.managed).map((hit) => hit.path))], io)
  io.log(`m22-to-folio --${options.mode} --check: ${open.length} leftover line(s).`)
  return open.length === 0 ? 0 : 1
}

function execute(options, io) {
  if (options.action === 'check') return runCheck(options, io)
  const result = plan(options)
  if (result.blockers.length > 0) {
    printRefusal(result, io)
    return 1
  }
  printPlan(result, options.action, io)
  if (options.action === 'dry-run') {
    io.log('Dry run: nothing was written. Rerun with --write to apply.')
    return 0
  }
  apply(result)
  const remaining = leftovers(options).filter((hit) => !hit.managed).length
  io.log(`Written. ${remaining} leftover line(s) outside the skip list; --check lists them.`)
  return 0
}

/** Run the command line; returns the process exit code. */
export function main(argv, io = console) {
  let options
  try {
    options = parseArgs(argv)
  } catch (error) {
    if (!(error instanceof UsageError)) throw error
    io.error(`m22-to-folio: ${error.message}. See --help.`)
    return 2
  }
  if (options.help) {
    io.log('Usage: m22-to-folio.mjs --slug|--prefix|--package [--dry-run|--write|--check] [--root <dir>] [--skip <glob>]...')
    return 0
  }
  try {
    return execute(options, io)
  } catch (error) {
    // A broken manifest, a git failure or a rename collision: say which, once,
    // without a stack trace, and write nothing further.
    io.error(`m22-to-folio: ${error.message}`)
    return 1
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
