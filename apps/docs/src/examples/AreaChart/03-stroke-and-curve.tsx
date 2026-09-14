'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  AreaChart,
  type AreaStrokeVariant,
  type ChartConfig,
  type ChartCurveType,
} from '@misoto22/folio/charts'
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

const STROKES: AreaStrokeVariant[] = ['solid', 'dashed', 'animated-dashed']
const CURVES = ['linear', 'monotone', 'step', 'bump'] as const

/**
 * The two axes of the line itself, and they sit at different levels: strokeVariant
 * belongs to one area, curveType belongs to the whole chart. animated-dashed is a
 * SMIL loop, which the stylesheet's reduced-motion rule cannot reach, so the
 * component gates it and drops it entirely rather than merely slowing it. The
 * curve is the setting that changes what the picture claims rather than how it
 * looks — step says nothing was measured between two rows, monotone says the
 * quantity moved smoothly, and the rows cannot tell you which is true.
 */
export function Example() {
  const [stroke, setStroke] = useState<AreaStrokeVariant>('dashed')
  const [curve, setCurve] = useState<ChartCurveType>('linear')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={stroke}
            onValueChange={(next) => next && setStroke(next as AreaStrokeVariant)}
            aria-label="Stroke"
          >
            {STROKES.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={String(curve)}
            onValueChange={(next) => next && setCurve(next as ChartCurveType)}
            aria-label="Curve"
          >
            {CURVES.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <AreaChart title="Visitors per month" config={config} data={data} curveType={curve}>
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="desktop" variant="solid" strokeVariant={stroke} />
      </AreaChart>
    </div>
  )
}
