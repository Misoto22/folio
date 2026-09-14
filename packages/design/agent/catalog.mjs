/**
 * What each component IS — the half a parser cannot produce.
 *
 * Everything mechanical (props, types, defaults, JSDoc) is read out of
 * `src/components/**` by `scripts/extract-props.mjs`. What is left here is the
 * part someone has to decide: which group a component belongs to, its one-line
 * summary, when to reach for it instead of its neighbour, the promises it keeps
 * so a call site does not have to, and its keyboard contract key by key.
 *
 * This lives in the PACKAGE rather than in the documentation site because it
 * describes the components, not the site. It is also what makes the package
 * legible offline: `scripts/emit-agent.mjs` turns it plus the extracted props
 * into `dist/agent/`, which is what `npx @misoto22/folio docs <Component>`
 * prints and what the skill in `skills/` sends an agent to.
 *
 * The site reads the emitted `dist/agent/catalog.json`, the same way it already
 * reads `dist/tokens.json` rather than re-parsing the stylesheets. A second
 * hand-kept copy is a copy that goes stale, and the site would have been the
 * one people believed.
 *
 * `name` is the only identifier. The directory is the name, and the site's URL
 * slug is the name in kebab-case; `catalog.test.ts` fails if either stops being
 * true, so neither is authored twice. WHICH tree the directory sits in decides
 * the specifier, and that is read off the filesystem — see `ENTRY_POINTS`.
 *
 * The entries themselves live one group to a file under `catalog/`, and this
 * module concatenates them in `GROUPS` order. They are prose rather than rows —
 * several paragraphs per component once anatomy and practices are filled — and a
 * single list of ninety-two of them is a file only one hand can be writing at a
 * time. Nothing else moved: this is still the module every consumer imports, and
 * `catalog.test.ts` fails if the concatenation loses an entry, duplicates a name,
 * or lets one group’s entries drift into another’s.
 */

import { ACTIONS } from './catalog/actions.mjs'
import { FORMS } from './catalog/forms.mjs'
import { NAVIGATION } from './catalog/navigation.mjs'
import { OVERLAYS } from './catalog/overlays.mjs'
import { FEEDBACK } from './catalog/feedback.mjs'
import { DISPLAY } from './catalog/display.mjs'
import { SURFACES } from './catalog/surfaces.mjs'
import { DATA } from './catalog/data.mjs'
import { CHARTS } from './catalog/charts.mjs'
import { DIAGRAMS } from './catalog/diagrams.mjs'
import { WEBSITE } from './catalog/website.mjs'

/**
 * @typedef {object} KeyRow
 * @property {string[]} keys
 * @property {string} does
 */

/**
 * A part of the rendered thing, named so a reader can point at it.
 *
 * The props tell a reader what to pass; they do not tell it what it will be
 * looking at, and half the questions asked about a component are about a part
 * that has no prop of its own — a spinner that only exists while `loading` is
 * true, a slot the label shares with an icon.
 *
 * @typedef {object} AnatomyPart
 * @property {string} element The name of the part, as a reader would point at it.
 * @property {boolean} [required] Whether the part is always present.
 * @property {string} description What the part is for.
 */

/**
 * One judgement about using the component, and the consequence of ignoring it.
 *
 * `accessibility` records what the component does on the caller's behalf. This
 * records what it cannot do: the call sites that compile, render, and are still
 * wrong. A line here earns its place by naming what breaks, because advice
 * without a consequence is a preference, and a preference is skipped.
 *
 * @typedef {object} Practice
 * @property {'do' | 'dont'} kind
 * @property {string} text One judgement, stated as one sentence.
 */

/**
 * @typedef {object} CatalogEntry
 * @property {string} name Display name, the directory name, and the slug source.
 * @property {string} group One of `GROUPS`.
 * @property {'component' | 'pattern'} [kind] Whether this is a reusable primitive or a website composition.
 * @property {string} summary One line.
 * @property {string} [when] When to reach for this rather than the one beside it.
 * @property {AnatomyPart[]} [anatomy] The parts a reader can point at, named.
 * @property {Practice[]} [practices] Do and don't, as judgements rather than advice.
 * @property {string[]} [accessibility] Promises the component keeps.
 * @property {KeyRow[]} [keyboard] The keyboard contract, key by key.
 * @property {string[]} [related] Slugs a reader is likely to want next.
 */

/**
 * The sidebar's order, and it is an argument rather than an alphabet: a reader
 * arrives wanting to DO something, then to move, then to be interrupted, then
 * to be told what happened — and only after all of that to arrange, to display,
 * to plot and to draw. Alphabetical would put Actions beside Charts and call it
 * a taxonomy.
 *
 * `Data` and `Charts` are two groups rather than one, and the line between them
 * is not cosmetic: everything in `Charts` needs the `recharts` peer dependency
 * and nothing in `Data` does. A reader who cannot add a rendering engine can
 * still use every entry in the first of the two.
 *
 * `Diagrams` is last because it is the furthest from a screen: the rest of this
 * list builds an interface, and those draw a picture of a system. They are also
 * the only group whose components render entirely on a server.
 */
export const GROUPS = [
  'Actions',
  'Forms',
  'Navigation',
  'Overlays',
  'Feedback',
  'Display',
  'Surfaces',
  'Data',
  'Charts',
  'Diagrams',
  'Website',
]

/** Every component's slug is its name in kebab-case. Derived, never authored. */
export const slugOf = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * The package's entry points, and the source tree each one is built from.
 *
 * The one fact here that a path cannot state: `.` is built from `src/index.ts`,
 * which re-exports `src/components/**`, so the specifier and the directory do
 * not share a name the way `./charts` and `./diagrams` do. Everything else is
 * derived from it — which entry point a component belongs to is decided by the
 * tree its directory sits in, never authored beside it, for the same reason the
 * slug is not authored: a second copy of a fact is a copy that goes stale, and
 * the emitted `Import:` line is one an agent pastes without checking.
 *
 * It is the line that most has to be right. A component named under the wrong
 * specifier does not produce a blank page, it produces an import that throws —
 * and the split entries exist precisely so an app that renders a Badge resolves
 * neither `recharts` nor a routing engine.
 *
 * @type {Record<string, string>} specifier → directory under `src/`
 */
export const ENTRY_POINTS = {
  '@misoto22/folio': 'components',
  '@misoto22/folio/charts': 'charts',
  '@misoto22/folio/diagrams': 'diagrams',
  '@misoto22/folio/website': 'website',
}

/** The specifier a consumer imports the root entry from. */
export const DEFAULT_ENTRY = '@misoto22/folio'

/** The directory under `src/` an entry point is built from. */
export const sourceDirOf = (specifier) => ENTRY_POINTS[specifier] ?? ENTRY_POINTS[DEFAULT_ENTRY]

/**
 * Every entry, in `GROUPS` order — see the group files under `catalog/`.
 *
 * @type {CatalogEntry[]}
 */
export const CATALOG = [
  ...ACTIONS,
  ...FORMS,
  ...NAVIGATION,
  ...OVERLAYS,
  ...FEEDBACK,
  ...DISPLAY,
  ...SURFACES,
  ...DATA,
  ...CHARTS,
  ...DIAGRAMS,
  ...WEBSITE,
]

/**
 * What each theme axis MEANS. The axes and their values are not authored here —
 * `scripts/emit-agent.mjs` reads them out of the stylesheets, the same way the
 * token list is read rather than retyped, and `catalog.test.ts` fails when this
 * table and the stylesheets disagree.
 *
 * What IS authored is the half a selector cannot say: what an unset axis gives
 * you. Every axis has an unset default — the White Reset is what you get by
 * writing no attribute at all — and a reader who does not know that reads the
 * value list as exhaustive and sets one needlessly.
 *
 * `data-accent` is the reason this became derived rather than authored: the
 * site's llms.txt described one for months while the stylesheets had none, and
 * an agent reading it set an attribute that did nothing. It is now real — the
 * selectors are in `themes.css` — and it arrived here the same way every other
 * value does, by being in the CSS. Nobody had to remember this table.
 *
 * @type {Record<string, string>}
 */
export const AXIS_DEFAULTS = {
  'data-mode': 'follows the app',
  // Law 7: the accent IS ink, and `ink` is that stated as a value rather than
  // as an absence — an unset accent inside a themed subtree is the ancestor's,
  // not the system's.
  'data-accent': 'ink',
  'data-surface': 'paper',
  'data-radius': 'the default radius ladder',
  'data-rules': 'hairline',
  'data-type': 'editorial',
  'data-motion': 'calm',
  'data-density': 'comfortable',
  // Set by `<Table density>` rather than by hand, and scoped to one table on
  // purpose: a dashboard often wants a dense grid inside comfortable chrome.
  'data-table-density': 'comfortable — whatever `data-density` is doing around it',
  'data-chart-palette': 'the neutral series ramp',
}
