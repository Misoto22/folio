'use client'

import { CalendarHeatmap, type CalendarHeatmapValue } from '@misoto22/folio/charts'

const FROM = '2026-01-04'
const DAYS = 182

// A working year: busy on weekdays, quiet at the weekend, and two weeks in
// March where nothing was recorded at all.
const values: CalendarHeatmapValue[] = Array.from({ length: DAYS }, (_, offset) => {
  const date = new Date(Date.parse(`${FROM}T00:00:00Z`) + offset * 86_400_000)
  const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6
  const missing = offset >= 70 && offset < 84
  return {
    date: date.toISOString().slice(0, 10),
    value: missing ? null : Math.round((weekend ? 2 : 9) + Math.sin(offset / 9) * (weekend ? 2 : 6)),
  }
})

/**
 * Half a year, built from the dates rather than from the order of the array —
 * which is the whole difference from a bare list of counts, where one missing
 * day shifts every reading after it by a cell and draws a plausible picture of
 * a year that did not happen. The fortnight in March is null rather than zero,
 * so it renders as a dashed gap and announces no data: nothing happened and
 * nothing was recorded are different readings, and a page that draws them alike
 * invites the reader to explain an outage that was a hole in collection.
 * describe names the unit, because the row and column a cell is announced with
 * are a weekday and a month over a block of five weeks.
 */
export function Example() {
  return (
    <CalendarHeatmap
      title="Commits per day"
      showTitle
      description="Darker is busier"
      values={values}
      from={FROM}
      to="2026-07-03"
      describe={(value, date) => `${String(value)} commits on ${date}`}
    />
  )
}
