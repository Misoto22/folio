'use client'

import { BarChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 314 },
]

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * Three ways to say "this one", side by side. A monochrome chart has no brighter
 * colour to reach for, so glowing puts a halo behind the series that is the point
 * of the figure; buffer draws the last category as an open hatch, the idiom for a
 * period still in progress, the same height as any other bar but visibly not the
 * same kind of fact; and hover highlight drops every bar the pointer is not on to
 * 30%. That last one is driven by the pointer, so it can never be the only thing
 * carrying a reading.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-3">
      <BarChart title="Glowing" showTitle config={config} data={data}>
        <BarChart.XAxis dataKey="month" />
        <BarChart.Bar dataKey="desktop" glowing />
      </BarChart>

      <BarChart title="Buffer — the last period is still open" showTitle config={config} data={data}>
        <BarChart.XAxis dataKey="month" />
        <BarChart.Bar dataKey="desktop" buffer />
      </BarChart>

      <BarChart title="Hover highlight" showTitle config={config} data={data}>
        <BarChart.XAxis dataKey="month" />
        <BarChart.Tooltip />
        <BarChart.Bar dataKey="desktop" variant="stripped" enableHoverHighlight />
      </BarChart>
    </div>
  )
}
