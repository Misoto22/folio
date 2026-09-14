'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { FunnelChart, type ChartConfig, type FunnelVariant } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

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

const VARIANTS: FunnelVariant[] = ['stepped', 'ramp']

/**
 * stepped is the honest default: every stage keeps the same fill and the taper
 * alone carries the drop. ramp darkens each stage as well, which encodes the same
 * fact twice and invites a reader to compare two things that are one — the toggle
 * is here to make that visible, not to offer the two as equals. The label prints
 * people at the centre of each stage rather than the stage's name, since the
 * number is exactly what the taper cannot be trusted to convey; the stage's name
 * is what the tooltip carries.
 */
export function Example() {
  const [variant, setVariant] = useState<FunnelVariant>('stepped')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as FunnelVariant)}
          aria-label="Stage fill"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <FunnelChart
        title={`Signup funnel — ${variant}`}
        config={config}
        data={stages}
        dataKey="people"
        nameKey="stage"
      >
        <FunnelChart.Funnel variant={variant} gap={3}>
          <FunnelChart.Label dataKey="people" position="center" />
        </FunnelChart.Funnel>
        <FunnelChart.Tooltip />
      </FunnelChart>
    </div>
  )
}
