'use client'

import { ComposedChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', revenue: 4200, profit: 1800 },
  { month: 'Feb', revenue: 5800, profit: 2400 },
  { month: 'Mar', revenue: 4100, profit: 1600 },
  { month: 'Apr', revenue: 6200, profit: 2800 },
  { month: 'May', revenue: 5400, profit: 2200 },
  { month: 'Jun', revenue: 7800, profit: 3400 },
]

const config = {
  revenue: { label: 'Revenue' },
  profit: { label: 'Profit' },
} satisfies ChartConfig

/**
 * Hovering a column dims every bar outside it. The highlight reads the chart's
 * own tooltip index, which is the half that was missing where this came from: the
 * state existed and was cleared on leave, but nothing ever set it, so the
 * highlight never fired. It is driven by the pointer, so it can never be the only
 * thing carrying a reading — the clickable legend, the tooltip and the figure's
 * hidden data table are what a keyboard reaches instead.
 */
export function Example() {
  return (
    <ComposedChart title="Revenue and profit" config={config} data={data}>
      <ComposedChart.Background variant="diagonal-lines" />
      <ComposedChart.XAxis dataKey="month" />
      <ComposedChart.Legend isClickable />
      <ComposedChart.Tooltip />
      <ComposedChart.Bar dataKey="revenue" enableHoverHighlight isClickable />
      <ComposedChart.Line dataKey="profit" glowing isClickable />
    </ComposedChart>
  )
}
