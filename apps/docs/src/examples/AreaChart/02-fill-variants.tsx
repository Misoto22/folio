'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { AreaChart, type AreaVariant, type ChartConfig } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 314 },
]

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

const VARIANTS: AreaVariant[] = [
  'gradient',
  'gradient-reverse',
  'solid',
  'dotted',
  'lines',
  'hatched',
]

/**
 * The six fills, cycled on one series so the differences are comparable. With no
 * hue to spend, this is the axis that separates two areas before the ramp does,
 * so a chart with more than one area should vary this before it varies anything
 * else. gradient is the default and dissolves toward the axis, solid reads as a
 * band rather than a slope, and the three textures are the ones that still
 * separate two series in a greyscale print.
 */
export function Example() {
  const [variant, setVariant] = useState<AreaVariant>('gradient')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as AreaVariant)}
          aria-label="Fill variant"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <AreaChart title={`Visitors per month — ${variant} fill`} config={config} data={data}>
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="desktop" variant={variant} />
      </AreaChart>
    </div>
  )
}
