import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

/**
 * The fill every skeleton part is drawn from: `--stone`, at the height of one
 * line until something says otherwise.
 *
 * Deliberately NOT a shimmer. A shimmer sweeps a highlight across the shape,
 * which implies a light source; the White Reset has none, so the sweep reads as
 * a bug rather than as loading. The whole page breathes together instead —
 * see `SkeletonPage`, which owns the single pulse.
 *
 * `h-3` is a default rather than a design. A `<div>` is already full width, so
 * height was the one dimension a caller could omit and get nothing for — a
 * bare `<Skeleton />` was a zero-height box, which is not a small skeleton but
 * an absent one. Twelve pixels is the height `SkeletonLine` already chose, and
 * any class the caller passes replaces it.
 *
 * @example
 * <Skeleton className="h-3 w-40 rounded-(--radius-pill)" />
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('h-3 bg-(--stone)', className)} {...rest} />
}

/** A line of type. Height is the line's; width is how far it runs. */
export function SkeletonLine({ className, ...rest }: SkeletonProps) {
  return <Skeleton className={cn('h-3 rounded-(--radius-pill)', className)} {...rest} />
}

/** A block: an image mount, a plate, a chart. */
export function SkeletonBlock({ className, ...rest }: SkeletonProps) {
  return <Skeleton className={cn('rounded-(--radius-sm)', className)} {...rest} />
}

/** A circle: an avatar, a marker. */
export function SkeletonCircle({ className, ...rest }: SkeletonProps) {
  return <Skeleton className={cn('size-9 rounded-full', className)} {...rest} />
}

export interface SkeletonTextProps extends SkeletonProps {
  /** How many lines of prose to stand in for. */
  lines?: number
}

/**
 * A paragraph.
 *
 * The last line is short, because real prose ends mid-measure. A block of equal
 * full-width bars reads as a table, and the reader then flinches when a
 * paragraph arrives instead.
 */
export function SkeletonText({ lines = 3, className, ...rest }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)} {...rest}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonLine key={index} className={index === lines - 1 ? 'w-[62%]' : 'w-full'} />
      ))}
    </div>
  )
}

export interface SkeletonPageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * What is loading, in words. Announced once; the shapes themselves are
   * `aria-hidden`, so this sentence is the entire experience for a screen
   * reader and "Loading" alone tells it nothing.
   */
  label: string
  children: ReactNode
}

/**
 * The frame a skeleton sits in: the live region, and the single pulse.
 *
 * One `animate-pulse` on the wrapper rather than one per part, so the page
 * breathes together instead of shimmering out of phase — twenty independently
 * animated bars is a visual noise floor, not a loading state.
 *
 * A skeleton whose shape does not match what replaces it is worse than none: it
 * promises a layout and then the page jumps out from under the reader. Compose
 * the parts to match the real thing, and change both together.
 *
 * @example
 * <SkeletonPage label="Loading projects">
 *   <SkeletonLine className="h-2.5 w-28" />
 *   <SkeletonBlock className="mt-6 h-40" />
 * </SkeletonPage>
 */
export function SkeletonPage({ label, children, className, ...rest }: SkeletonPageProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      data-folio-animated
      className={cn('animate-pulse motion-reduce:animate-none', className)}
      {...rest}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export default Skeleton
