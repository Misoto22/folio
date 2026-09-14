/**
 * Tests for `m22-to-folio.mjs`, run by `node --test` as `pnpm test:codemods`,
 * which the root `pnpm test` chains after the packages' suites — so CI's
 * Verify job runs them. The root `pnpm lint` lints this directory.
 *
 * They live beside the script rather than in a package's vitest suite because
 * the fixtures are full of `m22-` and `@misoto22/design`: anywhere outside
 * `scripts/codemods/**` the codemod would rewrite its own tests, and the
 * rename's zero-greps would flag them.
 *
 * The string cases pin the rules. The repository cases drive the real command
 * line against a throwaway git repository, because the promises that matter —
 * dry-run writes nothing, a second run changes nothing, the slug blocks
 * `--package`, paths move with `git mv` — only exist at that boundary.
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { isSkipped, parseArgs, renamedPath, transform } from './m22-to-folio.mjs'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'm22-to-folio.mjs')

const convert = (text, mode) => transform(text, mode).text

describe('--prefix', () => {
  const cases = [
    ['<div class="m22-card m22-card--raised">', '<div class="folio-card folio-card--raised">'],
    ['<section data-m22-animated>', '<section data-folio-animated>'],
    ['aspect-ratio: var(--m22-media-aspect);', 'aspect-ratio: var(--folio-media-aspect);'],
    ["className='animate-[m22-fade-in_200ms_ease-out]'", "className='animate-[folio-fade-in_200ms_ease-out]'"],
    ['@keyframes m22-fade-in {', '@keyframes folio-fade-in {'],
    ['const MARKER = /<!--m22-figure:(\\w+)-->/', 'const MARKER = /<!--folio-figure:(\\w+)-->/'],
    ["window.dispatchEvent(new Event('m22:palette'))", "window.dispatchEvent(new Event('folio:palette'))"],
  ]
  for (const [before, expected] of cases) {
    it(`rewrites ${before}`, () => assert.equal(convert(before, 'prefix'), expected))
  }

  it('counts each replacement', () => {
    assert.equal(transform('m22-a m22-b data-m22-c m22:palette', 'prefix').count, 4)
  })

  it('leaves package names and the slug to their own modes', () => {
    const text = "import '@misoto22/design/styles.css' // Misoto22/misoto22-design"
    assert.equal(convert(text, 'prefix'), text)
  })
})

describe('--package', () => {
  const cases = [
    ["import { Button } from '@misoto22/design'", "import { Button } from '@misoto22/folio'"],
    ["import { SiteLink } from '@misoto22/design/website'", "import { SiteLink } from '@misoto22/folio/website'"],
    ["import { AreaChart } from '@misoto22/design/charts'", "import { AreaChart } from '@misoto22/folio/charts'"],
    ["@import '@misoto22/design/styles.css';", "@import '@misoto22/folio/styles.css';"],
    ['pnpm --filter @misoto22/design-docs build', 'pnpm --filter @misoto22/folio-docs build'],
    ['"name": "misoto22-design-workspace",', '"name": "folio-workspace",'],
    ['npx misoto22-design docs Button', 'npx folio-design docs Button'],
    ['"misoto22-design": "./bin/misoto22-design.mjs"', '"folio-design": "./bin/folio-design.mjs"'],
    ['.claude/skills/misoto22-design/SKILL.md', '.claude/skills/folio-design/SKILL.md'],
    ['"globalName": "Misoto22Design",', '"globalName": "Misoto22Folio",'],
  ]
  for (const [before, expected] of cases) {
    it(`rewrites ${before}`, () => assert.equal(convert(before, 'package'), expected))
  }

  it('does not touch the GitHub slug, which is --slug and runs first', () => {
    const text = 'npx skills add Misoto22/misoto22-design'
    assert.equal(convert(text, 'package'), text)
  })

  it('leaves the class prefix to --prefix', () => {
    assert.equal(convert('m22-card', 'package'), 'm22-card')
  })
})

describe('--slug', () => {
  const cases = [
    ['https://github.com/Misoto22/misoto22-design/issues', 'https://github.com/Misoto22/folio/issues'],
    ['git+https://github.com/Misoto22/misoto22-design.git', 'git+https://github.com/Misoto22/folio.git'],
    ['npx skills add Misoto22/misoto22-design', 'npx skills add Misoto22/folio'],
    ['"repo": "Misoto22/misoto22-design"', '"repo": "Misoto22/folio"'],
  ]
  for (const [before, expected] of cases) {
    it(`rewrites ${before}`, () => assert.equal(convert(before, 'slug'), expected))
  }

  it('leaves the bin name and package to --package', () => {
    const text = "npx misoto22-design docs Button // '@misoto22/design'"
    assert.equal(convert(text, 'slug'), text)
  })

  it('then --package finishes the rest without producing a hybrid', () => {
    const text = 'npx skills add Misoto22/misoto22-design && npx misoto22-design init'
    assert.equal(
      convert(convert(text, 'slug'), 'package'),
      'npx skills add Misoto22/folio && npx folio-design init',
    )
  })
})

describe('what no mode touches', () => {
  const untouched = [
    'portfolio-grid Portfolio portfolio portfolios .portfolio-m22',
    'xm22-card _m22-card 9m22-card Xm22:palette',
    'https://ui.misoto22.com/components/button/',
    'https://api.misoto22.com/v1 and https://misoto22.com',
    'the misoto22-site repository',
    "op read 'op://01 Personal Development/m22-token/misoto22-design'",
    "import { x } from '@misoto22/tokens'",
    'Misoto22 owns the repository; @misoto22/designer is not ours',
  ]
  for (const mode of Object.keys({ slug: 0, prefix: 0, package: 0 })) {
    for (const text of untouched) {
      it(`--${mode} leaves ${text}`, () => assert.equal(convert(text, mode), text))
    }
  }

  it('never creates or destroys "folio" inside "portfolio"', () => {
    const text = 'portfolio-grid Portfolio m22-portfolio'
    const out = ['slug', 'prefix', 'package'].reduce((acc, mode) => convert(acc, mode), text)
    assert.equal(out, 'portfolio-grid Portfolio folio-portfolio')
    assert.equal(out.match(/portfolio/gi).length, text.match(/portfolio/gi).length)
  })
})

describe('idempotence', () => {
  const corpus = [
    'm22-card data-m22-animated --m22-media-aspect animate-[m22-fade-in_1s] <!--m22-figure: m22:palette',
    "'@misoto22/design/website' @misoto22/design-docs misoto22-design-workspace npx misoto22-design Misoto22Design",
    'https://github.com/Misoto22/misoto22-design.git',
  ].join('\n')

  for (const mode of ['slug', 'prefix', 'package']) {
    it(`--${mode} replaces nothing the second time`, () => {
      const once = convert(corpus, mode)
      assert.deepEqual(transform(once, mode), { text: once, count: 0 })
    })
  }
})

describe('paths', () => {
  it('renames the bin and the skill directory under --package', () => {
    assert.equal(renamedPath('packages/design/bin/misoto22-design.mjs', 'package'), 'packages/design/bin/folio-design.mjs')
    assert.equal(
      renamedPath('packages/design/skills/misoto22-design/rules/a11y.md', 'package'),
      'packages/design/skills/folio-design/rules/a11y.md',
    )
  })

  it('leaves packages/design and portfolio paths where they are', () => {
    for (const mode of ['slug', 'prefix', 'package']) {
      assert.equal(renamedPath('packages/design/src/index.ts', mode), 'packages/design/src/index.ts')
      assert.equal(renamedPath('apps/portfolio/page.tsx', mode), 'apps/portfolio/page.tsx')
    }
  })
})

describe('the skip list', () => {
  const always = [
    'CHANGELOG.md',
    'packages/design/CHANGELOG.md',
    'apps/docs/src/i18n/changelog.ts',
    'pnpm-lock.yaml',
    'apps/docs/src/lib/storage-keys.ts',
    'apps/docs/src/__tests__/storage-keys.test.ts',
    'packages/design/bin/migrate-legacy.mjs',
    'packages/design/src/__tests__/bin-init.test.ts',
    'scripts/codemods/m22-to-folio.test.mjs',
    'packages/design/dist/styles.css',
    'apps/docs/out/index.html',
    'apps/docs/src/generated/props.json',
  ]
  for (const mode of ['slug', 'prefix', 'package']) {
    for (const path of always) {
      it(`--${mode} skips ${path}`, () => assert.equal(isSkipped(path, mode), true))
    }
  }

  it('skips pending changesets under --prefix and --package, not --slug', () => {
    assert.equal(isSkipped('.changeset/brave-owls.md', 'package'), true)
    assert.equal(isSkipped('.changeset/brave-owls.md', 'prefix'), true)
    assert.equal(isSkipped('.changeset/brave-owls.md', 'slug'), false)
    assert.equal(isSkipped('.changeset/config.json', 'prefix'), false)
  })

  it('does not skip ordinary sources', () => {
    assert.equal(isSkipped('apps/docs/src/lib/theme-script.ts', 'prefix'), false)
    assert.equal(isSkipped('packages/design/src/styles/index.css', 'prefix'), false)
  })

  it('adds --skip globs to the defaults rather than replacing them', () => {
    assert.equal(isSkipped('apps/docs/e2e/chrome.spec.ts', 'prefix', ['apps/docs/e2e/**']), true)
    assert.equal(isSkipped('CHANGELOG.md', 'prefix', ['apps/docs/e2e/**']), true)
  })
})

describe('the command line', () => {
  it('defaults to a dry run', () => {
    assert.equal(parseArgs(['--prefix']).action, 'dry-run')
  })

  it('refuses no mode, two modes, and two actions', () => {
    for (const argv of [[], ['--prefix', '--package'], ['--slug', '--write', '--dry-run'], ['--prefix', '--root']]) {
      const result = run(process.cwd(), argv)
      assert.equal(result.status, 2, `${argv.join(' ')}: ${result.stderr}`)
    }
  })
})

// --- repository fixtures ---------------------------------------------------

const roots = []
after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true })
})

function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout
}

/** A git repository holding `files`, all staged, so `git ls-files` sees them. */
function repository(files) {
  const root = mkdtempSync(join(tmpdir(), 'm22-to-folio-'))
  roots.push(root)
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  git(root, ['init', '-q'])
  git(root, ['add', '-A'])
  return root
}

function run(root, argv) {
  return spawnSync(process.execPath, [SCRIPT, ...argv, '--root', root], { encoding: 'utf8' })
}

/** Every file under `root` except `.git`, as path → content. */
function snapshot(root, directory = '') {
  const files = {}
  for (const name of readdirSync(join(root, directory))) {
    if (name === '.git') continue
    const path = join(directory, name)
    if (statSync(join(root, path)).isDirectory()) Object.assign(files, snapshot(root, path))
    else files[path] = readFileSync(join(root, path), 'utf8')
  }
  return files
}

const LEGACY_KEYS = "export const LEGACY_KEYS = ['m22-mode', 'm22-accent', 'm22-theme', 'm22-sidebar']\n"

const SOURCES = {
  'apps/docs/src/components/Card.tsx': '<div className="m22-card" data-m22-animated />\n',
  'apps/docs/src/lib/storage-keys.ts': LEGACY_KEYS,
  'apps/docs/src/__tests__/storage-keys.test.ts': `expect(LEGACY_KEYS).toEqual(['m22-mode', 'm22-accent', 'm22-theme', 'm22-sidebar'])\n`,
  'CHANGELOG.md': '## 0.1.0\n\n- `m22-card` ships in `@misoto22/design`.\n',
  'portfolio.css': '.portfolio-grid { display: grid }\n',
  'binary.bin': Buffer.from([0x6d, 0x32, 0x32, 0x2d, 0x00, 0x01]),
}

describe('a dry run', () => {
  it('reports hits and a total, and writes nothing', () => {
    const root = repository(SOURCES)
    const before = snapshot(root)
    const status = git(root, ['status', '--porcelain'])
    const result = run(root, ['--prefix'])
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /2 {2}apps\/docs\/src\/components\/Card\.tsx/)
    assert.match(result.stdout, /2 replacement\(s\) in 1 file\(s\); 0 path rename\(s\)\./)
    assert.match(result.stdout, /Dry run: nothing was written/)
    assert.doesNotMatch(result.stdout, /regenerate/)
    assert.deepEqual(snapshot(root), before)
    assert.equal(git(root, ['status', '--porcelain']), status)
  })
})

describe('--write', () => {
  it('rewrites sources, skips the legacy storage keys, history and binaries, and is idempotent', () => {
    const root = repository(SOURCES)
    const binary = readFileSync(join(root, 'binary.bin'))
    assert.equal(run(root, ['--prefix', '--write']).status, 0)

    const after = snapshot(root)
    assert.equal(after['apps/docs/src/components/Card.tsx'], '<div className="folio-card" data-folio-animated />\n')
    assert.equal(after['apps/docs/src/lib/storage-keys.ts'], SOURCES['apps/docs/src/lib/storage-keys.ts'])
    assert.equal(after['apps/docs/src/__tests__/storage-keys.test.ts'], SOURCES['apps/docs/src/__tests__/storage-keys.test.ts'])
    assert.equal(after['CHANGELOG.md'], SOURCES['CHANGELOG.md'])
    assert.equal(after['portfolio.css'], SOURCES['portfolio.css'])
    assert.deepEqual(readFileSync(join(root, 'binary.bin')), binary)

    const again = run(root, ['--prefix', '--write'])
    assert.match(again.stdout, /0 replacement\(s\) in 0 file\(s\)/)
    assert.deepEqual(snapshot(root), after)
  })

  it('works when the storage-key files do not exist yet', () => {
    const root = repository({ 'src/a.css': '.m22-a {}\n' })
    assert.equal(run(root, ['--prefix', '--write']).status, 0)
    assert.equal(readFileSync(join(root, 'src/a.css'), 'utf8'), '.folio-a {}\n')
  })

  it('honours --skip', () => {
    const root = repository({ 'e2e/a.spec.ts': "'m22-a'\n", 'src/a.ts': "'m22-a'\n" })
    assert.equal(run(root, ['--prefix', '--write', '--skip', 'e2e/**']).status, 0)
    assert.equal(readFileSync(join(root, 'e2e/a.spec.ts'), 'utf8'), "'m22-a'\n")
    assert.equal(readFileSync(join(root, 'src/a.ts'), 'utf8'), "'folio-a'\n")
  })
})

describe('--check', () => {
  it('excludes the legacy storage-key files and exits 0 once the rest is replaced', () => {
    const root = repository(SOURCES)
    assert.equal(run(root, ['--prefix', '--check']).status, 1)
    run(root, ['--prefix', '--write'])
    const result = run(root, ['--prefix', '--check'])
    assert.equal(result.status, 0, result.stdout)
    assert.doesNotMatch(result.stdout, /storage-keys/)
  })

  it('lists what the rules deliberately leave for a human', () => {
    const root = repository({ 'src/a.ts': "const id = 'xm22-legacy'\n" })
    const result = run(root, ['--prefix', '--check'])
    assert.equal(result.status, 1)
    assert.match(result.stdout, /src\/a\.ts:1: const id = 'xm22-legacy'/)
  })
})

describe('harness-generated files', () => {
  const manifest = JSON.stringify({
    schemaVersion: 2,
    files: [
      { path: 'AGENTS.md', sha256: '0' },
      { path: '.cursor/rules/misoto-harness.mdc', sha256: '0' },
      { path: '.rulesync/rules/10-core-git.md', sha256: '0' },
    ],
  })
  const files = {
    '.rulesync/managed-files.json': manifest,
    'AGENTS.md': '# @misoto22/design\n\nnpx skills add Misoto22/misoto22-design\n',
    '.cursor/rules/misoto-harness.mdc': '# @misoto22/design\n',
    '.rulesync/rules/10-core-git.md': '# Git safety\n',
    '.rulesync/rules/50-project.md': '# @misoto22/design\n',
    '.rulesync/rules.json': '{ "title": "@misoto22/design" }\n',
  }

  it('are never edited, are named for regeneration, and neither block --package nor fail --check', () => {
    const root = repository(files)
    const dry = run(root, ['--package'])
    assert.equal(dry.status, 0, dry.stderr)
    assert.match(dry.stdout, /regenerate {2}AGENTS\.md/)
    assert.match(dry.stdout, /regenerate {2}\.cursor\/rules\/misoto-harness\.mdc/)
    assert.match(dry.stdout, /rulesync generate/)

    assert.equal(run(root, ['--package', '--write']).status, 0)
    for (const path of ['AGENTS.md', '.cursor/rules/misoto-harness.mdc', '.rulesync/rules/10-core-git.md']) {
      assert.equal(readFileSync(join(root, path), 'utf8'), files[path])
    }

    const check = run(root, ['--package', '--check'])
    assert.equal(check.status, 0, check.stdout)
    assert.match(check.stdout, /regenerate {2}AGENTS\.md/)
  })

  it('leaves the rulesync sources, which the manifest does not list, to be rewritten', () => {
    const root = repository(files)
    assert.equal(run(root, ['--package', '--write']).status, 0)
    assert.equal(readFileSync(join(root, '.rulesync/rules/50-project.md'), 'utf8'), '# @misoto22/folio\n')
    assert.equal(readFileSync(join(root, '.rulesync/rules.json'), 'utf8'), '{ "title": "@misoto22/folio" }\n')
  })

  it('stops with a clear message, writing nothing, when the manifest is not JSON', () => {
    const root = repository({ '.rulesync/managed-files.json': '{ not json', 'src/a.css': '.m22-a {}\n' })
    const result = run(root, ['--prefix', '--write'])
    assert.equal(result.status, 1)
    assert.match(result.stderr, /managed-files\.json is not valid JSON/)
    assert.doesNotMatch(result.stderr, /\n\s+at /)
    assert.equal(readFileSync(join(root, 'src/a.css'), 'utf8'), '.m22-a {}\n')
  })
})

describe('--package while the slug remains', () => {
  const files = {
    'README.md': 'npx skills add Misoto22/misoto22-design\n',
    'bin/misoto22-design.mjs': "import '@misoto22/design'\n",
    'CHANGELOG.md': 'https://github.com/Misoto22/misoto22-design/pull/1\n',
  }

  for (const action of ['--dry-run', '--write']) {
    it(`refuses ${action}, names the file, and writes nothing`, () => {
      const root = repository(files)
      const before = snapshot(root)
      const result = run(root, ['--package', action])
      assert.equal(result.status, 1)
      assert.match(result.stderr, /refusing to run/)
      assert.match(result.stderr, /README\.md/)
      assert.doesNotMatch(result.stderr, /CHANGELOG\.md/)
      assert.match(result.stderr, /--slug --write/)
      assert.deepEqual(snapshot(root), before)
    })
  }

  it('runs once --slug has replaced it, and moves paths with git mv', () => {
    const root = repository({ ...files, 'skills/misoto22-design/SKILL.md': 'name: misoto22-design\n' })
    assert.equal(run(root, ['--slug', '--write']).status, 0)
    const result = run(root, ['--package', '--write'])
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /rename {2}bin\/misoto22-design\.mjs -> bin\/folio-design\.mjs/)

    const tracked = git(root, ['ls-files']).trim().split('\n').sort()
    assert.deepEqual(tracked, ['CHANGELOG.md', 'README.md', 'bin/folio-design.mjs', 'skills/folio-design/SKILL.md'])
    assert.deepEqual(readdirSync(join(root, 'skills')), ['folio-design'])
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), 'npx skills add Misoto22/folio\n')
    assert.equal(readFileSync(join(root, 'bin/folio-design.mjs'), 'utf8'), "import '@misoto22/folio'\n")
    assert.equal(readFileSync(join(root, 'skills/folio-design/SKILL.md'), 'utf8'), 'name: folio-design\n')
    assert.equal(run(root, ['--package', '--check']).status, 0)
  })
})
