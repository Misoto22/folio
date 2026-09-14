'use client'

import { Calendar } from '@misoto22/folio'
import { useState } from 'react'

/** The first of the month the example opens on, so the rules read the same every day. */
const MONTH = new Date(2026, 8, 1)

/**
 * Weekends and anything before the 7th are refused, and the grid will not
 * commit one: disabled takes matchers — a day of the week, a date range, a
 * predicate — and dims the buttons it covers rather than removing them, so the
 * month keeps its shape and the reader can see WHY a day is unavailable. This
 * is also where an availability view starts: mark the cells through the
 * classNames slots, not by styling the day button, and the marks stay
 * compatible with the range wash. startMonth and endMonth bound how far the
 * caption's picker will travel; the default is ten years either side, which is
 * one page of the year grid and no paging at all.
 *
 * labels.labelNav names the month arrows' toolbar. Left alone every calendar
 * on a page is a nav called "Navigation bar" — react-day-picker's own string
 * — and three examples on one page are three landmarks nobody can tell apart.
 */
export function Example() {
  const [day, setDay] = useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={day}
      onSelect={setDay}
      defaultMonth={MONTH}
      startMonth={new Date(2026, 0, 1)}
      endMonth={new Date(2027, 11, 31)}
      disabled={[{ dayOfWeek: [0, 6] }, { before: new Date(2026, 8, 7) }]}
      labels={{ labelNav: () => 'Disabled days example navigation' }}
    />
  )
}
