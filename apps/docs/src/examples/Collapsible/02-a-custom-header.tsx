import { Badge, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@misoto22/folio'
import { RiArrowDownSLine } from '@remixicon/react'

/**
 * The loose trigger and panel, for a header that has to hold more than a title
 * — a count on one side, the control on the other. They exist so this call site
 * does not go to Radix directly and re-derive aria-expanded and aria-controls
 * by hand. Two things change when you leave the composed section behind: the
 * trigger is an icon button, so it needs an accessible name of its own, and the
 * panel is a bare div with no region role and no name. defaultOpen is set
 * because what this hides is why the reader came — a closed panel is unmounted
 * rather than hidden, so its text is not in the page for find-in-page or for a
 * print.
 */
export function Example() {
  return (
    <Collapsible defaultOpen className="w-full max-w-md">
      <div className="flex items-center justify-between gap-4 border-b border-(--rule) py-3">
        <span className="text-sm text-(--ink)">Failed checks</span>
        <div className="flex items-center gap-3">
          <Badge tone="danger">3</Badge>
          <CollapsibleTrigger
            aria-label="Show the failed checks"
            className="group inline-flex size-8 items-center justify-center rounded-(--radius) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink)"
          >
            <RiArrowDownSLine
              size={16}
              aria-hidden
              className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-data-[state=open]:rotate-180"
            />
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 py-3 text-sm text-(--ink-2)">
          <li>typecheck — 2 errors in apps/docs/src/lib/docs.ts</li>
          <li>lint — unused import in Toolbar.tsx</li>
          <li>visual diff — 1 changed screenshot</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
