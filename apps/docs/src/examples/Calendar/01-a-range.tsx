'use client'

import { Calendar } from '@misoto22/folio'
import { useState } from 'react'

/**
 * A month as a grid of days, with a range drawn across it. The wash lives on
 * the CELL and the fill on the two ends' BUTTONS, which is what lets a range
 * read as one band with round ends — and what lets a one-day range, which is
 * both ends at once, stay round. Mark availability through the classNames slots
 * rather than by styling the day button, or the background flattens that end.
 * The caption is one button, not two dropdowns: that is how a date is said, and
 * splitting it put four controls in a 250px row that also has to hold two
 * arrows. Open it and the month and year picker is drawn in place of the grid,
 * at exactly its size, with Escape putting focus back on the caption.
 *
 * labels.labelNav names the month arrows' toolbar. Left alone every calendar
 * on a page is a nav called "Navigation bar" — react-day-picker's own string
 * — and three examples on one page are three landmarks nobody can tell apart.
 */
export function Example() {
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>()

  return (
    <Calendar
      mode="range"
      selected={range as never}
      onSelect={setRange as never}
      defaultMonth={new Date(2026, 8, 1)}
      labels={{ labelNav: () => 'Range example navigation' }}
    />
  )
}
