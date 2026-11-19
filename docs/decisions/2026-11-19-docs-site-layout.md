# The documentation site's layout, navigation and type

Status: **proposed — waiting on a pick** (2026-11-19)
Scope: `apps/docs` only. No component in `packages/design` changes.
Mocks: the "Folio docs redesign" canvas in Claude Design (private to the owner).

## The problem

Audited against the built export at 390px and 1440px, light and dark.

**Navigation**

1. Every sidebar group starts collapsed except the one holding the open page.
   The Components rail is eleven headings with counts and chevrons, so a reader
   cannot scan 116 component names without opening each group in turn.
2. Three bars of chrome before any content on a phone: the masthead (48px),
   then a second sticky strip just for the four sections (44px), then the
   breadcrumb. About 110px of a 844px screen stays pinned.
3. The brand appears twice on a desktop, in the rail's head and (when the rail
   is folded) in the masthead. Its collapse control moves between the two.
   The rail head also carries a mono tagline nobody needs while navigating.
4. A component page puts the live component fifth. The order is Usage (a
   callout plus an import line), Notes, Anatomy, Best practices, and only then
   Examples. The thing a reader came to see is below the first screen.

**Layout**

5. Five content widths across nine views: `max-w-4xl`, `5xl`, `6xl`,
   `70rem`, and `--w-reading`. Pages jump sideways as you move between
   sections, and the home column sits left of centre with a wide empty right.
6. Double rules: the page intro draws a bottom rule and the tab strip under it
   draws another 50px lower.

**Type**

7. No body scale. The token ladder (`--fs-title` … `--fs-item`) covers
   headings only, so the app invented its own. There are 151 uses of
   `text-[13px]`, 44 of `15px`, 16 of `17px`, plus 11, 12, 12.5 and 13.5px.
   That breaks HAR-UI-003.
8. Running text is 13–14px at weight 300 (`--body-weight`) in `--ink-2`. That
   reads as faint grey on a documentation page, which is read rather than
   glanced at.
9. Uppercase, tracked mono labels are everywhere: FOUNDATIONS, ON THIS PAGE,
   READ NEXT, BUILT ON, and each group kicker. They compete with the headings
   they label, and the numbered table of contents adds a third voice.

## Options

Each option is drawn on the Button page, desktop and 390px.

### A · Reference

A three-column documentation layout, with the faults above removed.

- One 56px masthead. It holds the brand, the version, the four sections, a
  wide search field and three icons. The rail loses its own head.
- The rail is always expanded, with sentence-case group labels and no
  chevrons or counts.
- One centred reading column of `--w-reading` on every page, and a right
  table of contents without numbers.
- A component page opens on the live preview, with example tabs and a "show
  code" toggle. "When to use" comes next, then Props, then the rest.
- On a phone: one bar (menu, brand, search, theme) and one quiet
  breadcrumb / "On this page" row. The sections move into the drawer.

### B · Catalogue

No persistent sidebar. Search and the index pages do the navigating.

- A centred search field is the masthead's main element.
- Each page is a single centred column, under a sticky local bar with a
  breadcrumb on the left and in-page anchors on the right.
- Previous and next cards close every page.
- Strongest on a phone. Weakest for someone browsing the catalogue
  sideways, because moving between siblings needs search or the index.

### C · Workbench

A split component page: writing on the left, and a sticky live canvas with
prop controls on the right.

- A rail on a warm ground holds the brand, search, the sections as a 2×2
  grid, and the index.
- The canvas, the controls and the generated code stay in view while the
  reader scrolls the docs.
- Best for poking at a component. It costs a second layout for
  foundations and guides, which have no canvas, and on a phone the
  controls become a bottom sheet.

### Type, common to all three

All three use the same type system, and it lands as tokens rather than
literals:

- Docs body is 16px / 1.65 at weight 400. Secondary text is 14px. Metadata is
  13px. Code is mono at 0.875em. These are `--fs-body`, `--fs-small` and
  `--fs-meta` in the docs app's token layer, and nothing else in the app sets a
  font size.
- Labels are sentence case at weight 600 in the sans. Mono is kept for code,
  token names and versions.
- Headings stay on the package ladder in Newsreader.

## Recommendation

**A · Reference.** It fixes all nine faults. It keeps the URL structure, the
section model (`sections.ts`) and every e2e contract on the masthead controls.
It is also the layout people already know from documentation sites, which
matters more for a reference than novelty does.

C's live controls already exist as the Props tab's playground, so A loses
nothing by keeping them there. B's previous/next pager is worth taking into A.

## Round 2 — the theme was part of the problem

Henry turned down all three as mediocre. Part of the reason is the theme
itself: the root White Reset is a cold #fff ground with light-weight serif
display type and tracked mono capitals. He asked for misoto22.com's theme and
for the type to be redone as well.

misoto22.com is not a separate theme. It is folio's own `WORKBENCH_THEME`
preset (`packages/design/src/website/Workbench/theme.ts`), with these axes:

- `data-surface="linen"`: a warm ground and warm ink.
- `data-accent="ember"`.
- `data-action="ink"`.
- `data-type="grotesk"`: headings in Hanken Grotesk.
- `data-voice="quiet"`: display type at regular weight and about two-thirds
  of the ramp, labels in sentence-case sans, body text at 400.
- `data-rules="quiet"`.
- `data-controls="pill"`.

Adopting it is a default for the docs `<html>` attributes. It needs no new
colours, and the theme picker keeps every other combination one click away.

The layout vocabulary is taken from the site as well:

- A 60px masthead in a centred 1176px container: wordmark left, section links
  right with an underline, a pill search, and two icons.
- A page intro of a small sentence-case kicker, a title ending in a full
  stop, a 20px lede and a count pill.
- Filter chips between two hairlines.
- Index rows with a thumbnail, the name with its summary, and metadata on the
  right.
- 17px body text at line height 1.7. Mono only for code.

### D · Index (round 2)

No sidebar, like the blog and projects pages. The Components index is a
filterable list of chips and rows. A component page has the reading column on
the left, and on the right a sticky "On this page" list plus "Also in
<group>". Previous and next close the page. On a phone it is the site's own
header, the title, then the preview.

### E · Contents (round 2)

The same masthead and intro, plus a quiet index in the left of the container.
The index has no rail border or ground, and the current row is a filled pill.
In-page anchors become pills under the lede. On a phone the menu lists the
sections and then the open section's index.

## Round 3 — alignment and craft

Henry's verdict on round 2 was that the design still felt ordinary, with weak
visual alignment and UI. Rendering the round 2 mocks showed why:

- No grid. The content stopped at 892px, the contents list started at 1108px,
  and nothing reached the masthead's right edge, so a 216px gap read as an
  accident.
- Uneven spacing. The masthead icons sat 48px and 68px apart, and the
  vertical gaps were 40, 48 and 64px chosen per block.
- Mixed control voices. A mono pill sat beside sans pills, the props table's
  Type column took half the width, and the active chip hung 14px outside the
  content edge.
- Noise in the index. The 001 numbers repeated, `@misoto22/folio` appeared on
  every row, and the thumbnails were too small to show the component.

Round 3 keeps direction D and sets it on rules:

- **One 12-column grid** for every block: a 1176px container with 24px
  gutters. The masthead is brand over columns 1–3 and the tools over 4–12.
  The page head runs over 1–8, with a facts list (import, entry, source, agent
  Markdown) over 10–12 whose bottom aligns with the lede. The preview spans all
  12 columns. The article takes 1–8, and the sticky contents list takes 10–12
  with its top rule on the same line as the first section's.
- **One rhythm**: 8, 16, 24, 32, 48, 64 and 96px, with line heights on a 4px
  step. Titles are 44/48, ledes 22/32, body 17/28, and meta 13/20.
- **The preview is one object.** The example tabs and a Preview/Code
  segmented control sit inside its top edge, and the example's own description
  is its caption.
- **The props table** has fixed columns (25 / 55 / 20). Union members are
  separate chips, and the default sits right-aligned.
- **The index** borrows the homepage's figures row (116 components, 11
  groups, 229 tokens). Its filter bar is sticky. Each group has its name in
  columns 1–3 and a three-across card grid in 4–12, where every card has a
  168px stage showing the component.

## Round 4 — make it scannable, not a personal site

Henry's verdict on round 3 was that the navigation bar was still ugly, and that
a documentation site should be more visual and easier to read than his personal
site: more icons, more diagrams, more visual elements. Round 4 keeps the linen
theme's colours and changes the reading model.

The colour comes from sources the system already sanctions. Group identity
uses the `chroma` chart palette (`data-chart-palette="chroma"`, eight validated
categorical hues), tinted as a background behind an icon. Do and don't use
`--ok` and `--danger`, which are state colours. No new colour is introduced.

- **Navigation bar.** The brand mark, the wordmark and a version badge sit on
  the left. In the centre the five sections are a segmented control, each with
  an icon, and the current one is a raised tab. On the right are a filled
  search field with a ⌘K keycap and one grouped cluster for GitHub, language
  and theme.
- **Sidebar.** Each group has a coloured icon tile and a count, and its rows
  are indented under it. On a component page the sidebar returns, because
  moving from one component to the next is the most common task.
- **Component page.**
  - The page head has a large group-tinted icon tile, the title, the lede and
    fact chips: copy import, source, server component, and 44px / WCAG 2.5.5.
  - The preview sits on a dotted canvas, with tabs, dark and RTL toggles, and
    Code.
  - An "At a glance" row shows four cards: an emphasis ladder, the three
    sizes at their real proportions (36 / 44 / 48), keycaps, and what ships.
  - "When to use" becomes paired do and don't figures with rendered examples.
  - Anatomy is a numbered pin diagram with a legend.
  - Props have kind badges (enum, boolean), and the in-page contents list has
    an icon for each section.
- **Components index.** A grid of group tiles, each with an icon, a count
  and its first components, then one section per group with preview cards on
  a dotted stage.
- **Phone.** A compact header and the same head with fact chips. A floating
  bottom bar jumps between Preview, Usage, Anatomy, Props and A11y.

### Round 4, revised: no categorical colour

Henry approved the navigation bar and the icons, and rejected the
multicoloured icon tiles. Icons now take only the system's role tokens:

- **Primary** (`--ink` ground, `--paper` glyph): the current thing only. That
  is the open component's head tile, the current group in the sidebar, the
  anatomy pins, and the active group tile's outline on the index.
- **Secondary** (`--stone` ground, `--ink-2` glyph): every other icon tile,
  including group tiles, section-heading tiles and prop kind badges.
- **Success and fail** (`--ok`, `--danger`): only for states that mean
  something. That covers the do and don't figures, the server-component fact
  chip, and the checks under "Ships".

The `chroma` chart palette stays for charts and is not used in the site's
chrome.

## Choice

**Round 4, revised.** Henry approved it on 2026-11-19.

How it landed in `apps/docs`, and where it departs from the mock:

- **Theme.** A first visit opens in a new "Docs" preset: Workbench's linen,
  warm ink, grotesk, quiet voice and pill controls, with the accent at ink
  instead of ember. Two things decided against ember:
  - The axe suite failed eight pages on it. An example's 11px label sat at
    3.26:1 on an ember fill.
  - Ember turned tabs, checkboxes and preview toggles orange, which ran
    against the "role colours only" rule above.

  The pre-paint script carries the preset inline as `initial`, and
  `theme-axes.test.ts` holds that equal to `SITE_PRESET`. Workbench itself
  stays in the panel unchanged. Reset still means "no attributes", which is
  the White Reset. The preset's pill controls needed a `controls` axis
  (`fitted` / `pill`) in the theme panel. The CSS already defined it, and the
  docs had never offered it.
- **Type.** `--text-micro`, `caption`, `meta`, `body`, `lede` and `title`
  live in `globals.css` `@theme`. None of the views or chrome sets a font size
  of its own any more. `examples/` and `templates/` keep their literals,
  because readers copy that code into apps that do not have these utilities.
  Body text is 16px at `--body-weight`.
- **Masthead.** It is a full-width band holding the brand and version, the
  four sections as an icon segmented control, a filled search field, and a
  tool capsule. On a phone the sections become icon tabs inside the masthead,
  replacing the second sticky strip.
- **Rail.** Every group is unrolled under an icon tile, and the group holding
  the open page has the ink tile.
- **Component page.**
  - The head has a group tile, the trail and fact chips.
  - An "At a glance" row shows keycaps, prop names and the first
    accessibility promise.
  - The examples now come first.
  - Do and don't are cards with a state edge.
  - Anatomy rows are numbered.
  - Section headings and the contents rail share glyphs.
- **Components index.** A tile per group comes first, with its glyph, count
  and first names.

Not built from the mock, because the catalogue has no data for them:

- The per-component "emphasis" and "sizes" visualisations.
- The do/don't figures with rendered examples (the practices are text).
- The anatomy pin diagram (there are no part coordinates).
- The phone's floating section bar, because the masthead tabs already cover
  the sections. Each of these would need a new catalogue field first.
