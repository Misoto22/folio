'use client'

import { PieChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { chrome: { label: 'Chrome' } } satisfies ChartConfig

/**
 * The skeleton. isLoading swaps the marks for five equal wedges and keeps the
 * figure's measured height, so the page does not jump when the real data lands.
 * They pulse on a stagger, which is what sends the wave round the pie rather
 * than blinking the whole of it at once; under prefers-reduced-motion they hold
 * at a flat mid-opacity instead. Compose the parts you would compose with data
 * — innerRadius is read in this state too, so the loading donut is the same
 * shape as the one that replaces it.
 */
export function Example() {
  return (
    <PieChart
      title="Visitors by browser"
      config={config}
      data={[]}
      dataKey="visitors"
      nameKey="browser"
      isLoading
    >
      <PieChart.Pie innerRadius="50%" />
    </PieChart>
  )
}
