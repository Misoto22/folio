import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface Figure {
  /** Stable key; also what a caller keys its own data by. */
  id: string
  /** The label over the value. */
  label: string
  /** The value itself, set in the serif at the band's scale. */
  value: ReactNode
  /** The quiet line under it — a trend, a qualifier, a second fact. */
  note?: ReactNode
}

export interface FigureBandProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  figures: Figure[]
  /**
   * How large the value is set.
   *
   * `lead` is for a band that is the point of its page — a stats headline,
   * where the numbers ARE the content. `sub` is for a band that supports the
   * page around it, and keeps the ladder honest: a supporting figure must not
   * be set at the same size as the page's own subject.
   */
  scale?: 'lead' | 'sub'
  /** Names the band for assistive tech when it has no visible heading of its own. */
  label?: string
}

const VALUE_SCALE = {
  lead: 'text-[clamp(2rem,4cqi,2.75rem)] leading-[1.15] tracking-[-0.02em] tabular-nums',
  sub: 'text-[length:var(--fs-sub)] leading-[1.2]',
} as const

/** A framed, responsive group of related facts with semantic term/value pairs. */
export function FigureBand({
  figures,
  scale = 'lead',
  label,
  className,
  ...rest
}: FigureBandProps) {
  if (figures.length === 0) return null

  // Balance six metrics into two complete rows instead of a four-plus-two grid.
  const columns = Math.min(4, Math.ceil(figures.length / Math.ceil(figures.length / 4)))
  const columnClass = {
    1: '@xl:basis-full',
    2: '@xl:basis-[calc(50%-.5px)]',
    3: '@xl:basis-[calc(33.333333%-.667px)]',
    4: '@xl:basis-[calc(25%-.75px)]',
  }[columns]

  return (
    <div className="folio-figure-band @container w-full">
      <dl
        aria-label={label}
        className={cn(
          'm-0 flex w-full flex-wrap gap-px overflow-hidden rounded-[10px] border border-(--rule) bg-(--rule)',
          className,
        )}
        {...rest}
      >
        {figures.map((figure) => (
          <div
            key={figure.id}
            className={cn('min-w-0 grow basis-[calc(50%-.5px)] bg-(--paper) px-5 py-5 @xl:px-6 @xl:py-6', columnClass)}
          >
            <dt className="mb-2 font-sans text-[13px] font-normal leading-normal text-(--ink-3-aa)">{figure.label}</dt>
            <dd className={cn('m-0 font-heading font-normal text-(--ink)', VALUE_SCALE[scale])}>
              {figure.value}
            </dd>
            {figure.note !== undefined && figure.note !== null && (
              <dd className="m-0 mt-2.5 font-sans text-[13px] font-light leading-[1.5] text-(--ink-3-aa)">
                {figure.note}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}

export default FigureBand
