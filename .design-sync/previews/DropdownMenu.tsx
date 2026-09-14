import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Button,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiFileCopyLine, RiLockLine, RiMoreLine, RiPencilLine } from '@remixicon/react'

export function PostActions() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <RiMoreLine size={16} aria-hidden />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Manage post</DropdownMenuLabel>
        <DropdownMenuItem icon={RiPencilLine}>Edit</DropdownMenuItem>
        <DropdownMenuItem icon={RiFileCopyLine}>Duplicate</DropdownMenuItem>
        <DropdownMenuItem icon={RiLockLine}>Make private</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={RiDeleteBinLine}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
