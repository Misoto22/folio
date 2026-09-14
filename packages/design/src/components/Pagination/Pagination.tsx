'use client'

import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useSelectionIndicator } from '../../lib/useSelectionIndicator'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 1-based. */
  page: number
  /** Total pages. A value of 1 or less renders nothing. */
  pageCount: number
  onPageChange: (page: number) => void
  /** How many numbered pages sit either side of the current one. */
  siblings?: number
  label?: string
  /**
   * Names the two step controls.
   *
   * Each is a chevron and nothing else, so these strings are its entire
   * accessible name — the same reason `AppShell` exposes `openLabel` and
   * `closeLabel` rather than baking them in.
   */
  previousLabel?: string
  nextLabel?: string
  /**
   * Names one numbered page.
   *
   * A function rather than a template, because the number does not sit in the
   * same place in every language and neither does the noun around it —
   * `"Page 3"`, `"第 3 页"`, `"Seite 3"`. The visible digit is the same either
   * way; this is what a screen reader hears instead of a bare number.
   */
  pageLabel?: (page: number) => string
}

const GAP = '…' as const

/**
 * Builds the visible page list: always the first and last page, a window around
 * the current one, and an ellipsis wherever the sequence skips.
 *
 * Returned as numbers and a literal ellipsis rather than as pre-rendered nodes,
 * so the shape is testable without a DOM — the off-by-one at the window edges
 * is the whole difficulty of this component.
 */
export function paginationRange(page: number, pageCount: number, siblings = 1): (number | typeof GAP)[] {
  const first = 1
  const last = pageCount

  // Below the width the elided form would occupy — first, last, the window and
  // two ellipses — printing every page is both shorter and more useful. Without
  // this, a five-page list renders "1 2 … 5", which hides a page to save
  // nothing.
  const widest = 2 * siblings + 5
  if (pageCount <= widest) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const start = Math.max(first, page - siblings)
  const end = Math.min(last, page + siblings)

  const pages: (number | typeof GAP)[] = []
  if (start > first) {
    pages.push(first)
    // A single skipped page is printed, not elided: "1 … 3" is longer than
    // "1 2 3" and tells the reader less.
    if (start > first + 2) pages.push(GAP)
    else if (start === first + 2) pages.push(first + 1)
  }
  for (let n = start; n <= end; n += 1) pages.push(n)
  if (end < last) {
    if (end < last - 2) pages.push(GAP)
    else if (end === last - 2) pages.push(last - 1)
    pages.push(last)
  }
  return pages
}

const STEP =
  'inline-flex size-(--control-h-sm) items-center justify-center rounded-(--radius-pill) border transition-colors duration-(--duration-fast) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none'

/**
 * Numbered pagination.
 *
 * The current page is marked by one filled pill that TRAVELS between the
 * numbers rather than by a background switching off on one and on on another.
 * Two backgrounds cross-fading reads as two things changing; a shape moving
 * reads as the one thing that actually did.
 *
 * A `<nav>` wrapping a list, and the current page is a `<button aria-current>`
 * rather than a styled `<span>` — a reader jumping by landmark needs to find
 * the control, and a reader on the current page needs to be told they are
 * already there.
 *
 * Renders nothing at one page or fewer. A pager for a single page is furniture.
 *
 * Every string a reader hears is a prop. The chevrons carry no text, so
 * `previousLabel` and `nextLabel` are the whole of those two controls' names,
 * and `pageLabel` is a function because "Page 3" is a phrase whose parts move
 * around between languages.
 *
 * @example
 * <Pagination page={page} pageCount={12} onPageChange={setPage} />
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  label = 'Pagination',
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = (page) => `Page ${page}`,
  className,
  ...rest
}: PaginationProps) {
  // Called before the early return, because a hook cannot be conditional — and
  // keyed on the page so the pill re-measures when the elided window shifts and
  // the numbers under it change.
  const [listRef, indicator] = useSelectionIndicator<HTMLOListElement>(String(page))

  if (pageCount <= 1) return null
  const pages = paginationRange(page, pageCount, siblings)

  return (
    <nav aria-label={label} className={cn('flex items-center gap-1.5', className)} {...rest}>
      <button
        type="button"
        aria-label={previousLabel}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(STEP, 'border-(--rule-2) text-(--ink-2) hover:border-(--ink) hover:text-(--ink)')}
      >
        <RiArrowLeftSLine size={16} aria-hidden />
      </button>

      <ol ref={listRef} className="relative m-0 flex list-none items-center gap-1 p-0">
        {indicator.ready && (
          <span
            aria-hidden
            data-folio-animated
            className="absolute rounded-(--radius-pill) bg-(--accent) transition-[transform,width] duration-(--duration-base) ease-(--ease-out-expo) motion-reduce:transition-none"
            style={{
              transform: `translate(${indicator.offset}px, ${indicator.top}px)`,
              width: indicator.width,
              height: indicator.height,
              insetInlineStart: 0,
              top: 0,
            }}
          />
        )}
        {pages.map((entry, index) =>
          entry === GAP ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 mono-meta text-(--ink-3-aa)">
              {GAP}
            </li>
          ) : (
            <li key={entry} className="relative z-1">
              <button
                type="button"
                aria-current={entry === page ? 'page' : undefined}
                aria-label={pageLabel(entry)}
                data-indicator-active={entry === page ? 'true' : undefined}
                onClick={() => onPageChange(entry)}
                className={cn(
                  STEP,
                  'mono-meta tabular-nums',
                  entry === page
                    ? 'border-transparent text-(--accent-foreground)'
                    : 'border-transparent text-(--ink-2) hover:border-(--rule-2) hover:text-(--ink)',
                )}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        aria-label={nextLabel}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={cn(STEP, 'border-(--rule-2) text-(--ink-2) hover:border-(--ink) hover:text-(--ink)')}
      >
        <RiArrowRightSLine size={16} aria-hidden />
      </button>
    </nav>
  )
}

export default Pagination
