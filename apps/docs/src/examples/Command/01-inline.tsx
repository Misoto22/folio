'use client'

import {
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandHint,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@misoto22/folio'
import { RiCompassLine, RiMoonLine, RiRulerLine, RiScales3Line, RiShapesLine, RiSunLine } from '@remixicon/react'

/**
 * The palette's parts, laid out inline so all of them are visible at once: the
 * combobox input, the filtered list with its groups and separator, and the
 * footer that prints the keys. Reach for CommandDialog rather than this bare
 * root in an application — the root is an inline bordered box with no scrim, no
 * focus trap and no Escape handling of its own, so a palette built from it
 * stays open until something else closes it. Always render CommandEmpty: cmdk
 * shows an empty state only when one exists in the tree, so a palette without
 * one answers an unmatched filter with a blank strip. And note the icon prop
 * takes an ELEMENT here, the reverse of DropdownMenuItem one import away.
 */
export function Example() {
  return (
    <Command label="Command palette" className="w-full max-w-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No command matches that. Try “theme”.</CommandEmpty>
        {/* The glyph is what makes a long list scannable: the eye sorts by
            shape before it reads. */}
        <CommandGroup heading="Navigate">
          <CommandItem value="components" icon={<RiShapesLine aria-hidden />} meta="49" shortcut="C">
            Components
          </CommandItem>
          <CommandItem value="foundations" icon={<RiRulerLine aria-hidden />} shortcut="F">
            Foundations
          </CommandItem>
          <CommandItem value="principles" icon={<RiScales3Line aria-hidden />} shortcut="P">
            Principles
          </CommandItem>
          <CommandItem value="templates" icon={<RiCompassLine aria-hidden />}>
            Templates
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem value="light" icon={<RiSunLine aria-hidden />} meta="current">
            Switch to light
          </CommandItem>
          <CommandItem value="dark" icon={<RiMoonLine aria-hidden />}>
            Switch to dark
          </CommandItem>
        </CommandGroup>
      </CommandList>
      {/* Nothing on screen otherwise says the arrows move the row or that
          Enter runs it. */}
      <CommandFooter>
        <CommandHint keys={['↑', '↓']}>navigate</CommandHint>
        <CommandHint keys={['↵']}>run</CommandHint>
        <CommandHint keys={['esc']}>close</CommandHint>
      </CommandFooter>
    </Command>
  )
}
