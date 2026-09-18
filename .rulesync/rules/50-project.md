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
- **[DESIGN-CHANGELOG-002] MUST — Write the pull-request title as the changelog entry.** Title every pull request as a Conventional Commit whose description reads as its changelog entry — lowercase, imperative, and about what changed rather than the diff — because release-please writes the entry from the squash-merged title.
- **[DESIGN-I18N-002] SHOULD — Translate released changelog entries after they ship.** After a release ships, add the Chinese for its new changelog entries to `apps/docs/src/i18n/changelog.ts`, keyed by the fingerprint of the English; until then the Chinese page shows those entries in English.
- **[DESIGN-TEST-001] MUST — Run package gates.** Use `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` for affected code and output.
- **[DESIGN-SYNC-001] MUST — Keep Claude Design sync interactive.** Use the documented skill only after local verification; do not move credentials or interactive approval into CI.
