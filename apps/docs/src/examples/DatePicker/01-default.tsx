'use client'

import { DatePicker, Field } from '@misoto22/folio'

/**
 * A trigger and a Calendar in a Popover, and deliberately not a text input with
 * a calendar attached: a typed date needs a format, and 03/04 is March the
 * fourth in one country and the third of April in the next. The trigger prints
 * the chosen date in the visitor's own locale for the same reason. Where typing
 * would genuinely be faster — a date years back — the month and year are
 * dropdowns, which is that journey without the ambiguity.
 */
export function Example() {
  return (
    <Field
      label="Publish on"
      hint="Month and year are dropdowns — reaching two years back is one click, not twenty-four."
      className="w-full max-w-xs"
    >
      <DatePicker label="Publish on" />
    </Field>
  )
}
