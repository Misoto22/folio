'use client'

import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 148 },
  { month: 'Apr', desktop: 162 },
  { month: 'May', desktop: 289 },
  { month: 'Jun', desktop: 341 },
]

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * The hidden data table hands a screen-reader user every number, which is access
 * but not a shape — six figures read one at a time do not say that March dipped,
 * and a run of tones does, in under two seconds. The control announces the point
 * count, the span of the category axis and the two extremes before the first
 * note, so the melody is a measurement rather than a contour. Nothing ever plays
 * until someone presses the button: there is no autoPlay prop and no effect that
 * can begin a run.
 */
export function Example() {
  return (
    <AreaChart title="Visitors per month" config={config} data={data} xDataKey="month">
      <AreaChart.Sonify />
      <AreaChart.Grid />
      <AreaChart.XAxis dataKey="month" />
      <AreaChart.YAxis label="Visitors" />
      <AreaChart.Tooltip />
      <AreaChart.Area dataKey="desktop" variant="gradient" />
    </AreaChart>
  )
}
