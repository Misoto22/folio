import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

/**
 * The list a rail's items sit in.
 *
 * One number for the marker, because three rules depend on it: the marker's
 * own box, where the connector starts, and where it is centred. Written as a
 * property rather than repeated as a literal so a caller can move all three at
 * once.
 */
export const STEP_RAIL_LIST_CLASS = 'm-0 flex list-none flex-col p-0 [--step-size:2rem]'

export interface StepRailItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /**
   * `li` inside a real `<ol>`; `div` for a host that carries the list as ARIA
   * roles so article prose does not restyle it as a bulleted list.
   */
  as?: 'li' | 'div'
  /** What the marker prints: a count, a host counter, or nothing. */
  marker: ReactNode
  /** Classes for the marker, after its resting or filled look. */
  markerClassName?: string
  /** Draws the marker filled. Visual only; the caller decides what it announces. */
  filled?: boolean
  /** The last item draws no connector below its marker. */
  last: boolean
  title: ReactNode
  note?: ReactNode
  /** Anything that belongs under the note, inside the same column. */
  children?: ReactNode
}

/**
 * One stop on a numbered rail: marker, connector, name and note.
 *
 * Internal. It is the single rendering shared by the core `Steps` and the
 * website `StepSequence`, so the two cannot drift apart in geometry or type.
 * Neither entry point exports it.
 *
 * The connector is drawn on the ITEM rather than as a full-height line behind
 * the markers, so it starts under one and stops above the next — and the last
 * step has no tail hanging off it.
 */
export function StepRailItem({
  as: Item = 'li',
  marker,
  markerClassName,
  filled = false,
  last,
  title,
  note,
  children,
  className,
  ...rest
}: StepRailItemProps) {
  return (
    <Item {...rest} className={cn('relative flex gap-4 pb-7 last:pb-0', className)}>
      {/* Absolute, so it spans the gap between this marker and the next without
          taking part in the row's own layout — and simply absent on the last
          row rather than drawn and then hidden. */}
      {!last && (
        <span
          aria-hidden
          className="absolute start-[calc(var(--step-size)/2)] top-(--step-size) bottom-0 w-px -translate-x-1/2 bg-(--rule-2) rtl:translate-x-1/2"
        />
      )}
      <span
        aria-hidden
        className={cn(
          'relative z-1 grid size-(--step-size) shrink-0 place-items-center rounded-full border text-[12px] tabular-nums',
          filled
            ? 'border-(--accent) bg-(--accent) text-(--accent-foreground)'
            : 'border-(--rule-2) bg-(--paper) text-(--ink-3-aa)',
          markerClassName,
        )}
      >
        {marker}
      </span>
      <div className="flex min-w-0 flex-col gap-1 pt-1">
        <span className="font-sans text-[15px] leading-tight text-(--ink)">{title}</span>
        {note !== undefined && note !== null && (
          <span className="mono-meta leading-[1.6] text-(--ink-3-aa)">{note}</span>
        )}
        {children}
      </div>
    </Item>
  )
}
