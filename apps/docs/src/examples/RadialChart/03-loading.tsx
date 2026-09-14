'use client'

import { RadialChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { documents: { label: 'Documents' } } satisfies ChartConfig

/**
 * The skeleton. isLoading swaps the arcs for five of their own, re-rolled every
 * 1.5 seconds and morphing between lengths, and keeps the figure's measured
 * height so the page does not jump when the data lands; under
 * prefers-reduced-motion they hold still instead. The lengths come from a
 * deterministic function rather than Math.random, so the server and the client
 * draw the same skeleton and hydration has nothing to disagree about. The
 * composed RadialBar draws nothing in this state — it is here so the chart
 * comes back as itself, with the same bar, once the rows arrive.
 */
export function Example() {
  return (
    <RadialChart title="Storage used by tier" config={config} data={[]} nameKey="tier" isLoading>
      <RadialChart.RadialBar dataKey="used" />
    </RadialChart>
  )
}
