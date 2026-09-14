'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiDownloadLine, RiFileCopyLine, RiMoreLine, RiPushpinLine } from '@remixicon/react'

/**
 * The overflow control at the end of a row, where a word would only repeat what
 * the row already says. The trigger is an iconOnly Button, so aria-label is not
 * optional — without it the control is announced as an unnamed button. align is
 * end because the panel is at least 11rem wide and would otherwise open back
 * across its own trigger; it collides with 8px of padding against the frame and
 * flips rather than scrolling, since the panel has no maximum height. A row
 * that is not available right now is disabled rather than missing, so the list
 * does not change shape between visits.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-(--radius) border border-(--rule) px-4 py-3">
      <Text size="sm" tone="strong" className="font-mono">
        kyoto-february.tif
      </Text>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconOnly aria-label="Actions for kyoto-february.tif" variant="ghost" size="sm">
            <RiMoreLine size={16} aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem icon={RiFileCopyLine}>Copy link</DropdownMenuItem>
          <DropdownMenuItem icon={RiDownloadLine}>Download original</DropdownMenuItem>
          <DropdownMenuItem icon={RiPushpinLine} disabled>
            Pin to the collection
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={RiDeleteBinLine} destructive>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
