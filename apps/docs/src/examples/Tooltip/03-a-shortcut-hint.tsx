'use client'

import { Button, Kbd, Text, Tooltip, TooltipProvider } from '@misoto22/folio'

/**
 * The control says what it does on the page; the tip only adds the shortcut. A
 * tooltip is unreachable on touch, invisible to anyone scanning, and dismissed
 * the moment focus leaves — so nothing a reader NEEDS can live only in one. Two
 * more limits worth knowing: the tip is capped at 16rem in 11px mono, so a
 * sentence wraps into a five-line block that covers the thing it describes; and
 * nothing focusable belongs inside content, because the tip is not in the tab
 * order and closes when the trigger loses focus. A link or a button in there is
 * reachable by pointer and by nothing else. That is a Popover.
 */
export function Example() {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Tooltip content="Save the draft" side="bottom">
            <Button keycap="S">Save draft</Button>
          </Tooltip>
          <Tooltip content="Publish this post" side="bottom">
            <Button variant="secondary">Publish</Button>
          </Tooltip>
        </div>
        <Text size="sm" tone="muted">
          The same keys are printed on the page, so <Kbd>S</Kbd> is not news a
          hover has to break.
        </Text>
      </div>
    </TooltipProvider>
  )
}
