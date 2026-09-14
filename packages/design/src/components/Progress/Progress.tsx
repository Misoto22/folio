'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { warnBlankName } from '../../lib/warn'

export interface ProgressProps
  extends Omit<ComponentProps<typeof ProgressPrimitive.Root>, 'value' | 'max'> {
  /**
   * 0 to `max`, which is 100 unless you say otherwise. Omit (or pass `null`)
   * when the duration is genuinely unknown — the bar then sweeps instead of
   * filling, and Radix drops `aria-valuenow` so a screen reader is told
   * "indeterminate" rather than a number that is a guess.
   */
  value?: number | null
  /**
   * What `value` is measured against. 100 by default.
   *
   * The width is computed from it as well as announced from it. It used to be
   * only announced: `max` reached Radix through `...rest` while the width was
   * `value` clamped to 100, so `max={500}` with `value={100}` painted a full
   * bar and told a screen reader "100 of 500". A max that is not a positive
   * number is refused the way Radix refuses it — Radix warns, and both fall
   * back to 100 rather than drawing one picture and announcing another.
   */
  max?: number
  /** Names what is progressing. Required: a bare bar announces nothing. */
  label: string
  /** Prints the percentage above the bar. Only meaningful when `value` is set. */
  showValue?: boolean
}

/**
 * A bar that fills, or sweeps when the end is unknown.
 *
 * Flat: a track in `--stone`, a fill in `--ink`. The White Reset has no
 * gradient and no glow, so the only thing carrying the reading is the boundary
 * between the two.
 *
 * @example
 * <Progress value={62} label="Uploading photos" showValue />
 * @example
 * <Progress label="Indexing" />
 */
export function Progress({
  value = null,
  max,
  label,
  showValue = false,
  className,
  ...rest
}: ProgressProps) {
  warnBlankName('Progress', 'label', label, 'the progressbar is announced with no name and its percentage describes nothing')
  const indeterminate = value === null || value === undefined
  // Radix's own test for a usable max, so the fallback below is the same
  // fallback it applies — and `max` is forwarded raw, so Radix still prints the
  // warning rather than this component swallowing a bad prop quietly.
  const ceiling = typeof max === 'number' && !Number.isNaN(max) && max > 0 ? max : 100
  const bounded = indeterminate ? 0 : Math.min(ceiling, Math.max(0, value))
  const percent = (bounded / ceiling) * 100

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {showValue && !indeterminate && (
        <div className="flex items-baseline justify-between mono-meta text-(--ink-3-aa)">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(percent)}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        value={indeterminate ? null : bounded}
        max={max}
        aria-label={label}
        className="relative h-1 w-full overflow-hidden rounded-(--radius-pill) bg-(--stone)"
        {...rest}
      >
        {indeterminate ? (
          <span
            data-folio-animated
            // A quarter-width bar travelling the track. `transform` only, so it
            // runs on the compositor and never triggers layout. `rtl:-scale-x-100`
            // mirrors the whole motion rather than needing a second keyframe:
            // in a right-to-left document the sweep has to run the other way, or
            // it reads as progress running backwards.
            //
            // Nothing overrides it under `motion-reduce`, and that is the fix
            // rather than an omission: it used to become `w-full` at 40%
            // opacity, which is the shape of a FINISHED bar at rest, so a
            // reader who asked for less motion was told the operation was done.
            // Still, it is a quarter of the track at the inline start — the
            // same answer Spinner gives, where a ring that has stopped turning
            // still reads as unfinished because it is not a whole circle.
            className="absolute inset-y-0 start-0 w-1/4 rounded-(--radius-pill) bg-(--accent) rtl:-scale-x-100 motion-safe:animate-[folio-sweep_1.4s_var(--ease)_infinite]"
          />
        ) : (
          <ProgressPrimitive.Indicator
            // Width, not a translate. A `translateX(-N%)` fill has to be negated
            // in a right-to-left document, and an inline style cannot carry a
            // direction variant — so the bar grew from the wrong edge. Width
            // grows from the inline start on its own, in either direction.
            className="h-full rounded-(--radius-pill) bg-(--accent) transition-[width] duration-(--duration-slow) ease-(--ease-out-expo)"
            style={{ width: `${percent}%` }}
          />
        )}
      </ProgressPrimitive.Root>
    </div>
  )
}

export default Progress
