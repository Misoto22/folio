'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { AreaChart, type AreaStackType, type ChartConfig } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 314, mobile: 240 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

const STACKS: AreaStackType[] = ['default', 'stacked', 'expanded']

/**
 * Three different questions, not three looks: default compares two series,
 * stacked reads their total, expanded reads their share — and the value axis
 * switches to percentages on its own for the third. What stacking hides is the
 * baseline: only the bottom band still sits on a straight line, so every band
 * above it is a shape whose rises and falls are partly the band beneath it, which
 * is why default is still the setting for "did mobile grow".
 */
export function Example() {
  const [stackType, setStackType] = useState<AreaStackType>('stacked')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={stackType}
          onValueChange={(next) => next && setStackType(next as AreaStackType)}
          aria-label="Stacking"
        >
          {STACKS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <AreaChart
        title={`Visitors per month — ${stackType}`}
        config={config}
        data={data}
        stackType={stackType}
      >
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.YAxis />
        <AreaChart.Legend />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="desktop" variant="solid" />
        <AreaChart.Area dataKey="mobile" variant="lines" />
      </AreaChart>
    </div>
  )
}
