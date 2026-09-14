'use client'

import { FunnelChart, type ChartConfig } from '@misoto22/folio/charts'

const stages = [
  { stage: 'Visited', people: 4200 },
  { stage: 'Signed up', people: 1800 },
  { stage: 'Activated', people: 900 },
  { stage: 'Paid', people: 320 },
]

const config = {
  Visited: { label: 'Visited' },
  'Signed up': { label: 'Signed up' },
  Activated: { label: 'Activated' },
  Paid: { label: 'Paid' },
} satisfies ChartConfig

/**
 * The default funnel: four stages, widest first, each with its name printed beside
 * it. The taper encodes a ratio between neighbouring stages and the eye reads the
 * enclosed area, so a funnel exaggerates a shallow drop and flattens a steep one —
 * the printed label is the relief for that, and where the exact fall-off is the
 * point a BarChart puts every stage on one honest scale instead. Order is the
 * funnel and the data is never sorted for you, so the widest stage has to be
 * first.
 */
export function Example() {
  return (
    <FunnelChart
      title="Signup funnel"
      config={config}
      data={stages}
      dataKey="people"
      nameKey="stage"
    >
      <FunnelChart.Funnel>
        <FunnelChart.Label />
      </FunnelChart.Funnel>
      <FunnelChart.Tooltip />
    </FunnelChart>
  )
}
