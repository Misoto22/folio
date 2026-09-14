'use client'

import { Heatmap, formatNumber, type HeatmapCell } from '@misoto22/folio/charts'

const SHIFTS = ['00–06', '06–12', '12–18', '18–24']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

/** Median queue wait in seconds, one array per weekday, in shift order. */
function cells(byDay: number[][]): HeatmapCell[] {
  return DAYS.flatMap((row, day) =>
    SHIFTS.map((column, shift) => ({ row, column, value: byDay[day]?.[shift] ?? null })),
  )
}

const sydney = cells([
  [45, 210, 480, 260],
  [50, 240, 520, 275],
  [60, 260, 505, 300],
  [55, 250, 540, 320],
  [70, 300, 590, 355],
])

const frankfurt = cells([
  [30, 90, 160, 120],
  [35, 105, 180, 130],
  [40, 110, 175, 140],
  [30, 95, 165, 125],
  [45, 120, 200, 150],
])

const WAIT: [number, number] = [0, 600]
const asDuration = formatNumber({ style: 'duration' })

/**
 * Two grids that only mean something read against each other, so both are pinned
 * to one domain. Derived, each would run from zero to its own largest reading and
 * both would use the full ramp — Frankfurt's three-minute peak would come out
 * exactly as dark as Sydney's ten-minute one, which is the single failure a shared
 * legend cannot fix. formatValue carries the unit into the cells: without it a
 * shift announces itself as 480, and with it as 8m, which is the difference
 * between a number and a reading for anyone reaching these cells through the table
 * rather than by eye.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-2">
      <Heatmap
        title="Median queue wait — Sydney"
        showTitle
        description="Darker is a longer wait"
        columns={SHIFTS}
        rows={DAYS}
        cells={sydney}
        domain={WAIT}
        formatValue={asDuration}
      />
      <Heatmap
        title="Median queue wait — Frankfurt"
        showTitle
        description="Same scale, so the two grids can be compared"
        columns={SHIFTS}
        rows={DAYS}
        cells={frankfurt}
        domain={WAIT}
        formatValue={asDuration}
      />
    </div>
  )
}
