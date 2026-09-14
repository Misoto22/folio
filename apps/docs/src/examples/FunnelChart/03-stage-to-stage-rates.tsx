'use client'

import { FunnelChart, type ChartConfig } from '@misoto22/folio/charts'

// The rate is worked out at the call site: a funnel holds one number per stage
// and knows nothing about what its numbers mean.
const stages = [
  { stage: 'Visited', people: 4200, kept: 'the top of the funnel' },
  { stage: 'Signed up', people: 1800, kept: '43% of visitors' },
  { stage: 'Activated', people: 900, kept: '50% of signups' },
  { stage: 'Paid', people: 320, kept: '36% of activations' },
]

const config = {
  Visited: { label: 'Visited' },
  'Signed up': { label: 'Signed up' },
  Activated: { label: 'Activated' },
  Paid: { label: 'Paid' },
} satisfies ChartConfig

/**
 * Two labels on the same funnel: the stage's name inside it, and the share it
 * kept of the stage above it out to the right. The taper is a ratio the eye
 * reads as area, so it exaggerates a shallow drop and flattens a steep one, and
 * a printed rate is the only thing that makes the fall-off exact. The steepest
 * drop here is activations to paid, where barely a third carries through, and it
 * is the one the shape says least about because it happens where the funnel is
 * already narrow. Each rate is a share of the stage above it rather than of the
 * top, because those are two different numbers that look alike, and a funnel
 * that does not say which one it is printing gets read as whichever flatters
 * it.
 */
export function Example() {
  return (
    <FunnelChart
      title="Signup funnel, stage to stage"
      showTitle
      description="Each stage as a share of the one above it"
      config={config}
      data={stages}
      dataKey="people"
      nameKey="stage"
    >
      <FunnelChart.Funnel>
        <FunnelChart.Label position="center" />
        <FunnelChart.Label dataKey="kept" position="right" />
      </FunnelChart.Funnel>
      <FunnelChart.Tooltip />
    </FunnelChart>
  )
}
