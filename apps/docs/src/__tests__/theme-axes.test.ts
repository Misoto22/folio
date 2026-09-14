import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ACCENTS } from '@/components/AccentProvider'
import { AXES, DEFAULTS, LOOK_AXES, PRESETS, attribute } from '@/components/ThemeProvider'
// Reached across the workspace on purpose: a selector is the only thing that
// settles whether an axis value is real, and the package already derives them.
import { themeAxes } from '../../../../packages/design/scripts/theme-axes.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const SCRIPT = readFileSync(join(HERE, '..', 'lib', 'theme-script.ts'), 'utf8')

/** The axes the stylesheets actually define, read out of the selectors. */
const DERIVED: Record<string, string[]> = themeAxes()

describe('the pre-paint theme script', () => {
  /**
   * It restores the axes from `localStorage` before React exists, so it holds
   * its own copy of the defaults — and a hand-kept copy of a list is the thing
   * this repository keeps being bitten by. `chartPalette` was added to `AXES`
   * and not here, which is not an error anyone sees: the reader picks a themed
   * console, reloads, and the charts quietly come back grey.
   */
  it('knows every axis, and the same default for each', () => {
    const literal = /var defaults = \{([^}]*)\}/.exec(SCRIPT)?.[1]
    expect(literal, 'theme-script.ts must declare the defaults inline').toBeDefined()
    const restored = Object.fromEntries(
      [...literal!.matchAll(/(\w+): '([\w-]+)'/g)].map((m) => [m[1]!, m[2]!]),
    )
    expect(restored).toEqual(
      Object.fromEntries(Object.keys(AXES).map((axis) => [axis, DEFAULTS[axis as never]])),
    )
  })
})

describe('the theme axes', () => {
  /**
   * `data-chartPalette` is not a typo a browser reports — it is an attribute
   * nothing selects, so an axis whose name hyphenates has to go through
   * `attribute()` at every call site that writes one.
   */
  it('offers exactly the values the stylesheets define', () => {
    for (const axis of Object.keys(AXES) as (keyof typeof AXES)[]) {
      const defined = DERIVED[attribute(axis)] ?? []
      const offered = new Set<string>(AXES[axis])
      // Some defaults are NAMED — `paper`, `hairline`, `editorial` each carry a
      // selector so a subtree can opt back out of an ancestor's theme — and
      // some are only "write no attribute". So a default may appear on either
      // side; every other value has to appear on both.
      expect(defined.filter((value) => !offered.has(value)), `${attribute(axis)} defines it, the panel hides it`)
        .toEqual([])
      expect(
        [...offered].filter((value) => !defined.includes(value) && value !== DEFAULTS[axis]),
        `${attribute(axis)} offers it, no selector defines it`,
      ).toEqual([])
    }
  })

  /**
   * The accent picker offers exactly the accents the package defines.
   *
   * The hues used to live in this app's own stylesheet, which is why nothing
   * checked this: a list and the CSS it drew from were both the site's, so they
   * could only disagree with each other. `data-accent` is a shipped axis now,
   * and this list is names and notes over the package's selectors — an id with
   * no selector behind it is a swatch painted in the page's own accent, six
   * previews of six accents all showing the one already on screen.
   */
  it('offers exactly the accents the package ships', () => {
    const defined = DERIVED['data-accent'] ?? []
    const offered = ACCENTS.map((accent) => accent.id)
    expect([...offered].sort()).toEqual([...defined].sort())
  })

  /** A preset that sets an axis the panel cannot show is a look with no dial. */
  it('lets the panel reach every axis a preset sets', () => {
    for (const preset of PRESETS) {
      for (const key of Object.keys(preset.values)) {
        if (key === 'accent') continue
        expect(LOOK_AXES, `${preset.id} sets ${key}`).toContain(key)
      }
    }
  })

  /**
   * Every preset names every axis, or a thumbnail shows the READER's theme for
   * whichever axis it left out — the failure the named defaults exist to fix.
   */
  it('has every preset name every axis', () => {
    for (const preset of PRESETS) {
      for (const axis of LOOK_AXES) {
        expect(preset.values[axis], `${preset.id} leaves ${axis} unset`).toBeDefined()
      }
    }
  })
})
