'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  BarChart,
  type ChartConfig,
  type ChartTooltipRoundness,
  type ChartTooltipVariant,
} from '@misoto22/folio/charts'
import { RiComputerLine, RiSmartphoneLine } from '@remixicon/react'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
]

// A config entry can carry an icon, which the legend and the tooltip draw in
// place of the swatch. The label still does the naming; the icon is decoration.
const config = {
  desktop: { label: 'Desktop', icon: RiComputerLine },
  mobile: { label: 'Mobile', icon: RiSmartphoneLine },
} satisfies ChartConfig

const VARIANTS: ChartTooltipVariant[] = ['solid', 'frosted']
const ROUNDNESS: ChartTooltipRoundness[] = ['sm', 'md', 'lg']

/**
 * What a reader can do with a chart rather than what it looks like. The legend
 * entries are real buttons with aria-pressed, so Tab reaches them and Enter
 * toggles a series — a styled div with a click handler could do neither — and the
 * bars take a click to select for the same reason. The tooltip's ground and its
 * corner are the two knobs worth exposing, and defaultIndex opens it on a row
 * before anything is hovered, so the panel is legible in a screenshot and to a
 * reader who never moves a pointer. Both knobs move the floating panel and
 * nothing else on the card — and frosted is the plot showing THROUGH that
 * panel, so it reads where the panel crosses a bar and nowhere else: over the
 * white ground it is white at 75% over white, which is white.
 */
export function Example() {
  const [variant, setVariant] = useState<ChartTooltipVariant>('solid')
  const [roundness, setRoundness] = useState<ChartTooltipRoundness>('lg')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={variant}
            onValueChange={(next) => next && setVariant(next as ChartTooltipVariant)}
            aria-label="Tooltip ground"
          >
            {VARIANTS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={roundness}
            onValueChange={(next) => next && setRoundness(next as ChartTooltipRoundness)}
            aria-label="Tooltip corner"
          >
            {ROUNDNESS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <BarChart title="Visitors by month" config={config} data={data}>
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        <BarChart.Legend isClickable />
        <BarChart.Tooltip variant={variant} roundness={roundness} defaultIndex={1} />
        <BarChart.Bar dataKey="desktop" isClickable />
        <BarChart.Bar dataKey="mobile" variant="hatched" isClickable />
      </BarChart>
    </div>
  )
}
