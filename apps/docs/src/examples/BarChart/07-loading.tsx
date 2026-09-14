'use client'

import { BarChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * The skeleton, with its bar count set by hand. loadingBars decides how many bars
 * are drawn and otherwise defaults to twelve, which matters more on a bar chart
 * than on a line: a skeleton of twelve followed by six real bars reads as the
 * chart having lost half its data. The marks are swapped but the measured height
 * is kept, and a brush or a toolbar composed alongside is suppressed while this
 * is on, because there is nothing yet to choose a window from.
 */
export function Example() {
  return (
    <BarChart title="Visitors by month" config={config} data={[]} isLoading loadingBars={10}>
      <BarChart.Grid />
      <BarChart.Bar dataKey="desktop" />
    </BarChart>
  )
}
