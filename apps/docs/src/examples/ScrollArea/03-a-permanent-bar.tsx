'use client'

import { ScrollArea, Text } from '@misoto22/folio'

const SHORTCUTS = [
  ['⌘K', 'Open the palette'],
  ['⌘\\', 'Toggle the sidebar'],
  ['⌘⇧D', 'Deploy the current branch'],
  ['⌘⇧L', 'Follow the logs'],
  ['⌘/', 'Search this page'],
  ['G then O', 'Go to overview'],
  ['G then D', 'Go to deploys'],
  ['G then S', 'Go to settings'],
  ['?', 'Show every shortcut'],
]

/**
 * type="always" draws both bars whether or not the pointer is inside. The
 * default is hover, and the platform's own bar is hidden, so at rest there is
 * nothing on screen saying the box scrolls — which is fine when the last row is
 * visibly cut in half, and a trap when the content happens to end flush at the
 * boundary, as this list nearly does. Do not build a drag-to-scroll affordance
 * over it: the thumb is deliberately touch-none and the viewport is a real
 * overflow container, so touch dragging, momentum and the wheel are already the
 * platform's and behave the way the reader expects.
 */
export function Example() {
  return (
    <ScrollArea
      label="Keyboard shortcuts"
      type="always"
      className="h-44 w-full max-w-sm rounded-(--radius) border border-(--rule)"
    >
      <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 p-3">
        {SHORTCUTS.map(([keys, action]) => (
          <div key={keys} className="col-span-2 grid grid-cols-subgrid">
            <dt className="m-0 mono-meta text-(--ink)">{keys}</dt>
            <dd className="m-0">
              <Text as="span" size="sm">{action}</Text>
            </dd>
          </div>
        ))}
      </dl>
    </ScrollArea>
  )
}
