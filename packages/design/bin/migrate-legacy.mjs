/**
 * What `init` cleans up from before the Folio rename.
 *
 * Up to 0.15.0 this package was `@misoto22/design`: `init` installed its skill
 * as `misoto22-design`, and `--agents-md` appended a section naming that bin. A
 * project upgraded to `@misoto22/folio` would otherwise keep the old copy next
 * to the new one — two skills describing one package, the older one telling an
 * agent to run a command the package no longer ships.
 *
 * The old names below are literal ON PURPOSE. The rename codemod skips this file
 * and its guard test (`src/__tests__/bin-init.test.ts`): rewritten to the new
 * names, the migration would look for the new skill and migrate nothing.
 */
import { existsSync, readFileSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

/** The skill's directory and frontmatter name before the rename. */
export const LEGACY_SKILL_NAME = 'misoto22-design'

/** The section `init --agents-md` appended to AGENTS.md before the rename, verbatim. */
export const LEGACY_AGENTS_BLOCK = `
## @misoto22/design

UI comes from \`@misoto22/design\`. Read \`SKILL.md\` in the installed skill
directory before writing components against it — the names diverge from
shadcn/ui in several places, and colour is never written as a raw class.

- One component in full: \`npx misoto22-design docs <Component>\`
- Everything it ships: \`npx misoto22-design docs --installed\`
`

const LEGACY_NAME_LINE = new RegExp(`^name:\\s*['"]?${LEGACY_SKILL_NAME}['"]?\\s*$`, 'm')

/**
 * Whether `dir` holds the old skill, judged by the name in its frontmatter
 * rather than by the directory name — a directory someone else called
 * `misoto22-design` is not ours to move.
 */
export function isLegacySkill(dir) {
  const file = join(dir, 'SKILL.md')
  if (!existsSync(file)) return false
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'))
  return Boolean(frontmatter && LEGACY_NAME_LINE.test(frontmatter[1]))
}

/**
 * Move the old skill in each agent directory to `skillName`.
 *
 * Renamed rather than deleted when nothing sits at the new path, so anything a
 * project added beside the skill survives. When the new skill is already there
 * the old copy is only a duplicate, and is removed.
 *
 * @param {string} cwd the project root
 * @param {string[]} agentDirs skill directories relative to it, e.g. `.claude/skills`
 * @param {string} skillName the skill's current directory name
 * @returns {{ dir: string, from: string, to: string }[]} one entry per directory migrated
 */
export function migrateLegacySkills(cwd, agentDirs, skillName) {
  const migrated = []
  for (const dir of agentDirs) {
    const from = join(cwd, dir, LEGACY_SKILL_NAME)
    if (!isLegacySkill(from)) continue
    const to = join(cwd, dir, skillName)
    if (existsSync(to)) rmSync(from, { recursive: true, force: true })
    else renameSync(from, to)
    migrated.push({ dir, from, to })
  }
  return migrated
}

/**
 * `text` with the old AGENTS.md section replaced by `block`.
 *
 * Only the exact section `init` wrote is replaced: a hand-edited one is the
 * project's own prose, and is returned unchanged along with everything else.
 */
export function replaceLegacyAgentsBlock(text, block) {
  const legacy = LEGACY_AGENTS_BLOCK.trim()
  if (!text.includes(legacy)) return text
  return text.replace(legacy, () => block.trim())
}
