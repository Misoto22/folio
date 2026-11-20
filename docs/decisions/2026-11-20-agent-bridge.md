# An agent bridge for folio's components

Status: **proposed — waiting on a pick** (2026-11-20)
Scope: a new `@misoto22/folio/agent` entry, plus a state change inside the
interactive primitives in `packages/design`. `apps/docs` gains one e2e page.
Prompted by: Vercel's UI SDK (`@ui-sdk/core` 0.1.0-beta.13, read from the
published tarball on 2026-11-20), whose `createAgent()` lets an agent read
component state and call component actions instead of driving the DOM.

## The problem

An agent that operates a page built on folio today does it with browser tools:
it reads the accessibility tree, then clicks and types. That works, and it is
slow and expensive in the way UI SDK measured. Their own benchmark is one
settings-page task, three runs per column, Sonnet through Claude Code. Base UI
plus browser tools took 17 tool calls and 291.7k tokens. Their bridge took 7
calls and 69.5k tokens. The ui-sdk page driven by browser tools cost about the
same as the other libraries, so the saving comes from the bridge, not the
markup.

The page where this would matter is the admin console (`misoto22-admin`). It is
the place with forms, settings and lists that an agent might edit. The public
site is mostly read.

Four facts constrain any option:

1. **Admin does not use folio yet.** It still depends on
   `"@misoto22/design": "github:Misoto22/misoto22-design"`, the pre-rename
   package. That GitHub path now redirects to this monorepo, whose root is a
   private workspace and not the package. Admin imports `Button`, `Input`,
   `StatusPill`, `toast`, `Dialog` and `DialogContent` from it, and hand-rolls
   `chip-input`, `confirm-dialog` and others in `src/components/ui/`.
2. **Folio does not own most of its state.** `Switch`, `Select` and
   `RadioGroup` spread their props onto the Radix root. When the caller passes
   no `checked` or `value`, the value lives inside Radix, and folio has no
   handle to change it. `Checkbox`, `Tabs`, `Slider`, `Combobox` and
   `NumberField` already hold some state of their own. `Input` and `Textarea`
   are native elements.
3. **The label already has a source.** `Field` wires the control through
   `field-control.ts`. Components with a required `label` prop (`Select`,
   `Combobox`) and icon buttons with `aria-label` cover the rest.
4. **WebMCP is early.** `document.modelContext.registerTool` exists in few
   browsers, so the first users would be agents we run ourselves (Claude in
   Chrome, Playwright), not a browser's built-in agent.

## Options

### A · Stay with browser tools

Change nothing. Agents keep reading the accessibility tree.

- Cost: none.
- Keeps working through every folio release.
- Loses the token and time saving, which was 60–76% in UI SDK's one
  benchmark task.

### B · A folio-native bridge

A `@misoto22/folio/agent` entry with the same verbs as UI SDK, so an agent that
has learnt one knows the other: `createAgent`, `snapshot`, `act`, `query`,
`subscribe`, `registerTools`.

- Each interactive primitive calls an internal `useAgentPart({ kind, label,
  value, actions })`. With no bridge on the page it reads a `null` context and
  does nothing, so a page that never creates a bridge pays nothing.
- The primitives in fact 2 move to a controllable-state hook: folio holds the
  value when the caller does not. This is the expensive part. It touches the
  internals of about 22 Radix wrappers, and every one needs its keyboard and
  `ssr` tests re-run (DESIGN-API-001). The public props do not change.
- `Input` and `Textarea` set a value through the native setter and dispatch an
  `input` event, so React's `onChange` still fires.
- Three choices differ from UI SDK on purpose:
  - **Fail closed.** UI SDK runs every supported action when `allow` is
    absent. Here `createAgent()` without `allow` is read-only: `snapshot` and
    `query` work, and `act` refuses.
  - **Validate before applying.** UI SDK applies steps in order and keeps
    earlier ones when a later one is refused. Here `act` resolves every ref
    and asks `allow` for every step first, and changes nothing unless all of
    them pass.
  - **Redact by type.** `type="password"`, a one-time code, and anything
    under `data-agent-secret` show as `"[redacted]"` in `snapshot`,
    `subscribe` and `act` results.
- `data-agent-confirm="…"` on any control means a person must confirm that
  step, as in UI SDK.

Estimate, for whoever builds it:

| Slice | What | Time |
|---|---|---|
| B1 | `snapshot`/`act`/`allow`/redaction, and Input, Textarea, Select, Switch, Checkbox, RadioGroup, Tabs, Button | 2–3 days |
| B2 | The remaining interactive primitives, `query`, `subscribe`, `data-agent-confirm` | 3–4 days |
| B3 | `registerTools` for WebMCP, undo history | 2–3 days |

### C · Put UI SDK underneath folio

Replace Radix with `@ui-sdk/react` and get its bridge as it ships.

- Rewrites the behaviour layer of the 22 Radix-backed primitives (of 66 in
  `src/components`), plus the hand-built ones like `Combobox`, against a dependency at
  `0.1.0-beta.13` that published 13 betas in its first week.
- Its keyboard and ARIA contracts differ from Radix's in detail, so every
  `keyboard.test.tsx` expectation would need checking again.
- Rejected unless UI SDK reaches a stable 1.0 and Radix stops being
  maintained.

### D · A snapshot built from the DOM, no component changes

A small script reads roles, accessible names and values from the rendered DOM
and returns a compact list, like `snapshot()`. Acting still goes through
synthetic events.

- Cheap: one file, and nothing inside the primitives changes.
- It helps with reading, which is where most of the benchmark's tokens went.
  It does not help with acting.
- It is not specific to folio. It belongs in an agent tool, not in this
  package (DESIGN-ARCH-001).

## Recommendation

Do this in order, and stop at any step that does not pay for itself:

1. **Move admin to `@misoto22/folio`.** It is a prerequisite for every option
   except A, and it fixes a dependency that already points at the wrong
   thing. The rename codemod `scripts/codemods/m22-to-folio.mjs` and `init`'s legacy
   cleanup (`bin/migrate-legacy.mjs`) exist for this. It is work in
   `misoto22-admin`, not here.
2. **Measure before building.** Write one admin task, for example "rename a
   photo category, reorder two, save", and run it with Claude in Chrome on
   browser tools. Record tool calls, tokens, time and success. That baseline
   is the number B has to beat. UI SDK's table is their page, not ours.
3. **Build B1 only if the baseline shows the cost.** B1 alone covers the
   controls a settings screen uses, and its fail-closed and validate-first
   semantics are the parts that matter for safety. B2 and B3 wait for a
   second real use.

C is rejected. D is a fine idea for an agent tool and out of scope for this
package.

## Choice

Waiting on the owner.
