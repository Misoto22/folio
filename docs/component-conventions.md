# Component conventions

What every component in `packages/design/src/components` is expected to do, and
why. These are the rules a review checks against; the visual rules live on
[ui.misoto22.com/principles](https://ui.misoto22.com/principles/).

Everything here applies to `packages/design/src/diagrams` too — see
[Entry points](#entry-points) for the one thing that differs.

## Shape

- **One directory per component**, named for the component: `Button/Button.tsx`,
  and its test beside it as `Button/Button.test.tsx`. The documentation
  generator keys off that directory name, so a mismatch is caught by
  `apps/docs/src/content/__tests__/registry.test.ts` rather than by a blank page.
- **Named export plus a default.** The named export is the contract; the default
  exists so a call site can import either way.
- **`'use client'` only when the component owns state, an effect, or a browser
  API.** Buttons, cards, badges and tables stay server-renderable; anything
  wrapping Radix does not.

## Styling

- **Read semantic tokens, never primitives.** `text-(--ink)` and
  `border-(--rule)`, not a hex and not `--paper` where `--background` is meant.
  Dark mode is a value swap on those names, so a component that reads the right
  layer inherits it for free.
- **Merge the caller's `className` last, through `cn`.** `clsx` alone emits both
  sides of a conflict and lets the stylesheet's own order decide the winner,
  which means an override works or does not for reasons neither side can see.
- **No blurred shadow.** `--shadow*` resolves to `none` on purpose. Depth is a
  hairline, a change of ground, or `--lift` — a hard ink offset with no blur.
- **Full literal class strings for variants.** Tailwind only generates what it
  can see verbatim, so a side or a size is looked up in a `Record`, never
  interpolated into a template string.
- **Durations and easing come from tokens.** `duration-(--duration-fast)`, not
  `duration-150`.
- **Logical properties, always.** `ps-`/`pe-`, `start-`/`end-`, `border-s`/
  `border-e`, `text-start`. `direction.test.ts` fails the build on a physical
  one. Anything that slides along the inline axis (`translate-x-`) needs an
  explicit `rtl:` counterpart, because Tailwind has no logical translate.
- **Control sizes come from the density tokens.** `min-h-(--control-h-md)`, not
  `min-h-11`, and the vertical padding too — a control whose padding alone
  exceeds the compact height never shrinks, because `min-height` is a floor.

## Behaviour

- **Reach for Radix before re-implementing a pattern.** Focus traps, roving
  tabindex, typeahead and portal placement are where a hand-rolled component
  quietly becomes unusable with a keyboard.
- **Frameworks stay out.** No router import. A component that navigates takes
  `asChild` so the call site supplies its own `Link`.
- **A prop that is required for accessibility is required in the type.**
  `Table.caption`, `Progress.label`, `Avatar.alt`, `FloatingIconButton.label`.
  If it can be forgotten, it will be.

## Accessibility

- **Decoration is `aria-hidden`.** A status dot beside the word "Available"
  repeats it; an arrow inside a link is read as "north east arrow".
- **Colour is never the only carrier.** Every status tone is doubled by an icon,
  by the words, or by both.
- **44px is the pointer-target floor** for anything a finger has to hit.
- **Motion is gated behind `motion-safe`**, and every animated element carries
  `data-folio-animated` so the one reduced-motion rule in `keyframes.css` can
  reach it.

## Documentation

A component's JSDoc IS its documentation — the site parses it. So:

- The description says what the component is FOR and, where there is a
  neighbour it could be confused with, which one to reach for.
- Every prop that is not self-evident carries its own doc comment; the site
  prints an em dash where one is missing.
- Defaults are written as destructuring defaults in the implementation, not as
  `@default` tags. The generator reads the implementation, so the two cannot
  disagree.
- At least one `@example`, and at least one live example under
  `apps/docs/src/examples/<Component>/NN-name.tsx`. The registry test fails a
  component that has none.

## Entry points

Most components ship from the package root. A group that drags in weight the
root should not pay for gets its own subpath instead:

| Entry | What lives there |
|---|---|
| `@misoto22/folio` | `src/components` — the primitives |
| `@misoto22/folio/diagrams` | `src/diagrams` — five figure renderers, a routing engine, and the chrome to explore one |

A separate entry is a real commitment rather than a folder, and all of it has
to be done together:

- **`packages/design/agent/catalog.mjs`** is where the entry is declared, in
  `ENTRY_POINTS`, and where each of its components carries `entry:`. That file
  is the source of truth for what a component IS — the site, the offline agent
  docs and the printed import line all read it, and `catalog.test.ts` fails a
  component filed under a specifier its source does not live behind.
- Its own barrel (`src/<entry>/index.ts`) and an `exports` map in
  `package.json` pointing at `dist/<entry>/index.js`.
- Its own `__tests__/{surface,coverage,ssr,a11y}` — the coverage gate is keyed
  to its own directory listing, so a component added there without a fixture
  fails the build exactly as one added to `src/components` does.
- A line in `apps/docs/scripts/generate.mjs` and in `scripts/emit-agent.mjs`, so
  the prop tables are extracted from the second tree as well. Miss the second
  and `npx @misoto22/folio docs <Component>` throws on the whole catalog.
- Two budgets in `scripts/check-size.mjs`: the entry as a whole, and one leaf
  component from it. The second is the one that matters — it is what proves the
  entry is still tree-shakeable rather than shipping whole.

**Nothing under `src/components` may import from an entry.** That is the rule
the whole arrangement rests on: one import in the wrong direction puts the
routing engine back in the bundle that renders a `Badge`, and `check-size`
fails on `whole package` rather than on the file that caused it.

## Gates

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

New or changed behaviour needs a test that exercises the real boundary — see
`Field.test.tsx` for the shape: it asserts what a screen reader receives, not
which classes were emitted.

## Charts

Everything above holds. What a chart adds, and why:

- **Its own directory tree and its own entry.** `packages/design/src/charts`, shipped
  as `@misoto22/folio/charts`. Charts need a rendering engine (`recharts`) and an
  animation runtime (`motion`); both are optional peer dependencies, so an app that
  renders a Badge does not pay for them. `check-size.mjs` measures the charts entry
  separately, and the number appearing inside `everything` would mean charts have
  leaked into the main barrel.
- **`title` is required, like `Table.caption`.** It names the figure whether or not
  it is printed. A plot with no name announces nothing.
- **The rows ship twice.** Every chart also renders its data as a visually hidden
  table, built from the same rows the marks are drawn from. `hideDataTable` opts
  out, and is only correct when the page prints the data itself.
- **Texture first, ramp second.** The default series palette is neutral (see the
  `--series-*` block in `tokens.css`), so a chart with more than one series varies
  its FILL VARIANT before anything else. That ordering is what survives greyscale
  print, forced colours, and a colour-blind reader. `data-chart-palette="chroma"`
  swaps in a validated hue palette for a consumer who needs one; a hand-picked
  `colors` array is the last resort, not the first.
- **A translucent mark reads `--chart-fill` / `--chart-texture`, never a
  literal.** They are the only pair in the token layer that holds a different
  number on each ground, and they have to: ink at 14% over paper is a legible
  band, and paper-white at 14% over near-black is nothing. Every literal opacity
  in a fill is a mark that will be invisible in one of the two modes.
- **A background plate is bounded to the plot, not to the SVG.** Recharts puts
  the axes inside the same `<svg>`, so a plate sized to the surface runs under
  the tick labels. `usePlotArea()` is where that bound comes from.
- **Not everything needs an engine.** `Heatmap` is a `<table>` with weighted
  cells, `Sparkline` is one `<path>`, `BarList` is a two-column table,
  `BulletChart` is a stack of tracks and `BigNumber` is text; all five work with
  `recharts` absent, and all five sit under `Data` in the sidebar rather than
  under `Charts` for exactly that reason. Reach for a rendering engine when the
  form actually needs one.
- **Optional chrome must not be a mandatory dependency.** A cartesian root
  statically reaches its brush, its zoom surface, its toolbar and its export
  path whether or not the page composes them, so a UI component added to one of
  those is shipped by every consumer of every chart. The toolbar is capped at
  five controls and has no overflow menu for that reason, and its hover hints
  come off the native `title` rather than the system's `Tooltip`. `check-size`'s
  `one cartesian chart` budget is what catches the next one — the leaf-chart
  budget cannot, because `Sparkline` reaches none of it.
- **Annotations stack in one fixed order**, and `ANNOTATION_LAYER` is where it
  is written down: a band behind the grid, a line above the marks, a note above
  both. A band over its own gridlines reads as a second surface; a reference
  line behind a bar is a reference nobody can check.
- **Say what the form HIDES, not only what it shows.** The statistical family
  each carries one: a box plot cannot tell one hump from two and draws six
  points like six thousand, a histogram's shape is a property of its bin width,
  a bullet's bands are a judgement in the same ink as the measurement, and a
  waterfall's connectors imply a sequence most breakdowns do not have. That
  belongs in the component's own doc comment, where the person composing it
  reads it, rather than in a footnote on the page.
- **Small multiples share a domain by default.** On independent scales a group
  peaking at 40 and one peaking at 4,000 draw the same shape, so the comparison
  the reader came for is not merely lost but inverted. `Facet` makes the shared
  domain the default and an independent one an explicit choice.
- **A chart must have an empty state.** `data: []` renders `ChartEmpty`, not a
  bare pair of axes — an empty plot is indistinguishable from a failed load, and
  the reader's next move is to reload a page that was fine.
- **Forced colours are handled in `tokens.css`, not per component.** Browsers
  remap HTML colours automatically and do not reach inside SVG, so the chart
  tokens are re-pointed at system keywords under
  `@media (forced-colors: active)`. The eight-step ramp collapses to one colour
  there, which the system survives only because texture is the primary encoding
  — that block is where that decision gets cashed.
- **A number a reader has to decode is a defect.** Axes carry `label`, values
  carry `formatNumber`, and a series that needs its figures read carries
  `<Chart.Values>` — selectively. A number on every point is the most common
  way a chart is spoiled.
- **Colour by entity, never by rank.** A series takes its ramp slot from its
  position in the config, so hiding one never repaints the survivors.
- **Consumer colours are a system boundary.** `ChartStyle` writes them into a
  `<style>` element, so a value that is not a colour is rejected there rather than
  injected. See `isSafeColor`.
- **Motion is opted out of in JS, not only in CSS.** A reveal is an animated SVG
  mask and a crawling dash is SMIL; `keyframes.css`'s reduced-motion rule reaches
  neither, so every chart gates them on `useReducedMotion`.
- **A chart directory needs a fixture in `src/charts/__tests__/surface.tsx`**, which
  the axe and server-render suites iterate. `coverage.test.ts` beside it fails a
  chart that has none, and `direction.test.ts` covers the chart sources too.
