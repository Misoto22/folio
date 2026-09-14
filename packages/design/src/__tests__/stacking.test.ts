import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-expect-error — a build script, run here for the fact it derives.
import { themeAxes } from '../../scripts/theme-axes.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..')
const STYLES = join(SRC, 'styles')
const COMPONENTS = join(SRC, 'components')
const PACKAGE = join(SRC, '..')

const read = (path: string) => readFileSync(path, 'utf8')
const TOKENS = read(join(STYLES, 'tokens.css'))
const SEMANTIC = read(join(STYLES, 'semantic.css'))
const README = read(join(PACKAGE, 'README.md'))

const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** Every `.ts`/`.tsx` under `src/`, minus the tests. */
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    if (!/\.tsx?$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) return []
    return [read(path)]
  })
}

const SOURCES = sources(SRC)

/**
 * Every `--z-*` in the two `:root` layers, resolved to a number.
 *
 * The semantic layer aliases the primitive one — `--z-dropdown: var(--z-anchored)`
 * — so a rank comparison has to follow the alias rather than read the literal
 * beside it. One level of indirection is all the layering allows, and the first
 * assertion below fails loudly rather than silently comparing `NaN` if that
 * ever stops being true.
 */
function stackingRanks(): Map<string, number> {
  const raw = new Map<string, string>()
  for (const css of [TOKENS, SEMANTIC]) {
    for (const [, name, value] of strip(css).matchAll(/--(z-[\w-]+):\s*([^;]+);/g)) {
      raw.set(name!, value!.trim())
    }
  }
  const resolved = new Map<string, number>()
  for (const [name, value] of raw) {
    const alias = /^var\(\s*--([\w-]+)\s*\)$/.exec(value)?.[1]
    resolved.set(name, Number(alias ? raw.get(alias) : value))
  }
  return resolved
}

/** Component name → the `--z-*` token its own source paints at, if any. */
function paintedRank(name: string): string | undefined {
  const source = join(COMPONENTS, name, `${name}.tsx`)
  return /z-\(--(z-[\w-]+)\)/.exec(read(source))?.[1]
}

/**
 * The ladder is a contract between a number in `tokens.css` and where a panel
 * actually lands, and nothing checked that the two agreed.
 *
 * They did not. Every overlay in the package portals to `document.body`, so all
 * of them are siblings in the root stacking context and the rank is the whole
 * of the decision — and an anchored panel sat at 100, under a dialog at 210. A
 * `Select` inside a modal form, which is one of the most ordinary shapes there
 * is, painted its listbox behind the modal.
 */
describe('the stacking ladder', () => {
  const ranks = stackingRanks()

  it('resolves every rank to a number', () => {
    const unresolved = [...ranks].filter(([, value]) => !Number.isFinite(value)).map(([name]) => name)
    expect(unresolved).toEqual([])
  })

  /**
   * The load-bearing one. A panel a control opens is opened FROM somewhere, and
   * the surface it is most often opened from is a modal — so it has to clear
   * the modal, or it is invisible in exactly the case it is most used.
   */
  it('puts an anchored panel above the modal it can be opened from', () => {
    expect(ranks.get('z-dropdown')!).toBeGreaterThan(ranks.get('z-modal')!)
  })

  /** And under the toast, which has to survive a modal asking a question. */
  it('keeps the anchored panel under the toast', () => {
    expect(ranks.get('z-dropdown')!).toBeLessThan(ranks.get('z-toast')!)
  })

  it('paints every anchored panel at the anchored rank', () => {
    // Checked against the sources rather than a list kept here: a sixth
    // anchored panel written at --z-drawer would otherwise be a component
    // nobody thought about.
    const anchored = ['Popover', 'DropdownMenu', 'ContextMenu', 'Select']
    const wrong = anchored.filter((name) => paintedRank(name) !== 'z-dropdown')
    expect(wrong).toEqual([])
  })

  it('declares no rank that nothing reads', () => {
    // A token that looks load-bearing and is not gets trusted. `--z-palette`
    // was declared and read by nothing: `CommandDialog` goes through `Dialog`,
    // so a palette lands at --z-modal and its order against a second modal is
    // decided by document order — which is the right answer for a scrim and its
    // panel together, and the reason the rank was never needed.
    const readers = [SEMANTIC, ...SOURCES]
    const declared = [...strip(TOKENS).matchAll(/--(z-[\w-]+):/g)].map((match) => match[1]!)
    const unread = declared.filter(
      (name) => !readers.some((source) => source.includes(`--${name})`)),
    )
    expect(unread).toEqual([])
  })

  /**
   * The comment is printed into the site's stacking-order prose, so a count
   * that drifts is not a stale note in a stylesheet — it is a published claim
   * about how many names a consumer has to learn.
   */
  it('counts the component-facing aliases the semantic layer actually declares', () => {
    const aliases = [...strip(SEMANTIC).matchAll(/--(z-[\w-]+):/g)].length
    const claimed = /Stacking ─+ (\w+) component-facing name/.exec(SEMANTIC)?.[1]
    const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 }
    expect(claimed, 'the semantic stacking comment must state a count').toBeDefined()
    expect(WORDS[claimed!]).toBe(aliases)
  })
})

/**
 * The portable-CSS recipe, checked against the stylesheets that carry an axis.
 *
 * The README tables seven theming axes and then hands an app that compiles its
 * own Tailwind a three-import recipe that reaches two of them. A consumer
 * follows it, writes `data-radius="sharp"`, and nothing happens — no error, no
 * warning, no corner.
 */
describe('the portable CSS recipe', () => {
  const LAYERS = ['tokens.css', 'semantic.css', 'themes.css', 'keyframes.css']

  /** The imports inside the README's portable-layer code fence. */
  function recipe(): Set<string> {
    const fence = README.split('```').find((block) => block.includes('@misoto22/folio/tokens.css'))
    expect(fence, 'README must show the portable-layer recipe').toBeDefined()
    return new Set(
      [...fence!.matchAll(/@misoto22\/folio\/([\w.-]+\.css)/g)].map((match) => match[1]!),
    )
  }

  it('names every stylesheet that declares a theme axis', () => {
    const imported = recipe()
    const missing = Object.keys(themeAxes() as Record<string, string[]>).filter((axis) => {
      const declaredIn = LAYERS.filter((file) => read(join(STYLES, file)).includes(`[${axis}=`))
      return !declaredIn.some((file) => imported.has(file))
    })
    expect(missing, 'the recipe leaves these axes doing nothing').toEqual([])
  })
})
