---
'@misoto22/folio': minor
---

`@misoto22/design` is now `@misoto22/folio`, and classes, `data-` attributes and custom properties move from `m22-` to `folio-`.

Every component, prop, token and entry point is unchanged; only the names below move. `@misoto22/design` receives no further releases, so upgrading is swapping the dependency and replacing the old names in imports, stylesheets and selectors.

| Before | After |
|---|---|
| `@misoto22/design`, `@misoto22/design/charts`, `@misoto22/design/styles.css` … | `@misoto22/folio`, `@misoto22/folio/charts`, `@misoto22/folio/styles.css` … |
| `npx misoto22-design docs Button` | `npx @misoto22/folio docs Button` |
| the `misoto22-design` bin | `folio-design` |
| `skills/misoto22-design/` | `skills/folio-design/` |
| `.m22-*` classes and `m22-*` keyframes | `.folio-*` and `folio-*` |
| `data-m22-animated`, `data-m22-article`, `data-m22-menu` | `data-folio-animated`, `data-folio-article`, `data-folio-menu` |
| `--m22-media-aspect`, `--m22-media-max-block` | `--folio-media-aspect`, `--folio-media-max-block` |
| the `m22:palette` event | `folio:palette` |

`npx @misoto22/folio init` moves a skill an earlier version installed at `.agents/skills/misoto22-design` or `.claude/skills/misoto22-design` to `folio-design`, and rewrites the section `--agents-md` wrote into `AGENTS.md`, so a project is not left with two copies of the skill or with instructions naming a bin that is gone.

`folio` on npm is another package that ships a `folio` command, so the bin and the skill are `folio-design`, and the documentation runs the CLI as `npx @misoto22/folio` rather than by a bare name `npx` would resolve to someone else's package.
