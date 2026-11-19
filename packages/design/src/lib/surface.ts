/**
 * The system's materials: what a surface is MADE of, named once.
 *
 * The tokens already said this — `--panel-bg`, `--panel-border`,
 * `--panel-lift` and `--panel-filter` in tokens.css, re-valued by the glass
 * theme — but the four were only ever assembled at the call site. Seven
 * components each typed the same four classes, so a fifth ingredient (or a
 * component that forgot one) would have been a seven-file hunt. Same reason
 * `CONTROL_BASE` exists for fields: one export, every consumer.
 *
 * A material is colour, edge, depth and backdrop. Shape is deliberately NOT in
 * it: a dialog takes `--radius-lg`, a sheet is square against the viewport
 * edge, and a tooltip takes `--radius`, all in the same material. The border
 * WIDTH stays at the call site for the same reason — a sheet draws one edge,
 * a menu draws four.
 *
 * Kept as Tailwind class strings rather than an `@utility`, because a consumer
 * that compiles its own Tailwind over `dist/` (the site does) only receives
 * utilities whose CSS it can generate from a scanned candidate. An `@utility`
 * declared in this package's entry stylesheet would be a bare, unstyled class
 * there; these strings expand to arbitrary-property utilities any Tailwind v4
 * build can produce, and `twMerge` still lets a caller override one part.
 *
 * Three strengths, from quiet to loud:
 *
 *   SURFACE_PANEL_QUIET — chrome that floats over a CANVAS rather than over
 *                     the page: a diagram's toolbar, minimap, inspector. The
 *                     panel's ground, edge and backdrop without its lift,
 *                     because a toolbar pinned inside a figure is not stacked
 *                     above anything the reader has to look past.
 *   SURFACE_PANEL   — floats OVER the page: dialog, sheet, popover, menu,
 *                     select, palette. Raised by the hard two-step offset and,
 *                     under a glass theme, the only surface allowed to blur.
 *   SURFACE_FEATURE — the reversed plate: one per view at most (Card
 *                     variant="plate", the tooltip). Carries its own text
 *                     colour, because ink on a reversed ground is unreadable.
 *
 * The page ground itself (`bg-(--paper)`) and the field (`CONTROL_BASE`) are
 * the two materials below these and need no constant here.
 */
export const SURFACE_PANEL_QUIET = 'border-(--panel-border) bg-(--panel-bg) panel-blur'

export const SURFACE_PANEL = `${SURFACE_PANEL_QUIET} shadow-(--panel-lift)`

export const SURFACE_FEATURE = 'bg-(--feature-surface) text-(--on-feature)'
