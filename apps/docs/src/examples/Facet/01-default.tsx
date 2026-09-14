'use client'

import { Facet, LineChart, type ChartConfig } from '@misoto22/folio/charts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

const SERIES: Record<string, number[]> = {
  'Organic search': [4200, 4400, 4100, 4800, 5200, 5600, 6100, 6400],
  'Paid search': [2100, 2000, 1900, 1750, 1600, 1400, 1250, 1100],
  Direct: [1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150],
  Referral: [620, 700, 880, 810, 1020, 1180, 1260, 1400],
  Email: [430, 460, 450, 470, 520, 610, 590, 640],
  Social: [210, 260, 240, 320, 300, 280, 350, 410],
}

const ROWS = MONTHS.flatMap((month, index) =>
  Object.entries(SERIES).map(([channel, values]) => ({
    month,
    channel,
    visitors: values[index] ?? 0,
  })),
)

const config = { visitors: { label: 'Visitors' } } satisfies ChartConfig

/**
 * Six channels as six small plots on ONE domain, which is the entire reason the
 * component exists. Social peaks at 410 and Organic at 6,400, and that ratio is
 * the first thing the grid says — on independent scales the two would draw the
 * same rising line, so the comparison the reader came to make would be inverted
 * rather than merely lost. The shared scale is computed across the panels and
 * handed to the render function as panel.domain; a panel that does not pass it
 * to its value axis has opted back into the broken version. yLabel and xLabel
 * are printed once for the whole grid rather than once per panel, which is five
 * axis titles the reader does not have to read again.
 */
export function Example() {
  return (
    <Facet
      title="Visitors by channel, 2026"
      data={ROWS}
      by="channel"
      value="visitors"
      xDataKey="month"
      columns={3}
      yLabel="Visitors"
      xLabel="Jan – Aug 2026"
    >
      {(panel) => (
        <LineChart
          title={`${panel.name} visitors`}
          config={config}
          data={panel.rows}
          // The grid ships one table for every row, above; a table per panel
          // would put seven of them in the accessibility tree.
          hideDataTable
        >
          <LineChart.Grid />
          <LineChart.XAxis dataKey="month" interval="preserveStartEnd" />
          {/* The line that makes this a comparison rather than six pictures. */}
          <LineChart.YAxis domain={panel.domain} />
          <LineChart.Line dataKey="visitors" />
        </LineChart>
      )}
    </Facet>
  )
}
