'use client'

import { BarChart, type ChartConfig } from '@misoto22/folio/charts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const data = Array.from({ length: 24 }, (_, index) => ({
  month: `${MONTHS[index % 12]} ${25 + Math.floor(index / 12)}`,
  desktop: 1200 + Math.round(Math.sin(index / 3) * 900) + index * 40,
}))

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * The toolbar tops out at five controls and ships no overflow menu, which is a
 * size decision as much as a design one: a row that can never outgrow five 44px
 * targets does not need one, and the menu would cost every consumer of every
 * cartesian chart the Radix menu the chart reaches statically. A chart in a
 * narrow card drops controls instead — zoom={false}, or one export format rather
 * than two. The two files are deliberately not the same picture: the PNG is the
 * plot as it stands and follows the zoom, while the CSV is always the whole
 * dataset, like the figure's hidden data table, because a spreadsheet quietly
 * missing the rows you had zoomed past is data loss you cannot see.
 */
export function Example() {
  return (
    <BarChart title="Visitors by month" config={config} data={data} xDataKey="month">
      <BarChart.Toolbar exports={['png', 'csv']} />
      <BarChart.Grid />
      <BarChart.XAxis dataKey="month" />
      <BarChart.YAxis label="Visitors" />
      <BarChart.Tooltip />
      <BarChart.Bar dataKey="desktop" variant="duotone" />
    </BarChart>
  )
}
