'use client'

import {
  Button,
  Field,
  Input,
  NativeSelect,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@misoto22/folio'

/**
 * Content that is wide and short belongs on the bottom edge, not in a column.
 * start and end are a 24rem column, and a four-field row pushed into one wraps
 * into a ribbon the reader scrolls; bottom is full width and capped at 85vh, so
 * the row stays a row. It is still a modal dialog — the page behind is
 * scroll-locked and pointer-inert — so this is for a range the reader sets and
 * dismisses, not for a panel they work alongside. That one is a Popover, or a
 * column in the layout.
 */
export function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Set the reporting range</Button>
      </SheetTrigger>
      <SheetContent side="bottom" title="Reporting range" description="Applied to every chart on the page.">
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="From">
            <Input type="date" defaultValue="2026-07-01" />
          </Field>
          <Field label="To">
            <Input type="date" defaultValue="2026-09-30" />
          </Field>
          <Field label="Region">
            <NativeSelect defaultValue="au">
              <option value="au">Australia</option>
              <option value="jp">Japan</option>
              <option value="all">Everywhere</option>
            </NativeSelect>
          </Field>
          <Field label="Compare with">
            <NativeSelect defaultValue="previous">
              <option value="previous">Previous period</option>
              <option value="year">Same period last year</option>
              <option value="none">Nothing</option>
            </NativeSelect>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Apply</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
