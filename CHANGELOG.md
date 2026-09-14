# Changelog

`@misoto22/folio` follows [Semantic Versioning](https://semver.org). Entries
below 1.0.0 are the pre-release history, written by hand; from the first
changeset-driven release onward this file is assembled from the changesets that
shipped with each change.

## 0.1.0 — 2026-09-05

The first release that matches the site it was extracted from.

### Changed

- **Re-ported the token layer to the White Reset.** The package had been
  shipping the retired warm-cream theme — oklch surfaces, an 8/12/18px radius
  scale, a blurred elevation ramp. Anything built against it was off-brand by
  construction.
- **Split tokens from semantics.** `tokens.css` holds primitives, `semantic.css`
  holds roles, and a component reads only roles — which is what makes dark mode
  a value swap rather than a second palette.
- **Swapped the faces** to Hanken Grotesk, Newsreader and IBM Plex Mono,
  vendored by a script that owns the weight list.

### Added

- Fourteen primitives: `Skeleton`, `Progress`, `Alert`, `Tooltip`, `Table`,
  `Breadcrumb`, `Pagination`, `Accordion`, `RadioGroup`, `Avatar`, `Separator`,
  `Kbd`, `LinkArrow`, `FigureBand`.
- `cn` — the class merger every component now ends its class list with.
- `CONTROL_BASE` / `CONTROL_BORDER` / `isInvalid` — the shared text-control look.
- A documentation site at [ui.misoto22.com](https://ui.misoto22.com), generated
  from the package's own source.

### Fixed

- **Font stacks collapsed to the system font outside a `next/font` host.**
  `var(--font-hanken)` with no fallback is invalid at computed-value time, and
  IACVT discards the whole declaration rather than the one term.
- **Every `hover:shadow-(--shadow)` was inert.** The token resolves to `none`,
  so those hover states had been invisible while still costing a transition.
- **A caller's `className` did not reliably override.** `clsx` emits both sides
  of a conflict and lets stylesheet order decide; `cn` merges by utility group.
- **`Field` announced nothing without an explicit `htmlFor`.** The message id
  was derived from it, so the hint rendered and was never read aloud.
- **`NavItem asChild` rendered nothing when `icon` was omitted** — two children
  reached a Slot that permits one.
- **Input, Textarea and Select had drifted apart** on focus and disabled
  treatment, each carrying its own copy of the control class string.
- `Spinner` was an accent ring on a system whose accent is ink.
