'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/** The key the skeleton series is drawn from. Never a real series name. */
export const LOADING_KEY = 'loading'

/** One shimmer pass, in seconds. */
const SHIMMER_SECONDS = 2

/**
 * A deterministic pseudo-random sequence, seeded by index.
 *
 * The shape this was ported from called `Math.random()` inside a `useMemo`,
 * which runs during render — so the server rendered one skeleton, the client
 * rendered a different one, and React logged a hydration mismatch for every
 * chart on the page. A hash of the index gives the same jagged, un-patterned
 * silhouette on both sides of the wire, which is the only property the
 * skeleton actually needs from randomness.
 */
function noise(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Rows for the skeleton plot: one field, values inside a plausible band. */
export function loadingRows(points = 14, salt = 0, min = 0, max = 70) {
  return Array.from({ length: points }, (_, index) => ({
    [LOADING_KEY]: Math.floor(noise(index, salt) * (max - min)) + min,
  }))
}

/**
 * The skeleton's rows, re-rolled each time the shimmer leaves the plot.
 *
 * The swap is driven by the shimmer's own position rather than by a timer: an
 * interval drifts against the animation and eventually re-rolls the data in
 * full view, which reads as the chart glitching rather than as it loading.
 */
export function useLoadingRows(isLoading: boolean, points = 14) {
  const [salt, setSalt] = useState(0)

  const onShimmerExit = useCallback(() => {
    if (isLoading) setSalt((previous) => previous + 1)
  }, [isLoading])

  const rows = useMemo(() => loadingRows(points, salt), [points, salt])

  return { rows, onShimmerExit }
}

/**
 * The badge over a loading plot.
 *
 * Sits above the skeleton rather than replacing it, so the chart keeps its
 * measured height and the page does not jump when the data lands.
 */
export function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-(--z-rule) flex items-center justify-center">
      <output
        className="flex items-center gap-2 rounded-(--radius) border border-(--rule) bg-(--chart-surface) px-2.5 py-1 mono-meta text-(--ink-2)"
      >
        <span
          aria-hidden
          data-folio-animated
          className="size-3 rounded-(--radius-pill) border border-(--rule-2) border-t-(--ink) motion-safe:animate-[folio-spin_0.8s_linear_infinite]"
        />
        Loading
      </output>
    </div>
  )
}

/** Bell-curve opacity stops, so the shimmer has no hard edge at either end. */
function shimmerStops(steps = 17, min = 0.05, max = 0.9) {
  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1)
    const eased = Math.sin(t * Math.PI) ** 2
    return {
      offset: `${Math.round(t * 100)}%`,
      opacity: Number((min + eased * (max - min)).toFixed(3)),
    }
  })
}

/**
 * The travelling mask that makes the skeleton read as "working" rather than as
 * "broken".
 *
 * The plot is normalised to 0–1 and the pattern is three times that wide, so
 * the highlight has a full plot-width of runway on each side. `onShimmerExit`
 * fires as it crosses the far edge — off-screen — which is where the rows are
 * re-rolled, so the loop has no visible seam.
 *
 * With `prefers-reduced-motion` the whole travelling layer is dropped for a
 * flat wash: the skeleton still says "not yet", without anything moving.
 */
export function LoadingShimmer({ id, onShimmerExit }: { id: string; onShimmerExit: () => void }) {
  const reduceMotion = useReducedMotion()
  const stops = shimmerStops()
  const lastX = useRef(-1)

  return (
    <>
      <linearGradient id={`${id}-loading-gradient`} x1="0" y1="0" x2="1" y2="0">
        {stops.map(({ offset, opacity }) => (
          <stop key={offset} offset={offset} stopColor="white" stopOpacity={opacity} />
        ))}
      </linearGradient>
      <mask id={`${id}-loading-mask`} maskUnits="userSpaceOnUse">
        {reduceMotion ? (
          <rect width="100%" height="100%" fill="white" fillOpacity={0.55} />
        ) : (
          <rect width="100%" height="100%" fill={`url(#${id}-loading-pattern)`} />
        )}
      </mask>
      {!reduceMotion && (
        <pattern
          id={`${id}-loading-pattern`}
          patternUnits="objectBoundingBox"
          patternContentUnits="objectBoundingBox"
          patternTransform="rotate(25)"
          width={3}
          height="1"
          x="0"
          y="0"
        >
          <motion.rect
            y="0"
            width="1"
            height="1"
            fill={`url(#${id}-loading-gradient)`}
            initial={{ x: -1 }}
            animate={{ x: 2 }}
            transition={{
              duration: SHIMMER_SECONDS,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            }}
            onUpdate={(latest) => {
              const x = typeof latest.x === 'number' ? latest.x : -1
              if (x >= 1 && lastX.current < 1) onShimmerExit()
              lastX.current = x
            }}
          />
        </pattern>
      )}
    </>
  )
}
