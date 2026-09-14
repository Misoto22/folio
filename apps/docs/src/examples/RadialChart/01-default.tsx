'use client'

import { RadialChart, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { tier: 'documents', used: 72 },
  { tier: 'photos', used: 54 },
  { tier: 'backups', used: 31 },
]

const config = {
  documents: { label: 'Documents' },
  photos: { label: 'Photos' },
  backups: { label: 'Backups' },
} satisfies ChartConfig

/**
 * Three totals on one arc with no max, so the scale comes from the data and the
 * largest bar always fills the ring. The caveat is geometric: a bar's LENGTH is
 * its value but its RADIUS is not, so an inner bar and an outer bar holding the
 * same number are drawn at different lengths, and the ring flatters whatever
 * sits outermost. That makes this a display for three or four values a reader
 * will glance at, and a BarChart the honest choice for anything being ranked.
 * The legend does the naming, since the arcs carry no axis of their own.
 */
export function Example() {
  return (
    <RadialChart
      title="Storage used by tier"
      config={config}
      data={data}
      nameKey="tier"
      valueKey="used"
    >
      <RadialChart.RadialBar dataKey="used" isClickable />
      <RadialChart.Tooltip />
      <RadialChart.Legend isClickable />
    </RadialChart>
  )
}
