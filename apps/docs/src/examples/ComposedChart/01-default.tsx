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
 * Bars and a line over one axis — the shape for "the volume, and the rate it
 * moved at". One value axis, always: two measures at different scales belong in
 * two charts, or indexed to a common base, because a second y-scale lets the
 * author choose where the lines cross, which is the single most misleading thing
 * a chart can do. The axis this exposes is the only one, by design.
 */
export function Example() {
  return (
    <ComposedChart title="Revenue and profit" config={config} data={data} xDataKey="month">
      <ComposedChart.Grid />
      <ComposedChart.XAxis dataKey="month" />
      <ComposedChart.YAxis />
      <ComposedChart.Legend />
      <ComposedChart.Tooltip />
      <ComposedChart.Bar dataKey="revenue" />
      <ComposedChart.Line dataKey="profit" />
    </ComposedChart>
  )
}
