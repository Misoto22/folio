'use client'

import { DateRangePicker, Field } from '@misoto22/folio'

/**
 * Two months side by side, because a range that crosses a month boundary is the
 * common case and paging back and forth to see both ends is what makes a range
 * picker tiring. The panel stays open until both ends are chosen — a range is
 * not a value until it has a second date — and while only one end is set the
 * trigger prints “from – …”, so a half-answered range says so on the closed
 * control instead of looking finished. That half state is legal, so validate
 * before reading the second date: a reader who closed the panel early leaves it
 * undefined.
 */
export function Example() {
  return (
    <Field
      label="Reporting period"
      hint="Last 30 days and its neighbours are one click; the grid is for everything else."
      className="w-full max-w-sm"
    >
      <DateRangePicker label="Reporting period" />
    </Field>
  )
}
