'use client'

import { SankeyChart, type ChartConfig } from '@misoto22/folio/charts'

const data = { nodes: [{ name: 'Search' }], links: [] }

const config = { Search: { label: 'Search' } } satisfies ChartConfig

/**
 * The skeleton, and the one in this set that ignores its data: while isLoading
 * is set the diagram is replaced by a fixed eight-node, eleven-link graph, so
 * the shape reads as a sankey before anything has arrived and the data prop
 * only has to satisfy the type. Nodes and links pulse out of phase rather than
 * together, which is what keeps a skeleton from reading as one blinking block;
 * under prefers-reduced-motion they hold at fixed opacities instead. Node and
 * Link are slots the root reads, so composing them costs nothing here and is
 * what makes the diagram come back as itself when the graph lands.
 */
export function Example() {
  return (
    <SankeyChart title="Visits by source and outcome" config={config} data={data} isLoading>
      <SankeyChart.Node />
      <SankeyChart.Link />
    </SankeyChart>
  )
}
