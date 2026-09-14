'use client'

import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'

const data = Array.from({ length: 32 }, (_, index) => ({
  day: `D${index + 1}`,
  desktop: 140 + Math.round(Math.sin(index / 3) * 60) + index * 4,
}))

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * Thirty-two days is past what one plot can show at once, and a brush is the
 * answer that keeps the whole series visible while the reader picks a slice of
 * it. It is a child rather than a showBrush prop, and both handles are real
 * slider controls: tab to one and the arrow keys step it, Home and End jump it to
 * the ends, where the shape this was ported from was pointer-only. The cost is a
 * second miniature plot under the chart and the height it takes, so a chart of
 * six rows does not want one.
 */
export function Example() {
  return (
    <AreaChart title="Visitors per day" config={config} data={data} xDataKey="day">
      <AreaChart.Grid />
      <AreaChart.XAxis dataKey="day" />
      <AreaChart.Tooltip />
      <AreaChart.Area dataKey="desktop" variant="gradient" />
      <AreaChart.Brush height={56} />
    </AreaChart>
  )
}
