---
name: folio-design
description: Builds UI with @misoto22/folio — a monochrome design system of CSS tokens and 83 accessible React primitives, charts and diagrams included. Use when a project imports '@misoto22/folio', '@misoto22/folio/charts' '@misoto22/folio/diagrams' or '@misoto22/folio/website', sets data-mode / data-surface / data-radius / data-density, or uses cn(), CONTROL_BASE, or isInvalid. Also applies when adding a component, theming, plotting data, drawing an architecture, workflow, sequence, data-flow or lifecycle diagram, or fixing a form, table, dialog, or toast in such a project.
allowed-tools: Bash(npx folio-design *), Bash(pnpm exec folio-design *), Bash(bunx folio-design *)
---

# @misoto22/folio

CSS tokens plus React 19 primitives. Components ship compiled — you import them,
you do not copy them into the project.

```tsx
import { Button, Field, Input } from '@misoto22/folio'
import '@misoto22/folio/styles.css'
```

## Four entry points

The root entry has no dependencies a consumer has to install. Two groups live
behind their own specifier instead, each for weight the root should not carry:

```tsx
import { AreaChart, BarList, BigNumber } from '@misoto22/folio/charts'
import { ArchitectureFigure, DiagramCanvas } from '@misoto22/folio/diagrams'
import { SiteShell, Portfolio, CollectionIntro, SearchPalette } from '@misoto22/folio/website'
```

Charts need a rendering engine and an animation runtime that nothing else in
the package does:

```bash
pnpm add recharts motion      # optional peers, only for the charts entry
```

That separation is the reason an app that renders a Badge never resolves
`recharts` — so importing a chart from the root specifier does not render a
blank component, it throws. `docs <Component>` prints the right line for each
one; the `Import:` header is derived from the tree the component lives in, not
written by hand.

Some of the charts need no engine at all — `Heatmap` is a `<table>`,
`Sparkline` is one `<path>`, `BarList`, `BigNumber` and `BulletChart` are plain
HTML — but they ship from the charts entry all the same, so the boundary stays
one line rather than a list to memorise.

Diagrams need no peer at all; they carry an orthogonal routing engine instead,
which has no business in a bundle that renders a Badge. Reach for that entry
when the task is to DRAW a system rather than to build a screen:
`ArchitectureFigure` for what talks to what, `WorkflowFigure` for a process in
lanes, `SequenceFigure` for a call chain over time, `DataflowFigure` for a
pipeline, `LifecycleFigure` for a state machine. Each takes a typed JSON
specification and renders on a server. `Diagram` is a different thing and stays
on the root: a nesting CSS diagram for an article, not an SVG figure with
routed edges.

One more, for surfaces that cannot read a custom property — an OpenGraph card, a
`theme-color`, a canvas:

```ts
import { TOKENS } from '@misoto22/folio/tokens'
```

Never for styling a component. A literal in a stylesheet is a value that stops
following the theme, and every one of these mirrors a token that does.

## What this project has installed

```
!`npx folio-design docs --installed`
```

That is the version resolved in this project and every component it ships. Get
one component's full contract — every prop with its type and default, its
exported unions, its keyboard map, its accessibility promises, its examples —
with:

```bash
npx folio-design docs Button
```

Run that before writing against a component you have not used in this session.
The median component is ~500 tokens and the largest is ~1,300, against far more
for all eighty-three. It is generated from the installed source, so it cannot be
out of date the way the website can — and each file names the specifier it
ships from on its `Import:` line, which is the half that matters below.

It also resolves parts and types, not just components: `docs CardBody`,
`docs TH` and `docs ButtonVariant` all land on the right file. When an import
fails, ask it about the identifier you tried.

## The one thing to internalise

**This is not shadcn/ui, and the names differ where it matters most.** A model
writing from habit produces imports that do not exist. The full table is in
[naming.md](./rules/naming.md); these four are the ones that come up every time:

| Habit | Here |
| --- | --- |
| `CardContent` | **`CardBody`** |
| `TableHeader` / `TableBody` / `TableRow` / `TableHead` / `TableCell` | **`THead` / `TBody` / `TR` / `TH` / `TD`** |
| `<DialogTitle>` as a child | **`<DialogContent title="…">`** — a prop, not a child |
| `<AlertTitle>` / `<AlertDescription>` | **`<Alert tone title="…">`** — props, not children |

## Critical rules

Always enforced. Each links to a file with Incorrect/Correct pairs — read it when
you are about to do that thing, not before.

### Colour and theming → [tokens.md](./rules/tokens.md)

- **Never write a raw colour.** No `bg-neutral-900`, no `text-gray-500`, no hex.
  Read the semantic layer: `bg-(--background)`, `text-(--foreground-muted)`,
  `border-(--border-color)`.
- **Never write a `dark:` variant.** Dark mode is a value swap behind
  `data-mode="dark"`; a `dark:` override fights it and wins in only one theme.
- **Theme with the `data-*` axes**, set on any element, not just `:root`.
  `data-mode`, `data-accent`, `data-surface`, `data-radius`, `data-rules`,
  `data-type`, `data-motion`, `data-density`, `data-table-density`,
  `data-chart-palette`. `npx folio-design docs --installed` prints the
  current list; it is read out of the stylesheets rather than kept by hand here.
- **Durations and radii come from tokens.** `duration-(--duration-fast)`,
  `rounded-(--radius)` — not `duration-150`, not `rounded-lg`.
- **No blurred shadow.** `--shadow*` resolves to `none` on purpose. Depth is a
  hairline, a change of ground, or `--lift`.

### Composition → [composition.md](./rules/composition.md)

- **`className` adjusts layout, never appearance.** Margin, width, grid
  placement — yes. Colour, border, radius, font — no; that is what the props and
  the axes are for.
- **Use `cn()` for conditional classes.** It is exported. Plain template
  literals emit both sides of a Tailwind conflict and let stylesheet order pick
  the winner.
- **Card uses the full set.** `Card` → `CardHeader` / `CardTitle` / `CardBody` /
  `CardFooter`. Do not dump everything into one div.
- **`Select` is one component, not a compound.** It takes `label`, `placeholder`
  and `SelectItem` children. There is no `SelectTrigger` or `SelectValue`.
- **Logical properties, always.** `ps-` / `pe-` / `start-` / `end-` /
  `text-start`. The package is RTL-correct and a physical property breaks it.

### Forms → [forms.md](./rules/forms.md)

- **A labelled control is a `Field`.** `<Field label hint error required>` wraps
  one control and wires `aria-describedby`, `aria-required` and `aria-invalid`
  onto it. Never hand-roll `<label>` + input + error div.
- **Errors go in `Field`'s `error` prop.** It replaces `hint` — they are one
  slot, not two stacked messages — and it sets `aria-invalid` on the control for
  you, so do not also pass `invalid`.
- **Outside a `Field`, invalid state is `invalid` or `aria-invalid`** on the
  control. Never a red border class.
- **One control per `Field`.** The wiring clones a single element child; a
  wrapper div around two controls silently wires nothing.
- **Build custom controls on `CONTROL_BASE` + `CONTROL_BORDER`** and read the
  state with `isInvalid()`. All three are exported.

### Accessibility → [a11y.md](./rules/a11y.md)

- **Four props are required by the type because forgetting them ships an
  unusable control**: `Table.caption`, `Progress.label`, `Avatar.alt`,
  `FloatingIconButton.label`. `Select.label` and `Badge.children` too.
- **`<Button iconOnly>` needs `aria-label`.** There is no text to read.
- **Decoration is `aria-hidden`.** A status dot beside the word "Available"
  repeats it.
- **Colour is never the only carrier** of a status. Every tone is doubled by an
  icon or by the words.

### Imports

- **`toast` comes from `@misoto22/folio`, not from `sonner`.** Render `<Toaster />`
  once at the app root.
- **Styles are a separate import.** `@misoto22/folio/styles.css` for the whole
  compiled sheet, or `tokens.css` + `semantic.css` + `keyframes.css` when the app
  compiles its own Tailwind. Compositions from `@misoto22/folio/website` also
  need `website.css`, plus `website-base.css` when the whole page is a website.

## Key patterns

```tsx
// A labelled, validated field. Field does the ARIA wiring, including
// aria-invalid — do not also pass `invalid` on the control.
<Field label="Email" required error={errors.email}>
  <Input type="email" />
</Field>

// A select. One component; label is required.
<Select label="Region" placeholder="Choose one">
  <SelectItem value="au">Australia</SelectItem>
</Select>

// A dialog. The title is a prop, and it is not optional for a screen reader.
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent title="Delete project" description="This cannot be undone.">
    <Button variant="danger">Delete</Button>
  </DialogContent>
</Dialog>

// A table. caption is required; it is what a screen reader announces.
<Table caption="Open invoices" borders="rows">
  <THead><TR><TH>Client</TH><TH align="end">Amount</TH></TR></THead>
  <TBody><TR><TD>Acme</TD><TD align="end">$1,200</TD></TR></TBody>
</Table>

// Colour: semantic tokens, no raw values, no dark: variant.
<div className="bg-(--card-background) text-(--foreground-muted)">  // correct
<div className="bg-white text-gray-500 dark:bg-neutral-900">        // wrong

// Theming: an axis on any element themes the subtree below it.
<section data-surface="warm" data-radius="round">…</section>
```

## Variants, in full

Short enough to inline; everything else comes from `docs <Component>`.

Every union is exported under the name in brackets, so a wrapper can take one
without retyping it.

- `Button` — `variant` [`ButtonVariant`]: `primary` `secondary` `ghost` `danger` · `size` [`ButtonSize`]: `sm` `md` `lg` · also `href`, `asChild`, `loading`, `iconOnly`, `keycap`
- `Badge` — `tone` [`BadgeTone`]: `neutral` `success` `warning` `danger` `outline`
- `Alert` — `tone` [`AlertTone`]: `info` `success` `warning` `danger`
- `Card` — `variant`: `outline` `plate` `flat`
- `Table` — `borders` [`TableBorders`]: `rows` `grid` `bordered` `bordered-grid` `none` · `density`: `comfortable` `compact`
- `TH` / `TD` — `align` [`TableAlign`]: `start` `center` `end`

For metadata and Node build scripts, `import { BRAND } from '@misoto22/folio/brand'`
loads the canonical color mirror without React. This is a data-only subpath,
separate from the four React entry points above.
