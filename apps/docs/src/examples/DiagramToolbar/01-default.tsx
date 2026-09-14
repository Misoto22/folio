'use client'

import { Button } from '@misoto22/folio'
import { DiagramToolbar, DiagramToolbarGroup } from '@misoto22/folio/diagrams'

/**
 * Four controls in two groups, separated by a hairline rather than by space —
 * a gap wide enough to read as a boundary is also wide enough to stop the bar
 * reading as one object, which is the only reason the controls were collected
 * into a bar. The wrapper carries role="toolbar", which is why label is
 * required: without it a screen reader announces a toolbar with no name. Roving
 * focus is not implemented, so Tab visits all four buttons; where that is wrong,
 * use a plain div and skip the role.
 */
export function Example() {
  return (
    <DiagramToolbar label="Diagram actions">
      <DiagramToolbarGroup>
        <Button size="sm" variant="ghost">
          Theme
        </Button>
        <Button size="sm" variant="ghost">
          Style
        </Button>
      </DiagramToolbarGroup>
      <DiagramToolbarGroup>
        <Button size="sm" variant="ghost">
          Present
        </Button>
        <Button size="sm" variant="secondary">
          Export
        </Button>
      </DiagramToolbarGroup>
    </DiagramToolbar>
  )
}
