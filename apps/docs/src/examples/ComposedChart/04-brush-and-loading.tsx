'use client'

import { ComposedChart, type ChartConfig } from '@misoto22/folio/charts'

const data = Array.from({ length: 30 }, (_, index) => ({
  day: `D${index + 1}`,
  revenue: 3200 + Math.round(Math.abs(Math.sin(index / 3)) * 3600),
  profit: 900 + Math.round(Math.abs(Math.cos(index / 4)) * 1800),
}))

const config = {
  revenue: { label: 'Revenue' },
  profit: { label: 'Profit' },
} satisfies ChartConfig

/**
 * The two states a dashboard chart spends most of its time in, side by side. On
 * the left, a brush over thirty days: composed as a child, and the plot above
 * then renders only the window it selects. On the right, the same chart loading —
 * and a brush would not appear there even if one were composed, because a brush
 * is suppressed while isLoading is on: there is nothing yet to choose a window
 * from.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-2">
      <ComposedChart title="Revenue and profit" showTitle config={config} data={data} xDataKey="day">
        <ComposedChart.Grid />
        <ComposedChart.XAxis dataKey="day" />
        <ComposedChart.Tooltip />
        <ComposedChart.Bar dataKey="revenue" variant="stripped" />
        <ComposedChart.Line dataKey="profit" />
        <ComposedChart.Brush height={48} />
      </ComposedChart>

      <ComposedChart title="Loading" showTitle config={config} data={[]} isLoading>
        <ComposedChart.Grid />
        <ComposedChart.Bar dataKey="revenue" />
      </ComposedChart>
    </div>
  )
}
