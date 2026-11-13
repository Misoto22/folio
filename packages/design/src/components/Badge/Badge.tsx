import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'outline'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  /**
   * `neutral` is the default and the right answer nearly always. The three
   * status tones are the system's only chroma and are bound to STATE — a badge
   * that is red because the design wanted a red badge is the thing this scale
   * exists to prevent.
   */
  tone?: BadgeTone
}

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-(--stone) text-(--ink-2) border-transparent',
  success: 'bg-(--ok-soft) text-(--ok) border-transparent',
  warning: 'bg-(--warn-soft) text-(--warn) border-transparent',
  danger: 'bg-(--danger-soft) text-(--danger) border-transparent',
  outline: 'bg-transparent text-(--ink-2) border-(--rule-2)',
}

/**
 * A count, a state, a small inline marker.
 *
 * Mono and small, so it reads as metadata rather than as content. A badge is
 * not interactive — if it can be clicked or dismissed it is a `Tag` or a
 * button, and giving this one an `onClick` produces a control a keyboard cannot
 * reach.
 *
 * @example
 * <Badge>12</Badge>
 * @example
 * <Badge tone="success">Deployed</Badge>
 */
export function Badge({ children, tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-(--radius-sm) border px-2.5 py-1 font-(family-name:--label-font) text-xs tracking-[calc(0.025em*var(--label-tracking-scale))]',
        TONE[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge
