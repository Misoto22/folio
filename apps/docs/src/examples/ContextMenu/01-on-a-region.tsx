'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiDownloadLine, RiFileCopyLine } from '@remixicon/react'

/**
 * The menu a secondary click opens, placed at the POINTER rather than against
 * the trigger — there is no side or align to set, only the collision padding
 * that keeps it inside the frame. Never make it the only way to reach an
 * action: Shift+F10 opens it from the keyboard where the platform supports it,
 * and Radix opens it on a 700ms long press for touch and pen but cancels the
 * moment the pointer moves, so on a scrollable list the scroll gesture usually
 * wins. The label is a plain div with no role, like DropdownMenu's — a visual
 * heading, and nothing a screen reader hears on its way through the rows.
 */
export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="grid h-28 w-full max-w-sm place-items-center rounded-(--radius) border border-dashed border-(--rule-2) text-sm text-(--ink-3-aa)">
          Right-click anywhere in this box
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Frame</ContextMenuLabel>
        <ContextMenuItem icon={RiFileCopyLine}>Copy link</ContextMenuItem>
        <ContextMenuItem icon={RiDownloadLine}>Download original</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={RiDeleteBinLine} destructive>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
