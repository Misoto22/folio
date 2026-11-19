import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

/** A padding, margin, gap or inset utility written with a bracketed value. */
const BRACKETED_SPACE =
  /(?<![\w-])-?(?:p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|bottom|start|end|left|right)-\[([^\]]+)\]/g

/** A literal length — but not a zero, which is the same on every grid. */
const RAW_LENGTH = /(?<![\w.(-])(?!0(?:px|rem|em)\b)\d*\.?\d+(?:px|rem|em|vh|svh|dvh|vw)\b/

describe('space', () => {
  it('writes no raw length in a bracketed spacing utility', () => {
    // A length on the 4px grid is a plain step (`p-1`, `gap-0.5`); one that
    // cannot be on it is a `--space-*` token in tokens.css. What is left in
    // brackets may compose those — `calc(var(--x) + --spacing(6))` — but not
    // introduce a number of its own.
    const offenders = sources(SRC).flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(BRACKETED_SPACE)]
        .filter(([, value]) => RAW_LENGTH.test(value!.replace(/--spacing\([^)]*\)/g, '')))
        .map(([utility]) => `${relative(SRC, file)}: ${utility}`),
    )
    expect(offenders).toEqual([])
  })
})
