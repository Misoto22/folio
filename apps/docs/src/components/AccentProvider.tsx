'use client'

export interface AccentOption {
  id: string
  name: string
  note: string
}

/**
 * The accents this site can be re-skinned with.
 *
 * The White Reset itself is monochrome, and law 7 says so plainly: the accent
 * IS ink. That is not being walked back here. What this demonstrates is the
 * thing underneath the law — one pointer, `--clay`, that every component reads
 * through `--accent`. A consumer whose brand is not monochrome changes that one
 * token and the whole system follows, without touching a component.
 *
 * So: `ink` is the system. The rest are the same system wearing somebody
 * else's brand, and each one is picked to clear WCAG AA as text on paper, which
 * is the constraint that actually limits the choice.
 *
 * The IDS are the package's, not this file's. `data-accent` is a shipped theme
 * axis now, so the values live in `themes.css` and `theme-axes.test.ts` fails
 * when this list and those selectors disagree — the site used to hold both the
 * hues and the names, which is how it demonstrated an axis no consumer had.
 * What is left here is what a stylesheet cannot say: what to call each one, and
 * why anyone would reach for it.
 */
export const ACCENTS: AccentOption[] = [
  { id: 'ink', name: 'Ink', note: 'The system as it ships — law 7, one pointer, and the pointer is the mark.' },
  { id: 'clay', name: 'Clay', note: 'The warm editorial red the site carried before the White Reset.' },
  { id: 'forest', name: 'Forest', note: 'A cool neutral green — quiet enough to sit under a lot of type.' },
  { id: 'cobalt', name: 'Cobalt', note: 'The most conventional software blue that still clears AA on paper.' },
  { id: 'moss', name: 'Moss', note: 'A green-grey with the chroma taken out, for a dense working screen.' },
  { id: 'plum', name: 'Plum', note: 'A darker chroma for a brand that wants presence without heat.' },
  { id: 'ember', name: 'Ember', note: 'A burnt orange for links and the current state, warm enough to sit beside photographs.' },
]

/**
 * How a swatch paints itself, now that there is nothing to look a hue up in.
 *
 * The colour used to come from a `--swatch-*` variable this site declared on
 * `:root`, because `--accent` only ever holds the CHOSEN accent and a picker
 * has to draw all six at once. With the axis in the package the answer is
 * simpler and holds one fewer copy of every hue: put `data-accent` on the
 * swatch element itself and `themes.css` re-derives the whole chain THERE, so
 * `var(--accent)` on that element is its own accent rather than the page's.
 */
export const SWATCH = 'var(--accent)'

/** The accent is one axis of the theme; the state lives with the rest. */
export { useAccent } from './ThemeProvider'
