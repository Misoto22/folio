'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import {
  SankeyChart,
  type ChartConfig,
  type SankeyLabelPosition,
  type SankeyLinkVariant,
} from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = {
  nodes: [
    { name: 'Search' },
    { name: 'Social' },
    { name: 'Direct' },
    { name: 'Signed up' },
    { name: 'Browsed' },
    { name: 'Left' },
  ],
  links: [
    { source: 0, target: 3, value: 42 },
    { source: 0, target: 4, value: 68 },
    { source: 1, target: 4, value: 51 },
    { source: 1, target: 5, value: 34 },
    { source: 2, target: 3, value: 27 },
    { source: 2, target: 5, value: 18 },
  ],
}

const config = {
  Search: { label: 'Search' },
  Social: { label: 'Social' },
  Direct: { label: 'Direct' },
  'Signed up': { label: 'Signed up' },
  Browsed: { label: 'Browsed' },
  Left: { label: 'Left' },
} satisfies ChartConfig

const LINKS: SankeyLinkVariant[] = ['gradient', 'source', 'target', 'solid']
const LABELS: SankeyLabelPosition[] = ['outside', 'inside']

/**
 * The four link variants and the two label positions on one graph. gradient
 * fades the source's colour into the target's and is the one that reads as
 * movement; source and target attribute a whole band to one end, which is what
 * to reach for when the question is where this came from rather than what
 * became of it; solid gives up colour entirely and lets the node rectangles
 * carry identity. Labels set to inside need a node wide enough to hold them,
 * which is why nodeWidth jumps from 12 to 76 with the toggle — left at 12 the
 * label runs outside the shape it is meant to sit in.
 */
export function Example() {
  const [link, setLink] = useState<SankeyLinkVariant>('gradient')
  const [position, setPosition] = useState<SankeyLabelPosition>('outside')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            type="single"
            value={link}
            onValueChange={(next) => next && setLink(next as SankeyLinkVariant)}
            aria-label="Link"
          >
            {LINKS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={position}
            onValueChange={(next) => next && setPosition(next as SankeyLabelPosition)}
            aria-label="Labels"
          >
            {LABELS.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </ExampleControls>

      <SankeyChart
        title="Visits by source and outcome"
        config={config}
        data={data}
        nodeWidth={position === 'inside' ? 76 : 12}
      >
        <SankeyChart.Node radius={3} isClickable>
          <SankeyChart.NodeLabel position={position} showValues />
        </SankeyChart.Node>
        <SankeyChart.Link variant={link} verticalPadding={2} />
        <SankeyChart.Tooltip />
      </SankeyChart>
    </div>
  )
}
