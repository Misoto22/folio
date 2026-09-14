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

/** One row per month, one column per channel — what a multi-series chart eats. */
const WIDE = MONTHS.map((month, index) => {
  const row: Record<string, string | number> = { month }
  for (const [channel, values] of Object.entries(SERIES)) row[channel] = values[index] ?? 0
  return row
})

/** One row per month PER channel — what a facet eats. */
const LONG = MONTHS.flatMap((month, index) =>
  Object.entries(SERIES).map(([channel, values]) => ({
    month,
    channel,
    visitors: values[index] ?? 0,
  })),
)

const overplotted = Object.fromEntries(
  Object.keys(SERIES).map((channel) => [channel, { label: channel }]),
) satisfies ChartConfig

const single = { visitors: { label: 'Visitors' } } satisfies ChartConfig

/**
 * The same six channels twice, and the trade stated as a picture. Above, one
 * plot and six lines: the legend has to be carried back into the hairball, and
 * Paid search falling by half is invisible under Organic's rise. Below, six
 * small plots on one domain, where that fall is the second thing you see and
 * the ranking is the first. Faceting costs the direct overlay — crossovers and
 * gaps between two named series are gone, and past about five series that is a
 * trade worth making every time — and it costs a reshape, since a multi-series
 * chart eats one row per month with a column per channel while a facet eats one
 * row per month PER channel.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="eyebrow text-(--ink-3-aa)">Overplotted — six series, one plot</p>
        <LineChart
          title="Visitors by channel, overplotted"
          config={overplotted}
          data={WIDE}
          xDataKey="month"
        >
          <LineChart.Grid />
          <LineChart.XAxis dataKey="month" />
          <LineChart.YAxis />
          <LineChart.Legend />
          <LineChart.Tooltip />
          {Object.keys(SERIES).map((channel) => (
            <LineChart.Line key={channel} dataKey={channel} />
          ))}
        </LineChart>
      </section>

      <section className="flex flex-col gap-2">
        <p className="eyebrow text-(--ink-3-aa)">Faceted — six plots, one domain</p>
        <Facet
          title="Visitors by channel, faceted"
          data={LONG}
          by="channel"
          value="visitors"
          xDataKey="month"
          columns={3}
          yLabel="Visitors"
        >
          {(panel) => (
            <LineChart title={`${panel.name} visitors`} config={single} data={panel.rows} hideDataTable>
              <LineChart.Grid />
              <LineChart.XAxis dataKey="month" interval="preserveStartEnd" />
              <LineChart.YAxis domain={panel.domain} />
              <LineChart.Line dataKey="visitors" />
            </LineChart>
          )}
        </Facet>
      </section>
    </div>
  )
}
