import { CodeBlock } from '@misoto22/folio'

const OUTPUT = `> @misoto22/folio build
tokens      → dist/tokens.css     145 tokens
components  → dist/index.js        61 exports
types       → dist/index.d.ts
size check  → within budget
done in 4.2s`

/**
 * A log, not a command — copyable={false} is for the block nobody is meant to
 * run, and this is the case it exists for. Everywhere else the button stays:
 * dropping it to tidy the strip takes away the reason a reader stops selecting
 * a wrapped command by hand. With no title, no language and no copy button
 * there is nothing to put in the strip, so there is no strip — and the
 * scrolling body still needs a name, which is what label is for.
 */
export function Example() {
  return (
    <CodeBlock code={OUTPUT} copyable={false} label="Build output" maxHeight="12rem" />
  )
}
