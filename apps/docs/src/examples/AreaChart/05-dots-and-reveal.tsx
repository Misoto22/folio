'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  AreaChart,
  type ChartConfig,
  type ChartDotVariant,
  type ChartRevealType,
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

const DOTS: ChartDotVariant[] = ['default', 'border', 'colored-border']
const REVEALS: ChartRevealType[] = ['forward', 'reverse', 'center-out', 'edges-in', 'none']

/**
 * Markers and the intro wipe are one subject because they share one mask: it
 * covers the area's fill, its stroke and its resting dots together, so the
 * markers arrive with the line instead of popping in ahead of it, which is what
 * happens when the two are animated apart. The key on the chart is what replays
 * the reveal — changing animationType alone would not remount the area. A reveal
 * is a per-frame animated SVG mask and the heaviest thing in the package, which
 * is why none is a real answer and is also where an OS reduce-motion preference
 * lands.
 */
export function Example() {
  const [dot, setDot] = useState<ChartDotVariant>('border')
  const [reveal, setReveal] = useState<ChartRevealType>('forward')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={dot}
            onValueChange={(next) => next && setDot(next as ChartDotVariant)}
            aria-label="Dot"
          >
            {DOTS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={reveal}
            onValueChange={(next) => next && setReveal(next as ChartRevealType)}
            aria-label="Reveal"
          >
            {REVEALS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <AreaChart
        key={`${dot}-${reveal}`}
        title="Visitors per month"
        config={config}
        data={data}
        animationType={reveal}
      >
        <AreaChart.Grid />
        <AreaChart.XAxis dataKey="month" />
        <AreaChart.Tooltip />
        <AreaChart.Area dataKey="desktop" variant="solid">
          <AreaChart.Dot variant={dot} />
          <AreaChart.ActiveDot variant="colored-border" />
        </AreaChart.Area>
      </AreaChart>
    </div>
  )
}
