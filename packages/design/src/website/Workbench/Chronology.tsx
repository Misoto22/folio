import type { CSSProperties, ReactNode } from 'react'

export interface ChronologyItem {
  id: string
  title: ReactNode
  organisation?: ReactNode
  /** Decimal years, e.g. 2019.5 for July 2019. */
  start: number
  /** Decimal years; omit for an item that is still going. */
  end?: number
  kind: 'role' | 'study'
}

export interface ChronologyProps {
  /** Accessible name of the chart. */
  label: string
  /** First and last year on the axis, inclusive. */
  from: number
  to: number
  items: ChronologyItem[]
  /** Text marking a current item, such as "Now". */
  currentLabel?: ReactNode
}

/**
 * Roles and studies as bars on one year axis, one lane each. Roles are filled,
 * studies outlined, and a current role is ink with an accent end. The bars are
 * a list underneath, so a screen reader hears titles and dates rather than
 * geometry.
 */
export function Chronology({ label, from, to, items, currentLabel }: ChronologyProps) {
  const span = to + 1 - from
  const years = Array.from({ length: to - from + 1 }, (_, index) => from + index)
  const position = (value: number) => `${(((value - from) / span) * 100).toFixed(3)}%`
  return (
    <figure className="folio-wb-chronology" aria-label={label}>
      <ol>
        {items.map((item) => {
          const current = item.end === undefined
          // A bar that starts in the later part of the axis hangs its label from its end,
          // so a long title never runs off the right of the axis.
          const align = current || (item.start - from) / span >= 0.4 ? 'end' : 'start'
          const style = { '--start': position(item.start), '--end': position(item.end ?? to + 1) } as CSSProperties
          return (
            <li key={item.id} data-kind={item.kind} data-current={current || undefined} data-align={align} style={style}>
              <p>
                <span>{item.title}</span>
                {item.organisation && <span className="folio-wb-chronology-org"> · {item.organisation}</span>}
                {current && currentLabel && <span className="folio-wb-chronology-now"> · {currentLabel}</span>}
              </p>
              <span className="folio-wb-chronology-bar" aria-hidden />
            </li>
          )
        })}
      </ol>
      <div className="folio-wb-chronology-axis" aria-hidden>
        {years.map((year) => (
          <span key={year}>{year}</span>
        ))}
      </div>
    </figure>
  )
}
