'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { PieChart, type ChartConfig } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
]

const config = {
  chrome: { label: 'Chrome' },
  safari: { label: 'Safari' },
  firefox: { label: 'Firefox' },
  edge: { label: 'Edge' },
} satisfies ChartConfig

const SHAPES = {
  pie: { innerRadius: 0, paddingAngle: 0, cornerRadius: 0 },
  donut: { innerRadius: '55%', paddingAngle: 2, cornerRadius: 4 },
  padded: { innerRadius: '35%', paddingAngle: 5, cornerRadius: 6 },
  overlapping: { innerRadius: '40%', paddingAngle: -14, cornerRadius: 8 },
} as const

type Shape = keyof typeof SHAPES

/**
 * Four shapes out of three props — innerRadius, paddingAngle and cornerRadius —
 * over one set of four values. Raising innerRadius above zero makes it a donut,
 * which is the easier of the two to read: the hole takes away the area a reader
 * would otherwise try to judge and leaves the arc. The last option sets a
 * NEGATIVE paddingAngle so the wedges overlap, and the surface-coloured stroke
 * each sector then carries is what re-separates them into stacked cards — a
 * look rather than a reading, since all four shapes draw the same four numbers.
 */
export function Example() {
  const [shape, setShape] = useState<Shape>('donut')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={shape}
          onValueChange={(next) => next && setShape(next as Shape)}
          aria-label="Shape"
        >
          {(Object.keys(SHAPES) as Shape[]).map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <PieChart
        title={`Visitors by browser — ${shape}`}
        config={config}
        data={data}
        dataKey="visitors"
        nameKey="browser"
      >
        <PieChart.Pie {...SHAPES[shape]} />
        <PieChart.Tooltip />
        <PieChart.Legend />
      </PieChart>
    </div>
  )
}
