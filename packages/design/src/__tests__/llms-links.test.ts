import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// llms.txt is read offline, inside node_modules, so every relative link has to
// land on something `files` puts in the tarball. A link that only resolves in
// the repository is a dead end for the agent that followed it. This reads the
// manifest rather than the disk because dist/ does not exist before a build.
const files = (JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { files: string[] })
  .files

const links = [...readFileSync(join(ROOT, 'llms.txt'), 'utf8').matchAll(/\]\((\.\/[^)#\s]+)/g)].map(
  (match) => normalize(match[1]!).replace(/\/$/, ''),
)

const isPacked = (path: string) =>
  files.some((entry) => path === entry || path.startsWith(`${entry}/`))

describe('llms.txt', () => {
  it('links to something', () => {
    expect(links.length).toBeGreaterThan(0)
  })

  it('links only to files the tarball ships', () => {
    expect(links.filter((path) => !isPacked(path))).toEqual([])
  })
})
