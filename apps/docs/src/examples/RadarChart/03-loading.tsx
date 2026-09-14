'use client'

import { RadarChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { current: { label: 'Current' } } satisfies ChartConfig

/**
 * The skeleton. A radar has no straight axis for a travelling highlight to run
 * along, so it animates by MORPHING between shapes — six spokes re-rolled every
 * 1.5 seconds, with Recharts' own transition carrying the change; under
 * prefers-reduced-motion the animation is off and the shape simply holds. The
 * spoke values come from a deterministic function rather than Math.random,
 * because a server-rendered skeleton that disagrees with the client's is a
 * hydration mismatch. Leave the parts composed while isLoading is set: the grid
 * is still drawn, the Radar itself renders nothing, and both come back as
 * themselves when the data arrives.
 */
export function Example() {
  return (
    <RadarChart title="Team profile" config={config} data={[]} isLoading>
      <RadarChart.PolarGrid />
      <RadarChart.Radar dataKey="current" />
    </RadarChart>
  )
}
