'use client'

import { ScatterChart, type ChartConfig } from '@misoto22/folio/charts'

const releases = [
  { kb: 120, ms: 340, downloads: 400 },
  { kb: 180, ms: 412, downloads: 1200 },
  { kb: 240, ms: 505, downloads: 260 },
  { kb: 310, ms: 618, downloads: 2400 },
  { kb: 420, ms: 790, downloads: 900 },
]

const config = { releases: { label: 'Releases' } } satisfies ChartConfig

/**
 * A third measure on the same two axes, carried by ZAxis. Recharts scales the z
 * range in AREA units, which is what makes it safe: map a value to a RADIUS
 * instead and doubling it quadruples the ink, so a release with twice the
 * downloads would read as four times as popular. The 60 to 900 range here is a
 * fifteenfold span of area and roughly a fourfold span of diameter. outline is
 * deliberate too — bubbles overlap by construction, and a solid mark hides
 * whatever smaller one it lands on.
 */
export function Example() {
  return (
    <ScatterChart
      title="Load time, bundle size and downloads"
      config={config}
      table={{
        rows: releases,
        rowKey: 'kb',
        columns: [
          { key: 'ms', label: 'Load (ms)' },
          { key: 'downloads', label: 'Downloads' },
        ],
      }}
    >
      <ScatterChart.Grid />
      <ScatterChart.XAxis dataKey="kb" name="Bundle" unit=" kB" />
      <ScatterChart.YAxis dataKey="ms" name="Load" unit=" ms" />
      <ScatterChart.ZAxis dataKey="downloads" name="Downloads" range={[60, 900]} />
      <ScatterChart.Tooltip />
      <ScatterChart.Scatter dataKey="releases" data={releases} variant="outline" />
    </ScatterChart>
  )
}
