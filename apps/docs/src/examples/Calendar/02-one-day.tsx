'use client'

import { Calendar, Text } from '@misoto22/folio'
import { useState } from 'react'

const MONTH = new Date(2026, 8, 1)

/**
 * One day at a time, and the two marks that must not look alike: today is a
 * RING and selected is a FILL. One is a fact about the calendar and the other
 * is a choice the reader made, so a system that draws both the same way leaves
 * the reader unable to tell what they picked. Days from the neighbouring months
 * are shown and dimmed rather than left as holes. Do not give the grid a fixed
 * height — most months are five weeks and some are six — and do not stretch it
 * with w-full: it is w-fit and lays out fixed 36px columns, so a width class
 * only leaves the same grid sitting at the start edge of a wider box. For
 * choosing a date inside a form, this belongs in a DatePicker.
 *
 * labels.labelNav names the month arrows' toolbar. Left alone every calendar
 * on a page is a nav called "Navigation bar" — react-day-picker's own string
 * — and three examples on one page are three landmarks nobody can tell apart.
 */
export function Example() {
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 8, 17))

  return (
    <div className="flex flex-col items-center gap-4">
      <Calendar
        mode="single"
        selected={day}
        onSelect={setDay}
        defaultMonth={MONTH}
        labels={{ labelNav: () => 'One day example navigation' }}
      />
      <Text size="sm" tone="muted">
        {day ? day.toDateString() : 'nothing chosen'}
      </Text>
    </div>
  )
}
