/**
 * Parses the package's own CSS into structured tokens.
 *
 * This lives in the PACKAGE, not in the documentation site, because the answer
 * it produces is not a documentation concern: a Satori card, a native app, a
 * Figma sync and a build script all need the token values, and none of them can
 * read a stylesheet. Shipping `dist/tokens.json` beside `dist/tokens.css` means
 * there is one parser and one answer rather than one per consumer.
 *
 * The documentation site is simply the first consumer.
 *
 * Comments are carried through, because in this system the comment above a
 * token is usually the only place the REASON for it is written down.
 */
import { readFileSync } from 'node:fs'

/** A CSS block: its selector, and its declarations in document order. */
function* blocks(css) {
  const pattern = /([^{}]+)\{([^{}]*)\}/g
  for (const [, selector, body] of css.matchAll(pattern)) {
    yield { selector: selector.trim(), body }
  }
}

/** A comment's text, unwrapped onto one line. */
function note(comment) {
  return comment
    .split('\n')
    .map((line) => line.replace(/^\s*/, '').replace(/\s+$/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Splits a declaration body into entries, keeping the comment that explains
 * each one. The line break is what tells the two kinds apart.
 *
 * A comment on its own line INTRODUCES what follows, and is attached to the
 * next declaration — for a run of tokens (the usual style here) that makes it
 * the run's heading. A comment that opens on the same line as the declaration
 * before it is that declaration's OWN note, and has to be attached backwards:
 * the pattern matches it after the declaration has already been recorded,
 * which is what used to push every trailing note one row down the table.
 *
 * When a token has both, the nearer one wins. Its trailing note describes that
 * token; the heading above describes the run it happens to begin.
 */
function parseBody(body) {
  const entries = []
  let pendingComment
  let declarationEnd
  const pattern = /\/\*([\s\S]*?)\*\/|--([\w-]+):\s*([^;]+);/g
  for (const match of body.matchAll(pattern)) {
    const [text, comment, name, value] = match
    if (comment !== undefined) {
      const trailing =
        declarationEnd !== undefined && !body.slice(declarationEnd, match.index).includes('\n')
      if (trailing) entries[entries.length - 1].comment = note(comment)
      else pendingComment = note(comment)
      continue
    }
    entries.push({ name, value: value.trim(), comment: pendingComment })
    pendingComment = undefined
    declarationEnd = match.index + text.length
  }
  return entries
}

/**
 * Whether a block declares DEFAULTS — the values a reader gets having opted in
 * to nothing.
 *
 * True when the selector list contains a bare `:root`. `:root, [data-radius]`
 * declares the radius ladder at the root as well as inside a themed subtree,
 * so the root half is unconditional and those values are the defaults.
 * `[data-density='compact']` has no such half: it applies only below an
 * attribute somebody has to write.
 */
function declaresDefaults(selector) {
  return selector
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(',')
    .some((part) => /^(:root|html)$/.test(part.trim()))
}

/**
 * Which foundations page a token belongs on. Derived from the name, so a token
 * added to the CSS lands somewhere without anyone updating a mapping — and an
 * unrecognised one lands in `other`, visibly, rather than vanishing.
 */
function classify(name, value) {
  if (/^(series-|chart-)/.test(name)) return 'data'
  if (/^(control-|field-)/.test(name)) return 'density'
  if (/^(fs-|sans|serif|mono|cjk-|lh-|ls-)/.test(name)) return 'type'
  if (/^radius/.test(name)) return 'radius'
  if (/^(ease|fast|mid|slow|duration)/.test(name)) return 'motion'
  if (/^z-/.test(name)) return 'layer'
  // `bar-h` before the colour rule below, which claims everything starting
  // `bar` — `--bar` and `--bar-2` are grounds, and this one is a height.
  if (/^(pad|sec|space-|maxw|col|row|w-|measure-|page-pad|scroll-offset|toc-|bar-h)/.test(name)) return 'space'
  if (/^(focus|ring)/.test(name)) return 'focus'
  if (/^ico-/.test(name)) return 'icon'
  if (/^(shadow|lift|disabled-opacity)/.test(name)) return 'depth'
  if (/(^|-)(soft|wash)$/.test(name) || /^(paper|ink|stone|mist|rule|clay|red|forest|bar|ok|warn|danger|scrim|on-|feature|photo|background|foreground|secondary|accent|border|card|code|nav|success|warning|info|brand|overlay)/.test(name)) {
    return 'colour'
  }
  return value.startsWith('#') || value.startsWith('rgba') ? 'colour' : 'other'
}

/**
 * @param {{ tokens: string, semantic: string }} files absolute paths
 */
export function extractTokens(files) {
  const layers = {}

  for (const [layer, path] of Object.entries(files)) {
    const css = readFileSync(path, 'utf8')
    const light = []
    const dark = []
    for (const { selector, body } of blocks(css)) {
      const target = selector.includes("[data-mode='dark']") ? dark : light
      const defaults = declaresDefaults(selector)
      for (const entry of parseBody(body)) {
        target.push({ defaults, entry: { ...entry, category: classify(entry.name, entry.value) } })
      }
    }
    // A token declared twice keeps its LAST declaration, matching how the
    // browser resolves two `:root` blocks — but only among declarations of the
    // same standing. A conditional block never overrides an unconditional one.
    // The browser argument does not reach it: `[data-density='compact']`
    // resolves last only inside a subtree somebody opted in to, and taking its
    // value as the answer published `--control-h-md` as 36px directly beneath
    // prose reading "at the default, a medium control is 44px".
    //
    // Only the default is emitted, rather than the default with its compact
    // variant beside it. The variant would document the density axis better,
    // and there is nowhere to put it: `dist/tokens.json`, the generated
    // `tokens.d.ts` and every consumer of them describe a token as one value
    // per colour scheme, so a second axis is a change to that contract, not to
    // this parser. The wrong default is the bug; the missing variant is a
    // feature, and a separate one.
    //
    // A token that only a conditional block declares is still kept: that value
    // is the only one there is, and dropping it would lose the token entirely.
    const dedupe = (held) => {
      const byName = new Map()
      for (const candidate of held) {
        const seen = byName.get(candidate.entry.name)
        if (seen && seen.defaults && !candidate.defaults) continue
        byName.set(candidate.entry.name, candidate)
      }
      return [...byName.values()].map((candidate) => candidate.entry)
    }
    layers[layer] = { light: dedupe(light), dark: dedupe(dark) }
  }

  return layers
}
