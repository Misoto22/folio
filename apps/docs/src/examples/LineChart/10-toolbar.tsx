'use client'

import { LineChart, type ChartConfig } from '@misoto22/folio/charts'

const data = Array.from({ length: 90 }, (_, index) => ({
  day: `D${index + 1}`,
  desktop: 160 + Math.round(Math.sin(index / 6) * 70),
  mobile: 90 + Math.round(Math.cos(index / 9) * 50),
}))

const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig

/**
 * The toolbar and the brush drive one window, so they cannot disagree: step the
 * zoom and the handles below move, drag a handle and reset zoom lights up. Ninety
 * days is the case that wants both — the strip shows the shape you are choosing
 * from, the buttons step into it precisely. Composing the toolbar is also what
 * switches the plot's own gestures on: it becomes focusable, arrow keys pan, plus
 * and minus zoom, zero resets, and dragging across the plot zooms to that span.
 * The wheel is gated behind Ctrl or Cmd, because a chart that swallowed a plain
 * wheel event would trap the page's scroll under the pointer.
 */
export function Example() {
  return (
    <LineChart title="Visitors per day" config={config} data={data} xDataKey="day">
      <LineChart.Toolbar exports={['png', 'csv']} />
      <LineChart.Grid />
      <LineChart.XAxis dataKey="day" />
      <LineChart.YAxis label="Visitors" />
      <LineChart.Legend />
      <LineChart.Tooltip />
      <LineChart.Line dataKey="desktop" />
      <LineChart.Line dataKey="mobile" strokeVariant="dashed" />
      <LineChart.Brush height={48} />
    </LineChart>
  )
}
