'use client'

import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * One of the two states a real dashboard chart spends most of its life in, and
 * the one that says "not yet" rather than "there is nothing here". The skeleton's
 * rows are seeded from the row index rather than drawn from Math.random, so the
 * server and the client render the same shape and a loading chart does not log a
 * hydration mismatch — and it keeps the chart's measured height, so the page does
 * not jump when the data lands. Under prefers-reduced-motion the travelling
 * highlight is replaced by a flat wash.
 */
export function Example() {
  return (
    <AreaChart title="Visitors per month" config={config} data={[]} isLoading>
      <AreaChart.Grid />
      <AreaChart.Area dataKey="desktop" />
    </AreaChart>
  )
}
