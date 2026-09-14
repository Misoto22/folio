'use client'

import { BarChart, formatNumber, type ChartConfig } from '@misoto22/folio/charts'

const data = [
  { month: 'Jan', revenue: 18_600, refunds: 1_240 },
  { month: 'Feb', revenue: 30_500, refunds: 980 },
  { month: 'Mar', revenue: 23_700, refunds: 2_310 },
  { month: 'Apr', revenue: 27_300, refunds: 1_150 },
  { month: 'May', revenue: 9_200, refunds: 3_040 },
  { month: 'Jun', revenue: 31_400, refunds: 870 },
]

const config = {
  revenue: { label: 'Revenue' },
  refunds: { label: 'Refunds' },
} satisfies ChartConfig

const money = formatNumber({ style: 'currency', currency: 'AUD', fractionDigits: 0 })

/**
 * Two series on screen and one worth listening to. keys narrows the run, because
 * playback is sequential — each series plays in full, one after another — and a
 * listener rarely wants all of them. formatValue is what the announcement speaks,
 * so the range is read out in the units the axis prints, "from $9,200 to $31,400"
 * rather than "9200"; leave it off and the spoken range falls back to the default
 * tick format, which is not the one on the axis beside it.
 */
export function Example() {
  return (
    <BarChart title="Revenue by month" config={config} data={data} xDataKey="month">
      <BarChart.Sonify keys={['revenue']} formatValue={money} />
      <BarChart.Grid />
      <BarChart.XAxis dataKey="month" />
      <BarChart.YAxis tickFormatter={money} width={72} />
      <BarChart.Legend />
      <BarChart.Tooltip />
      <BarChart.Bar dataKey="revenue" variant="duotone" />
      <BarChart.Bar dataKey="refunds" variant="hatched" />
    </BarChart>
  )
}
