'use client'

import { LineChart, type ChartConfig } from '@misoto22/folio/charts'

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
 * Several series compared against each other, which is the one question a line
 * chart exists for. There is no fill variant on offer here on purpose: filling
 * four overlapping series makes that comparison unanswerable. The stroke carries
 * the difference instead — the second line is dashed rather than left to a step
 * of grey — and the legend names both, because neither the ramp nor the dash
 * describes itself.
 */
export function Example() {
  return (
    <LineChart title="Visitors per month" config={config} data={data} xDataKey="month">
      <LineChart.Grid />
      <LineChart.XAxis dataKey="month" />
      <LineChart.YAxis />
      <LineChart.Legend />
      <LineChart.Tooltip />
      <LineChart.Line dataKey="desktop" />
      <LineChart.Line dataKey="mobile" strokeVariant="dashed" />
    </LineChart>
  )
}
