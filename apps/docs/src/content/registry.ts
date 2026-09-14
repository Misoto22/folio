// Relative, not the `@/` alias: this module is pulled in by the Playwright
// specs as well as by the app, and Playwright resolves tsconfig paths only
// when `baseUrl` is set — which Next does not need and this tsconfig does not
// have. The alias resolved locally and did not on CI, which is the worst shape
// that failure can take.
import catalog from '../generated/catalog'

/**
 * The component list, and where each one sits in the sidebar.
 *
 * What each component IS — its group, its one-line summary, when to reach for
 * it instead of its neighbour, the promises it keeps and its keyboard contract
 * — is authored in the PACKAGE, at `packages/design/agent/catalog.mjs`, and
 * read here from the artifact its build emits. That is the same arrangement the
 * tokens already have, and for the same reason: it describes the components, so
 * a hand-kept copy on this side would be a second answer to a question the
 * package already answers — and this side is the one people would read.
 *
 * What is genuinely the site's own is below: how tall a preview card has to be
 * before an open panel spills out of it. Nothing else.
 *
 * `dir` and `slug` are both the component's name — the directory under
 * `packages/design/src/components` or `src/charts`, and the name in
 * kebab-case. Neither is authored; `catalog.test.ts` in the package fails if
 * either stops being true.
 */

export const GROUPS = catalog.groups as readonly string[] as readonly ComponentGroup[]

export type ComponentGroup =
  | 'Actions'
  | 'Charts'
  | 'Data'
  | 'Display'
  | 'Feedback'
  | 'Forms'
  | 'Overlays'
  | 'Navigation'
  | 'Surfaces'
  | 'Diagrams'
  | 'Website'

export interface ComponentEntry {
  /** URL segment — the name in kebab-case. */
  slug: string
  /** Directory under one of the package's source trees — the generated-data key. */
  dir: string
  /**
   * The specifier this component is imported from.
   *
   * Emitted rather than authored: `@misoto22/design/charts` and
   * `@misoto22/design/diagrams` are separate entry points, and an import line
   * naming the wrong one does not render a blank page — it throws.
   */
  entry: string
  /** Display name. */
  name: string
  group: ComponentGroup
  /** One line, shown in the index and under the page title. */
  summary: string
  /** When to reach for this rather than the component beside it. */
  when?: string
  /**
   * The parts of the rendered thing, named so a reader can point at one.
   *
   * The props say what may be passed; they do not say what the reader is
   * looking at, and half the questions a component attracts are about a part
   * with no prop of its own — a spinner that exists only while `loading` is
   * true, a slot the label shares with an icon.
   *
   * Optional because it is being filled in component by component in the
   * package, and a page has to read right while the field is still absent.
   */
  anatomy?: { element: string; required?: boolean; description: string }[]
  /**
   * Do and don't, as judgements with a consequence attached.
   *
   * `accessibility` records what the component does on the caller's behalf;
   * this records what it cannot — the call sites that compile, render, and are
   * still wrong.
   */
  practices?: { kind: 'do' | 'dont'; text: string }[]
  /** Promises the component keeps so a call site does not have to. */
  accessibility?: string[]
  /**
   * The keyboard contract, key by key.
   *
   * Written out rather than left implied, because "it is accessible" is not
   * something a reader can act on and "Escape closes it, and focus returns to
   * the trigger" is. It is also the part that quietly regresses: a wrapper that
   * swallows a key looks identical until someone tries it.
   */
  keyboard?: { keys: string[]; does: string }[]
  /**
   * Extra room the preview needs.
   *
   * A component that opens a panel — a date picker, a combobox — draws it
   * against the trigger, which on a page means "just below the field" and in a
   * short preview card means "over whatever is underneath". This is the card
   * reserving the space the open state will use, so the example reads as it
   * would in an app rather than as something spilling out of its box.
   *
   * A Tailwind class, because it is a layout decision and belongs in the same
   * vocabulary as the rest of them. The site's own, which is why it is the one
   * thing this file still authors.
   */
  previewHeight?: string
  /** Slugs of components a reader is likely to want next. */
  related?: string[]
}

/** How much room each open-panel preview reserves. The site's only opinion here. */
const PREVIEW_HEIGHTS: Record<string, string> = {
  calendar: 'min-h-[24rem]',
  combobox: 'min-h-[29rem]',
  command: 'min-h-[24rem]',
  'context-menu': 'min-h-[20rem]',
  'color-picker': 'min-h-[32rem]',
  'date-picker': 'min-h-[26rem]',
  // 20rem, not 18: the overflow-button example opens a five-row panel from a
  // trigger part-way down the frame, and 18rem cleared it by a few pixels —
  // which a compact density or a font fallback would take back.
  'dropdown-menu': 'min-h-[20rem]',
  popover: 'min-h-[20rem]',
  'searchable-menu': 'min-h-[27rem]',
  select: 'min-h-[24rem]',

  // A plot needs room the way an open panel does: a chart squeezed into a
  // short card loses its axis labels before it loses anything else.
  'area-chart': 'min-h-[22rem]',
  'bar-chart': 'min-h-[22rem]',
  'box-plot': 'min-h-[24rem]',
  'composed-chart': 'min-h-[22rem]',
  facet: 'min-h-[28rem]',
  'funnel-chart': 'min-h-[24rem]',
  histogram: 'min-h-[24rem]',
  'line-chart': 'min-h-[22rem]',
  'pie-chart': 'min-h-[24rem]',
  'radar-chart': 'min-h-[24rem]',
  'radial-chart': 'min-h-[24rem]',
  'sankey-chart': 'min-h-[24rem]',
  'scatter-chart': 'min-h-[22rem]',
  'treemap-chart': 'min-h-[24rem]',
  'waterfall-chart': 'min-h-[24rem]',

  // A figure's chrome needs the same: an export menu and a minimap both draw
  // over the card rather than inside it.
  'diagram-export-menu': 'min-h-[26rem]',
  'diagram-minimap': 'min-h-[24rem]',
}

/**
 * Every family the package catalogues, website compositions included.
 *
 * The compositions had a section of their own at `/patterns/` for a while. They
 * are the `Website` group now, for the reason Charts and Diagrams never needed a
 * section: shipping from a separate entry point is a fact the component's page
 * states, not a reason to file it where a reader browsing the catalogue has to
 * know to look. The retired addresses redirect — see `public/_redirects`.
 */
export const COMPONENTS: ComponentEntry[] = catalog.components.map((entry) => ({
  ...(entry as Omit<ComponentEntry, 'dir' | 'previewHeight'>),
  dir: entry.name,
  previewHeight: PREVIEW_HEIGHTS[entry.slug],
}))

export const BY_SLUG = new Map(COMPONENTS.map((entry) => [entry.slug, entry]))

/** Components in sidebar order: groups as declared, entries alphabetical within. */
export function groupedComponents(): { group: ComponentGroup; entries: ComponentEntry[] }[] {
  return GROUPS.map((group) => ({
    group,
    entries: COMPONENTS.filter((entry) => entry.group === group).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((section) => section.entries.length > 0)
}
