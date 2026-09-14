'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { LineChart, type ChartBackgroundVariant, type ChartConfig } from '@misoto22/folio/charts'
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

const VARIANTS: ChartBackgroundVariant[] = [
  'dots',
  'grid',
  'cross-hatch',
  'diagonal-lines',
  'plus',
  'falling-triangles',
  '4-pointed-star',
  'tiny-checkers',
  'overlapping-circles',
  'wiggle-lines',
  'bubbles',
]

/**
 * Eleven decorative plates, and the count is the point: with no hue to spend, a
 * chart's personality has to come from somewhere, and the plate is the one place
 * texture can be loud without competing with the marks. It is drawn to the plot
 * rectangle rather than to the whole SVG, so it stops where the data stops and
 * never runs underneath the tick labels. It is not a grid, though — this example
 * composes it in place of one, and a plate helps nobody read a value off an axis.
 */
export function Example() {
  const [variant, setVariant] = useState<ChartBackgroundVariant>('dots')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as ChartBackgroundVariant)}
          aria-label="Background plate"
          className="flex-wrap"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <LineChart title={`Visitors per month — ${variant} plate`} config={config} data={data}>
        <LineChart.Background variant={variant} />
        <LineChart.XAxis dataKey="month" />
        <LineChart.Tooltip />
        <LineChart.Line dataKey="desktop" />
      </LineChart>
    </div>
  )
}
