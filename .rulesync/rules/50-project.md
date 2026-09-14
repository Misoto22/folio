---
root: true
targets: ["agentsmd"]
description: Project-owned rules for the Folio design system
scope: project
---

# @misoto22/folio

- **[DESIGN-ARCH-001] MUST — Keep primitives reusable.** Tokens and components may serve the public site and admin console but must not absorb either host's routes, data access, or business logic.
- **[DESIGN-TOKEN-001] MUST — Preserve token ownership.** Change the canonical CSS and TypeScript token sources, then rebuild exported CSS and package artifacts instead of editing `dist/`.
- **[DESIGN-API-001] MUST — Treat exports as consumer contracts.** Review public exports, CSS entry points, peer dependencies, and accessible behavior before changing a primitive.
- **[DESIGN-CHANGELOG-001] MUST — Lead a changeset with its entry.** Write the changelog entry as a changeset's first paragraph — one sentence, under 160 characters — and put the reasoning below a blank line, where the documentation site folds it away.
- **[DESIGN-I18N-001] MUST — Ship a changeset's Chinese with it.** Translate a changeset's sentences into `apps/docs/src/i18n/changelog.ts` in the pull request that writes the changeset, not in the release that publishes it.
- **[DESIGN-TEST-001] MUST — Run package gates.** Use `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` for affected code and output.
- **[DESIGN-SYNC-001] MUST — Keep Claude Design sync interactive.** Use the documented skill only after local verification; do not move credentials or interactive approval into CI.
