'use client'

import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

/**
 * The other state a real dashboard reaches within a week — a filter that matches
 * nothing — and the one worth writing a sentence for, because an empty pair of
 * axes is indistinguishable from a chart that failed to load, so the reader
 * reloads the page and it is still empty. Distinct from the loading skeleton:
 * that one says "not yet", this one says "there is nothing here", and it usually
 * has something to do next attached. Pass empty={false} instead to keep the bare
 * axes, for a chart whose emptiness is itself the reading.
 */
export function Example() {
  return (
    <AreaChart
      title="Visitors per month"
      config={config}
      data={[]}
      empty={{
        title: 'No visits in this range',
        description: 'This project had no traffic before March. Try a wider range.',
      }}
    >
      <AreaChart.Grid />
      <AreaChart.Area dataKey="desktop" />
    </AreaChart>
  )
}
