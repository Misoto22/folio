'use client'

import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiDownloadLine, RiFileCopyLine, RiMoreLine, type RemixiconComponentType } from '@remixicon/react'

interface Action {
  label: string
  icon: RemixiconComponentType
  destructive?: boolean
}

const ACTIONS: Action[] = [
  { label: 'Copy link', icon: RiFileCopyLine },
  { label: 'Download original', icon: RiDownloadLine },
  { label: 'Delete', icon: RiDeleteBinLine, destructive: true },
]

/**
 * One array of actions, two doors into it. ContextMenuItem and DropdownMenuItem
 * take identical icon, destructive and disabled props, so the same list feeds
 * both and the right-click becomes the shortcut rather than the only way in —
 * which matters because a touch user, a trackpad user and a keyboard user may
 * have no way to open a context menu at all. Write the list once: two hand-kept
 * copies is how the overflow button ends up missing the action somebody added
 * to the right-click.
 */
export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
              {ACTIONS.map((action) => (
                <DropdownMenuItem key={action.label} icon={action.icon} destructive={action.destructive}>
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {ACTIONS.map((action) => (
          <ContextMenuItem key={action.label} icon={action.icon} destructive={action.destructive}>
            {action.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
