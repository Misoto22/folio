'use client'

import { Heatmap, type HeatmapCell } from '@misoto22/folio/charts'

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']
const TEAMS = ['Platform', 'Growth', 'Mobile', 'Data']

// A delta against target: negative and positive both matter, and zero is the
// page itself.
const cells: HeatmapCell[] = TEAMS.flatMap((row, team) =>
  WEEKS.map((column, week) => ({
    row,
    column,
    value: week === 3 && team === 2 ? null : Math.round(Math.sin(week + team * 1.7) * 40),
  })),
)

/**
 * Diverging reads distance from the midpoint, so both directions darken and the
 * middle of the scale is the page itself — the scale for a delta, a residual,
 * anything whose zero is a real boundary rather than just the bottom. The domain
 * is pinned symmetrically on purpose: derived, it would run from the lowest
 * reading to the highest and leave the midpoint wherever the extremes happened to
 * fall rather than on the zero the scale hinges on. The week with no reading is
 * drawn as a dashed outline instead of the palest cell, because a gap is not a
 * zero, and showValues caps the wash at 35 percent of the ramp so a printed number
 * clears its own background on every cell.
 */
export function Example() {
  return (
    <Heatmap
      title="Weekly delta against target"
      showTitle
      description="Zero is the page; darker is further from target in either direction"
      columns={WEEKS}
      rows={TEAMS}
      cells={cells}
      scale="diverging"
      domain={[-40, 40]}
      showValues
    />
  )
}
