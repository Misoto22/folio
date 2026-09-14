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
 * Three layers, drawn in the order editorial charting settled on and fixed by the
 * package rather than by the order they are composed in: the band is context and
 * sits behind the grid, the line is a claim about the data and sits above the
 * marks, and the note explains both and sits above everything, the hover dot
 * included. Most charts that look like they need a second series need a reference
 * line instead — "are we above the line" is a question a threshold answers at a
 * glance and a second series does not.
 */
export function Example() {
  return (
    <AreaChart title="Visitors per month" config={config} data={data} xDataKey="month">
      <AreaChart.Grid />
      <AreaChart.XAxis dataKey="month" />
      <AreaChart.YAxis label="Visitors" />
      <AreaChart.Tooltip />

      <AreaChart.ReferenceBand x={['Mar', 'Apr']} label="Migration" />
      <AreaChart.ReferenceLine y={250} label="Target" weight="firm" />
      <AreaChart.Annotation x="Mar" y={148} text="Deploy freeze" showAnchor />

      <AreaChart.Area dataKey="desktop" variant="solid" />
    </AreaChart>
  )
}
