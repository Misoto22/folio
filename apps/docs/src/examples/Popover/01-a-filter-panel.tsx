'use client'

import { Button, Field, Popover, PopoverClose, PopoverContent, PopoverTrigger, Select, SelectItem } from '@misoto22/folio'

/**
 * A panel with controls in it, which is the whole distinction from a tooltip:
 * put a field or a button inside a tip and it is unreachable. label names the
 * panel and is announced on entry, so make it say what the panel holds rather
 * than repeating the trigger. showClose is off by default and turned on here
 * because the panel holds a form — a non-modal panel whose only exit is
 * clicking away gives an in-progress edit no deliberate end. It really is not
 * modal: there is no focus trap, so tabbing past the last control moves focus
 * into the page, which Radix reads as a focus-outside and closes the panel.
 */
export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Filters</Button>
      </PopoverTrigger>
      <PopoverContent label="Deploy filters" showClose>
        <div className="flex flex-col gap-4">
          <Field label="Status">
            <Select label="Status" defaultValue="all">
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </Select>
          </Field>
          <PopoverClose asChild>
            <Button size="sm">Apply</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
