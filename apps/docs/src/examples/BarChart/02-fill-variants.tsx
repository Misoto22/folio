'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { BarChart, type BarVariant, type ChartConfig } from '@misoto22/folio/charts'
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

const VARIANTS: BarVariant[] = [
  'default',
  'hatched',
  'duotone',
  'duotone-reverse',
  'gradient',
  'stripped',
]

/**
 * Six ways to fill a bar, cycled on one series so they are comparable. stripped
 * is the one that survives density best: it rounds only the top corners and
 * prints a 2px cap of the series colour above a wash, so at twenty bars it still
 * reads as twenty distinct values where a solid block has become a wall. The
 * rest trade weight for texture, and with no hue to spend this is what separates
 * two series before the ramp does.
 */
export function Example() {
  const [variant, setVariant] = useState<BarVariant>('default')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as BarVariant)}
          aria-label="Fill variant"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <BarChart title={`Visitors by month — ${variant}`} config={config} data={data}>
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.Tooltip />
        <BarChart.Bar dataKey="desktop" variant={variant} />
      </BarChart>
    </div>
  )
}
