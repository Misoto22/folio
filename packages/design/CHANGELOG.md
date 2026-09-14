# @misoto22/design

## 0.15.0

### Minor Changes

- [#109](https://github.com/Misoto22/misoto22-design/pull/109) [`d65dea0`](https://github.com/Misoto22/misoto22-design/commit/d65dea06af3e02cfd767f322e37b75febd0c8097) Thanks [@Misoto22](https://github.com/Misoto22)! - `CommandDialog` takes `shouldFilter`, `inputLabel` and its dialog's focus and Escape handlers, and `SearchPalette` is now built on it instead of beside it.
  
  `SearchPalette` rebuilt the same modal by hand — a `Dialog` holding a `Command`, placed above centre — and restyled the library's own row and heading attributes to get there, so a change to either palette could move one and leave the other behind. It now renders `CommandDialog`, takes its geometry and its list, and styles only the elements it renders itself.
  
  The new props are the hooks it could not do without, forwarded unchanged: `shouldFilter` for results a host has already filtered, `inputLabel` for a field named apart from its dialog, and `onOpenAutoFocus`, `onCloseAutoFocus` and `onEscapeKeyDown` for returning focus to whatever opened a palette that has no `DialogTrigger`, and for a detail view that Escape leaves rather than closes.

- [#111](https://github.com/Misoto22/misoto22-design/pull/111) [`faf08cf`](https://github.com/Misoto22/misoto22-design/commit/faf08cfa9d16eeed365a76c0bbd2c3fa0f33a993) Thanks [@Misoto22](https://github.com/Misoto22)! - `styles.css` no longer carries the website compositions: import `website.css` for
  them, and the new `website-base.css` for a whole site's document defaults.
  
  An application that wanted only the primitives received about 1,300 lines of
  website CSS, and some of it reached the whole document: a body font size and
  background, zeroed heading and paragraph margins, one focus ring on every link
  and control, and a restyle of every `DropdownMenu`.
  
  `website.css` now holds only rules scoped to a composition's classes, and its
  menu styling reaches only the menus the compositions open. The body, heading,
  paragraph and link defaults, the scrollbar gutter, the `:lang(zh)` spacing and
  the site-wide focus ring move to `@misoto22/design/website-base.css`.
  
  That ring now sits in the base layer, so a primitive's own outline utility wins
  over it again. Unlayered, it beat `outline-none` and drew a clipped square around
  the `Command` input in every host that loaded the website styles.
  
  `website-motion.css` is removed. No component used its unprefixed classes and
  keyframes, and its `@keyframes pulse` shared a name with the one Tailwind's
  `animate-pulse` reads.
  
  The chart surface's keyboard focus ring moves to `keyframes.css`, so an
  application on `styles.css` keeps it.
  
  To migrate a website host, add the imports it now needs beside its existing
  stylesheet:
  
  - `@import '@misoto22/design/website.css';` for the compositions.
  - `@import '@misoto22/design/website-base.css';` for the document defaults and the focus ring, when the whole page is a website.
  - Copy any of `.route-enter`, `.panel-in`, `.sheet-in`, `.scrim-in`, `.ask-launcher` or `::highlight(ask-passage)` the host still uses into its own stylesheet.
  
  An application that renders only the primitives needs no change.

### Patch Changes

- [#107](https://github.com/Misoto22/misoto22-design/pull/107) [`a2603e7`](https://github.com/Misoto22/misoto22-design/commit/a2603e7403ebc6f373d916e238ba5f6a99ec2a91) Thanks [@Misoto22](https://github.com/Misoto22)! - `CommandItem`'s active-row accent bar now clips to the row's own corner radius, so it no longer pokes past a rounded highlight.
  
  The bar is an absolutely-positioned `::before`, and a rounded parent does not clip an absolutely-positioned child by default — only `overflow-hidden` on the row does. At `data-radius="round"`, `--radius-row` reaches 18px and the bar's flat edge stuck out past the highlight's curve by close to 7px; at the default radius the miss was under a pixel, and at `sharp` there was none, which is why the defect went unnoticed until the round theme was checked directly.
  
  Every other child — icon, meta, shortcut — stays clear of the newly-clipped corners at every radius, the closest any of them comes to a corner's arc centre being about 7px on an 18px arc. The focus ring is unaffected too: `outline` paints outside an element's border box, which its own `overflow` never clips. `Combobox` and `SearchableMenu` render their rows through this same `CommandItem`, so both pick up the fix without a separate change; `DropdownMenu`, `ContextMenu`, `Select`, `NavItem` and `Sidebar` highlight a row with a plain background fill and carry no accent bar, so none of them shared the defect.

- [#105](https://github.com/Misoto22/misoto22-design/pull/105) [`21fc205`](https://github.com/Misoto22/misoto22-design/commit/21fc205e7504bccec79c3ddb32f46fa614b88f9c) Thanks [@Misoto22](https://github.com/Misoto22)! - `SiteNavigation` takes its width from its containing block, so a transformed or contained frame keeps the whole masthead inside it.
  
  The header pinned itself to `window.innerWidth` so that an overlay's scroll lock could not change its width in a WebView. That is right against the viewport and wrong anywhere else: under an ancestor with a `transform` or `contain: layout` — a device preview, an embedded console, a documentation card — a fixed header is laid out against that ancestor, and a window-wide width pushed its links and preferences out past the frame's edge.
  
  It now pins a width only when the stylesheet's `inline-size: 100%` already resolves to the viewport, and otherwise leaves the width to the containing block.

- [#106](https://github.com/Misoto22/misoto22-design/pull/106) [`ffd26b9`](https://github.com/Misoto22/misoto22-design/commit/ffd26b9ee6959825f147ab89f472e7f6dd95455a) Thanks [@Misoto22](https://github.com/Misoto22)! - `StepSequence` now draws the core `Steps` rail, and `ClipboardButton` shares `CodeBlock`'s copy state, including what a refused clipboard write does.
  
  The website rail was a second implementation of the same figure — marker, connector, name and note — at its own sizes. It now renders through the same internal rail item as `Steps`, so its markers are the core 2rem circles with sans counters and the anchor no longer sets its label in medium weight. Host counters, tags, the caption, `data-anchor` and the ARIA list roles that keep article prose from restyling it are unchanged, and the anchor is still not announced as the current step.
  
  Both copy controls confirm for 1600ms from the latest accepted write. A refused write now clears any confirmation still showing instead of leaving it up, and names the refusal once in development as `CLIPBOARD_WRITE_REJECTED`.

## 0.14.1

### Patch Changes

- [#103](https://github.com/Misoto22/misoto22-design/pull/103) [`a0acf7d`](https://github.com/Misoto22/misoto22-design/commit/a0acf7d8fb71733b8ba78f65d79d9488581ba1cd) Thanks [@Misoto22](https://github.com/Misoto22)! - `Heatmap` lays its grid out as a fixed table now, so its cells keep a real width instead of collapsing to 0px.
  
  Every cell's printed reading is `sr-only`, so automatic table layout had no content to size a data column by and handed the row-header column all the slack it could find. Measured in a consumer at 1440px: 919 of 1035px went to the header, and every one of a year calendar's 392 cells came out 0px wide — an invisible grid. `CalendarHeatmap` inherits `Heatmap`, so it carried the same defect.
  
  The row-header column gets its width from a `colgroup` rather than from a cell, because fixed layout only ever reads a column's width off a cell in the table's first row, and that row's own corner cell is `sr-only` — `position: absolute` — so a width placed there was never seen. A `col` is read regardless of which cell in the column, or which row, is hidden.

## 0.14.0

### Minor Changes

- [#101](https://github.com/Misoto22/misoto22-design/pull/101) [`8d6e255`](https://github.com/Misoto22/misoto22-design/commit/8d6e2550dddcb71261fe3db4def037854ed4cfc7) Thanks [@Misoto22](https://github.com/Misoto22)! - `data-accent` is a shipped theme axis now — `ink`, `clay`, `forest`, `cobalt`, `moss` and `plum`, each re-pointing one token the whole system reads.
  
  **The site could show it and no consumer could have it.** Five accents lived in
  the documentation app's own `globals.css`, so a page on ui.misoto22.com
  demonstrated a re-pointing that no installed copy of the package could
  reproduce — while `SKILL.md`, `rules/tokens.md` and the emitted `llms.txt` each
  said in so many words that no such attribute existed. All three were right about
  the package and wrong about what the reader had just been shown.
  
  `moss` is the sixth and it is the one the axis was moved for: a green-grey with
  almost no chroma left in it, for a dense working screen where the accent has to
  mark a choice without becoming the loudest thing on the page.
  
  Every value carries a light hex, a dark hex and a collapse to `CanvasText` under
  forced colours. The last of those is not politeness — a browser remaps an
  element's own colours and does not reach inside an SVG or a `color-mix()`, and
  `[data-accent='moss']` matches an element directly, so it outranks anything
  `:root` merely offers. Without the restatement a reader in Windows High Contrast
  who had chosen an accent kept it.
  
  Nothing is authored twice. `scripts/theme-axes.mjs` reads the axis out of the
  selectors that define it, so the skill, the offline agent documentation and the
  site's index gained the row because the CSS exists. The one thing a selector
  cannot say — that an unset accent is `ink` rather than the ancestor's — is the
  line `catalog.mjs` still authors.

- [#101](https://github.com/Misoto22/misoto22-design/pull/101) [`8d6e255`](https://github.com/Misoto22/misoto22-design/commit/8d6e2550dddcb71261fe3db4def037854ed4cfc7) Thanks [@Misoto22](https://github.com/Misoto22)! - `CalendarHeatmap` — a year of daily readings as a week-by-week grid, built from the dates rather than from the order of the array.
  
  `Heatmap` draws named rows and columns and knows nothing about dates, so every
  consumer wrote the calendar on top of it and none of them wrote it the same way
  twice. What that costs is not effort but correctness: given a bare list of
  counts, one missing Tuesday shifts every reading after it by a cell, and the
  result is a plausible picture of a year that did not happen.
  
  **A day with no entry is a gap, not a zero.** "Nothing happened" and "nothing
  was recorded" are different readings, and a grid that draws them alike invites
  the reader to explain an outage that was a hole in collection. `null` renders as
  a dashed outline and announces "no data"; zero is the palest cell on the ramp.
  
  Every bound is a UTC midnight parsed out of `YYYY-MM-DD`, because a local-time
  calendar drawn in two timezones is two different calendars and the disagreement
  is exactly one day wide — small enough to survive review, large enough to move a
  reading into the wrong week.
  
  `Heatmap.formatValue` now receives the cell as well as the number. It is what
  makes `describe(value, date)` possible at all: two days with the same count are
  two different readings, and the row and column a cell is announced with are a
  weekday and a month spanning five weeks. Existing callers are unaffected — the
  parameter is additional and a one-argument formatter still satisfies the type.

- [#101](https://github.com/Misoto22/misoto22-design/pull/101) [`8d6e255`](https://github.com/Misoto22/misoto22-design/commit/8d6e2550dddcb71261fe3db4def037854ed4cfc7) Thanks [@Misoto22](https://github.com/Misoto22)! - `Metric` — the stat tile that sits four across on a console: a label, a monospaced figure, a status tone and a free slot under the number.
  
  **`BigNumber` was the only figure in the set and it is the wrong size for four
  of them.** It is one headline in the editorial face with a delta under it, for
  the ONE number a view is about, and it needs the charts entry. A dashboard whose
  tiles have to be a `<div>` because the delta does not apply is a dashboard with
  two tile designs in it, which is what every console built on this package had.
  
  The figure is monospace and tabular by construction rather than by a prop.
  Four tiles in a row are read down the column as much as along it, and
  proportional digits put the same magnitude at two different widths — which is a
  comparison the reader came for and cannot make.
  
  `asChild` is how a tile becomes a link, and it is `Slottable` underneath rather
  than a bare `Slot`: a bare one hands the child the props and leaves it holding
  its own content, so `<a href="…" />` would render a correctly styled empty box
  and nothing would say so. The whole plate becomes the link, which also means the
  link's accessible name is every word in the tile, read in order.

- [#101](https://github.com/Misoto22/misoto22-design/pull/101) [`8d6e255`](https://github.com/Misoto22/misoto22-design/commit/8d6e2550dddcb71261fe3db4def037854ed4cfc7) Thanks [@Misoto22](https://github.com/Misoto22)! - `PageHeader` — a page opening, with the order of its parts fixed: the trail, the kicker, the title, the controls that qualify it, and the sentence under them.
  
  The system had `Heading` for a heading and `Breadcrumb` for a trail and nothing
  that said how a page STARTS, so every application invented the arrangement — and
  the eyebrow landed above the title on one screen and below it on the next. Two
  consoles built on this package had two different answers, which is one more than
  a design system is for.
  
  **Where the range picker goes is the argument.** It sits beside the title, above
  the rule, because it does not act on the records: it says which slice of them the
  title refers to. Below the rule it becomes a toolbar competing with whatever
  strip the page starts with, which is where every application had put it.
  
  The title is an `h1` by default because a page has one name, and a shell that
  owns the document's heading has taken the page's own name away from it; `level`
  moves it for the case where the opening is not the document's, which is a
  preview canvas or a template inside a page that already has an `h1`. The SIZE
  does not move with it: `--fs-heading` at every level, rather than `Heading`'s own
  level-1 default of `--fs-title`, because a page opening stands over a working
  screen and moving one down the outline is a fact about the document rather than
  a request for smaller type.

### Patch Changes

- [#101](https://github.com/Misoto22/misoto22-design/pull/101) [`8d6e255`](https://github.com/Misoto22/misoto22-design/commit/8d6e2550dddcb71261fe3db4def037854ed4cfc7) Thanks [@Misoto22](https://github.com/Misoto22)! - The `warm` and `cool` surfaces keep their rules dark now — both set `--rule` and `--rule-2` once, so every border on a dark page rendered near-white.
  
  **The dark block restated the grounds and not the rules.** Each surface moves
  five tokens on the light ground and only three of them came back in dark, so
  `#e8e4da` and `#e4e9ee` kept resolving over `#12110f` and `#0c0e11` — 14.86:1
  and 15.82:1 against the surface's own paper, where the neutral dark rule sits at
  1.42:1. Measured in a console built on this package: 33 routes, up to 174
  near-white borders on one page. `glass` restates both and was never affected.
  
  The replacements are built the way `tokens.css` builds its own, the system's
  near-white at an alpha over whatever ground is under it, and at the SAME alphas
  — 0.14 and 0.26 — because the alpha is what a rule's weight is. What moves is
  the near-white: `#f4f4f2` held at its own lightness and turned onto the
  surface's dark hue, 84.6° for warm and 258.4° for cool, at the chroma that
  surface's light `--rule` carries. Composited on each surface's own dark paper
  the two land at 1.45 / 2.19 and 1.42 / 2.17 against the root's 1.42 / 2.16.
  
  The tint is not decoration. A light warm rule carries MORE chroma than the
  ground it separates — C 0.0111 at `--stone` against 0.0185 at `--rule-2` — and
  the root's neutral near-white inverts that on the dark ground: at 26% it washes
  the tint out, leaving warm's heaviest rule at C 0.0075 over a `--stone` of
  C 0.0103, the least warm thing on a warm page.
  
  The test asks this per TOKEN now rather than per block, because a dark block
  existing is not a dark block being complete — which is the whole of what the
  surface axis was checking, and both of these had one.

## 0.13.1

### Patch Changes

- [#99](https://github.com/Misoto22/misoto22-design/pull/99) [`6d4f512`](https://github.com/Misoto22/misoto22-design/commit/6d4f5129146a239609924bc5ca303c5682c74f1e) Thanks [@Misoto22](https://github.com/Misoto22)! - Restore the collection filter hit area and the chart's two-pixel focus ring on public websites.

## 0.13.0

### Minor Changes

- [#97](https://github.com/Misoto22/misoto22-design/pull/97) [`e34836e`](https://github.com/Misoto22/misoto22-design/commit/e34836e057c02054850aa78e66c656c9838ae934) Thanks [@Misoto22](https://github.com/Misoto22)! - Media-detail return controls now retain a 44px touch target after browser subpixel rounding.
  
  A 0.25px safety margin prevents a declared 44px target from measuring just under 44px in a real browser layout.
  
  Media page compositions accept `headingLevel` when they are embedded inside an existing document outline.
  
  The default remains an `h1` for standalone pages, while an embedded composition can use the heading level that follows its host section.

## 0.12.5

### Patch Changes

- [#95](https://github.com/Misoto22/misoto22-design/pull/95) [`b03eb7b`](https://github.com/Misoto22/misoto22-design/commit/b03eb7b571e25e93537b384f0be062f2a4c91753) Thanks [@Misoto22](https://github.com/Misoto22)! - Media-detail return controls now retain a 44px touch target after browser subpixel rounding.
  
  A 0.25px safety margin prevents a declared 44px target from measuring just under 44px in a real browser layout.

## 0.12.4

### Patch Changes

- [#93](https://github.com/Misoto22/misoto22-design/pull/93) [`9489393`](https://github.com/Misoto22/misoto22-design/commit/9489393283ad92cdbb0e40a36c7738746c2c132f) Thanks [@Misoto22](https://github.com/Misoto22)! - Media-detail return controls now keep a 44px touch target.
  
  The layout receives a host-owned link, so direct semantic children need their own target instead of inheriting density from the host.

## 0.12.3

### Patch Changes

- [#91](https://github.com/Misoto22/misoto22-design/pull/91) [`942b251`](https://github.com/Misoto22/misoto22-design/commit/942b2513b1deba9ea4d76c572f92b8a639a3d13f) Thanks [@Misoto22](https://github.com/Misoto22)! - Website fields retain a 16px type size on phones, and keyboard-focused charts now show the system focus ring.
  
  Compact controls keep their desktop density. Only editable collection, question-card and command-palette fields expand to the mobile-safe text size, while a direct Recharts surface rule protects its keyboard focus treatment from chart defaults.

## 0.12.2

### Patch Changes

- [#88](https://github.com/Misoto22/misoto22-design/pull/88) [`9d24295`](https://github.com/Misoto22/misoto22-design/commit/9d2429522a71386f4eb7cea5e09ce61a2bc76aa2) Thanks [@Misoto22](https://github.com/Misoto22)! - Sheet close actions provide a 44px target across every edge.
  
  The close icon remains small, while its reachable surface now meets the same 44px target used by the rest of the package's mobile controls.

## 0.12.1

### Patch Changes

- [#86](https://github.com/Misoto22/misoto22-design/pull/86) [`2745959`](https://github.com/Misoto22/misoto22-design/commit/27459599bbfc7cc178ebc65949d4922b1f4f8a40) Thanks [@Misoto22](https://github.com/Misoto22)! - Question cards expose their heading as a named region and restore a 44px submit target.
  
  The question prompt is a distinct conversation invitation inside a larger portfolio or archive. Its heading now names the section landmark, so assistive technology can find that invitation directly. The circular submit control keeps its compact shape while restoring the package's documented 44px interactive target.

## 0.12.0

### Minor Changes

- [#84](https://github.com/Misoto22/misoto22-design/pull/84) [`424b569`](https://github.com/Misoto22/misoto22-design/commit/424b569f1fc9d8629d85738e82b9f541684cbffc) Thanks [@Misoto22](https://github.com/Misoto22)! - Add reusable website compositions for navigation, portfolios, archives, reading, media, forms, search, metrics and conversations.
  
  The separate `@misoto22/design/website` entry owns presentation and accessible interactions. Hosts supply localized labels, router links, content and service state; chart engines remain in the optional charts entry.
  
  The portable `website.css` entry and compiled stylesheet share the canonical tokens. Offline documentation includes every family and its server and client exports.

## 0.11.0

### Minor Changes

- [#82](https://github.com/Misoto22/misoto22-design/pull/82) [`45bd51e`](https://github.com/Misoto22/misoto22-design/commit/45bd51e52f52512ca50cbc1116253348a5113d3d) Thanks [@Misoto22](https://github.com/Misoto22)! - Every icon in the package is a Remix Icon glyph now, and the brand marks lucide dropped come
  back with them.
  
  `lucide-react` is gone from `dependencies` and `@remixicon/react` replaces it, across all
  thirty-four components that draw one. The names change with it — `Check` is `RiCheckLine`,
  `X` is `RiCloseLine`, `Settings` is `RiSettings3Line` — but no export of this package's own
  changes, so an app that never imported an icon directly sees only different glyphs.
  
  BRAND MARKS ARE THE REASON. lucide removed every one of them, and a design system that
  cannot draw a GitHub octocat without redrawing somebody's trademark in a house stroke is a
  design system that pushes that decision onto its consumers. This site had already paid it:
  the mark in its own masthead was a hand-drawn path in a file of its own, and that file is
  deleted. Remix Icon ships `RiGithubFill`, `RiTwitterXFill`, `RiDiscordFill`, `RiSlackFill`,
  `RiFigmaFill` and a couple of hundred more, each in a Fill and a Line.
  
  Three things change for a consumer, and all three are visible rather than silent.
  
  `--ico-stroke` IS REMOVED. A Remix glyph is a filled path on a 24px grid, so there is no
  weight to set and nothing for the token to name; a token that documents a knob the system no
  longer has is worse than no token. `--ico-s`, `--ico-m` and `--ico-l` are unchanged, and so
  is every size the package draws at.
  
  `LucideIcon` becomes `RemixiconComponentType` in the props that take an icon COMPONENT —
  `NavItem.icon`, `EmptyState.icon`, `DropdownMenuItem.icon`, `ContextMenuItem.icon`,
  `CommandItem.icon`, and the chart toolbar's. Both are `ComponentType`s over an SVG's props,
  so a lucide icon passed to one still type-checks and still renders; the name in the
  reference is what moved.
  
  AND `aria-hidden` IS NOW WRITTEN RATHER THAN INHERITED. lucide stamped `aria-hidden="true"`
  onto any icon it had not been handed an `aria-` prop or a role for. `@remixicon/react` adds
  nothing and spreads what it is given straight onto the `svg`, so every decorative glyph in
  the package carries the attribute at its own call site — thirty-nine of them, added in this
  change. Anything drawing its own icons should check the same thing on upgrade: nothing
  fails, the icon simply starts being announced.

## 0.10.1

### Patch Changes

- [#79](https://github.com/Misoto22/misoto22-design/pull/79) [`1838aec`](https://github.com/Misoto22/misoto22-design/commit/1838aecf3cac7e1eadb798f6913660621a5263b4) Thanks [@Misoto22](https://github.com/Misoto22)! - A chart's empty state stays where its plot was, instead of pinning to the top of a taller figure.
  
  `ChartEmpty` sizes itself 16:9 and stops at `max-h-[26rem]`, which is right for a card that grows to its content and short of a figure the page has given a fixed height — a dashboard tile, a cell in a grid. The box was then shorter than the figure holding it, so the words landed near the top while the plot they stand in for had filled the whole cell, and the same chart read at two different heights depending on whether it had data. The container it replaces is `flex-1` and `justify-center`; this was neither. An auto margin is the smaller of the two available fixes: it absorbs the free space when there is any and does nothing when there is none, so a chart that sizes to its own content keeps exactly the shape it had.

## 0.10.0

### Minor Changes

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - The chart palette gains a third value, and forced colours gets its ramp back.
  
  `data-chart-palette` had two answers — `mono` and `chroma` — and neither one
  was "our accent is not ink". A consumer whose buttons, pills and rules had all
  re-pointed off `--clay` still got eight greys in every chart, and the only way
  out was the thing the axis exists to prevent: hand-picked hexes in a `colors`
  config. `accent` derives all eight names from `--clay` instead, so it works for
  an accent nobody here has seen.
  
  It pins the LIGHTNESS and inherits the hue, because separation and contrast are
  carried almost entirely by lightness — eight even steps across L 0.173–0.640 on
  paper and L 0.967–0.530 on the dark ground, both bounds set by the weakest hue
  rather than the prettiest. Measured across all 360 hues at maximum chroma:
  adjacent-pair separation ΔE 26.7 light / 25.0 dark (OKLab ×100, against a floor
  of 15), minimum contrast 3.11 on both grounds. `--series-1` sits mid-band, so a
  one-series chart paints within ΔE 2 of the accent itself rather than in the
  accent's darkest possible shade, and ink stays available as `--series-2`. What
  it is NOT is a categorical palette: one hue laddered eight ways is guesswork at
  eight series, and `chroma` is still the answer for a reader comparing
  categories.
  
  Separately, and older than this: `tokens.css` collapses the ramp to
  `CanvasText` under `forced-colors`, and it writes that on `:root` — which any
  palette attribute then outranks, because an element matching
  `[data-chart-palette]` directly beats a value it merely inherits from the root,
  and beats it on source order at the root itself. A reader in Windows High
  Contrast who was on `chroma` kept getting the eight hues, which is the setting
  being ignored rather than honoured. The ramp is restated after the palettes, at
  the specificity the dark blocks use.

### Patch Changes

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - A chart with a brush gets its plot back.
  
  The brush is rendered as the chart container's FOOTER, and the footer branch
  dropped the plot's whole shape: no `aspect-video` — correct, since sizing the
  outer box 16:9 pays for the footer out of the plot's share — but also no
  `min-h`, which was not. So a brushed chart had a plot with no intrinsic height
  at all, and in any container that sizes to its content the plot measured zero
  and only the brush's own 56px survived. The page showed a scrubber with nothing
  above it to scrub. Recharts says so out loud — "width(-1) and height(-1) of
  chart should be greater than 0" — into a console nobody reads, which is why it
  stood.
  
  The shape moves down one element instead of being dropped: with a footer, the
  plot carries `aspect-video max-h-[26rem] min-h-[13rem]` and the footer sits
  under it. `AreaChart`, `BarChart`, `LineChart` and `ComposedChart` are all
  affected — every chart that takes a `Brush`.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - `--control-lh`: every control is now the height its token claims.
  
  `--control-h-sm` is 36px and an `sm` Button measured 39. `md` said 44 and
  measured 46; `lg` said 48 and measured 50. `min-height` is a floor, and a floor
  only binds while the box is under it — the box being the line, the padding and
  the border. The padding was already scaled per density for exactly this reason,
  with a comment saying so. The LINE was not: it inherited the body's 1.6 reading
  leading, which no control asked for, and 20.8 + 16 + 2 clears 36 on its own.
  
  So every text button in the system was two to three pixels taller than the
  number documenting it, and the documentation said 36 and 44. The Button page
  still says "sm is 36px at the default density"; it is now true.
  
  `--control-lh: 1.2` is the missing term, declared beside the padding it belongs
  with, and `tokens.test.ts` now runs the arithmetic — line plus padding plus
  border against the height token, at every size, on both densities.
  
  `Kbd` carried the same literal `1.6`. Everything about it tracks its context in
  `em` — "so it tracks whatever type it sits beside" — except the leading, which
  was pinned at the reading value, so a keycap inside a control stood proud of
  the label next to it. That is what kept the documentation site's search field
  at 39px after the button itself was fixed, and what made it the one control in
  the masthead taller than the four beside it.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - Example headings reach the Chinese site.
  
  `generate.mjs` derives them from the filename — `02-fill-variants` becomes
  `fill variants` — so they are not prose anyone wrote, are not in `messages.ts`,
  and are not JSX for `untranslated-chrome.test.ts` to find. Three mechanisms
  guard the site's Chinese and none of them can see a string the BUILD makes. So
  the contents rail on `/zh` listed `default`, `brush` and `value labels` under
  示例 for as long as the site has existed, and every check passed.
  
  `ExampleCopy` gains a `title`, and `exampleTitle()` reads it. No fingerprint,
  for the reason `ComponentCopyZh.name` has none: there is no English author to
  drift away from, and renaming the file renames the key, which already fails.
  
  The catalogue is translated a group at a time. Charts and Data are done — 88
  headings — and the test guards it two ways: a finished group may not regress,
  and the untranslated remainder may only get smaller.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - An example's own knobs move out of the specimen and into the canvas toolbar.
  
  A chart example that lets a reader switch the tooltip's ground had two
  different things on the card: the chart, which is what the page is about, and
  two pill groups, which are the demo's scaffolding. Drawn together they read as
  one composition and the scaffolding won — it sat on top, it was the only thing
  with a filled ground, and at 36px it was the system's smallest control against
  a 26px toolbar two pixels above it. A reader looking for what `BarChart`
  renders found a settings panel.
  
  `ExampleControls` portals them up one band, beside LTR/RTL and the density
  switch, at the same chrome scale — the same strip height, to the pixel. The
  example's own code does not change: wiring state to a prop is the lesson in
  several of these, so the controls stay where they were written and only the
  canvas draws them elsewhere. `generate.mjs` unwraps the element out of the
  printed snippet, the way it already drops `export function Example` and the
  relative imports, so the code a reader copies is byte-for-byte what it was.
  
  Twenty-four chart examples move. The four where a `ToggleGroup` IS the
  specimen — its own three examples and `Field`'s group-naming one — stay put.
  
  Separately, the tooltip knobs in `BarChart`'s interaction example now say what
  they do: both move the floating panel and nothing else on the card, and
  `frosted` is the plot showing THROUGH that panel, so it reads where the panel
  crosses a bar and nowhere else. Over the white ground it is white at 75% over
  white, which is white — a knob that appeared not to work.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - `--bar-h`: the band across the top of an application, as one number.
  
  It was five literals in two packages, and they disagreed. `AppShell` said
  `h-14` and the documentation site said `h-16` — the same role, 56px in the
  component this system ships and 64px on the site documenting it. A sixth,
  `SidebarHeader`'s `min-h-14` floor, is what accidentally kept the rail's head
  level with the masthead beside it, and what would have stopped it staying level
  the moment either moved. `--scroll-offset` was a seventh: "a masthead plus a
  line of air", written as `88px`, a number derived by hand from whichever of the
  two answers its author had on screen.
  
  Derived rather than typed. A bar is a row of controls and the air around them,
  so it is the control it seats plus six pixels above and below — the same twelve
  `--sidebar-w-icon` adds to a rail's collapsed width, for the same reason. A bar
  can no longer be set to a height its own controls do not fit in, and
  `--scroll-offset` is now `calc(var(--bar-h) + 1.5rem)`, so a bar that moves
  takes every anchored heading with it.
  
  WHICH control depends on the pointer. A bar is chrome: its controls are `sm`,
  the density this system documents as a deliberate below-the-floor size for a
  mouse. A finger is not a mouse, so on a coarse pointer they grow to the 44px
  target WCAG 2.5.5 asks for and the bar grows with them. 48px comfortable and
  42px compact with a pointer; 56px and 48px with a finger.
  
  Declared on the root, which is load-bearing rather than incidental: a `var()`
  inside a custom property is substituted where the property is DECLARED, so
  `--control-h-md` resolves once and every descendant inherits the same answer —
  including a rail that pins its own `data-density`, which is what keeps a
  compact rail's head level with a comfortable page's bar.
  
  The documentation site's masthead loses 16px in the process — 64px down to 48px
  on a desktop, unchanged at 56px on a phone. It was seating 39px of content in
  64px of bar, and holding a further 8px for a 44px target that only exists when
  the pointer is a finger.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - Hovering a rail no longer emboldens the section under the pointer.
  
  The fill follows the pointer while the pointer is in the list, and the three
  declarations that do it land on every row. Two are no-ops on a row that is not
  current — it has no fill and no ink to give up. `font-normal` was not: it is an
  absolute weight rather than an undo, so in a rail whose base face is lighter
  than 400 — the White Reset's own sidebar runs at 300 — every row got HEAVIER
  the moment the pointer arrived. Selecting one row appeared to embolden its
  whole section, which is the opposite of a highlight that follows the pointer.
  
  The weight is now scoped to `aria-current="page"`, which is the only row that
  has a weight to give up. The fill and the ink still relax on every row, because
  there the class says what it means.

- [#76](https://github.com/Misoto22/misoto22-design/pull/76) [`d6a2ccc`](https://github.com/Misoto22/misoto22-design/commit/d6a2ccc3daac923962e121a6c405df0caad2d372) Thanks [@Misoto22](https://github.com/Misoto22)! - `AreaChart 面积图` becomes `AreaChart - 面积图`.
  
  Both halves are names — the export identifier and the Chinese one — and a
  space between two names reads as one name that changed script half way
  through. The dash says they are two labels for the same thing, which is what
  they are. The order does not move: the English is the import, and it stays
  first.

## 0.9.0

### Minor Changes

- [#71](https://github.com/Misoto22/misoto22-design/pull/71) [`5b0d101`](https://github.com/Misoto22/misoto22-design/commit/5b0d101e8ebfee3c51d9d2b6bc15a6af3e06b7cf) Thanks [@Misoto22](https://github.com/Misoto22)! - `Sidebar` is a drawer where a column will not fit, and a page has a side to sit on.
  
  Five things the rail could not do, and one of them was the reason every
  application built on it wrote a second navigation by hand.
  
  **Under `breakpoint` it is an overlay**, not a narrower column: `fixed` against
  its own edge, over a scrim, and `inert` while closed. That last part is the one
  hand-written versions skip — a drawer merely translated off-screen still holds
  focus and is still read aloud, so a closed one puts its whole index between the
  reader and the page they were on. The scrim is a real button, because tapping
  beside a drawer is how a drawer is closed and that gesture has to exist for a
  keyboard too. A row closes it: following a link inside an overlay and leaving
  the overlay up is a reader landing somewhere they cannot see.
  
  The switch is a media query in the stylesheet, not a branch on `matchMedia`.
  The first version asked JavaScript and rendered a different tree from the
  answer — an answer that does not exist until an effect runs, so a phone painted
  a 256px column beside a 390px screen and the page scrolled sideways until React
  caught up. `breakpoint` is therefore one of `'sm' | 'md' | 'lg' | 'xl'` rather
  than a number: these are literal class strings, and a class built from a runtime
  number is one the compiler never emitted. `null` pins the rail as a column at
  every width, and `contained` points the overlay at a positioned ancestor instead
  of the window — for a rail inside a device preview or an embedded console.
  
  **`side="end"`** puts the rail on the other edge, logically: the right in a
  Latin document and the left in an Arabic one, with the hairline, the collapse
  glyph and the row tooltips all following rather than being written twice.
  
  **`variant`** decides which of the two pieces is the panel. `flush` is a column
  and a page divided by a hairline. `floating` lifts the rail off the ground as
  its own bordered panel. `inset` is the same gesture the other way up — the rail
  becomes the ground and the new `SidebarInset` draws the page as the panel, which
  is why the setting lives on the provider: one decision, two components, and no
  way to set half of it.
  
  **`SidebarInset`** is the column beside the rail. Every layout built on this was
  writing the same `flex min-w-0 flex-1 flex-col` by hand, and `min-w-0` is the
  half everybody forgets: a flex child's floor is its content, so one wide table
  inside pushes the whole page past the viewport and takes the rail's width with
  it.
  
  **`persist`** takes a `localStorage` key and remembers the docked state. A
  reader who put the rail away did not mean "until the next page". Only the docked
  state is kept — restoring an open drawer is a page that loads with its own
  navigation over the top of itself — and it is read after mount, never during
  render, because a value from storage in the first pass is a hydration mismatch.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`2e7ca63`](https://github.com/Misoto22/misoto22-design/commit/2e7ca6313dcf93e856ab616c3f6f9017d6d53f8b) Thanks [@Misoto22](https://github.com/Misoto22)! - `SidebarBranch` — a row that opens onto more rows — plus a `badge` slot on
  `SidebarGroup`, and a 16rem rail.
  
  Nesting is the thing a rail is for and the thing a flat list of groups cannot
  do: a workspace with projects in it, a folder with documents in it, a service
  with its environments. The line it draws is between a PLACE and a HEADING —
  `SidebarGroup` is a heading over a set and has neither an icon nor a state
  because it is not somewhere you can be; a branch has both because it is.
  
  Children sit behind the same hairline a group draws, one indent further in, so
  depth reads as depth. Two levels is what the indent has room for at this width;
  a third is a horizontal scrollbar with an outline in it. Collapsed to icons a
  branch is its icon and its children are not drawn — a nested glyph under an
  unnested one is two marks with no visible relationship.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`ab4d16a`](https://github.com/Misoto22/misoto22-design/commit/ab4d16a30964bf45cec0a6b53be8a8a6b465ce77) Thanks [@Misoto22](https://github.com/Misoto22)! - `Sidebar` — a navigation rail down the side of an application, with the control
  that hides it living on the thing it hides.
  
  Composed rather than configured: `SidebarProvider`, `Sidebar`, `SidebarHeader`,
  `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarFooter`,
  `SidebarSeparator`, `SidebarTrigger` and `useSidebar`. A rail is a header, a
  scrolling middle and a footer, and every product wants different things in all
  three; what the component owns is the part that is the same everywhere — the
  width, the edge, the scrolling, and what happens when it closes.
  
  - **Closing has three shapes.** `icon` keeps the rail and drops the labels,
    which suits a fixed set a reader learns the shape of. `offcanvas` takes the
    whole rail away, which suits a long index nobody memorises — ninety-two rows
    collapse to ninety-two identical file icons, which is width answering
    nothing. `none` is a rail that does not close.
  - **The trigger belongs inside.** A control that hides a thing lives on the
    thing: in an application's masthead it is one more anonymous icon in a row of
    them, with nothing connecting it to the column it operates.
  - **A collapsed row is still a named row.** The label leaves the layout — a
    `sr-only` label still occupies the flex row's gap — and becomes the row's
    tooltip, because an icon alone is a guess for a sighted reader and nothing at
    all for a screen reader. The provider supplies the tooltip provider that needs,
    so the icon state works without the app being told to wrap itself in one.
  - **A `<nav>`, not an `<aside>`.** The element decides the landmark, and a rail
    of links announced as "complementary" is not the one a reader jumps to when
    they go looking for the navigation.
  - `--sidebar-w` and `--sidebar-w-icon` are tokens, because the shell beside the
    rail has to reserve exactly what the rail believes it is.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`86644c3`](https://github.com/Misoto22/misoto22-design/commit/86644c3819dc88558adbe3d28cacae451024579b) Thanks [@Misoto22](https://github.com/Misoto22)! - Every theme axis default now has a name, so a subtree can opt OUT of an
  ancestor's theme rather than only into a different one.
  
  `[data-surface='paper']`, `[data-rules='hairline']`, `[data-type='editorial']`
  and `[data-density='comfortable']` join `[data-radius]`, which already worked
  this way. Each sits on the rule that declares the defaults rather than
  restating them, so there is nothing new to drift.
  
  The gap this closes: "the White Reset" used to be spelled "write no attribute",
  which works exactly once — at the root. Inside a page whose root carries a
  theme, an unset axis is not the default, it is whatever the ancestor said. Five
  theme specimens on one page each inherited whichever theme the reader had
  applied to the site, and all five showed the same colours.
  
  Two corrections found by the browser sweep, in the same layer:
  
  `[data-density='comfortable']` first landed on a `:root` block that also carries
  the status colours, the floating surfaces and the motion steps, so every element
  declaring the default density re-declared the whole LIGHT palette on itself — in
  dark mode, a light `--danger` painted on a dark ground. A neutral value may only
  restate the axis it names, so density now sits on a rule holding nothing else.
  
  And the dark block was missing the compound forms — `[data-mode='dark'][data-surface='paper']`
  and the rest — so a dark subtree that named its own default surface got the light
  one back.

- [#67](https://github.com/Misoto22/misoto22-design/pull/67) [`74b34c5`](https://github.com/Misoto22/misoto22-design/commit/74b34c5379d8cfc76141a85771753a2fa5a4c163) Thanks [@Misoto22](https://github.com/Misoto22)! - Two controls the forms group was missing, and the way out of the one a slider
  cannot do: `ColorPicker`, `NumberField`, and `editable` on `Slider`.
  
  The gap was written down in the package's own documentation. `Slider`'s
  catalogue entry said "put an `Input` beside it when the exact number matters",
  which is a component library telling a caller to build the missing half by hand
  and keep two controls in step themselves. There was no numeric control with a
  range and no colour control at all.
  
  - **`ColorPicker`** — a swatch trigger and a panel that works in OKLCH. That is
    the substance rather than the styling: in HSV, which is what
    `<input type="color">` and most libraries use, a row of constant "lightness"
    visibly darkens as it saturates, so a reader tuning a palette is fighting the
    instrument. The plane is normalised to the gamut row by row, so its whole
    surface is reachable instead of a lens of colour inside bands of clipped
    duplicates, and the hue strip is taken at the lightness already chosen. It
    reads and writes hex, `rgb()`, `hsl()`, `oklch()` and `color(display-p3 …)`;
    the notation a caller passes in is the notation they get back. The plane is a
    group of two real sliders under the canvas rather than key handlers on it, so
    the arrows move it and a screen reader announces which axis it is on — the
    part a 2D picker usually leaves out, and leaving it out makes the control
    unusable rather than merely awkward.
  - **`NumberField`** — a real `<input type="number">` in the shared control box,
    with a grip that sweeps the value as it is dragged, one step every 4px and ten
    with Shift held. A value that is TUNED — a duration, a line height, an offset
    — is found by passing through its neighbours, not by typing candidates one at
    a time. Clamping happens when the field is left rather than on every
    keystroke, because a minimum of 10 otherwise makes 50 unreachable: the `5` is
    pushed up before the `0` arrives.
  - **`Slider`'s `editable`** — turns the readout into a box per thumb, showing
    `format`'s output at rest and the bare number on focus, so a reader still sees
    "$1,200" and a typist is never asked to type a currency symbol back. A typed
    value is held inside the neighbouring thumb as well as inside `min` and `max`,
    which is the bound a dragged one cannot cross and a typed one can.
  
  `Slider` is now controlled from its own state whether or not the caller controls
  it, because a number typed into the readout never passes through Radix — left as
  it was, the thumb stayed where it had been while the figure above it moved.
  
  The colour maths is adapted from [DialKit](https://github.com/joshpuckett/dialkit)
  (MIT, Copyright (c) 2026 Josh Puckett); the notice travels with it in
  `src/lib/color.ts`.

### Patch Changes

- [#73](https://github.com/Misoto22/misoto22-design/pull/73) [`649cffe`](https://github.com/Misoto22/misoto22-design/commit/649cffe06f46f702bcdeb75b8a43a345064c288f) Thanks [@Misoto22](https://github.com/Misoto22)! - `RadarChart.Radar` fills again instead of handing the SVG `NaN`.
  
  The default fill opacity follows `--chart-fill` through a `calc()`, so it reads
  on both grounds without the component knowing which one it is on. That value is
  a string, and the dimming factor was applied to it in JS — `'calc(…)' * 1` is
  `NaN`, which React writes to `fill-opacity` after warning once in the console.
  Every unselected radar therefore lost its fill, on every render, since the
  default path never went through a number at all.
  
  The factor multiplies inside the `calc()` now. A number passed as
  `fillOpacity` still scales the way it always did.
  
  A gate walks every chart's rendered attributes and fails on any `NaN`, because
  nothing else would have noticed: jsdom has no layout, and the hidden table each
  chart carries still read correctly the whole time.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`f3b6018`](https://github.com/Misoto22/misoto22-design/commit/f3b601898d5d4acf0a1c7602322412c4b857ae2f) Thanks [@Misoto22](https://github.com/Misoto22)! - The rail stops looking like a terminal listing.
  
  A `SidebarGroup` heading was set in the MONO face at 15px medium. Ten of those
  stacked in a column read as a code listing rather than as a navigation: mono is
  this system's voice for code, metadata and figures, and a navigation heading is
  none of those. The heading is now the same face and size as its rows and
  outranks them by weight and by one step of ink — the two signals that can rank a
  row without changing what kind of thing it is. Counts come off mono too.
  
  `NavItem` tightens with it: `--radius-sm`, and the padding a 14px row wants
  rather than the padding a 15px one did.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`2a1d613`](https://github.com/Misoto22/misoto22-design/commit/2a1d613e3193acc901eba8222656e684200a73a7) Thanks [@Misoto22](https://github.com/Misoto22)! - `BulletChart` draws its target where the target is.
  
  Two ways the rule went missing, and the second one is the common case.
  
  A fixed half-width pull put a target at the bottom of the scale half outside
  the track, where `overflow-hidden` took it — so "Open incidents, target 0" drew
  no target at all, on the one measure whose whole point is the distance from it.
  The pull is proportional now: flush at the start at 0, flush at the end at 1,
  centred on its position everywhere between.
  
  And the rule is drawn in `--ink` on a bar drawn in `--ink`, so wherever the
  target sat INSIDE the achieved range it was an ink rule on an ink bar and
  simply not there — which is every measure that is meeting its target. It now
  carries a paper halo, so it reads against the bar and against the bands alike.

- [#71](https://github.com/Misoto22/misoto22-design/pull/71) [`5b0d101`](https://github.com/Misoto22/misoto22-design/commit/5b0d101e8ebfee3c51d9d2b6bc15a6af3e06b7cf) Thanks [@Misoto22](https://github.com/Misoto22)! - Named axis defaults reach one more call site, and the argument for them is now
  on the page.
  
  `ThemeRail` wrote only the axes a preset moves, on the reasoning that the rest
  are the White Reset. They are not: an unset axis is not "the default", it is
  whatever the ancestor said — and that rail's ancestor is a document carrying
  whichever theme the reader applied to the site. So every thumbnail showed the
  reader's own corners, rules and face for five of its six axes, and eight
  previews of eight different themes came out looking like eight previews of the
  one already on screen. It is the same defect the themes gallery had, in the
  second of the two files that draws a preview.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`73f7427`](https://github.com/Misoto22/misoto22-design/commit/73f7427363fc4a5f43b5a07adb09842bcb582fd6) Thanks [@Misoto22](https://github.com/Misoto22)! - Diagram edges go straight when straight is available.
  
  Two bugs, one symptom. The port spread keyed on the word `auto` rather than on
  the face a line would actually use, so every auto-routed line leaving one node
  counted as sharing a face with every other — a node with one line going right
  and one going down had both nudged off centre to make room for each other on a
  face neither was on. Each line then arrived a few units out of true, and the
  router answered that with a dogleg: two corners, an S, and a line that looks
  like it is avoiding something.
  
  The spread now keys on the resolved face, and a line whose two ends are within
  two corner radii of each other is drawn straight rather than kinked — below
  that threshold the dogleg cannot even draw its own corners. Real turns keep
  their elbows.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`7ef871e`](https://github.com/Misoto22/misoto22-design/commit/7ef871ee1b064138380c1978b8842a3287fc7e26) Thanks [@Misoto22](https://github.com/Misoto22)! - A floating panel now reads as floating, and a list draws one highlight rather
  than two.
  
  **Depth.** Every overlay — menu, popover, select, dialog, sheet, palette — sat
  on `--paper` over a page of `--paper` with a hairline between them, so nothing
  said the two were different surfaces. `--panel-lift` is the offset under them,
  and it does not break Law 2: the law says a box-shadow is never BLURRED, not
  that there is never one. Two hard steps in the rule colours, which is a stack
  seen from the front — the flattest way to say depth without drawing light.
  
  **One highlight.** `SidebarItem` drew the current page filled and filled a row
  under the pointer, which is two rows claiming to be where the reader is. While
  the pointer is in the list the fill is the pointer's, and it returns to the
  current row when the pointer leaves. `aria-current` never moves — nothing about
  what is TRUE changes, only what is drawn.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`b28c818`](https://github.com/Misoto22/misoto22-design/commit/b28c81871b943c04a7d44e6b7d547c972554650b) Thanks [@Misoto22](https://github.com/Misoto22)! - `TabsList` no longer grows a vertical scrollbar beside a row of tabs.
  
  `overflow-x: auto` on its own computes `overflow-y` to `auto` as well, and the
  active trigger's `-mb-px` rule leaves the content exactly one pixel taller than
  the box — enough for a browser to draw a full-height scrollbar next to a strip
  with nothing to scroll. A strip only ever scrolls sideways, so it now says so.

- [#69](https://github.com/Misoto22/misoto22-design/pull/69) [`1acaffa`](https://github.com/Misoto22/misoto22-design/commit/1acaffac34f22c889d13eeac3b495b659fed1865) Thanks [@Misoto22](https://github.com/Misoto22)! - Three things that did not line up.
  
  **`Sidebar` renders without a provider.** It threw, which is defensible for a
  hook a consumer called by hand and wrong for the component: `<Sidebar>` on its
  own is the first thing anybody writes, and the documentation site's own props
  panel renders exactly that and got an error boundary instead of a rail. The
  parts now fall back to the state a rail with no controls would be in — open,
  not collapsible. `useSidebar` still throws, because a call to the hook is code
  asking for state nothing is keeping.
  
  **`ErrorState`'s code was set `leading-none`.** At the title step this face
  draws about 62px of ink and a line box of exactly the font size is 47, so the
  figures overflowed their own box by seven pixels at each end — pressing against
  the eyebrow above and eating a third of the gap to the heading below. It has a
  real line box now, and the space the layout asks for is the space that appears.
  
  **`TD` says why it is top-aligned, and when not to be.** A 36px row action
  beside 16px of text makes a 52px row, and top-aligned every other cell hangs at
  the top of it with twenty pixels of nothing underneath.

## 0.8.0

### Minor Changes

- [#60](https://github.com/Misoto22/misoto22-design/pull/60) [`1ab9eed`](https://github.com/Misoto22/misoto22-design/commit/1ab9eed7c0e463df5539af2db3facfa9648a2dbb) Thanks [@Misoto22](https://github.com/Misoto22)! - The package tells an agent when it gets a component wrong, and reaches agents
  that are not Claude Code.
  
  Six gaps, found by re-reading what the ecosystem settled on since the agent
  surface shipped.
  
  **Development warnings, written to be repaired from.** The skill documented a
  handful of ways to misuse a component that fail *silently*, and documentation
  only helps a reader who went looking — the whole problem being that nothing told
  them to look. Now the component says it where it happens, in the shape an agent
  can act on without asking: a stable code, the offending field, and an imperative
  fix.
  
  - `FIELD_CONTROL_NOT_LABELLABLE` — `<Field><div><Input /></div></Field>` renders,
    and the label points at the div. This is the failure that looks most correct.
  - `FIELD_CONTROL_NOT_WIRED` — no single element to wire at all.
  - `BUTTON_ICON_ONLY_UNNAMED` — an `iconOnly` Button with neither `aria-label`
    nor `aria-labelledby` is announced as "button" and nothing else.
  - `REQUIRED_NAME_BLANK` — `<Table caption="">` satisfies the type and leaves the
    table anonymous. Applied to `Table.caption`, `Progress.label`, `Select.label`,
    `Combobox.label` and `FloatingIconButton.label`; deliberately not to
    `Avatar.alt`, where an empty string is the correct markup for a decorative
    image.
  
  Each fires once per problem, and every call site is behind
  `process.env.NODE_ENV`, so none of it reaches a production bundle.
  
  **`init` reaches more than one agent.** It wrote only `.claude/skills/`, which
  handed Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Cline, Zed and Warp
  nothing. It now writes `.agents/skills/` — the path all of those share — and
  adds `.claude/skills/` when the project already has one. `--agent agents` or
  `--agent claude` picks one.
  
  **Pointer files at the package root.** `AGENTS.md`, `CLAUDE.md` and `llms.txt`
  now ship in the tarball. An agent exploring `node_modules` looks for those
  filenames before it opens a README or reaches the network, and found none of
  them. They are pointers only, so they cannot go stale between releases. The
  `AGENTS.md` doubles as the nested subproject file for anyone working on the
  package in its own repository.
  
  **Prompt-based evals.** `skills/misoto22-design/evals/evals.json` carries six
  tasks with the identifiers correct output must and must not contain. `claims.json`
  proves the rules match the package; it cannot prove an agent given the rules
  writes correct code, and this is the half that can. Every `must_use` identifier
  is checked against the real export surface, so an eval cannot quietly start
  expecting something the package no longer ships.
  
  Also documented: `npx skills add Misoto22/misoto22-design` already works and
  nothing said so.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - Sixteen charts that drew a readable, plausible, wrong picture.
  
  None of these threw, none looked broken, and none could be caught by rendering
  the chart and looking at it — the plot was always confident. What they had in
  common is that the picture disagreed with the rows behind it, and the reader had
  no way to tell.
  
  - **`BarChart`'s `buffer` hatched the last VISIBLE bar, not the last row.**
    `dataLength` came from the brushed window, so brushing back into the middle of
    a range drew a month that closed in March as still being counted. It now
    resolves the last row's position in the window, and hatches nothing when that
    row is off the end of it.
  
  - **`BarChart` painted `Math.max(0, height - 3)`.** Anything under three pixels
    rendered at zero height, so a count of two on a scale topping out at a thousand
    was pixel-identical to a category with no rows — while the invisible
    full-column hit rect still caught the pointer, giving the reader a bar to hover
    that was not there. A bar with a value on it is now floored at one pixel.
  
  - **`TreemapChart` emitted `<desc>{chartId}</desc>` inside every tile.** The
    comment called it a hidden id; `<desc>` IS the accessible description, so every
    tile was announced as its name followed by an opaque generated string. Removed,
    along with the id it needed.
  
  - **`TreemapChart` dropped a leaf with no area and said nothing.** A tile at zero
    or below is laid out at zero width and never drawn, so the picture and the
    hidden leaf table disagreed about how many leaves there were. The table now
    prints such a leaf as "not drawn".
  
  - **`RadialChart.onSelectionChange` reported `value: 0` from the legend.** The
    arc handed its own number in; the legend had only a name, and `value ?? 0`
    invented one — so the same selection reported two different values depending on
    which control the reader used. The value now comes from the row, through
    `valueKey` or, failing that, the `dataKey` of the composed
    `<RadialChart.RadialBar>` — which also gives a chart that named neither a
    hidden table, where it previously had none at all.
  
  - **`AreaChart` silently ignored a `tickFormatter` under `stackType="expanded"`.**
    The axis wrote `isExpanded ? percentTick : (tickFormatter ?? defaultTick)`, so
    a formatter handed to the YAxis was indistinguishable from a typo. A caller's
    formatter now wins; the percentage default applies when there is none.
  
  - **`Histogram` discarded observations outside explicit `bins` edges.** The
    tooltip's share-of-total was taken over the bins, so it always summed to 100%
    however much of the sample the edges cut off — the one number that would have
    revealed the tail was the one that hid it. Out-of-range observations now count
    toward the share and get their own "Below" and "Above" rows in the table.
  
  - **`BigNumber` announced a verdict on a change of zero.** The tone, the arrow
    and the word all said "no change" while the sr-only text still took the
    intent's side, so `{ value: 0, intent: 'up-is-good' }` was read out as "no
    change, worse". There is no direction for an intent to judge, so the verdict is
    now dropped with it. `value` also gains an empty state — `null` prints an em
    dash with "No data" behind it rather than leaving a label over a blank line.
  
  - **`Sparkline` drew an unchanged run along the floor.** `span = max - min || 1`
    normalised every point of a constant series to the BOTTOM edge, so "unchanged"
    and "pinned at its worst" were the same picture — in a column of sparklines,
    the one distinction that matters. `Heatmap` answered a zero span with the
    middle and `BulletChart` with the start; all three now agree on the middle,
    through one shared `fraction`.
  
  - **`Heatmap` stretched its domain with a number it never drew.** Values were
    collected from every cell, but the grid renders by row-and-column lookup — so
    one misspelt header inflated the derived domain invisibly and pushed every
    drawn cell into the first fraction of the ramp. The domain now comes from the
    cells the grid can place.
  
  - **`BulletChart` clamped without saying so.** A value past the domain filled the
    track exactly as the domain's top did; a notch at the end of the track now says
    it happened. Range bounds outside the domain were also filtered before the band
    label was built, so `[60, 80]` on `[0, 50]` produced one flat band AND lost the
    bounds from the table — the label now names what the caller set.
  
  - **Seven charts had no empty state at all.** `PieChart`, `RadarChart`,
    `RadialChart`, `SankeyChart`, `ScatterChart`, `FunnelChart` and `TreemapChart`
    drew a named figure over a blank box at zero rows, and `ChartDataTable` renders
    nothing below one row — so the picture and its text equivalent went silent
    together and "no data" looked exactly like "failed to load". `BarList`,
    `BigNumber` and `Heatmap` were in the same position. The state now lives in
    `ChartFigure`, which every chart root already wraps itself in, and every chart
    in the package routes through it.
  
  - **`ScatterChart`'s `isLoading` was hard-coded `false`.** It is now a prop, with
    the same badge every other chart shows.
  
  - **`defaultSelectedDataKey` and its siblings seeded `useState` once.** Nine
    charts had a default and no controlled counterpart, so a call site that wanted
    a chart's selection to follow a filter, a route or a sibling chart had no way
    to say so — the prop that looks like the way to do it silently was not. Each
    now takes `selectedDataKey` / `selectedSector` / `selectedBar` /
    `selectedNode` beside its default, through one shared hook.
  
  - **`FunnelChart` emitted an unreferenced `<defs>` block.** The root generated
    stage gradients under its own `useId` while `<Funnel>` generated and painted
    from its own — one gradient definition per stage, per chart, drawn and never
    used.
  
  The three gaps that were "chart N forgot what charts 1 to N-1 do" are now gates
  rather than review items: the shared chart fixture requires an empty render per
  chart, and the suite walks every chart for its empty state and for the keyboard
  cursor over its plot. Recharts 3.8 has no `accessibilityLayer` for `Sankey` or
  `Treemap`, which is recorded as the exception it is rather than left looking like
  an oversight.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - Nine places where what was drawn and what was announced were two different
  things.
  
  **Two overlays stayed reachable after they visually closed.**
  
  - **`AppShell`'s closed drawer was still in the tab order on a phone.** It was
    translated off-screen and nothing else — no `inert`, no unmount — so every
    link in it stayed focusable and stayed in the accessibility tree, and Tab from
    the toggle walked into a menu nobody could see. Below `md` the closed drawer
    is `inert` now, decided by a media query rather than by `open` alone, because
    above the breakpoint that element is the application's navigation column and
    hiding it would be the larger bug. Closing it — by Escape or by the scrim —
    returns focus to the toggle: focus inside an inert subtree is focus the
    browser throws away, and the scrim is worse, since it is itself the focused
    element and it unmounts. The drawer also carries `data-m22-animated` now, so
    the reduced-motion rule reaches its `transition-transform`.
  
  - **`Calendar`'s month picker could be left open over focusable content.** The
    panel is opaque and drawn in place of the day grid, but the grid stayed
    mounted and focusable underneath it, so Tab from the last month walked onto a
    day the reader could not see — and past the caption that owns the Escape
    handler, so the panel could no longer be dismissed either. Tab wraps inside
    the panel now, and the role follows the behaviour rather than the other way
    round: it was `group` for exactly as long as Tab walked out of it, and it is
    `dialog` now that focus stays. No `aria-modal` — the panel covers this month's
    grid, not the page.
  
  **Toast descriptions were unreadable in dark mode.** The `Toaster` never passed
  `theme`, so sonner defaulted to `light` and stamped `data-sonner-theme="light"`.
  Its stylesheet hard-codes the description at `#3f3f3f` and overrides that only
  under its own dark theme, and the inline token style could not reach it — so on
  `--paper: #0d0d0d` every `toast(title, { description })` put dark grey on near
  black, roughly 1.85:1, and lost its second half. `theme` now follows the
  `data-mode` attribute on `<html>`, observed rather than read once, so it also
  follows a reader who switches with the Toaster already mounted. Deliberately not
  sonner's own `theme="system"`: that reads `prefers-color-scheme`, and this
  system lets a reader override the operating system — a toast following the OS
  while the page follows the override is the same defect pointing the other way.
  Pass `theme` yourself and it still wins. The `--success-*` and `--error-*`
  custom properties are now emitted only under `richColors`, which is the only
  state sonner reads them in; at the default they were six inert declarations
  sitting in the element's style attribute looking like the source of a success
  toast's colour.
  
  **Four things in the loading family accepted an instruction and did nothing
  with it.**
  
  - **`Progress` showed a reader who asked for less motion a finished bar.** The
    indeterminate sweep carried `motion-reduce:w-full motion-reduce:opacity-40`,
    so under `prefers-reduced-motion` an operation still running was drawn as a
    full-width bar at rest — which is what a completed one looks like. It now
    stops where it is drawn, a quarter of the track at the inline start, the same
    answer `Spinner` gives: a partial shape still reads as unfinished.
  
  - **`Progress` accepted `max` and disagreed with it.** `max` reached Radix
    through `...rest` and was announced as `aria-valuemax`, while the width was
    `value` clamped to 100 — so `max={500}` with `value={100}` painted a full bar
    and told a screen reader "100 of 500". The width is computed from `max` now,
    and `max` is a documented prop rather than an inherited one. A `max` that is
    not a positive number falls back to 100 exactly as Radix does, so the picture
    and the announcement cannot come apart.
  
  - **`Spinner`'s `className` missed the ring.** It merged onto the outer
    `inline-flex` wrapper while `size` and `tone` went on the inner span, so
    `<Spinner className="size-8" />` grew an invisible box around an unchanged
    18px circle. `className` reaches the ring now, after `size` and `tone` and
    overriding both.
  
  - **A bare `<Skeleton />` rendered nothing.** It set a fill colour and no
    dimensions, and a `div` is already full width, so the one thing it could not
    supply for itself was the one thing missing: it was a zero-height box. The
    base falls back to `h-3`, the height `SkeletonLine` already chose, and any
    class the caller passes replaces it.
  
  **`Article` discarded `children` when `html` was also passed** and said nothing
  about it, and `html=""` counted as present — so a pipeline that rendered an
  empty string took a page of hand-written children down with it. It says so in
  development now (`ARTICLE_HTML_AND_CHILDREN`), with the field and an imperative
  fix, like the other warnings. The behaviour is unchanged: `html` still wins,
  because there is no wrapper that could hold both without costing every block
  inside it its spacing.
  
  **Accessible names that could only be English are now props.** `Pagination`
  named its controls `"Page 3"`, `"Previous page"` and `"Next page"` with only the
  nav's own `label` exposed; `Calendar` did the same for `"Earlier years"`,
  `"Later years"`, `"Previous year"`, `"Next year"` and its two panel names —
  while its month names already followed `locale`, which is what made the chrome
  around them read as an oversight rather than a policy. `AppShell` and
  `Breadcrumb` have always exposed every string, so the package was inconsistent
  with itself. `Pagination` gains `previousLabel`, `nextLabel` and `pageLabel`;
  `Calendar` gains the six `CalendarLabels` props. `pageLabel` is a function
  rather than a template because "Page 3" is a phrase whose parts move around
  between languages. Every default is the English that was there before.

- [#58](https://github.com/Misoto22/misoto22-design/pull/58) [`dd69487`](https://github.com/Misoto22/misoto22-design/commit/dd69487bc62b61f10b7314d3b6ea718b46959c66) Thanks [@Misoto22](https://github.com/Misoto22)! - Five content primitives: `Text`, `Heading`, `Code`, `CodeBlock` and `Markdown`.
  
  The package had `Article` — a whole reading column, styled from element
  selectors — and nothing between it and raw JSX for a single paragraph or one
  heading. The evidence was not theoretical: the documentation site had
  hand-rolled a private `CodeBlock` of its own, and a template pass had styled a
  raw `<pre>` against the tokens because the package exports no code block. A
  design system whose own site has to build a primitive has a gap in the package.
  
  - **`Text`** — the system's paragraph. Four steps of type, three rungs of ink,
    and `as` to change the element without changing the look. The default tone is
    `--ink-2`, not `--ink`: a page whose paragraphs are all full-strength ink has
    spent the top of the ladder on its body copy.
  - **`Heading`** — `level` sets the element, `size` sets the look, and they are
    two props because every heading component that takes one number bends either
    the outline or the type to reach the other. `size` defaults from `level`
    through the system's ladder, which SKIPS a step between the first two
    levels — `--fs-lead` over `--fs-heading` is a ratio of 1.14 and reads as an
    accident, where `--fs-title` over `--fs-heading` is 1.86 and reads as a
    hierarchy. Levels five and six are the mono kicker, as they are in
    `article.css`.
  - **`Code`** — inline code, as a real `<code>`, sized in `em` so the same token
    is proportionate in body copy and in a table cell.
  - **`CodeBlock`** — title, language label, line numbers, banded lines, a
    `maxHeight` whose overflow scrolls inside a focusable, named
    `role="group"`, and a copy button that copies the `code` string rather than
    the rendered markup. The body is a group and not a `region` on purpose: a
    region is a LANDMARK, one of the handful of major sections a reader navigates
    a page by, and a snippet is not one — an article carrying three fenced blocks
    would otherwise put three landmarks called "Code" into that map. The group
    keeps the tab stop and keeps the name; it just stays out of the landmark
    list. Highlighting stays out of the package: pass `html` from a build-time
    Shiki pass, or pass nothing and the block renders the string as text.
    `lineNumbers` and `highlightLines` are typed out of the `html` form, because
    they are a per-line structure and `html` is one opaque string — passing both
    is a compile error rather than a prop that silently renders nothing.
  - **`Markdown`** — a Markdown STRING into system-styled nodes. This is the
    headline gap: user-generated content, a model's answer or a README had no
    path into the system at all, because `Article` takes trusted HTML through
    `dangerouslySetInnerHTML` and is documented that way.
  
  No new runtime dependency, and that was the decision worth writing down.
  markdown-it is what the documentation site uses, but the site is an app and this
  is a library, where the dependency list is part of the contract. Measured with
  the same esbuild pass `check:size` runs, markdown-it is 110.7 kB minified
  against the 38.9 kB the package had left under its bundle budget. So `Markdown`
  parses the subset this system already styles — headings, prose, fences,
  blockquotes, nested lists, rules, and inline emphasis, code, links and images —
  and takes a `parse` function for everything else. It emits React elements rather
  than markup, so there is no `dangerouslySetInnerHTML` in that path at all: no
  sanitiser to configure and none to get wrong. A link whose scheme is not
  `http`, `https`, `mailto` or `tel` renders as plain text.
  
  `headingLevelStart` shifts a whole document down, so markdown dropped inside an
  `<h2>` section starts at `<h3>` instead of opening a second `<h1>`, and every
  heading carries a stable id slugged from its own text in any script — exported
  as `slugify`, so a table of contents can arrive at the same ids without reading
  them back off the DOM.
  
  `Markdown` and `Article` stay separate and are composable: `Markdown` turns a
  string into nodes, `Article` is the reading column those nodes sit in, and
  either works alone. It renders a fragment rather than a wrapper, which is what
  makes the nesting work — `Article`'s rhythm is a direct-child combinator, so any
  element between the two would cost every paragraph its spacing.
  
  The whole package bundles to 390.6 kB minified against a 420 kB budget, up
  9.5 kB; the compiled stylesheet is 71 kB against 90 kB, up 3.3 kB. Importing one
  leaf component is unchanged at 27.3 kB, 7% of the whole.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - Twelve fields in `@misoto22/design/diagrams` that typechecked and drew something
  else — and the half of every figure a screen reader was never given.
  
  Each of these renders without an error, a warning or a missing box. The
  specification is valid, the picture is not the one it describes, and the only
  way to find out was to look at the drawing already knowing what it should have
  been. Every one now does what its type implies, or says so by name in
  development. None of the warnings reaches a production bundle.
  
  **Placement that quietly disagreed with the specification.**
  
  - **An `ArchitectureFigure` component that declared neither `row` nor `col` was
    drawn at row 0, column 0** — along with every other component that declared
    neither, which is one plate with the rest underneath it. They now flow into
    the next free cell in declaration order, wrapping at `layout.cols`, stepping
    around whatever the placed ones claimed. `layout.cols` had been accepted and
    read by nothing.
  
  - **`layout.cellW` moved plates without widening them.** The pitch came from
    the layout and the plate's own width from the module default, so `cellW: 240`
    was a grid with wider gaps rather than wider boxes.
  
  - **Two components on one cell** are still one plate over another — there is no
    second place to put the second plate — but development now prints
    `DIAGRAM_CELL_COLLISION` naming both.
  
  - **A spec object mutated in place drew the picture it was first given.** The
    model is memoised on the spec's identity, and a `push` does not change it.
    All five figures now print `DIAGRAM_SPEC_MUTATED` when they catch that.
  
  - **An unknown `lane` id resolved to lane 0** in `WorkflowFigure` and
    `LifecycleFigure`, drawing the step in the right column and the wrong band.
    It still does — there is nowhere else to put the box — but it prints
    `DIAGRAM_LANE_UNKNOWN`, and in a lifecycle it no longer enrols the state in
    the implicit main rail: a typo could previously add an arrow the machine does
    not have.
  
  - **A `DataflowFigure` node past the declared `stages`** is drawn past the last
    heading, under no heading at all. Now `DIAGRAM_STAGE_OUT_OF_RANGE`, and the
    text equivalent files it under a band named for what it is.
  
  - **`LifecycleFigure.yOffset` was accepted and deliberately dropped**, while
    `WorkflowFigure` and `DataflowFigure` both applied theirs — one field name,
    two behaviours, nothing in the type to say which. It is applied.
  
  - **A `SequenceFigure` message naming an undeclared participant** vanished from
    the picture and survived in the hidden summary as a raw id: the two halves of
    one figure disagreeing about what the exchange contains. Dangling edges are
    now dropped from both halves in every figure, and reported once as
    `DIAGRAM_EDGE_DANGLING`.
  
  **The text equivalent carried half the diagram.** Each figure publishes a
  `role="img"` picture beside a hidden list, and that list held nodes and edges
  only — so a workflow's lane axis and a data flow's stage axis, the second
  dimension of both diagrams, reached a screen reader not at all. The list is now
  grouped by that axis, which makes it structural rather than a phrase repeated on
  every row, and the statements that group nothing follow as sentences: an
  architecture boundary and what it encloses, a workflow phase and the columns it
  covers, a sequence segment and the messages inside it, an activation bar named
  by the calls it spans. A lifecycle state's step number joins its line, and the
  implicit rail — two of the three arrows in a three-state machine — is published
  for the first time. Selecting a node from the list is unchanged: exactly one
  control per node, wherever it is grouped.
  
  **Fields that typechecked and did nothing.**
  
  - **`WorkflowPhase.toCol` and `.variant` are drawn.** A phase's rule runs across
    the columns it claims instead of across the whole figure, so its extent is
    something a reader can see; `security` dashes that rule and `emphasis`
    thickens it.
  
  - **`WorkflowEdge.role` reaches the line.** `async` and `error` take the quiet
    dashed stroke the docstring had been promising for `error`; `return` keeps its
    open arrowhead; `main` and `branch` add nothing, because `mainPath` already
    draws that distinction as weight. An explicit `variant` still wins.
  
  - **`meta.views` and the three label nudges are documented as the no-ops they
    are**, the way `meta.viewBox` already was, and `column_fit: 'spread'` now
    describes what it does — the widest label sets the pitch for every column —
    rather than dividing the figure evenly, which it never did.
  
  **The chrome.**
  
  - **`DiagramExportMenu` reported a success it could not have known about.** With
    `onExport`, a handler that did nothing resolved exactly like one that wrote a
    file. `ExportResult` now carries `source`, and `ok` says only that the
    pipeline named by it finished.
  
  - **There was no transparent export in any format.** A new `background` prop
    takes `null` for a figure going onto a coloured page; JPEG is still flattened
    onto the reader's own paper, because a transparent JPEG is a black one. The
    serialiser behind all of it — `serializeSvg`, `rasterize`, `downloadBlob`,
    `exportFilename` — is exported from `@misoto22/design/diagrams`, so a caller
    who needs a different pipeline has something to build on.
  
  - **The five format rows are menu items.** They were plain buttons inside a
    `role="menu"`: no roving focus, no typeahead, and the menu stayed open over
    the file it had just written.
  
  - **`DiagramInspector` keyed its facts by label**, so a node read out of two
    files showed one row. Both render.
  
  - **`DiagramMinimap` asked for the one number that makes it lie.** A
    `DiagramCanvas` now reports the frame it was measured against on every view it
    emits, so `frame` is optional and wiring `onViewChange` through is enough. A
    `content` width of 0 — a ref measured on the first render — draws an empty
    plate rather than the artwork's top-left corner at full size; the viewport
    rectangle is clipped to the map; and a drag seeks only when it started on the
    map.
  
  - **`LifecycleFigure`'s plates take a pointer cursor** when the caller can
    select them. It is the one figure that builds its own group rather than using
    the shared plate, and it was the one figure showing a text caret over a
    control.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - The form controls now announce what they draw.
  
  `Field` drew a hint, an error and a required marker under six of the twelve
  controls it wraps and announced none of them. The wiring travelled by
  `cloneElement`, and each of those six dropped it: Radix's select root renders no
  DOM node at all, `Combobox` and `DatePicker` never spread what they were handed,
  the slider root is a roleless `<span>`, and `<label for>` does not bind to a
  `<div role="radiogroup">`. Every one of them rendered perfectly and was invisible
  to a screen reader, which is the only kind of defect a review of the browser
  cannot find.
  
  - **The wiring reaches the element that carries the role.** `Select`, `Combobox`
    and `DatePicker` put the id, `aria-describedby`, `aria-required` and
    `aria-invalid` on their TRIGGER — so the visible label clicks through to it and
    the message below is announced; `RadioGroup` and `ToggleGroup` take them on the
    group root; `Slider` moves them onto the THUMB, which is where `role="slider"`
    lives. Two limits are now stated rather than implied: the words above a group
    name it through `aria-labelledby` and do not click through, the way a
    `<legend>` does not, and `required` has nowhere to sit on `DatePicker`'s plain
    `<button>` trigger, where the asterisk is the whole of the marking.
  
  - **A trigger announces its value as well as its name.** `Select`, `Combobox`,
    `DatePicker` and `DateRangePicker` set `aria-label={label}` on a trigger whose
    text IS the current value, and `aria-label` outranks name-from-content — so a
    reader was told "Tags" and never "3 selected", and `DatePicker`'s `format`
    reached the screen and nothing else. The trigger is now named by the label and
    by its own value together: "Region, Australia". Inside a `Field` with a label,
    that label is the name and the control's own `label` is not repeated.
  
  - **`Select` reads `aria-invalid`.** It was the one control on `CONTROL_BASE`
    calling `isInvalid` with a single argument, so a `Field` error — or a form
    library — painted the message red under a resting border. `Combobox` picks up
    the same danger border.
  
  - **`<Slider label="Volume" />` renders a thumb.** The thumbs come from this
    component's own array, which was empty when neither `value` nor `defaultValue`
    was given, so the plainest possible usage drew a track with nothing on it to
    drag. It now falls back to the primitive's own default of one thumb at the
    minimum. Three more on the same control: `disabled` dims it (the old
    `disabled:` variant compiled to `&:disabled`, which never matches the `<span>`
    it was on), `format` becomes each thumb's `aria-valuetext` instead of changing
    only the printed readout, and `showValue` prints one name per thumb rather than
    the first name over a pair of numbers.
  
  - **`<Checkbox defaultChecked="indeterminate" />` draws the dash.** The glyph was
    chosen from `props.checked`, which an uncontrolled box never sets, so a
    partly-selected list showed the tick that means "all of them".
  
  - **`DatePicker` presets respect `disabledDates`.** The rail set the value the
    grid beside it would refuse. A shortcut landing on a blocked day is now drawn
    unavailable and refuses the click; a range preset is tested at its ends.
  
  - **Layout.** `NativeSelect`'s `className` now sizes the WRAPPER the chevron is
    pinned to — on the `<select>` it narrowed the box and left the arrow floating
    at the far edge of the row. Note the change of target: colours and borders sent
    through `className` no longer reach the `<select>`, which keeps `CONTROL_BASE`.
    `Select`'s trigger truncates its value, so one long option no longer makes the
    field taller than the one beside it.
  
  - **`aria-required` stays off a role that cannot take it.** A `Field`'s
    `required` around `<ToggleGroup type="multiple">` put the attribute on a
    `role="toolbar"`, where ARIA does not allow it.
  
  `Select`, `Combobox`, `DatePicker` and `DateRangePicker` accept `id`,
  `aria-describedby` and `aria-invalid` (and `aria-required`, where the role
  permits it) as ordinary props, so a form library can address them without a
  `Field`.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - Overlays now clear the surface that opened them, and reach the container that
  asked for them.
  
  **A select inside a modal form was painted behind the modal.** `--z-dropdown`
  resolved to `--z-drawer`, 100, while a dialog panel sits at `--z-modal`, 210.
  Every overlay in the package portals to `document.body`, so all of them are
  siblings in the root stacking context and the rank is the whole of the decision
  — there is no ancestor left to nest one inside another. A `Popover`,
  `DropdownMenu`, `Select` or `SearchableMenu` opened from inside a `Dialog` or a
  `Sheet` was therefore invisible in exactly the case it is most used.
  
  The ladder gains `--z-anchored` at 220, above the modal and below the toast, and
  `--z-dropdown` points at it. **`--z-palette` is removed**: it was read by
  nothing, and it could not have worked — a command palette is a `Dialog`, so it
  lands at `--z-modal`, and its order against a second modal is settled by
  document order, which moves a scrim and its panel together where a lone panel
  rank would have separated them. The count stays at seven ranks, and the
  reasoning is written into `tokens.css` beside the numbers.
  
  **`OverlayContainer` now redirects every overlay, which is what it always said
  it did.** `Dialog` and `Sheet` rendered the Radix portal with no container and
  never called `useOverlayContainer`; their props derive from `Content`, which has
  no `container`, so a caller could not pass one either. Both now read it — and
  switch from `fixed` to `absolute` when a container is named, because a `fixed`
  panel resolves against the viewport whatever element it is portalled into, so
  honouring the container without that swap would have moved the markup and left
  the picture unchanged. A modal inside a bounded frame now stays in the frame and
  inherits the `dir`, `data-density` and theme axes set there.
  
  **`SearchableMenu` filtered on the id instead of the label.** cmdk derives an
  item's value from the first string in `[value, children, ref]` and only falls
  back to the row's text when `value` is absent; this passed `action.id`, so with
  the opaque ids an application actually has, typing the words a reader can see
  matched nothing and the menu showed its empty state. The label's own text is now
  lifted into the row's keywords, with the id still the identity. A label built
  only from elements prints no text to lift, and development says so
  (`SEARCHABLE_MENU_LABEL_UNREADABLE`) rather than shipping a row nothing matches.
  
  **`icon` meant opposite things one import apart.** `DropdownMenuItem.icon` and
  `ContextMenuItem.icon` took the Lucide component; `CommandItem.icon` took the
  rendered element. All three now take either, and the wrong guess no longer fails
  at render.
  
  **`DropdownMenuGroup` and `ContextMenuGroup` are new.** Radix's `MenuLabel` is a
  bare `<div>` with no role and no `aria-labelledby` wiring, and `MenuGroup` — the
  one that carries `role="group"` — was not re-exported at all, so the sections a
  sighted reader saw arrived as one undivided list. The group renders the label
  inside itself and points the one at the other, which is not something a caller
  should have to remember. `DropdownMenuLabel` stays, for a line that heads
  nothing.
  
  **A dialog with no title says so.** The fallback accessible name is the literal
  string "Dialog", so every unnamed modal in an application announced identically
  — and passed an automated accessibility check while doing it, which is how the
  problem survives a review. The fallback still renders, because an unnamed modal
  is worse; development now warns `DIALOG_TITLE_MISSING`.
  
  **`SheetContent` carries `data-m22-animated`.** Its scrim always asserted that
  its fade was decorative and the panel never did, so under `prefers-reduced-motion`
  the fade was cancelled and the panel still travelled the full width of itself.
  
  **The portable CSS recipe was missing a layer.** `README.md` told an app that
  compiles its own Tailwind to import `tokens.css`, `semantic.css` and
  `keyframes.css`. `data-mode` and `data-density` live in `tokens.css` and
  survived; `data-surface`, `data-radius`, `data-rules`, `data-type`,
  `data-motion` and `data-chart-palette` are declared only in `themes.css`, which
  the recipe never mentioned — so a consumer wrote `data-radius="sharp"` and got
  no error, no warning and no corner. The split is deliberate: `themes.css` is its
  own export, attribute-scoped where `semantic.css` is `:root`-scoped, and the
  package's own tests hold the two apart. So the recipe names all four layers, and
  a test derives the axes from the stylesheets and fails when a documented recipe
  stops reaching one.

- [#58](https://github.com/Misoto22/misoto22-design/pull/58) [`dd69487`](https://github.com/Misoto22/misoto22-design/commit/dd69487bc62b61f10b7314d3b6ea718b46959c66) Thanks [@Misoto22](https://github.com/Misoto22)! - Four record-and-settings primitives — `DescriptionList`, `Toolbar`, `Timestamp`
  and `AspectRatio` — and three props that made a fourth and fifth component
  unnecessary.
  
  The evidence was a template pass: eight new pages built from the existing
  library, and a list of what had to be hand-rolled and how many times. The
  repeats are what shipped.
  
  - **`DescriptionList`** — a record's fields as a real `<dl>`/`<dt>`/`<dd>`. The
    most repeated shape in any detail page, and the one most often built out of a
    `<div>` grid — which looks identical and tells a screen reader there are two
    columns of unrelated text. `layout` is `row` or `stacked`, `divided` draws the
    hairlines, and an empty `items` renders `null` rather than an empty bordered
    box.
  - **`Toolbar`** — the sticky bar of actions at the edge of a working surface,
    built independently by two templates. Opaque `--paper` and not a blur, because
    content scrolls under it. It is a named `role="group"` and deliberately not
    `role="toolbar"`: that role promises arrow keys between the controls, and
    declaring it without roving tabindex tells a screen-reader user to press keys
    that do nothing.
  - **`Timestamp`** — an instant, rendered the one way the system renders them.
    The first paint is the UTC calendar date sliced straight out of the ISO string
    with no `Intl` involved, so the server and the hydrating client cannot
    disagree; the relative and locale-aware forms are applied after mount. The
    `datetime` attribute is the full ISO instant from the first render and never
    changes. A value nothing can parse renders an em dash, never the browser's
    literal `Invalid Date`.
  - **`AspectRatio`** — the one layout primitive that is genuinely hard by hand.
    The `padding-top` percentage trick resolves against the WIDTH, which is why it
    works and also why it breaks as a flex child. Here the box declares
    `aspect-ratio` and every direct child is stretched out of flow, so content
    with no intrinsic size still holds the box open.
  
  Three additions that are props rather than components:
  
  - **`Field` gains `description` and `layout="row"`** — the settings row, which a
    template hand-rolled three times. It is a layout on `Field` and not a
    `SettingRow` beside it, because the label wiring, the required marker and the
    message slot are the same three things either way. `description` explains the
    setting and sits under the label; `hint` explains the input and sits under the
    control. Both reach the control through `aria-describedby`. The association is
    `Field`'s existing `cloneElement` wiring, so it holds for `Input`, `Textarea`,
    `NativeSelect`, `Checkbox` and `Switch` — every control a settings row is
    built from — and not for the six composite controls that already carry their
    own `label` prop. That limit is now written into `Field`'s own documentation
    rather than only into the catalog.
  - **`Tag` gains `onRemove` and `removeLabel`** — instead of a `Token` component.
    A token is a tag with a remove button; the difference is one prop, and this
    system already ships three things that look alike. `removeLabel` is required
    alongside `onRemove`, because "Remove" repeated down a row of filters is eight
    controls a screen reader cannot tell apart.
  - **`Separator` gains `label`** — "or continue with" was two `Separator`s and a
    `span` at every call site. The rule is drawn twice, one `aria-hidden` piece
    either side of the words, so there is no ground to punch a hole in and the
    component never has to be told which surface it is on.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - Eight components that rendered correctly and described something else.
  
  Every defect here shipped a component that looks finished: no error, no warning,
  no missing box. What they had in common is that the failure was invisible in the
  browser and invisible in review, which is the only kind of defect a
  documentation pass cannot find.
  
  - **`Avatar` announced nothing without a photograph.** `alt` reached the DOM
    only through `AvatarPrimitive.Image`, which renders only under `src`, and the
    initials are `aria-hidden` — so every row of a user list where photographs are
    optional was an unnamed circle, however carefully `alt` was written. The ROOT
    now carries the name as `role="img"`, in both cases, and the image's own `alt`
    is empty so nobody is read twice. An empty `alt` still takes no role at all,
    which keeps the deliberate decorative case out of the tree rather than putting
    an unnamed image in it.
  
  - **`StatusPill`'s `tone` reached nothing a reader could hear.** It was
    forwarded solely to the inner `StatusDot`, which is `aria-hidden` by law, so
    "Degraded" in a warning pill and "Degraded" in a neutral one were the same
    sentence. The `warning` and `danger` tones now carry a visually-hidden
    severity word. `success` and `neutral` add nothing on purpose: they are the
    absence of alarm, which is what a reader already assumes.
  
  - **`Diagram` drew a confident picture of a different spec.** Three silent
    no-ops, all now reported by name in development and none reaching a production
    bundle. An edge between non-adjacent nodes, or one written `to`→`from`, drew
    no arrow and said nothing (`DIAGRAM_EDGE_NOT_ADJACENT`,
    `DIAGRAM_EDGE_UNKNOWN_NODE`). The same `edges` array was handed to every rank,
    so a pair of ids reused two levels down drew the arrow again down there — it
    is now resolved once for the whole figure and spent at the first pair that
    matches, so one edge is one arrow, and the duplicate id that caused it says so
    (`DIAGRAM_DUPLICATE_ID`). `accent` on a container and `direction` on a leaf
    both type-check and paint nothing; both are now reported
    (`DIAGRAM_ACCENT_ON_CONTAINER`, `DIAGRAM_DIRECTION_ON_LEAF`).
  
  - **`Table`'s scroll container was not a positioning context.** `sr-only` is
    `position: absolute`, so a visually-hidden label inside a cell resolved
    against the document — escaping the table's own scroll container and any
    `overflow-hidden` around it, and widening the page by however far the table
    happened to be scrolled. It is `relative` now. `ScrollArea`'s root already
    was; its viewport is now too, so an absolutely-positioned descendant travels
    with the content instead of hanging still over it.
  
  - **`ScrollArea` clipped the axis it did not scroll.** Radix sets the viewport's
    `overflowX`/`overflowY` from which `Scrollbar` children are mounted, so the
    old `orientation="vertical"` default left the horizontal axis `hidden`:
    content wider than the box was not merely unmarked, it was unreachable by
    every key and every gesture. The default is `both`. Narrowing it is still
    available, and is now a decision someone wrote down.
  
  - **`Breadcrumb` shipped crumbs that impersonated the current page.** A middle
    crumb with no `href` renders as a `<span>` inheriting the nav's `--ink-3-aa` —
    the same colour as the links beside it — and takes no `aria-current` either.
    Invisible in the browser, invisible in review; named in the console instead
    (`BREADCRUMB_CRUMB_NOT_LINKED`).
  
  - **`Card` rounded its corners and did not clip them.** A full-bleed image or a
    filled first child laid its square corners over the card's round ones. The box
    clips now; pass `overflow-visible` for the rarer card that deliberately
    overhangs.

- [#58](https://github.com/Misoto22/misoto22-design/pull/58) [`dd69487`](https://github.com/Misoto22/misoto22-design/commit/dd69487bc62b61f10b7314d3b6ea718b46959c66) Thanks [@Misoto22](https://github.com/Misoto22)! - `EmptyState` and `ErrorState` take a `level`, and stop deciding the document
  outline for the caller.
  
  Both rendered a heading at a level that was fixed and could not be passed in —
  `ErrorState` an `h1`, `EmptyState` an `h3`. That is not only a markup detail:
  the catalog entry for `ErrorState` already told readers "do not render it inside
  a shell that already has an h1", which was advice the API gave them no way to
  take. A rule the caller cannot follow is worse than no rule.
  
  Both now render through `Heading`, so the element and the size are separate
  props and the size is pinned by the component: `EmptyState` is `--fs-sub` and
  `ErrorState` is `--fs-heading` at every level. Moving a state down the outline
  is a fact about the document, not a request for smaller type.
  
  The two defaults differ, and deliberately:
  
  - **`ErrorState` defaults to `1`, unchanged.** It replaces the page rather than
    sitting inside one — its own ground, its own viewport, its own top clearance —
    so the page's single `h1` is the one it renders. Existing call sites render
    exactly the markup they did. Inside an app shell that already owns the page
    heading, pass `level={2}`.
  - **`EmptyState` defaults to `2`, changed from a fixed `3`.** It stands in for a
    whole view inside a page that already has an `h1`, so the level below that one
    is the level that does not leave a hole in heading navigation. The old `h3`
    was wrong in the ordinary case and impossible to correct.
  
  Neither is required. The correct placement has one answer often enough that
  making every call site restate it would buy nothing, and `Heading` already
  proves the point that a good default is worth more than a forced decision.
  
  **What a consumer has to do.** If you relied on `ErrorState` rendering the page
  `h1`, nothing — that is still the default. If you relied on `EmptyState`
  rendering an `h3` — a CSS selector, a snapshot, a test querying by level —
  pass `level={3}` to keep it, or update the expectation. Nothing else about
  either component moved.
  
  One rendering difference beyond the element: the heading now takes its
  line-height from the system ladder — 1.25 for `EmptyState`, 1.2 for
  `ErrorState` — where before it inherited the ambient 1.5. That is the same
  leading `article.css` gives a rendered Markdown heading, which is what makes a
  component page and a post read as one publication. Font size, face, weight,
  colour and the surrounding spacing are unchanged.

- [#58](https://github.com/Misoto22/misoto22-design/pull/58) [`dd69487`](https://github.com/Misoto22/misoto22-design/commit/dd69487bc62b61f10b7314d3b6ea718b46959c66) Thanks [@Misoto22](https://github.com/Misoto22)! - `Tag` owns the filter case, and `Markdown` finishes the link boundary.
  
  Both shipped hours ago and both were found by their first consumer.
  
  - `Tag` takes an `onClick`. The advice used to be to wrap a tag in a button at
    the call site, which is fine alone and invalid the moment the chip is also
    removable: the remove control is a real `<button>`, so the wrapper made a
    button inside a button — markup a parser splits into siblings, leaving a DOM
    neither the author nor the accessibility tree expects. A removable filter
    chip is an ordinary thing to want, so the component now owns it. With
    `onClick` the chip IS the button, carrying `aria-pressed` from `active`; with
    both handlers the label and the X render as sibling buttons, and the label
    takes the leading padding with it so the target is the chip up to the X
    rather than the words with dead space around them. `aria-pressed` is emitted
    only when `active` is passed, so a chip that navigates does not announce
    itself as "not pressed".
  
  - A `Markdown` link that leaves for another site now carries
    `rel="noreferrer nofollow"`. Refusing `javascript:` stops the href
    EXECUTING; it does nothing about an untrusted author spending the page's
    ranking or reading its URL out of the `Referer`, and untrusted content is the
    input this component exists for. Relative, `mailto:` and `tel:` hrefs cannot
    leave the origin and are untouched. New opt-in `markExternalLinks` adds the
    system's outbound arrow to the same links; it is off by default because the
    mark is an addition to a sentence the component did not write, and because
    "another site" can only mean "carries an http(s) scheme" from in here.
  
  Documentation caught up with three things that were already true: `Markdown`
  brings type and colour but no vertical rhythm, so anything longer than a
  sentence wants `<Article as="div">` around it; a fenced code block renders
  `CodeBlock`, which is a client component; and `article.css`'s header comment
  said a utility beats the article's rules, which is backwards — the file is
  imported unlayered while Tailwind's utilities are in `@layer utilities`, and
  that is precisely what lets a `Markdown` paragraph's `m-0` give way to the
  article rhythm.

### Patch Changes

- [#58](https://github.com/Misoto22/misoto22-design/pull/58) [`dd69487`](https://github.com/Misoto22/misoto22-design/commit/dd69487bc62b61f10b7314d3b6ea718b46959c66) Thanks [@Misoto22](https://github.com/Misoto22)! - `{@link}` survives extraction, and the article cascade is documented the way it
  actually runs.
  
  Three corrections to what the package publishes about itself. None of them
  changes a rendered pixel; all three change what a reader — or an agent reading
  `dist/agent/` — is told.
  
  **`{@link}` was being deleted.** The props extractor joined a JSDoc comment's
  parts on their `text`, and a `{@link Name}` node's own `text` is empty: the
  identifier lives on its `name`. So `See {@link TableBorders}.` shipped as
  `See .` — nine descriptions across seven components, each one a sentence
  pointing at something that had been removed on the way out. A link now renders
  as its bare identifier, which is what a reader greps for and what the row
  beside it already prints as the prop's type.
  
  **The article cascade was documented backwards.** `Article`'s note, and the
  `Article` catalog entry beside it, said a component's own utility outranks the
  article's element selectors. It is the other way round: `article.css` is
  imported unlayered while Tailwind's utilities sit in `@layer utilities`, and an
  unlayered rule beats a layered one whatever either one's specificity is. That
  is not a footnote — it is the mechanism the whole composition rests on, the
  reason a `Markdown` paragraph carrying `m-0` gives its margin up to the
  article's rhythm. A caller who believed the old version would reach for a class
  to hold a property inside an article and watch it lose; the honest answer is an
  inline style, or a tag the stylesheet does not reach.
  
  **`CodeBlock` documented a trade without its consequence.** Line numbers live
  inside each line's row so a number cannot come apart from the line it numbers.
  The cost went unsaid: the number is inside the scrolling box, so on a wide
  snippet it scrolls away with the code rather than staying in a gutter. A gutter
  that stayed put would be the second column this deliberately avoids — worth
  knowing before someone reports it as a bug.

- [#64](https://github.com/Misoto22/misoto22-design/pull/64) [`4807494`](https://github.com/Misoto22/misoto22-design/commit/4807494fc44cd571a8e9b37c3e5f4abe8db3eaa7) Thanks [@Misoto22](https://github.com/Misoto22)! - `prefers-reduced-motion` is now honoured by everything, instead of by whatever
  remembered to ask.
  
  The rule in `keyframes.css` was an opt-in: a surface that animated carried
  `data-m22-animated`, and that attribute was what got cancelled. Four
  independent documentation passes each found a different piece of the same
  failure.
  
  - Half the selector matched nothing at all. `[class*='m22-anim']` was written
    for a class-name scheme the package never adopted — Tailwind emits
    `animate-[m22-collapsible-down_…]`, which contains no `m22-anim` — so that
    branch had never once fired, and nothing anywhere said so.
  - The rule only ever set `animation`. Anything animated by `transition`
    escaped it entirely, which is most things that slide: `SheetContent` and
    `AppShell`'s drawer both move on `transition-transform`.
  - Two siblings disagreed. `CollapsibleContent` carried
    `motion-reduce:animate-none`; `CollapsibleSection` — the composed one its own
    JSDoc calls what most call sites want — carried nothing, and neither did
    `Accordion`'s panel.
  
  Four authors forgetting the same thing in four components is a fact about the
  mechanism, not about the authors. So the guarantee is no longer the marker: the
  block now carries the universal reduced-motion reset, capping both
  `animation-duration` and `transition-duration`. A component added tomorrow is
  covered before its author has read the file.
  
  This is a `*` rule in a stylesheet consumers import, and that is intended. It
  fires only when the reader has asked their operating system for less motion,
  and a caller with motion they consider essential can still keep it — an
  `!important` on `*` is the weakest one there is, so any class-level
  `animation-duration: … !important` outranks it. What changes is which way round
  the default falls: keeping motion under this preference is now something you
  write down, rather than something you get by forgetting.
  
  Durations collapse to `0.01ms` rather than to `none`, because JavaScript
  listens — Radix unmounts a closing panel on `animationend`, and consumer code
  may await `transitionend`. A near-zero duration still fires both.
  
  `data-m22-animated` stays and is now deliberately redundant: it is a component
  asserting its motion is decorative, and it goes further than the floor by
  removing the animation outright. `Accordion`'s panel and both `Collapsible`
  panels now carry it, so the two siblings finally agree.
  `src/__tests__/reduced-motion.test.tsx` fails if the block stops being
  universal, stops naming transitions, grows a selector that matches nothing, or
  if a component reaches for a system keyframe without making the assertion.

## 0.7.0

### Minor Changes

- [#52](https://github.com/Misoto22/misoto22-design/pull/52) [`212f6d4`](https://github.com/Misoto22/misoto22-design/commit/212f6d4a62cf6b55a7b422505e7de356364ac551) Thanks [@Misoto22](https://github.com/Misoto22)! - Add `@misoto22/design/diagrams`: five diagram figures and the chrome to explore one.
  
  `ArchitectureFigure`, `WorkflowFigure`, `SequenceFigure`, `DataflowFigure` and
  `LifecycleFigure` render the JSON schemas published by
  [archify](https://github.com/tt-a1i/archify), so a specification authored for
  that tool renders here with no translation step — in this system's own terms
  rather than in archify's palette. Where archify separates seven kinds of node
  by hue, these carry the kind twice, as a drawn sigil and as a word on the
  plate's eyebrow, so the distinction survives a greyscale print and a
  colour-blind reader. The only colour any of them spends is `--success` and
  `--danger` on a terminal lifecycle state, which is what those two tokens were
  reserved for.
  
  Every position comes out of the specification, so the figures render on a
  server and produce identical markup twice — there is no layout to do and
  therefore no shift on hydration. The `<svg>` is `role="img"` with a name, and
  each figure publishes its nodes and relationships beside it as an ordinary
  list; passing `onSelectNode` turns that list into the keyboard's route to a
  selection.
  
  `DiagramCanvas`, `DiagramToolbar`, `DiagramExportMenu`, `DiagramInspector`,
  `DiagramMinimap` and `DiagramLegend` are the reader-facing half: pan and zoom,
  a grouped action bar, PNG / JPEG / WebP / SVG / share-card export with the
  theme's custom properties baked into real colours, a detail panel and an
  overview map.
  
  They ship from their own entry point so a page rendering a `Badge` does not pay
  for a routing engine; `check-size` fails if they ever leak into the main
  barrel. The shared SVG export helpers now live in `src/lib/svg-export.ts`.

### Patch Changes

- [#55](https://github.com/Misoto22/misoto22-design/pull/55) [`eff6c5c`](https://github.com/Misoto22/misoto22-design/commit/eff6c5c3f18b867d6950ed7896eb2c171ff8eb7e) Thanks [@Misoto22](https://github.com/Misoto22)! - Fold the chart PNG export onto the shared SVG export.
  
  `charts/lib/export.ts` and `lib/svg-export.ts` each carried the same computed-
  style walker, the same standalone-document builder and the same canvas
  rasteriser — arrived at independently, for charts and for diagrams, and already
  diverging: the shared copy had picked up `marker-start`/`mid`/`end`, without
  which an exported arrow comes out headless. Two copies of a paint walker means
  the next fix lands in one of them.
  
  The chart module keeps only what a Recharts chart knows and a diagram does not:
  which `<svg>` in the subtree is the plot, what a row of chart data looks like as
  a CSV record, and that the ground behind an exported plot is `--chart-surface`.
  It is 387 lines down to 182, and `chartToPng`'s signature is unchanged.
  
  `findPlotSvg` now has a test, which it did not before. Both of its narrowings
  are load-bearing and each fails the same silent way — the toolbar sits outside
  the plot wrapper and every control in it is an `<svg>`, the legend draws its
  swatches inside it — so an export that skipped either one would be a picture of
  an icon, which looks like a working download until somebody opens the file.
  
  Two visible differences, both from the shared serialiser: the exported title
  band is 34px at 15px rather than 30px at 13px, and a chart exported before it
  has been measured now says `serializeSvg:` rather than `chartToPng:` in the
  error it throws.

## 0.6.1

### Patch Changes

- [#53](https://github.com/Misoto22/misoto22-design/pull/53) [`4f7ebd8`](https://github.com/Misoto22/misoto22-design/commit/4f7ebd82961bd7745a0c665295b5c1ac5306b3ab) Thanks [@Misoto22](https://github.com/Misoto22)! - Fix the `Import:` line the offline documentation prints for a chart.
  
  `dist/agent/AreaChart.md` said `import { AreaChart } from '@misoto22/design'`,
  which throws. Charts ship from `@misoto22/design/charts` behind optional peers,
  and that separation is the whole reason an app rendering a Badge never resolves
  `recharts` — so the root barrel does not export them and never will. Twenty
  components carried the wrong line, in the tarball and in the site's `llms.txt`
  alike. It is the one line an agent pastes without checking.
  
  Which specifier a component is imported from is now derived from the tree its
  directory sits in — `ENTRY_POINTS` maps each specifier to one directory under
  `src/`, and nothing is authored per component. The alternative was a field on
  every entry, which is a second copy of something the filesystem already says.
  `catalog.test.ts` fails when a catalog entry names no entry point's tree.
  
  The skill was stale in the same direction and is corrected with it: it said 52
  primitives when there are 72, never mentioned the charts entry or
  `@misoto22/design/tokens`, and still offered `data-accent` — an attribute that
  has never existed, in the same skill whose own `rules/tokens.md` says so. Two
  tests now hold that line: every specifier in `exports` has to appear in
  `SKILL.md`, and no skill file may offer `data-accent` as something to set.
  
  Nothing about the runtime changed: same exports, same CSS, same bundle.

## 0.6.0

### Minor Changes

- [#47](https://github.com/Misoto22/misoto22-design/pull/47) [`09fc30a`](https://github.com/Misoto22/misoto22-design/commit/09fc30a621361f2c705829c60552c288320637d4) Thanks [@Misoto22](https://github.com/Misoto22)! - The package documents itself for agents, offline: a `misoto22-design` CLI, a
  skill, and a README.
  
  The docs were on a website while the version being written against was in
  `node_modules`, and neither side could see the disagreement. Everything an agent
  needs now ships in the same tarball as the source it was generated from.
  
  - `npx misoto22-design docs <Component>` prints one component in full — every
    prop with its type and default, the exported unions, the keyboard contract,
    the accessibility promises, the `@example` blocks. The median component is
    about 500 tokens, against roughly 28,000 for all fifty-two. It resolves parts
    and types too, so `docs CardBody`, `docs TH` and `docs ButtonVariant` all land
    on the right file — which is what you have when an import just failed.
  - `npx misoto22-design docs --installed` is the cheap half: the resolved version
    and every component name, a few hundred tokens.
  - `npx misoto22-design init --agents-md` installs the skill under
    `.claude/skills/` and points `AGENTS.md` at it. Its name and description are
    about 110 tokens and are all a session carries until something touches the
    package; the body and the five rule files load from there.
  - `README.md` was listed in `files` and did not exist, so the npm page has been
    blank. It exists now.
  
  Two things the old documentation said were not true. There has never been a
  `data-accent` attribute — `--accent` is a custom property — and
  `data-surface="glass"` was never listed, so nothing pointed at an axis value
  that does work. The axes are now read out of the stylesheets that define them
  rather than described by hand, and a test fails when the authored half stops
  matching.
  
  Nothing about the runtime changed: same exports, same CSS, same bundle.

- [#49](https://github.com/Misoto22/misoto22-design/pull/49) [`625198b`](https://github.com/Misoto22/misoto22-design/commit/625198b30a106c4c6e56df5d9e353f944f2bca18) Thanks [@Misoto22](https://github.com/Misoto22)! - Add twenty data-visualisation primitives.
  
  Sixteen ship from a new `@misoto22/design/charts` entry with `recharts` and
  `motion` as OPTIONAL peer dependencies — `AreaChart`, `BarChart`, `LineChart`,
  `ComposedChart`, `ScatterChart`, `PieChart`, `RadarChart`, `RadialChart`,
  `FunnelChart`, `TreemapChart`, `SankeyChart`, `BoxPlot`, `Histogram`,
  `WaterfallChart`, `Facet` and the toolbar-driven zoom — each a compound component
  composed from axes, grid, tooltip, legend, dots, a background plate and a
  keyboard-driven zoom brush. The main entry and its size budget are unchanged: an
  app that renders a Badge does not pay for a rendering engine.
  
  `Heatmap`, `Sparkline`, `BarList`, `BigNumber` and `BulletChart` ship from the
  same entry and need NO engine at all.
  The heatmap is a real `<table>` with weighted cells, so the structure a screen
  reader walks is the structure the eye reads; the sparkline is one `<path>`, so a
  hundred of them in a table cost nothing.
  
  The token layer gains a data block: `--series-1` … `--series-8` (a neutral ramp
  whose adjacent steps clear ΔE 21 and 3:1 on their own ground), the `--chart-*`
  roles, and `--chart-fill` / `--chart-texture` — the only tokens in the system
  that hold different numbers on the two grounds, because ink at 14% over paper is
  a legible band and paper-white at 14% over near-black is nothing. Texture is the
  primary carrier of series identity; the ramp supports it. `data-chart-palette`
  is a seventh theme axis that swaps the ramp for a validated categorical palette.
  
  Every chart requires a `title`, renders its rows again as a visually hidden
  table, and drops its intro animation under `prefers-reduced-motion`.
  
  Borrowed from a survey of the field, and each one fixing something that was
  missing rather than adding a variant:
  
  - **An annotation layer** — `ReferenceLine`, `ReferenceBand` and `Annotation` on
    every cartesian chart, stacked in the order editorial charting settled on
    (band behind the grid, line above the marks, note above both). Most charts
    that look like they need a second series need a target line instead.
  - **Axis titles** (`<Chart.XAxis label>`), because an axis reading 0 · 100 · 200
    says nothing about whether those are people, milliseconds or dollars.
  - **Selective value labels** — `<Chart.Values show="last | first-last | extremes
    | all">`. The default prints one number, not one per point.
  - **`formatNumber`** with compact, percent, currency, duration and byte styles,
    and a compact default on every value axis above four digits.
  - **An empty state.** `data: []` now renders `ChartEmpty` rather than a bare
    pair of axes, which is indistinguishable from a failed load.
  - **Forced-colours support** in `tokens.css`. Browsers do not remap SVG, so the
    chart tokens re-point onto system colours there and texture carries the
    series apart; `Heatmap` reveals its numbers, since its wash is gone.
  - **`BarList`** — a ranked list with the bar behind the name, which a
    horizontal bar chart cannot do.
  - **`BigNumber`** — one figure at headline size with a delta whose direction is
    stated by the call site, never inferred from the sign.
  - **`BulletChart`** — Stephen Few's replacement for the dashboard gauge: a
    measure, its target and its qualitative bands in the height of a line of
    text. Plain HTML, so ten of them stack into a status page for free.
  - **The statistical family** — `BoxPlot`, `Histogram` and `WaterfallChart`.
    Each documents what it HIDES rather than only what it shows: a box cannot
    tell one hump from two, a histogram's shape is a property of its bin width,
    and a waterfall's connectors imply a sequence most breakdowns do not have.
  - **`Facet`** — the same chart once per group on one shared scale, which is the
    answer to eight series overplotted into a hairball. The shared domain is the
    default: on independent scales a group peaking at 40 and one peaking at 4,000
    draw the same shape, and the comparison is not merely lost but inverted.
  - **Sonification** — `<Chart.Sonify>` plays a series as pitch over time for a
    reader who cannot see the plot. Never autoplays; sound only ever starts from
    an explicit user action, which is a different question from
    `prefers-reduced-motion`.
  - **A chart toolbar** — step zoom, reset, and taking the figure away as a PNG
    or a CSV. Capped at five controls with no overflow menu, so a cartesian chart
    does not statically reach a menu component every consumer would then ship.
    Zoom and the brush drive ONE window, so they cannot disagree.

## 0.5.0

### Minor Changes

- [#42](https://github.com/Misoto22/misoto22-design/pull/42) [`682e85e`](https://github.com/Misoto22/misoto22-design/commit/682e85e05495d2dbbb3308345881b0817de93135) Thanks [@Misoto22](https://github.com/Misoto22)! - `AppShell` takes `sidebarLabel`, `navLabel`, `openLabel` and `closeLabel`.
  
  Both landmark names were hardcoded English. Two `complementary` landmarks with
  the same name cannot be told apart, which is exactly the pair a shell rendered
  inside another page makes — a preview, a screenshot harness — and it was the
  only part of the component a non-English app could not translate.

## 0.4.0

### Minor Changes

- [#40](https://github.com/Misoto22/misoto22-design/pull/40) [`fb9b117`](https://github.com/Misoto22/misoto22-design/commit/fb9b11721c0f5000c62860f3358d1893c181318f) Thanks [@Misoto22](https://github.com/Misoto22)! - One radius ladder driven by one factor, a calendar that picks a month in place
  of the grid, a reading surface for long-form content, and a numbered rail for
  the sequences a diagram should not be drawing.
  
  **The radius is a ladder now, and a theme moves one number.** The four steps
  were four independent values, and the radius theme re-typed all four — so
  nothing held them in proportion and a corner nested inside another corner was
  right at the one setting somebody checked and wrong at every other. Every step
  is now `calc(<n>px * var(--radius-factor))` — 4, 6, 8, 12 and the pill, which is
  where Tailwind's scale, shadcn's `--radius` ± 2 and ± 4, Radix Themes' steps 3
  and 4 and Material's `xs`/`sm`/`md` all land within a pixel of each other.
  `sharp` sets the factor to `0` and `round` to `2`, and the pill is on the ladder
  with everything else: a square theme that left every button a capsule was not a
  square theme. A true circle — an avatar, a status dot, a spinner, a radio — is
  geometry and stays round.
  
  **`Button` now draws `--radius`, the control step**, which is the same corner an
  `Input`, a `Select` trigger and a `Textarea` draw. It was a pill, and a pill
  beside an 8px field is two different ideas of what a control is — the one
  inconsistency in the system that every reader noticed and no component page
  could explain. The capsule is kept for the things that genuinely are one: a
  badge, a status pill, a segmented strip, a progress track. `Calendar`'s own
  chrome buttons follow, and its caption arrows are now the same height as the
  month they sit beside rather than ten pixels above it.
  
  Two rounded edges separated by a gap of `p` are concentric only when the inner
  radius is the outer minus `p`. Both directions are named rather than left for
  each surface to guess: `--radius-row` subtracts (a row inside a panel padded by
  6px) and `--radius-frame` adds (a frame sitting 16px outside a `--radius-lg`
  panel), with the adding one gated so a square theme stays square. Menus,
  popovers, selects and the command palette now round their panel at
  `--radius-lg` and their rows at `--radius-row`, which is the pairing that
  actually holds at every setting.
  
  The ladder is declared for `:root` **and** `[data-radius]`. A custom property
  substitutes `var()` where it is declared, so a ladder written only on the root
  bakes the root's factor in and a themed subtree never reaches its own — which
  is exactly what the themes page does, five radii on five wrappers.
  
  **New `Article`** — the long-form reading surface. Everything a Markdown
  pipeline emits, set in this system's type, colour and rules: headings and their
  anchors, lists, tables, quotations, code, figures, footnotes and MathML. The
  styles ship as `@misoto22/design/article.css` and are scoped to a data
  attribute, so a site with its own pipeline can take the reading surface without
  taking the components.
  
  **New `Diagram`** — a flow or architecture figure drawn from the system's own
  parts. Nesting is containment and an edge is a step between siblings; it takes a
  spec rather than markup, so a fenced ```diagram block and a hand-written figure
  are one renderer, and it server-renders because it is markup rather than a
  canvas.
  
  **`Calendar` picks a month in place of the grid.** The month and year were two
  `Select`s that portalled a ten-rem list over the calendar — three visible months
  out of twelve, with a scroll arrow at each end, floating on top of the thing the
  reader opened it to change. The caption is now one control reading "September
  2026", and it swaps the day grid for a 3×4 month grid or a 4×6 year grid at the
  same size. Nothing overlaps, nothing scrolls, Escape closes it and hands focus
  back, and the year pages tile the range from its first year so every year in the
  span is reachable — the old arrangement could offer a year it never showed.
  
  The picker BROWSES; it does not navigate. Stepping the year moves the grid under
  the arrows and leaves the calendar where it was, so one click does one thing:
  choosing a month is what moves the calendar and closes the panel. It used to
  navigate and close on the arrow, which meant `‹` on "2026" left the reader
  looking at a different month with the picker gone.
  
  **New `Steps`** — a numbered sequence as a rail: a marker, a rule through them,
  a name and a line of detail. It is the figure a technical page reaches for
  after a diagram and is not one, because nothing branches and nothing points at
  anything; drawing an order with boxes and arrows says otherwise. An `<ol>`, with
  the connector on the item so it stops between markers rather than running
  through them and off the end.
  
  **New floating-surface tokens, and a glass theme that spends them.**
  `--panel-bg`, `--panel-border` and `--panel-filter` are what a surface that
  FLOATS fills with and what it does to whatever is behind it — read by `Dialog`,
  `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu`, `Select` and `Command`, and
  by nothing that sits in the page, because a card has nothing behind it to treat.
  All three default to the plain surface, and `--panel-filter: none` is not a blur
  of zero: any `backdrop-filter` value promotes its element to a compositing layer
  and makes it a containing block for fixed descendants, which is a cost every
  menu would pay for a theme most readers never turn on.
  
  `[data-surface='glass']` then sets a translucent panel, a specular edge and
  `blur(20px) saturate(180%)`. It does not break law 2: the blur is not UNDER a
  surface pretending to be a shadow, it is BEHIND one. A shadow claims a light
  source this system does not have; a frosted panel claims a material, and says
  honestly that the page is still there behind it.
  
  `Collapsible` also exports `CollapsibleTrigger` and `CollapsibleContent`, for a
  disclosure that needs its own header layout.
  
  **`FigureBand` reaches four columns again.** Its container query was declared on
  the same element it queried, which can never match, so the band stayed two
  columns at every width — four figures on a full page came out as a 2×2 block
  with a hole in it.

### Patch Changes

- [#34](https://github.com/Misoto22/misoto22-design/pull/34) [`7fcaf6c`](https://github.com/Misoto22/misoto22-design/commit/7fcaf6cd48a05d4e67cd9d3bc572c381b1222838) Thanks [@Misoto22](https://github.com/Misoto22)! - `ToggleGroup`'s sliding pill lands on its segment inside a scaled container.
  
  The indicator measured with `getBoundingClientRect`, which reports visual
  pixels, and positioned with `transform`, which is interpreted in the element's
  own coordinate space. Inside anything zoomed or scaled — a thumbnail, a device
  preview — the two disagreed by exactly the scale factor and the pill sat short
  of its segment. It now accumulates layout offsets up to the strip instead.

## 0.3.1

### Patch Changes

- [#28](https://github.com/Misoto22/misoto22-design/pull/28) [`4f4a433`](https://github.com/Misoto22/misoto22-design/commit/4f4a433504cf254e87ff69afd56771cf46cf364e) Thanks [@Misoto22](https://github.com/Misoto22)! - Restore the table's column gutter, which a unitless zero had been silently
  eating.
  
  `--table-pad-x` was `0` rather than `0px`. The cell rule adds to it inside a
  calc, so it resolved to `calc(0 + 1.5rem)` — invalid at computed-value time,
  which drops the whole declaration instead of falling back. Every non-last cell
  of every `borders="rows"` or `borders="none"` table therefore had no
  `padding-inline-end` at all, and an `align="end"` column butted straight against
  its neighbour. The ruled variants were unaffected, because they set the variable
  to `0.75rem` and a unit came with it.

- [#29](https://github.com/Misoto22/misoto22-design/pull/29) [`d97ad30`](https://github.com/Misoto22/misoto22-design/commit/d97ad30f35ba3be5f19dc4e50e529e0c5098e28c) Thanks [@Misoto22](https://github.com/Misoto22)! - Ten fixes from a walk over the published site.
  
  - `FigureBand` collapsed to two zero-width columns of overlapping text. It
    declares `@container`, which computes its width without looking at its
    contents — as a shrink-to-fit flex item that resolved to nothing.
  - `CardTitle` on the reversed `plate` was ink on near-black, at 1.25:1.
  - `ToggleGroup` stretched to whatever its flex parent was, leaving dead space
    after the last segment. `inline-flex` does not opt out of that; `w-fit` does.
  - Anchored panels grow from their trigger and now animate on the way out too.
  - `Select` takes `contentClassName`, and the calendar's year list uses it: the
    default 18rem covered the calendar the reader opened it to change.
  - `Combobox` and `SearchableMenu` name their filter field for what it does. It
    inherited the control's own name, so a screen reader met two comboboxes
    called the same thing, one inside the other.
  - New `scroll-hairline` for a bounded panel, used by the command palette.

## 0.3.0

### Minor Changes

- [#21](https://github.com/Misoto22/misoto22-design/pull/21) [`30a3f0c`](https://github.com/Misoto22/misoto22-design/commit/30a3f0c5061a824e9babffe27a980dac36a5a745) Thanks [@Misoto22](https://github.com/Misoto22)! - Configurable Table, a searchable action menu, and calendar/date-picker repairs.
  
  - `Table` takes `borders` (`rows` | `grid` | `bordered` | `bordered-grid` | `none`),
    `density`, per-column `align`, and per-column opt-in `sortable` with
    `sortDirection` / `onSort`. All rules are drawn from the wrapper, so the
    component stays server-renderable.
  - New `SearchableMenu`: a filterable menu of actions, for the case
    `DropdownMenu` outgrows and `Combobox` does not fit (it sets no value).
  - `Calendar` month and year pickers are our own `Select` rather than the native
    dropdown, and span 10 years either side instead of the full century.
  - A selected day is round again. In range mode a one-day selection was both
    range start and range end, and the two overrides summed to `border-radius: 0`.
  - `DatePicker` and `DateRangePicker` take `presets`: a shortcut rail (Last 30
    days, Last 90 days, Year to date…), computed on click so "today" means today.

- [#23](https://github.com/Misoto22/misoto22-design/pull/23) [`de06cfb`](https://github.com/Misoto22/misoto22-design/commit/de06cfbeff0e83cac3b432cfa9f9158d5207fb65) Thanks [@Misoto22](https://github.com/Misoto22)! - `Command` rows carry a glyph and a note, and the palette says which keys do what.
  
  - `CommandItem` takes `icon` and `meta`. Forty rows of bare text cannot be
    scanned — the eye sorts by shape before it reads.
  - New `CommandFooter` and `CommandHint`: the key-hint strip a palette needs,
    because nothing else on screen says the arrows move the row.
  - The highlighted row reads `--accent` with a leading rule, rather than a flat
    grey fill.
  - `CommandDialog` is wider and sits above centre, where a palette belongs.

- [#17](https://github.com/Misoto22/misoto22-design/pull/17) [`5278356`](https://github.com/Misoto22/misoto22-design/commit/52783560faddae03d4f282999ac4fe17ce0d3a4c) Thanks [@Misoto22](https://github.com/Misoto22)! - Fix the interactions that were drawn but not wired, and give selection
  something that moves.
  
  `Select` is now the styled control and the native one becomes `NativeSelect`.
  The old default stopped being part of the system the moment it opened — the
  option list is drawn by the operating system and carries none of these tokens.
  The one genuine argument for staying native was the keyboard contract, and
  Radix answers it: typeahead, arrows, Home and End, Escape without choosing.
  
  `Slider` printed a figure that never moved. It read the value off the props, and
  an uncontrolled slider's `defaultValue` does not change — so the number sat at
  its starting point while the thumb travelled, which is the one thing `showValue`
  exists to prevent.
  
  `ToggleGroup` looked identical whether it held one value or several, so a
  multiple-value group looked like a broken single one. A single-value strip now
  moves ONE pill between its options and a multiple-value strip fills each
  pressed option separately. `Pagination` gets the same treatment: a shape that
  travels reads as the one thing that changed, where two backgrounds cross-fading
  reads as two.
  
  `Combobox` takes several values, keeps the panel open while you pick them, and
  clips the command list to its own corners — the list's square edges had been
  poking through the panel's radius.
  
  `Calendar` navigates by month and year dropdowns rather than two arrows.
  Twenty-four clicks to reach two years ago is not a navigation model. Its nav
  also sat above the grid rather than beside the caption, because the nav renders
  first in the DOM and was left in the flow.
  
  `DateRangePicker` is new. It shows two months, and closes only once two days
  have actually been clicked — the library reports `{ from, to }` on the FIRST
  click, so a completeness check closed the panel instantly and produced a
  one-day range every time.
  
  `Switch` narrows its thumb as it travels, and `Slider`'s grows as it is
  grabbed, so both read as something being moved rather than a value blinking to
  a new state.

- [#19](https://github.com/Misoto22/misoto22-design/pull/19) [`1580754`](https://github.com/Misoto22/misoto22-design/commit/15807547bb628e59a0d2283b75582fe47cbe0401) Thanks [@Misoto22](https://github.com/Misoto22)! - Route every chosen-state surface through the accent pointer.
  
  Law 7 says the system has one pointer and that the pointer is ink. Half the
  components were reading `--ink` directly instead — a primary button, a checked
  box, an active tab, the current page, a slider's filled range, a selected day.
  While the accent IS ink the two render identically, which is exactly why nobody
  noticed, and why the law was true on the principles page and not in the code.
  
  They read `--accent` now. Nothing changes at the default, and re-pointing that
  one token re-skins the system without a component being touched — which is what
  having a pointer was for.

- [#22](https://github.com/Misoto22/misoto22-design/pull/22) [`81ae658`](https://github.com/Misoto22/misoto22-design/commit/81ae658dba21127790f6b03fc8749dc7e52c97f2) Thanks [@Misoto22](https://github.com/Misoto22)! - Overlays and the fluid scale can be re-based onto a bounded frame.
  
  - New `OverlayContainer`: names the element that `Popover`, `Select`,
    `DropdownMenu`, `ContextMenu` and `Tooltip` should render into. Panels then
    collide with that element's edges rather than the viewport's, and inherit the
    `dir` and `data-density` set on it. `Dialog` and `Sheet` still cover the
    viewport, which is what they are for.
  - New `--fluid` token, `1vw` by default. A frame that declares
    `container-type: inline-size` and sets `--fluid: 1cqi` on an element inside
    it carrying `data-fluid-frame` re-bases the whole type and spacing ramp onto
    its own width.
  - `FigureBand` is a query container and reads its own width, so four figures
    across is a decision about the band rather than about the window.

- [#27](https://github.com/Misoto22/misoto22-design/pull/27) [`46cfdde`](https://github.com/Misoto22/misoto22-design/commit/46cfdde90ae2f0ef283bd1da5863e3e428a304cf) Thanks [@Misoto22](https://github.com/Misoto22)! - Published to npmjs, publicly, instead of to GitHub Packages.
  
  The repository has been public and MIT-licensed for a while, but the package it
  ships was restricted on a registry that needs a token to read — so the install
  instructions were a gate rather than a command. It now publishes to the default
  registry with `access: public`, which every client reads without an `.npmrc`.
  
  Two consequences for anything already installing it. The scope no longer needs
  pointing anywhere, so the `@misoto22:registry` and `_authToken` lines can come
  out of the consumer's `.npmrc`; and the versions published to GitHub Packages
  stay where they are — nothing was copied across, and `0.3.0` is the first
  version on npmjs.
  
  The manifest's `description` also changes. It, the repository's About field and
  the README's opening line each carried a different sentence, so two of them were
  always the stale one; they now say the same thing, and it carries no component
  count, because a number in a manifest has nothing to check it and had already
  drifted by two.

- [#24](https://github.com/Misoto22/misoto22-design/pull/24) [`6110ccc`](https://github.com/Misoto22/misoto22-design/commit/6110ccc4898286d4aa2503e296414f63521967ae) Thanks [@Misoto22](https://github.com/Misoto22)! - New `themes.css`: theming beyond the accent.
  
  Six axes, each an attribute that re-points tokens the package already defines —
  `data-surface`, `data-radius`, `data-rules`, `data-type`, `data-motion`, and the
  existing `data-density`. No component reads any of them, and the layer
  introduces no token of its own; a theme re-points, it does not invent.
  
  Nothing is anchored to `:root`, so an axis can sit on any element and the
  subtree below takes it. That is what lets a page print five themes side by side
  without five documents.
  
  Available as `@misoto22/design/themes.css`, and included in `styles.css`.

## 0.2.0

### Minor Changes

- [#13](https://github.com/Misoto22/misoto22-design/pull/13) [`0a4d5e9`](https://github.com/Misoto22/misoto22-design/commit/0a4d5e9ebb9883d432ad985091d5655a550ecdcb) Thanks [@Misoto22](https://github.com/Misoto22)! - Add eleven components and make the table do what a table is for.
  
  `Popover`, `Sheet`, `ContextMenu`, `Command` (the ⌘K palette), `Combobox`,
  `Slider`, `ToggleGroup`, `Collapsible`, `ScrollArea`, `Calendar` and
  `DatePicker`. Each documents the neighbour it could be confused with, because
  the interesting question is rarely how a component looks: a tooltip cannot hold
  a control, an accordion of one manages a value nobody reads, a native select
  beats a combobox up to about a dozen options, and a toggle group changes a
  value where tabs change a panel.
  
  `Table` gains sortable headers and a sticky header row. The sort control is a
  `<button>` inside the `<th>` rather than a click handler on the cell — a cell
  with an `onClick` is not focusable and not announced, so the sort exists only
  for a mouse — and it sets `aria-sort`, which is the only way a screen reader
  learns the table is ordered at all.
  
  `Dialog` gains `hideTitle`, for a surface whose purpose is obvious to anyone
  who can see it. The title itself stays required.
  
  Two defects the browser suite caught on the way in: the calendar's
  out-of-month days were drawn in the rule colour at 1.38:1, and `cmdk` renders
  its separator as `role="separator"` inside a `role="listbox"`, which ARIA
  forbids and which put a critical violation inside every palette.

- [#12](https://github.com/Misoto22/misoto22-design/pull/12) [`ec362c1`](https://github.com/Misoto22/misoto22-design/commit/ec362c1135d3b2e7e2e6e47e282106d3e2ef7e8b) Thanks [@Misoto22](https://github.com/Misoto22)! - Add a density axis, make every component direction-independent, and ship the
  tokens in a machine-readable form.
  
  `data-density="compact"` on any container tightens every control below it —
  44px at the default, which is the pointer target WCAG 2.5.5 asks for, and 36px
  compact, which still clears 2.5.8 and no longer meets 2.5.5. It is for a dense
  desktop tool driven by a mouse, and the docs say so rather than presenting it
  as free.
  
  Every component now uses logical properties, so `dir="rtl"` mirrors the system
  with no stylesheet of its own. A source test fails the build on a physical one
  and on any inline-axis transform without an `rtl:` counterpart; a browser test
  checks the result actually mirrors, which a source test cannot.
  
  `@misoto22/design/tokens` exports every token with its light value, dark value,
  category and explaining comment, as JSON and as a typed module — for a Figma
  sync, a native app, or any consumer that needs the values and cannot read a
  stylesheet. The documentation site now reads that artifact instead of parsing
  the CSS a second time, so the site and the package can no longer disagree about
  what a token is.
  
  `FloatingIconButton`'s `position` is now `start` / `end` rather than
  `left` / `right`, so the API does not hard-code one script's layout.

### Patch Changes

- [#10](https://github.com/Misoto22/misoto22-design/pull/10) [`fddb290`](https://github.com/Misoto22/misoto22-design/commit/fddb290e93ce7cb84afd99da7c70c16c8556bf63) Thanks [@Misoto22](https://github.com/Misoto22)! - Ship the package with a licence, a publish target and a changelog. It is MIT
  licensed, published to GitHub Packages under the `@misoto22` scope, and
  versioned by changesets — so a consumer can install it, and can tell what
  changed between two versions without reading the commit log.

- [#14](https://github.com/Misoto22/misoto22-design/pull/14) [`4c051b3`](https://github.com/Misoto22/misoto22-design/commit/4c051b3f407391d2a3843e1cab1ff118de505b68) Thanks [@Misoto22](https://github.com/Misoto22)! - Add a size and tree-shaking budget to the build (`pnpm check:size`).
  
  The absolute numbers are the boring half. The useful one is the proportion:
  bundling a single component and comparing it to the whole package is the only
  way to notice that tree shaking has quietly stopped working — one barrel
  import, one side effect in the entry, and every consumer ships the calendar to
  render a badge. It is invisible in review and shows up months later as a bundle
  nobody can explain.

- [#11](https://github.com/Misoto22/misoto22-design/pull/11) [`225ec72`](https://github.com/Misoto22/misoto22-design/commit/225ec72b7268c6cc8dbf084ef31da6c16aefed24) Thanks [@Misoto22](https://github.com/Misoto22)! - Fix three defects a browser found that a jsdom suite could not see.
  
  `Table`'s scroll container was unreachable by keyboard: a scrollable region
  whose contents are not themselves focusable has nothing to Tab to, so every
  column past the fold did not exist for anyone not using a mouse. It is now a
  focusable, labelled region.
  
  `RadioGroup` moved focus with the arrow keys but not the selection. The
  upstream primitive gates that on a flag cleared by `keyup`, and loses the race
  against its own focus move — a normal keypress releases before React commits,
  so the outline moved and nothing was chosen. Tracked by timestamp instead,
  which cannot be cleared out from under the focus handler.
  
  `AppShell` renders a `<main>`, which is right for an application shell and
  wrong for one embedded in another page — a document may contain exactly one. It
  now takes `contentAs`.
