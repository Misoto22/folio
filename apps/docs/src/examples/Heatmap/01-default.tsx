'use client'

import { Heatmap, type HeatmapCell } from '@misoto22/folio/charts'

const HOURS = ['00', '03', '06', '09', '12', '15', '18', '21']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// A weekday-shaped load: quiet at night, two peaks, and a flat weekend.
const cells: HeatmapCell[] = DAYS.flatMap((row, day) =>
  HOURS.map((column, hour) => {
    const weekend = day >= 5
    const shape = Math.max(0, Math.sin(((hour - 1) / HOURS.length) * Math.PI))
    return {
      row,
      column,
      value: Math.round(shape * (weekend ? 18 : 64) + (weekend ? 2 : 8)),
    }
  }),
)

/**
 * The sequential scale, for a value that only ever goes up — a count, a duration,
 * a volume. The ramp is one hue, light to dark, because lightness is the only
 * channel whose order the eye reads without consulting a legend; spending hue on
 * magnitude is the perennial heatmap mistake, and there is no hue left here to get
 * wrong. The domain is derived from the cells, which is right for a grid read on
 * its own and wrong the moment a second grid is put beside it.
 */
export function Example() {
  return (
    <Heatmap
      title="Commits by weekday and hour"
      showTitle
      description="Darker is busier"
      columns={HOURS}
      rows={DAYS}
      cells={cells}
    />
  )
}
