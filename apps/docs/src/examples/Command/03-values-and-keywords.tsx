'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@misoto22/folio'
import { RiFileDownloadLine, RiGitBranchLine, RiGroupLine, RiResetLeftLine } from '@remixicon/react'

/**
 * cmdk filters on an item's value and only falls back to the row's own text
 * when there is none — so passing an internal id as value makes the visible
 * label unsearchable, which is the single most common way a palette ships
 * broken. Every value here is what a reader would actually type, and the second
 * half of each row is a keywords list for the words they might type instead:
 * revert for a rollback, teammate for people. meta is the quiet note at the end
 * of the row, for what kind of thing it is — not a description, because a
 * palette that prints a sentence per row stops being scannable at about six.
 */
export function Example() {
  return (
    <Command label="Project commands" className="w-full max-w-md">
      <CommandInput placeholder="Try revert, or teammate…" />
      <CommandList>
        <CommandEmpty>Nothing matches. Try branch, export or revert.</CommandEmpty>
        <CommandGroup heading="Release">
          <CommandItem
            value="roll back the release"
            keywords={['revert', 'undo', 'previous']}
            icon={<RiResetLeftLine size={16} aria-hidden />}
            meta="release"
          >
            Roll back the release
          </CommandItem>
          <CommandItem
            value="create a release branch"
            keywords={['cut', 'branch', 'tag']}
            icon={<RiGitBranchLine size={16} aria-hidden />}
            meta="git"
          >
            Create a release branch
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Project">
          <CommandItem
            value="invite a collaborator"
            keywords={['teammate', 'member', 'people']}
            icon={<RiGroupLine size={16} aria-hidden />}
            meta="people"
          >
            Invite a collaborator
          </CommandItem>
          <CommandItem
            value="export the deploy log"
            keywords={['csv', 'download', 'spreadsheet']}
            icon={<RiFileDownloadLine size={16} aria-hidden />}
            meta="data"
          >
            Export the deploy log
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
