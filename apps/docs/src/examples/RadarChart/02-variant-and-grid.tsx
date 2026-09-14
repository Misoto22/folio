'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { RadarChart, type ChartConfig, type RadarVariant } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { skill: 'Design', current: 86, target: 95 },
  { skill: 'Research', current: 64, target: 80 },
  { skill: 'Writing', current: 72, target: 78 },
  { skill: 'Delivery', current: 91, target: 88 },
  { skill: 'Review', current: 58, target: 75 },
  { skill: 'Support', current: 77, target: 70 },
]

const config = {
  current: { label: 'Current' },
  target: { label: 'Target' },
} satisfies ChartConfig

const VARIANTS: RadarVariant[] = ['filled', 'lines']
const GRIDS = ['polygon', 'circle'] as const

/**
 * A second series on the web, and the two props that decide whether the pair
 * can be told apart. Filled polygons overlap, and judging areas through two
 * layers of translucency is the one thing a radar is worst at — lines gives up
 * the fill and keeps the outline, which is what carries the shape anyway.
 * gridType circle swaps the polygon web for rings, so the grid reads as a scale
 * instead of competing with the marks as a second shape. Clicking a series or
 * its legend entry drops the other to a fifth of its opacity, which is the way
 * back to one silhouette at a time.
 */
export function Example() {
  const [variant, setVariant] = useState<RadarVariant>('lines')
  const [gridType, setGridType] = useState<(typeof GRIDS)[number]>('polygon')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={variant}
            onValueChange={(next) => next && setVariant(next as RadarVariant)}
            aria-label="Radar fill"
          >
            {VARIANTS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={gridType}
            onValueChange={(next) => next && setGridType(next as (typeof GRIDS)[number])}
            aria-label="Grid"
          >
            {GRIDS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <RadarChart title="Team profile" config={config} data={data} angleDataKey="skill">
        <RadarChart.PolarGrid gridType={gridType} />
        <RadarChart.PolarAngleAxis dataKey="skill" />
        <RadarChart.Legend isClickable />
        <RadarChart.Tooltip />
        <RadarChart.Radar dataKey="current" variant={variant} isClickable />
        <RadarChart.Radar dataKey="target" variant={variant} isClickable />
      </RadarChart>
    </div>
  )
}
