'use client'

import { PieChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
  { browser: 'other', visitors: 90 },
]

const config = {
  chrome: { label: 'Chrome' },
  safari: { label: 'Safari' },
  firefox: { label: 'Firefox' },
  edge: { label: 'Edge' },
  other: { label: 'Other' },
} satisfies ChartConfig

/**
 * The default composition — wedges, a hover panel and a key. A pie is read by
 * angle, the least precise encoding on offer, so it answers roughly what share
 * and nothing more precise: ranking 275 against 200 by eye is unreliable, and
 * past about five wedges, which is exactly this many, a BarChart answers the
 * same question better. The legend is not decoration here, since a pie has no
 * category axis and nothing else names the sectors; the figure also ships a
 * hidden table of the same rows, which is where the exact numbers live.
 */
export function Example() {
  return (
    <PieChart
      title="Visitors by browser"
      config={config}
      data={data}
      dataKey="visitors"
      nameKey="browser"
    >
      <PieChart.Pie />
      <PieChart.Tooltip />
      <PieChart.Legend />
    </PieChart>
  )
}
