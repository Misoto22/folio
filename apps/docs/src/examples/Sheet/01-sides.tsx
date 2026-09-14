'use client'

import { Button, Field, Input, Sheet, SheetContent, SheetTrigger } from '@misoto22/folio'

/**
 * The four edges, named in reading order rather than as left and right: end is
 * the right in English and the left in Arabic, from one class string carrying
 * its own rtl variant, so there is no second code path to keep in step. Flip
 * this canvas to RTL and watch start and end swap. start and end are a
 * min(24rem, 92vw) column at full height; top and bottom are a full-width band
 * capped at 85vh. Every sheet has a close button whichever edge it comes from —
 * there is no showClose to turn it off, unlike Dialog.
 */
export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      {(['start', 'end', 'top', 'bottom'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side} title="Filters" description="Narrow the list.">
            <Field label="Search"><Input type="search" /></Field>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
