# @misoto22/design

A monochrome design system for software, writing and photography: portable CSS
tokens and accessible React 19 primitives. Paper ground, near-black mark, and
status is the only chroma in the file.

Components ship compiled — you import them, you do not copy them into your
project.

**[ui.misoto22.com](https://ui.misoto22.com)** · [Changelog](./CHANGELOG.md)

## Install

```bash
npm install @misoto22/design
```

```tsx
import { Button, Field, Input } from '@misoto22/design'
import '@misoto22/design/styles.css'
```

`styles.css` is the whole compiled sheet — tokens, roles, themes, motion and
the vendored faces. An app that compiles its own Tailwind can take the portable
layers instead:

```tsx
import '@misoto22/design/tokens.css'    // primitives, plus data-mode and data-density
import '@misoto22/design/semantic.css'  // roles
import '@misoto22/design/themes.css'    // the other six theming axes
import '@misoto22/design/keyframes.css' // motion
```

All four, or the theming table below is a table of attributes that do nothing.
`data-mode` and `data-density` are declared in `tokens.css`; every other axis
lives only in `themes.css`, and an app that skips it writes `data-radius="sharp"`
and gets no error, no warning, and no corner. Two more layers are opt-in rather
than missing: `@misoto22/design/fonts.css` carries the vendored faces, and
`@misoto22/design/article.css` styles long-form prose.

Diagrams ship from their own specifier, so a page that renders a `Badge` does
not pay for a routing engine:

```tsx
import { ArchitectureFigure, DiagramCanvas } from '@misoto22/design/diagrams'
import { SiteShell, Portfolio, CollectionIntro, SearchPalette } from '@misoto22/design/website'
```

Five server-rendered figures — architecture, workflow, sequence, data-flow and
lifecycle — plus the chrome to explore one. They read the JSON schemas
published by [archify](https://github.com/tt-a1i/archify), so a specification
authored for that tool renders here with no translation step.

## Theming

Eight independent axes, each an attribute, each working on **any** element
rather than only on the root. An unset axis is the default.

| Attribute | Values |
| --- | --- |
| `data-mode` | `light` `dark` |
| `data-surface` | `warm` `cool` `glass` |
| `data-radius` | `sharp` `round` |
| `data-rules` | `quiet` `firm` |
| `data-type` | `grotesk` `bookish` |
| `data-motion` | `still` `snappy` |
| `data-density` | `compact` |
| `data-chart-palette` | `chroma` |

```tsx
<section data-surface="warm" data-radius="sharp">…</section>
```

No component reads any of them, and none of them introduces a token. To
re-accent the system, re-point one custom property:

```css
:root { --accent: var(--ok); }
```

## For agents

This package is documented for the reader that installed it, not only for the
one that can open a browser — and the two need different things. Everything
below is generated from the source in this same tarball, so it describes the
version you actually have rather than whatever the website shipped last.

**One component, in full** — every prop with its type and default, the exported
unions, the keyboard contract, the accessibility promises, the examples:

```bash
npx misoto22-design docs Button
```

The median component is about 500 tokens. It resolves parts and types too, so
`docs CardBody`, `docs TH` and `docs ButtonVariant` all land on the right file —
useful when an import just failed.

**What is installed here**, as a few hundred tokens rather than fifty prop
tables:

```bash
npx misoto22-design docs --installed
```

**Install the skill** into your project, so a coding agent picks up the
conventions without being told each time:

```bash
npx misoto22-design init --agents-md
```

That writes the skill to `.agents/skills/` — the path Codex, Cursor, GitHub
Copilot, Gemini CLI, OpenCode, Cline, Zed and Warp all read — and to
`.claude/skills/` as well when the project already has a `.claude/`. Use
`--agent agents` or `--agent claude` to pick one. For any other agent,
[`skills`](https://github.com/vercel-labs/skills) covers around seventy of them
and finds this one without any configuration:

```bash
npx skills add Misoto22/misoto22-design
```

The skill is progressive: its name and description are about 110 tokens and are
all that sits in a session until something actually touches this package. The
body is around 2,200, and the five rule files load one at a time, only when the
work reaches them.

An agent that explores `node_modules` by filename rather than by command finds
`AGENTS.md`, `CLAUDE.md` and `llms.txt` at the package root. They are pointers
to the above and nothing else, so they cannot go stale between releases.

The names diverge from shadcn/ui in a handful of places that a model writing
from habit gets wrong — `CardBody` not `CardContent`, `THead`/`TBody`/`TR`/`TH`/`TD`
not `TableHeader`/…, and `title` as a prop on `DialogContent` rather than a
`DialogTitle` child. The skill leads with that table, and
`src/__tests__/skill.test.ts` fails the build if any of it stops being true.

On the web, the same content is at
[`/llms.txt`](https://ui.misoto22.com/llms.txt) (index),
[`/llms-full.txt`](https://ui.misoto22.com/llms-full.txt) (everything inline),
and `/components/<slug>/llms.txt` (one component).

### It tells you when you get it wrong

Some ways of misusing a component fail silently — a `Field` whose child is a
wrapper wires the label onto the box, an icon-only `Button` with no accessible
name renders perfectly and is invisible to a screen reader. Development warns on
those where it happens, with a stable code, the offending field and an
imperative fix:

```
[@misoto22/design] FIELD_CONTROL_NOT_LABELLABLE
  Field's child is a <div>, which cannot take a label — so the id,
  aria-describedby, aria-required and aria-invalid were applied to it rather
  than to a control.
  field: children
  fix:   Put the control itself directly inside Field, with no wrapper. For a
         row of controls, give each its own Field and lay them out around it.
  docs:  npx misoto22-design docs Field
```

Every call site is behind `process.env.NODE_ENV`, so none of it reaches a
production bundle.

## Accessibility

Every component is tested against `axe-core` best-practice rules, keyboard
contracts are asserted key by key, and a prop that is required for
accessibility is required in the type — `Table.caption`, `Progress.label`,
`Avatar.alt`, `FloatingIconButton.label`. If it can be forgotten, it will be.

Logical properties throughout, so the system is RTL-correct; motion is gated
behind `prefers-reduced-motion`.

## Requirements

React 19, Node 24+. ESM only.

## Licence

MIT © Henry Chen

## Website compositions

Import page composition families from `@misoto22/design/website`. They include
navigation, portfolios, content collections, reading layouts, media browsing,
contact forms, listening views, metrics, search and conversations. Pass localized
labels, router link elements and plain view data; keep backend requests, routing
and authentication in the application.

`styles.css` does not include these compositions, so an application that renders
only the primitives receives none of their rules. Import `website.css` beside it —
or beside the portable token, semantic, theme and keyframe layers in an
application that already builds Tailwind, scanning the package's `dist`
directory. A host whose whole page is a website also imports `website-base.css`,
which sets the body type, heading and paragraph margins and a site-wide focus
ring; an application that embeds a composition in its own chrome leaves it out.

```tsx
import '@misoto22/design/styles.css'
import '@misoto22/design/website.css'
import '@misoto22/design/website-base.css' // only when the whole page is a website
```

`npx misoto22-design docs SiteShell` and `docs SearchPalette` explain the contracts.

For metadata and build scripts, `import { BRAND } from '@misoto22/design/brand'`
loads the token mirror without loading React components. This data-only entry
also supports Node's native ESM loading from CommonJS on the supported Node versions.
