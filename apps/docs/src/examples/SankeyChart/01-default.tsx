'use client'

import { SankeyChart, type ChartConfig } from '@misoto22/folio/charts'

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

/**
 * The only chart here whose data is a GRAPH rather than a table: it takes nodes
 * and links, and each link names its ends by index into that node array. Width
 * is quantity and a node is drawn as tall as the flows through it, so a link
 * the data leaves out quietly shrinks the node it should have fed — and a flow
 * that returns to a stage it already left has no left-to-right reading at all.
 * The hidden table lists the FLOWS rather than the nodes for the same reason: a
 * table of node totals loses every from-to the diagram exists to state.
 * NodeLabel with showValues prints the number beside each name, because a
 * band's width is no easier to measure by eye than a wedge's angle.
 */
export function Example() {
  return (
    <SankeyChart title="Visits by source and outcome" config={config} data={data} nodeWidth={12}>
      <SankeyChart.Node radius={3}>
        <SankeyChart.NodeLabel position="outside" showValues />
      </SankeyChart.Node>
      <SankeyChart.Link variant="gradient" />
      <SankeyChart.Tooltip />
    </SankeyChart>
  )
}
