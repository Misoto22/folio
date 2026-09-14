'use client'

import { Sparkline } from '@misoto22/folio/charts'

const ROWS = [
  { project: 'Kestrel', trend: [12, 15, 14, 19, 22, 26, 31] },
  { project: 'Harrier', trend: [8] },
  { project: 'Merlin', trend: [] },
]

/**
 * What a sparkline does when there is no shape to draw. Under two points it
 * prints its own label followed by "not enough data" instead of a mark: one
 * reading is not a trend, and normalising a single value against itself puts a
 * dot wherever the arithmetic lands, which a reader would take for a
 * measurement. It is the state a new project is in on its first day and the
 * state a narrow filter reaches constantly, so it is worth knowing what it looks
 * like before it turns up forty rows down a table.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {ROWS.map((row) => (
        <div key={row.project} className="flex items-center gap-4">
          <span className="w-16 shrink-0 mono-meta text-(--ink-3-aa)">{row.project}</span>
          <Sparkline label={`${row.project}, last seven days`} data={row.trend} />
        </div>
      ))}
    </div>
  )
}
