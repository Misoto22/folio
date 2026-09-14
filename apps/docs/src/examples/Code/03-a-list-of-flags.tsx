import { Code } from '@misoto22/folio'

/**
 * The same chip in a definition list, where the type around it is smaller. It
 * is sized at 0.85em rather than in pixels, so it is proportionate in a term
 * column, in body copy and in a table cell without anyone choosing a size — and
 * it keeps no whitespace, so a multi-line string handed to it collapses into
 * one run. That case is CodeBlock.
 */
export function Example() {
  return (
    <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 text-sm text-(--ink-2)">
      <dt><Code>--force</Code></dt>
      <dd className="m-0">Overwrites <Code>dist/</Code> instead of failing on it.</dd>
      <dt><Code>--filter</Code></dt>
      <dd className="m-0">Runs in one workspace package.</dd>
      <dt><Code>--dry-run</Code></dt>
      <dd className="m-0">Prints what would be published, and publishes nothing.</dd>
    </dl>
  )
}
