'use client'

import { BarChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 314, mobile: 240 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

/**
 * Two bar series over one category axis, which is the shape to reach for when the
 * categories are discrete rather than a continuum. Each series takes the next
 * slot on the grey ramp in declaration order, so hiding one never repaints the
 * survivors; the second carries a hatch, because a step of grey alone is a thin
 * thing to ask a reader to hold in their head. That is also why the legend is not
 * optional above one series.
 */
export function Example() {
  return (
    <BarChart title="Visitors by month" config={config} data={data} xDataKey="month">
      <BarChart.Grid />
      <BarChart.XAxis dataKey="month" />
      <BarChart.YAxis />
      <BarChart.Legend />
      <BarChart.Tooltip />
      <BarChart.Bar dataKey="desktop" />
      <BarChart.Bar dataKey="mobile" variant="hatched" />
    </BarChart>
  )
}
