// @vitest-environment node
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
// @ts-expect-error — plain ESM shipped beside the bin, typed by JSDoc rather than by a declaration.
import { LEGACY_AGENTS_BLOCK, LEGACY_SKILL_NAME } from '../../bin/migrate-legacy.mjs'

const BIN = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'bin', 'folio-design.mjs')

let project: string

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'folio-init-'))
})

afterEach(() => {
  rmSync(project, { recursive: true, force: true })
})

/** Run the real bin in the scratch project, the way a consumer's shell would. */
function init(...args: string[]) {
  return spawnSync(process.execPath, [BIN, 'init', ...args], { cwd: project, encoding: 'utf8' })
}

/** A skill directory as an earlier `init` left it, under whatever name its frontmatter gives. */
function installSkill(dir: string, name: string, folder = 'misoto22-design') {
  const root = join(project, dir, folder)
  mkdirSync(join(root, 'rules'), { recursive: true })
  writeFileSync(join(root, 'SKILL.md'), `---\nname: ${name}\ndescription: old\n---\n\n# old\n`)
  writeFileSync(join(root, 'rules', 'naming.md'), 'old rules\n')
  return root
}

function frontmatterName(dir: string) {
  return /^name: (.+)$/m.exec(readFileSync(join(project, dir, 'SKILL.md'), 'utf8'))?.[1]
}

/**
 * The migration only works while it looks for the OLD names, and a rename
 * codemod run over this repository would happily rewrite them to the new ones.
 * The codemod skips this file and the module for that reason; these literals
 * are what fails if either is ever rewritten anyway.
 */
describe('the pre-rename names init looks for', () => {
  it('are the names 0.15.0 and earlier installed', () => {
    expect(LEGACY_SKILL_NAME).toBe('misoto22-design')
    expect(LEGACY_AGENTS_BLOCK).toContain('## @misoto22/design')
    expect(LEGACY_AGENTS_BLOCK).toContain('`npx misoto22-design docs <Component>`')
  })
})

describe('init migrates a skill installed under the old name', () => {
  it('moves the shared-path copy to folio-design and refreshes it', () => {
    installSkill('.agents/skills', 'misoto22-design')

    const result = init()

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('migrated')
    expect(existsSync(join(project, '.agents/skills/misoto22-design'))).toBe(false)
    expect(frontmatterName('.agents/skills/folio-design')).toBe('folio-design')
  })

  it('migrates the Claude copy even when --agent names only the shared path', () => {
    installSkill('.claude/skills', 'misoto22-design')

    const result = init('--agent', 'agents')

    expect(result.status).toBe(0)
    expect(existsSync(join(project, '.claude/skills/misoto22-design'))).toBe(false)
    expect(frontmatterName('.claude/skills/folio-design')).toBe('folio-design')
    expect(frontmatterName('.agents/skills/folio-design')).toBe('folio-design')
  })

  it('removes the old copy when the new skill is already installed beside it', () => {
    installSkill('.agents/skills', 'misoto22-design')
    installSkill('.agents/skills', 'folio-design', 'folio-design')

    const result = init()

    expect(result.status).toBe(0)
    expect(existsSync(join(project, '.agents/skills/misoto22-design'))).toBe(false)
    expect(frontmatterName('.agents/skills/folio-design')).toBe('folio-design')
  })

  it('leaves a misoto22-design directory alone when its SKILL.md names another skill', () => {
    const foreign = installSkill('.agents/skills', 'someone-elses-skill')
    const unnamed = join(project, '.claude/skills/misoto22-design')
    mkdirSync(unnamed, { recursive: true })
    writeFileSync(join(unnamed, 'notes.md'), 'no SKILL.md here\n')

    const result = init()

    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain('migrated')
    expect(readFileSync(join(foreign, 'SKILL.md'), 'utf8')).toContain('name: someone-elses-skill')
    expect(existsSync(join(unnamed, 'notes.md'))).toBe(true)
  })

  it('migrates nothing when the arguments are rejected', () => {
    const legacy = installSkill('.agents/skills', 'misoto22-design')

    const result = init('--agent', 'vim')

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unknown --agent "vim"')
    expect(existsSync(join(legacy, 'SKILL.md'))).toBe(true)
  })
})

describe('init rewrites the AGENTS.md section written before the rename', () => {
  it('replaces the old section in place, without --agents-md, and keeps the rest', () => {
    const before = `# AGENTS.md\n\nProject notes.\n${LEGACY_AGENTS_BLOCK}\n## Later section\n\nKept.\n`
    writeFileSync(join(project, 'AGENTS.md'), before)

    const result = init()
    const after = readFileSync(join(project, 'AGENTS.md'), 'utf8')

    expect(result.status).toBe(0)
    expect(after).toContain('## @misoto22/folio')
    expect(after).toContain('`npx @misoto22/folio docs <Component>`')
    expect(after).not.toContain('misoto22-design')
    expect(after).not.toContain('@misoto22/design')
    expect(after.startsWith('# AGENTS.md\n\nProject notes.\n')).toBe(true)
    expect(after).toContain('## Later section\n\nKept.\n')
  })

  it('leaves a hand-edited mention of the old package as the project wrote it', () => {
    const before = '# AGENTS.md\n\nWe use @misoto22/design for UI.\n'
    writeFileSync(join(project, 'AGENTS.md'), before)

    const result = init()

    expect(result.status).toBe(0)
    expect(readFileSync(join(project, 'AGENTS.md'), 'utf8')).toBe(before)
  })
})
