'use client'

import { BarChart, type ChartConfig } from '@misoto22/folio/charts'

const data = Array.from({ length: 28 }, (_, index) => ({
  day: `D${index + 1}`,
  desktop: 90 + Math.round(Math.abs(Math.sin(index / 2)) * 180),
}))

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * Twenty-eight bars is where a category axis stops being readable, and the brush
 * keeps the whole series in view while the reader chooses a slice of it. The
 * strip below draws the same rows with the bar mark, so what is being chosen from
 * looks like what is being read — a control that shows only the zoomed result
 * cannot do that. The chart above then renders just the selected window, so
 * everything reading the visible rows follows the selection with it.
 */
export function Example() {
  return (
    <BarChart title="Visitors by day" config={config} data={data} xDataKey="day">
      <BarChart.Grid />
      <BarChart.XAxis dataKey="day" />
      <BarChart.Tooltip />
      <BarChart.Bar dataKey="desktop" variant="stripped" />
      <BarChart.Brush height={56} />
    </BarChart>
  )
}
