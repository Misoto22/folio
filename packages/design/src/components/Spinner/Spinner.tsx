import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** 14px / 18px / 26px. Match the size of the type it sits beside. */
  size?: 'sm' | 'md' | 'lg'
  /**
   * `default` draws the ring against the page — a hairline track in the rule
   * colour with the leading quarter in ink. `current` draws it in the inherited
   * text colour, which is what a spinner inside a filled button needs: on an
   * ink ground an ink ring is invisible.
   */
  tone?: 'default' | 'current'
  /** Merged onto the RING, after `size` and `tone`, so it overrides both. */
  className?: string
  /**
   * Announced to assistive tech. Pass the specific thing being waited on
   * ("Loading projects"), not the generic word — a screen reader user hearing
   * "Loading" three times cannot tell which three things.
   *
   * Pass `null` for a spinner that sits inside a control which already names
   * the operation (a button whose own label changes to "Saving…"), so the two
   * are not read out twice.
   */
  label?: string | null
}

const SIZE = {
  sm: 'size-3.5 border-[1.5px]',
  md: 'size-[18px] border-2',
  lg: 'size-6.5 border-2',
} as const

const TONE = {
  default: 'border-(--rule-2) border-t-(--ink)',
  current: 'border-current/25 border-t-current',
} as const

/**
 * The system's one "working" indicator.
 *
 * A ring, not a blurred glow and not a shimmer: the White Reset has no light
 * source, so depth and softness are not available to it. The leading quarter is
 * the only thing that distinguishes the ring from a plain circle, which is why
 * the track stays a hairline — a spinner is a hint that time is passing, not a
 * feature of the page.
 *
 * It spins under `motion-safe` only. A reader who has asked for less motion
 * gets a static ring, which still reads as "not finished" because the leading
 * quarter is darker than the track.
 *
 * For a wait long enough that the reader would otherwise wonder whether the
 * page is broken, prefer `Skeleton` — a shape that describes what is coming
 * beats a dot that describes nothing.
 *
 * `className` reaches the RING, alongside `size` and `tone`, and overrides
 * them: every utility a caller has for a spinner is about the ring, and merged
 * onto the wrapper instead `className="size-8"` grew an invisible box around an
 * unchanged 18px circle. Layout still works from there — the wrapper is
 * `inline-flex` and takes the ring's margin box as its own.
 *
 * @example
 * <Spinner size="lg" label="Loading projects" />
 * @example
 * // Inside a filled button, where the ground is ink:
 * <Spinner size="sm" tone="current" label={null} />
 */
export function Spinner({
  size = 'md',
  tone = 'default',
  className,
  label = 'Loading',
  ...rest
}: SpinnerProps) {
  return (
    <span
      role={label === null ? undefined : 'status'}
      aria-hidden={label === null ? true : undefined}
      className="inline-flex shrink-0 items-center justify-center"
      {...rest}
    >
      <span
        data-folio-animated
        className={cn(
          'inline-block rounded-full border-solid motion-safe:animate-[folio-spin_0.7s_linear_infinite]',
          SIZE[size],
          TONE[tone],
          className,
        )}
      />
      {label !== null && <span className="sr-only">{label}</span>}
    </span>
  )
}

export default Spinner
