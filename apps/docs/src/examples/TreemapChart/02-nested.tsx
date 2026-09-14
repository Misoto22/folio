'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { TreemapChart, type TreemapVariant } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const tree = [
  {
    name: 'runtime',
    children: [
      { name: 'react-dom', size: 310 },
      { name: 'react', size: 92 },
    ],
  },
  {
    name: 'charts',
    children: [
      { name: 'recharts', size: 480 },
      { name: 'motion', size: 140 },
    ],
  },
  {
    name: 'ui',
    children: [
      { name: '@remixicon/react', size: 96 },
      { name: 'cmdk', size: 62 },
      { name: 'sonner', size: 28 },
      { name: 'clsx', size: 12 },
    ],
  },
]

const VARIANTS: TreemapVariant[] = ['ramp', 'nested']

/**
 * Two levels, and the two ways of painting them. ramp walks the series ramp so
 * siblings separate by lightness, which is what a flat set of tiles wants; nested
 * darkens by depth instead, so every tile at one level shares a weight and the
 * question the paint answers becomes what is inside what. Only the leaves carry a
 * size — a branch is the sum of its children — and the hidden data table is
 * flattened to those leaves, because a nested tree read aloud row by row is not
 * something anyone can follow.
 */
export function Example() {
  const [variant, setVariant] = useState<TreemapVariant>('nested')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={variant}
          onValueChange={(next) => next && setVariant(next as TreemapVariant)}
          aria-label="Tile fill"
        >
          {VARIANTS.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <TreemapChart
        title={`Bundle size by group — ${variant}`}
        data={tree}
        variant={variant}
        showLabels
      >
        <TreemapChart.Tooltip />
      </TreemapChart>
    </div>
  )
}
