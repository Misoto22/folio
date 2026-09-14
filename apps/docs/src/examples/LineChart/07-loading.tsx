'use client'

import { LineChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * The state every chart on a page is in on first paint. isLoading swaps the marks
 * for a skeleton and keeps the chart's measured height, so nothing on the page
 * moves when the rows land. The skeleton's rows are re-rolled as the shimmer
 * leaves the plot rather than on a timer, because an interval drifts against the
 * animation and eventually re-rolls them in full view, which reads as the chart
 * glitching rather than as it loading.
 */
export function Example() {
  return (
    <LineChart title="Visitors per month" config={config} data={[]} isLoading>
      <LineChart.Grid />
      <LineChart.Line dataKey="desktop" />
    </LineChart>
  )
}
