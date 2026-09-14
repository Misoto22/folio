'use client'

import { ScatterChart, type ChartConfig } from '@misoto22/folio/charts'

const desktop = [
  { kb: 120, ms: 340 },
  { kb: 180, ms: 412 },
  { kb: 240, ms: 505 },
  { kb: 310, ms: 618 },
  { kb: 360, ms: 660 },
  { kb: 420, ms: 790 },
  { kb: 470, ms: 812 },
]

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * Two measures against each other, one mark per observation — the only chart
 * here whose x axis is a NUMBER rather than a category, which is what lets it
 * answer correlation, clustering and outliers. Seven points rising together is
 * a pattern and not a coefficient: nothing here fits a line, and the chart
 * claims no share of ms explained by kB. Each solid mark carries a
 * surface-coloured ring, the hairline that keeps two overlapping observations
 * countable — past a few hundred points that stops working and density has to
 * be shown some other way. The table prop is not bookkeeping: a scatter's rows
 * live on each Scatter rather than on the root, so unlike every other chart in
 * the package the hidden table cannot be inferred and has to be declared.
 */
export function Example() {
  return (
    <ScatterChart
      title="Load time against bundle size"
      config={config}
      table={{
        rows: desktop,
        rowKey: 'kb',
        columns: [{ key: 'ms', label: 'Load (ms)' }],
      }}
    >
      <ScatterChart.Grid />
      <ScatterChart.XAxis dataKey="kb" name="Bundle" unit=" kB" />
      <ScatterChart.YAxis dataKey="ms" name="Load" unit=" ms" />
      <ScatterChart.Tooltip />
      <ScatterChart.Scatter dataKey="desktop" data={desktop} />
    </ScatterChart>
  )
}
