'use client'

import { LineChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { week: 'W1', p95: 142, p50: 61 },
  { week: 'W2', p95: 161, p50: 64 },
  { week: 'W3', p95: 204, p50: 66 },
  { week: 'W4', p95: 188, p50: 63 },
  { week: 'W5', p95: 134, p50: 58 },
  { week: 'W6', p95: 129, p50: 57 },
]

const config = {
  p95: { label: 'p95 latency' },
  p50: { label: 'p50 latency' },
} satisfies ChartConfig

/**
 * Two series play one after the other, each introduced by name, rather than
 * together with one panned to each ear. Panning is the better demo and the worse
 * choice: it assumes a stereo output and two usable ears, so a mono speaker or a
 * single hearing aid collapses both runs into one melody the listener cannot
 * unpick, and it caps the feature at two series. Both are pitched against the
 * same range, exactly as they share one value axis on screen, so p50's flatness
 * low in the range is audible as flatness rather than renormalised into a second
 * dramatic line.
 */
export function Example() {
  return (
    <LineChart title="Latency per week, milliseconds" config={config} data={data} xDataKey="week">
      <LineChart.Sonify align="start" noteMs={180} />
      <LineChart.Grid />
      <LineChart.XAxis dataKey="week" />
      <LineChart.YAxis label="ms" />
      <LineChart.Legend />
      <LineChart.Tooltip />
      <LineChart.Line dataKey="p95" />
      <LineChart.Line dataKey="p50" strokeVariant="dashed" />
    </LineChart>
  )
}
