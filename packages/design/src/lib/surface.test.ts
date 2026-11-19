import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { SURFACE_FEATURE, SURFACE_PANEL, SURFACE_PANEL_QUIET } from './surface'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const OWNER = join(SRC, 'lib', 'surface.ts')

/** Every .ts/.tsx source file under src, tests excluded. */
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

/**
 * The ground class of each material. A file that writes one of these by hand is
 * assembling the material itself, which is the copy this module exists to end.
 */
const GROUNDS = [
  { material: 'SURFACE_PANEL or SURFACE_PANEL_QUIET', ground: 'bg-(--panel-bg)' },
  { material: 'SURFACE_FEATURE', ground: 'bg-(--feature-surface)' },
]

describe('surface materials', () => {
  it('assembles each material from tokens only', () => {
    for (const recipe of [SURFACE_PANEL_QUIET, SURFACE_PANEL, SURFACE_FEATURE]) {
      for (const utility of recipe.split(' ')) {
        expect(utility, `${utility} names no token`).toMatch(/\(--[\w-]+\)|^panel-blur$/)
      }
    }
  })

  it('keeps the panel material complete: ground, edge, lift and backdrop', () => {
    expect(SURFACE_PANEL.split(' ').sort()).toEqual(
      ['bg-(--panel-bg)', 'border-(--panel-border)', 'panel-blur', 'shadow-(--panel-lift)'].sort(),
    )
  })

  it('makes the quiet panel the raised one minus its lift, and nothing else', () => {
    const raised = new Set(SURFACE_PANEL.split(' '))
    const quiet = SURFACE_PANEL_QUIET.split(' ')
    expect(quiet.every((utility) => raised.has(utility))).toBe(true)
    expect([...raised].filter((utility) => !quiet.includes(utility))).toEqual(['shadow-(--panel-lift)'])
  })

  it('pairs the reversed ground with its own text colour', () => {
    expect(SURFACE_FEATURE.split(' ').sort()).toEqual(['bg-(--feature-surface)', 'text-(--on-feature)'].sort())
  })

  it.each(GROUNDS)('is the only source that writes $ground', ({ material, ground }) => {
    const offenders = sources(SRC)
      .filter((file) => file !== OWNER && readFileSync(file, 'utf8').includes(ground))
      .map((file) => relative(SRC, file))
    expect(offenders, `use ${material} from lib/surface instead`).toEqual([])
  })
})
