'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiDownloadLine, RiFileCopyLine, RiShareLine } from '@remixicon/react'

/**
 * The two anchored panels, side by side, on the one question that separates
 * them: is the content something you fill in, or something you pick? A
 * popover's contents are ordinary tab stops, so four actions in one is four
 * stops with no type-ahead and no arrow keys — where a menu is a single stop
 * with both. A menu, in turn, cannot hold a slider or a field, because a
 * menuitem is not a place a value gets entered. Both portal to the same layer
 * and both close on Escape back to their trigger; neither belongs inside a
 * Dialog, which paints over them.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Export size</Button>
        </PopoverTrigger>
        <PopoverContent label="Export size" showClose>
          <div className="flex flex-col gap-4">
            <Slider
              label="Longest edge"
              defaultValue={[2400]}
              min={800}
              max={6000}
              step={100}
              showValue
              format={(pixels) => `${pixels}px`}
            />
            <PopoverClose asChild>
              <Button size="sm">Export</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Share</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem icon={RiFileCopyLine}>Copy link</DropdownMenuItem>
          <DropdownMenuItem icon={RiShareLine}>Post to the channel</DropdownMenuItem>
          <DropdownMenuItem icon={RiDownloadLine}>Download original</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={RiDeleteBinLine} destructive>Revoke the link</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
