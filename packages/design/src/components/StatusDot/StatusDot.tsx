import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral'

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** 7px / 8px. `md` is the default. */
  size?: 'sm' | 'md'
  tone?: StatusTone
  /** A halo that grows and dissolves, for "live right now". Off for a settled state. */
  pulse?: boolean
}

const SIZE = { sm: 'size-[7px]', md: 'size-2' } as const

const TONE: Record<StatusTone, string> = {
  success: 'bg-(--ok)',
  warning: 'bg-(--warn)',
  danger: 'bg-(--danger)',
  neutral: 'bg-(--ink-3-aa)',
}

/**
 * The dot beside a status word.
 *
 * `aria-hidden` without exception: the dot repeats a state the adjacent label
 * already names, and a screen reader announcing "available" twice is worse than
 * not announcing the decoration at all. If a call site has no visible label,
 * the fix is a label, not an `aria-label` on the dot.
 *
 * The halo is a separate absolutely-positioned ring rather than a box-shadow,
 * because Law 2 of this system is that a shadow is never blurred — and it is
 * motion-safe, so a reader who asked for less motion gets a static dot.
 *
 * @example
 * <span className="inline-flex items-center gap-2"><StatusDot /> Available</span>
 */
export function StatusDot({
  size = 'md',
  tone = 'success',
  pulse = true,
  className,
  ...rest
}: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative inline-grid shrink-0 place-items-center', SIZE[size], className)}
      {...rest}
    >
      <span className={cn('absolute inset-0 rounded-full', TONE[tone])} />
      {pulse && (
        <span
          data-folio-animated
          className={cn(
            'absolute inset-0 rounded-full motion-safe:animate-[folio-halo_2.4s_ease-out_infinite]',
            TONE[tone],
          )}
        />
      )}
    </span>
  )
}

export default StatusDot
