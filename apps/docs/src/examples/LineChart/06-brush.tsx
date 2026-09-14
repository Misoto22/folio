'use client'

import { LineChart, type ChartConfig } from '@misoto22/folio/charts'

const data = Array.from({ length: 40 }, (_, index) => ({
  day: `D${index + 1}`,
  desktop: 160 + Math.round(Math.sin(index / 4) * 70),
  mobile: 90 + Math.round(Math.cos(index / 5) * 50),
}))

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

/**
 * Forty rows and two series, which is where a line chart starts crossing itself.
 * The strip is a miniature of the whole series with a lit window over the part
 * the plot above is showing, so the reader can see what they are choosing from
 * while they choose it. Its handles are positioned by inline style rather than by
 * start and end classes on purpose: a cartesian plot is drawn first row first in
 * every writing direction, so mirroring them under dir="rtl" would put the
 * earlier handle at the end of a chart that still runs the other way.
 */
export function Example() {
  return (
    <LineChart title="Visitors per day" config={config} data={data} xDataKey="day">
      <LineChart.Grid />
      <LineChart.XAxis dataKey="day" />
      <LineChart.Legend />
      <LineChart.Tooltip />
      <LineChart.Line dataKey="desktop" />
      <LineChart.Line dataKey="mobile" strokeVariant="dashed" />
      <LineChart.Brush height={56} />
    </LineChart>
  )
}
