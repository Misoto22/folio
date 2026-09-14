# @misoto22/folio — for agents

Pointers, not content. Everything below is generated from the source in this
same tarball, so nothing here can describe a version that is not installed.

## You have installed this package

You are probably reading this because you searched `node_modules` for a filename
you recognise. The three commands are what you came for:

```bash
npx @misoto22/folio docs Button        # one component, in full
npx @misoto22/folio docs --installed   # this version, and every component in it
npx @misoto22/folio init --agents-md   # install the skill into this project
```

`docs` resolves parts and types as well as components, so `docs CardBody`,
`docs TH` and `docs ButtonVariant` all land on the right file. When an import
fails, ask it about the identifier you tried.

Read `skills/folio-design/SKILL.md` in this package before writing components
against it. The names diverge from shadcn/ui in several places, and colour is
never written as a raw class; the skill leads with both.

`init` writes it to `.agents/skills/` — the path Codex, Cursor, Copilot, Gemini
CLI, OpenCode, Cline, Zed and Warp share — and to `.claude/skills/` when the
project already has one. For anything else, `npx skills add
Misoto22/folio` finds this skill with no configuration.

Some misuse fails silently, so the components say so in development:
`FIELD_CONTROL_NOT_LABELLABLE` when a wrapper takes the label instead of the
control, `BUTTON_ICON_ONLY_UNNAMED` when an icon-only button has no accessible
name, `REQUIRED_NAME_BLANK` when a required name is an empty string. Each prints
the field and an imperative fix, once per problem, and none reaches a production
bundle.

Nineteen codes in all. Eight on the primitives —
`ARTICLE_HTML_AND_CHILDREN`, `BREADCRUMB_CRUMB_NOT_LINKED`,
`BUTTON_ICON_ONLY_UNNAMED`, `DIALOG_TITLE_MISSING`,
`FIELD_CONTROL_NOT_LABELLABLE`, `FIELD_CONTROL_NOT_WIRED`,
`REQUIRED_NAME_BLANK`, `SEARCHABLE_MENU_LABEL_UNREADABLE`. Five on `Diagram`,
which checks the spec it was handed because a figure that ignores an edge still
renders beautifully — `DIAGRAM_ACCENT_ON_CONTAINER`, `DIAGRAM_DIRECTION_ON_LEAF`,
`DIAGRAM_DUPLICATE_ID`, `DIAGRAM_EDGE_NOT_ADJACENT`,
`DIAGRAM_EDGE_UNKNOWN_NODE`. And six on the figures in
`@misoto22/folio/diagrams` — `DIAGRAM_CELL_COLLISION`, `DIAGRAM_EDGE_DANGLING`,
`DIAGRAM_LANE_UNKNOWN`, `DIAGRAM_REF_UNKNOWN`, `DIAGRAM_SPEC_MUTATED`,
`DIAGRAM_STAGE_OUT_OF_RANGE`. `skills/folio-design/rules/a11y.md` tables what
each one fires on; `src/lib/warn.ts` is where they are printed.

Four entry points, and importing from the wrong one throws rather than renders
blank. Each `docs` file names its own on the `Import:` line.

| Specifier | What ships from it |
| --- | --- |
| `@misoto22/folio` | The primitives |
| `@misoto22/folio/charts` | Charts — needs the `recharts` and `motion` peers |
| `@misoto22/folio/diagrams` | Figures with routed edges |
| `@misoto22/folio/website` | Website compositions, with data and routes supplied by the host — styled by `website.css`, which `styles.css` does not include |

## You are working ON this package, in its repository

The repository root `AGENTS.md` still applies in full — this file is additive,
not a replacement, and the Harness rules there (`HAR-*`, `DESIGN-*`) govern this
directory as much as any other. Read it first.

What is specific to here:

- **`dist/` is generated.** `dist/agent/**` included — it is written by
  `scripts/emit-agent.mjs` at build time. Edit the source, then rebuild.
- **`agent/catalog.mjs` is the one hand-written description** of what each
  component IS: its group, summary, when to reach for it, accessibility
  promises and keyboard contract. Everything mechanical is parsed out of
  `src/**` by `scripts/extract-props.mjs`. `src/__tests__/catalog.test.ts`
  fails when the two disagree.
- **The skill is tested.** `src/__tests__/skill.test.ts` asserts every claim in
  `skills/` against the extracted source, in both directions — an identifier the
  rules tell an agent to write must exist, and one they say to avoid must not.
  Renaming an export without updating the rules fails the build, on purpose.
- **Gates:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build`, from the
  repository root.

## On the web

`https://ui.misoto22.com` — and `/llms.txt`, `/llms-full.txt`, and
`/components/<slug>/llms.txt` for the same content without the CSS. Prefer the
CLI above when the package is installed: it is version-locked and needs no
network.
