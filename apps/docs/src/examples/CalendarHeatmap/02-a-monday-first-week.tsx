'use client'

import { CalendarHeatmap, type CalendarHeatmapValue } from '@misoto22/folio/charts'

const FROM = '2026-01-05'

const values: CalendarHeatmapValue[] = Array.from({ length: 91 }, (_, offset) => ({
  date: new Date(Date.parse(`${FROM}T00:00:00Z`) + offset * 86_400_000).toISOString().slice(0, 10),
  value: (offset * 7) % 13,
}))

/**
 * The same grid for a reader whose week starts on Monday, and in that reader's
 * own words. weekStartsOn rotates the rows; weekdayLabels and monthLabels
 * translate them. The two are separate props on purpose: the labels array is
 * always Sunday-first whatever the grid does, so a Monday-first German calendar
 * and a Monday-first English one share the same convention and differ only in
 * the strings. The domain is pinned, which is what makes two calendars
 * comparable — on their own domains a quiet year and a busy one look identical.
 */
export function Example() {
  return (
    <CalendarHeatmap
      title="Beiträge pro Tag"
      showTitle
      values={values}
      from={FROM}
      to="2026-04-05"
      weekStartsOn={1}
      weekdayLabels={['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']}
      monthLabels={['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']}
      domain={[0, 20]}
      describe={(value, date) => `${String(value)} Beiträge am ${date}`}
    />
  )
}
