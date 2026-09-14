'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  BarChart,
  type BarOrientation,
  type BarStackType,
  type ChartConfig,
} from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { channel: 'Organic search', desktop: 186, mobile: 80 },
  { channel: 'Paid social', desktop: 305, mobile: 200 },
  { channel: 'Direct', desktop: 237, mobile: 120 },
  { channel: 'Referral', desktop: 173, mobile: 190 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

const STACKS: BarStackType[] = ['default', 'stacked', 'percent']
const ORIENTATIONS: BarOrientation[] = ['vertical', 'horizontal']

/**
 * Two choices that interact. Stacking asks a different question at each setting —
 * default compares, stacked totals, percent shares — while orientation is about
 * the category names: "Organic search" reads straight beside a row and has to be
 * rotated or truncated under a column. The axes swap with it, which is the one
 * part the call site does by hand: the category dataKey moves from the X axis to
 * the Y, and that axis needs a width wide enough for the longest label.
 */
export function Example() {
  const [stackType, setStackType] = useState<BarStackType>('default')
  const [orientation, setOrientation] = useState<BarOrientation>('vertical')

  const horizontal = orientation === 'horizontal'

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={stackType}
            onValueChange={(next) => next && setStackType(next as BarStackType)}
            aria-label="Stacking"
          >
            {STACKS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={orientation}
            onValueChange={(next) => next && setOrientation(next as BarOrientation)}
            aria-label="Orientation"
          >
            {ORIENTATIONS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <BarChart
        title={`Visitors by channel — ${stackType}, ${orientation}`}
        config={config}
        data={data}
        stackType={stackType}
        orientation={orientation}
      >
        <BarChart.Grid />
        {horizontal ? (
          <>
            <BarChart.XAxis />
            <BarChart.YAxis dataKey="channel" width={128} />
          </>
        ) : (
          <>
            <BarChart.XAxis dataKey="channel" />
            <BarChart.YAxis />
          </>
        )}
        <BarChart.Legend />
        <BarChart.Tooltip />
        <BarChart.Bar dataKey="desktop" variant="duotone" />
        <BarChart.Bar dataKey="mobile" variant="hatched" />
      </BarChart>
    </div>
  )
}
