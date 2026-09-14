# The documentation site

`apps/docs` is a Next.js app exported statically to Cloudflare Pages. Almost
everything it says about the package is read out of the package, so the two
cannot disagree.

## What is generated, and from what

| Output | Read from | Why not hand-written |
|---|---|---|
| `props.json` | the components' TypeScript AST | a hand-kept prop table is how a docs site starts lying — someone adds a prop and the table still lists four |
| `tokens.json` | `@misoto22/folio/tokens` | the package emits it; the site parsing the CSS a second time meant the two could disagree, and the site is the one people believe |
| `examples.json` | `src/examples/**/*.tsx` | the page renders the module and the code block is read from the same file, so a preview cannot drift from the code beneath it |
| `templates.json` | `src/templates/*.tsx` | same trick, for whole screens |
| `changelog.json` | the repository's `CHANGELOG.md` | two lists of what changed disagree within two releases |

The hand-written parts are `src/content/registry.ts` (grouping, summaries,
accessibility promises, keyboard tables) and `src/i18n/content.ts` (the Chinese
for all of it). `registry.test.ts` fails the build when either falls out of step
with what the package ships.

## Locales

- English: no prefix — `/components/button/`
- Chinese: `/zh/components/button/`

`src/views/*` holds each page's body and takes a `locale`; `src/app/**` and
`src/app/zh/**` are thin route files that pass it. Client components read the
locale off the pathname instead, because threading a prop through the chrome to
reach a search box is worse than one hook.

`src/i18n/messages.ts` types the Chinese catalogue off the English one, so a
missing key is a compile error rather than a blank on a page. `content.ts` holds
the translated editorial layer and falls back to English for anything absent.

**The API reference stays in English on purpose.** Prop descriptions, the Notes
section and type signatures come from the package source; a translation would be
a second copy that drifts the first time a doc comment is edited. Chinese pages
carry a line saying so.

## Testing

| Suite | Runs in | Answers |
|---|---|---|
| `src/content/__tests__` | vitest | does the registry match what the package ships |
| `e2e/a11y.spec.ts` | Chromium | axe over **every page, both themes, both languages** |
| `e2e/keyboard.spec.ts` | Chromium | the site's own shortcuts, the editor, the search |
| `e2e/interactions.spec.ts` | Chromium | the component behaviours a static tree cannot show |
| `e2e/direction.spec.ts` | Chromium | RTL actually mirrors; density actually shrinks |
| `e2e/shell.spec.ts` | Chromium | the palette, the accent, the templates |
| `e2e/i18n.spec.ts` | Chromium | both locales, and that the switcher stays on the page |

```bash
pnpm dev                                       # localhost:4023
pnpm --filter @misoto22/folio-docs test:e2e   # needs `pnpm build` first
```

The end-to-end suite serves the **built export**, not the dev server — the dev
server renders through a different pipeline, so a bug in the artifact would pass
and then reach production.
