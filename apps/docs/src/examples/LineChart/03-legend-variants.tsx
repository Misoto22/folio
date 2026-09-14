'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { LineChart, type ChartConfig, type ChartLegendVariant } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

const VARIANTS: ChartLegendVariant[] = [
  'square',
  'circle',
  'circle-outline',
  'rounded-square',
  'rounded-square-outline',
  'vertical-bar',
  'horizontal-bar',
]

/**
 * Seven swatch shapes, and the mark is doing more work here than it would in a
 * chromatic system: two lines differ by a step of grey and a dash pattern, and
 * neither names itself, which is why a legend is required above one series rather
 * than decorative. Matching the swatch to the mark — a bar beside a bar chart, a
 * dot beside a scatter — is often the fastest way a reader ties the key to the
 * plot.
 */
export function Example() {
  const [variant, setVariant] = useState<ChartLegendVariant>('rounded-square')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as ChartLegendVariant)}
          aria-label="Legend swatch"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <LineChart title="Visitors per month" config={config} data={data}>
        <LineChart.Grid />
        <LineChart.XAxis dataKey="month" />
        <LineChart.Legend variant={variant} />
        <LineChart.Tooltip />
        <LineChart.Line dataKey="desktop" />
        <LineChart.Line dataKey="mobile" strokeVariant="dashed" />
      </LineChart>
    </div>
  )
}
