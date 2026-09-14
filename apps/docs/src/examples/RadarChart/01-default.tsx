'use client'

import { RadarChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { skill: 'Design', current: 86 },
  { skill: 'Research', current: 64 },
  { skill: 'Writing', current: 72 },
  { skill: 'Delivery', current: 91 },
  { skill: 'Review', current: 58 },
  { skill: 'Support', current: 77 },
]

const config = { current: { label: 'Current' } } satisfies ChartConfig

/**
 * One profile across six named dimensions: what a radar offers is a silhouette
 * to recognise, not magnitudes to compare. Two consequences follow from the
 * geometry and neither is a matter of taste — doubling every value quadruples
 * the area the polygon encloses, so the fill overstates the difference it
 * appears to show, and reordering the spokes redraws the same six numbers as a
 * different shape, which makes the axis order a choice the chart cannot label.
 * Dot variant border marks each vertex, which is where the values actually are;
 * the edges between them are interpolation rather than data.
 */
export function Example() {
  return (
    <RadarChart title="Team profile" config={config} data={data} angleDataKey="skill">
      <RadarChart.PolarGrid />
      <RadarChart.PolarAngleAxis dataKey="skill" />
      <RadarChart.Tooltip />
      <RadarChart.Radar dataKey="current">
        <RadarChart.Dot variant="border" />
      </RadarChart.Radar>
    </RadarChart>
  )
}
