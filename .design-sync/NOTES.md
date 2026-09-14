# design-sync notes — @misoto22/folio

Repo-specific gotchas for future syncs.

## Layout (changed 2026-09-05)
- The repository is a pnpm monorepo: the package is `packages/design`, and `apps/docs` is the documentation site published at https://ui.misoto22.com. Root scripts fan out (`pnpm build:design`, `pnpm build:docs`).
- **The docs site is now the primary showcase.** It renders every component from a live example file and parses the prop tables straight out of the package's source, so it cannot fall behind the way a hand-kept gallery does. The design-sync previews below remain the surface for claude.ai/design specifically.

## Build
- The package builds with `pnpm build:design` = fonts, then `tsup` (JS+dts), then Tailwind CLI (CSS). The DS entry is `packages/design/dist/index.js`.
- tsup uses **`bundle: false`** (+ `esbuild-fix-imports-plugin`) on purpose: bundling/splitting strips `'use client'` directives, which breaks RSC consumers. Don't switch to bundled output.
- `tsconfig.json` needs `"ignoreDeprecations": "6.0"` (TS 6.0 + tsup dts trips on `baseUrl`).
- `pnpm-workspace.yaml` `allowBuilds` must list esbuild / @tailwindcss/oxide / @parcel/watcher or installs skip native build scripts.

## Fonts (changed 2026-09-05)
- The faces are now **Hanken Grotesk / Newsreader / IBM Plex Mono**, matching the White Reset. The previous trio (Geist / Cormorant Garamond / JetBrains Mono) belonged to the retired warm-cream theme.
- `scripts/vendor-fonts.mjs` copies the latin woff2 out of `@fontsource/*` into `src/styles/fonts/` and REGENERATES `src/styles/fonts.css`. The weight list lives in that script and nowhere else, so a rule can no longer point at a file nobody vendored. Re-run with `pnpm --filter @misoto22/folio build:fonts`.
- `dist/styles.css` now carries the @font-face rules itself (appended by `scripts/copy-portable-css.mjs`), so a standalone consumer gets the faces from the one stylesheet. An app that loads them through `next/font` sets `--font-hanken` / `--font-newsreader` / `--font-plex-mono` and never reaches the fallback.

## Render / previews
- Playwright pinned to **1.59.1** in `.ds-sync` to match the already-cached chromium build **1217** (`~/Library/Caches/ms-playwright`) — avoids a ~100MB download. 1.60.x wants build 1223 (not cached).
- **Toaster** ships as a FLOOR CARD on purpose: sonner renders nothing until a `toast()` call, so it can't render statically. Authorable later only with a mount-time toast + capture-timing hack.
- **FloatingIconButton** is `position: fixed`; its preview frames it in a `transform: translateZ(0)` box so the fixed button anchors inside the card (a transform establishes a containing block for fixed descendants). Without that the card is blank.
- Overlay/full-page components use `cfg.overrides.<Name>.cardMode` + `viewport` so their open/large state renders inside the card: ErrorState (column), Dialog, DropdownMenu, AppShell, FloatingIconButton (single + sized viewport).
- 15 compound sub-parts (CardHeader/Body/Footer/Title, Dialog*/DropdownMenu*/Tabs* parts) are floor cards — used via their parent's composition, which IS authored. Authorable on any re-sync.

## Known render warns
- None as of the first sync (render check clean: 0 bad/blank/thin).

## Re-sync risks
- **Token drift**: `src/styles/tokens.css` + `semantic.css` now carry the White Reset, re-ported from `misoto22-site` on 2026-09-05 (the package had been shipping the retired warm-cream theme). `brand.ts` is checked against the CSS by `tokens/brand.test.ts`, so THAT half can no longer drift silently. The link to the site is still manual — if the site's theme changes, re-port.
- **Preview backlog**: the previews cover the original 22 components. The 14 added on 2026-09-05 (Kbd, Avatar, LinkArrow, Separator, FigureBand, Skeleton, Progress, Alert, Table, Breadcrumb, Pagination, Tooltip, Accordion, RadioGroup) have live examples in `apps/docs/src/examples` but no design-sync preview yet.
- **Floor-card backlog**: Toaster + the 15 sub-parts are the standing offer for incremental preview authoring.
- **Playwright/chromium**: the 1.59.1↔build-1217 pairing depends on the local browser cache; a cache cleanup needs re-resolving the version (see Render section).
- **Fonts**: only the latin subset + a few weights are shipped (Geist 400/500/600, Cormorant 300–600, JetBrains Mono 400/500). Wider coverage needs more woff2 in `src/styles/fonts/` + `fonts.css` rules.
