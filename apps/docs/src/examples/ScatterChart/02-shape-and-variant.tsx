'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  ScatterChart,
  type ChartConfig,
  type ScatterShape,
  type ScatterVariant,
} from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const desktop = [
  { kb: 120, ms: 340 },
  { kb: 180, ms: 412 },
  { kb: 240, ms: 505 },
  { kb: 310, ms: 618 },
  { kb: 420, ms: 790 },
]

const mobile = [
  { kb: 130, ms: 520 },
  { kb: 190, ms: 610 },
  { kb: 250, ms: 704 },
  { kb: 320, ms: 861 },
  { kb: 430, ms: 990 },
]

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

const SHAPES: ScatterShape[] = ['circle', 'square', 'triangle', 'diamond', 'cross', 'ring']
const VARIANTS: ScatterVariant[] = ['solid', 'outline']

/**
 * Two clouds that overlap, and the props that keep them apart. The package's
 * ramp is monochrome, so shape is doing the work hue does elsewhere: circle
 * against cross separates two overlapping clouds far better than two steps of
 * grey, and a shape survives overprinting where a lightness step does not.
 * outline hollows the mark out, which is the version to reach for where the
 * clouds sit on top of each other, since a hollow mark shows the one underneath
 * it. Past three series shape stops separating them, and the answer is a grid
 * of small multiples — one plot per series, same axes — not a fourth glyph.
 */
export function Example() {
  const [shape, setShape] = useState<ScatterShape>('circle')
  const [variant, setVariant] = useState<ScatterVariant>('solid')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={shape}
            onValueChange={(next) => next && setShape(next as ScatterShape)}
            aria-label="Mark shape"
          >
            {SHAPES.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={variant}
            onValueChange={(next) => next && setVariant(next as ScatterVariant)}
            aria-label="Mark fill"
          >
            {VARIANTS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <ScatterChart
        title="Load time against bundle size"
        config={config}
        table={{
          rows: [...desktop, ...mobile],
          rowKey: 'kb',
          columns: [{ key: 'ms', label: 'Load (ms)' }],
        }}
      >
        <ScatterChart.Grid />
        <ScatterChart.XAxis dataKey="kb" name="Bundle" unit=" kB" />
        <ScatterChart.YAxis dataKey="ms" name="Load" unit=" ms" />
        <ScatterChart.Legend isClickable />
        <ScatterChart.Tooltip />
        <ScatterChart.Scatter
          dataKey="desktop"
          data={desktop}
          shape={shape}
          variant={variant}
          isClickable
        />
        <ScatterChart.Scatter dataKey="mobile" data={mobile} shape="cross" isClickable />
      </ScatterChart>
    </div>
  )
}
