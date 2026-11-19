'use client'

import {
  Fragment,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  startTransition,
  type ComponentProps,
  type FC,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '../../lib/cn'
import { colorStops, type ChartConfig } from './chart'

/** The slice of the data a brush has selected, as row indexes. */
export interface ChartBrushRange {
  startIndex: number
  endIndex: number
}

/** Which mark the miniature strip is drawn with. */
export type ChartBrushVariant = 'line' | 'area' | 'bar'

export interface BrushProps {
  /** Strip height in pixels. */
  height?: number
  /** Turns a row's x value into a handle label. */
  formatLabel?: (value: unknown, index: number) => string
  onChange?: (range: ChartBrushRange) => void
}

/**
 * Declares the zoom brush under a chart.
 *
 * Renders nothing itself — its PRESENCE among the chart's children turns the
 * footer on, and its props configure it. A marker rather than a `showBrush`
 * prop because the brush is composed like every other part, so a consumer does
 * not have to remember which knobs are children and which are props.
 */
export const Brush: FC<BrushProps> = () => null

/** How firmly the handles catch up with the pointer. */
const SPRING = { stiffness: 300, damping: 35, mass: 0.8 }

type DragKind = 'start' | 'end' | 'pan'

interface DragState {
  kind: DragKind
  originX: number
  originRange: ChartBrushRange
}

/**
 * Pointer-capture dragging for the two handles and the selected span.
 *
 * `setPointerCapture` routes every subsequent move to the element that was
 * pressed, so mouse, touch and pen all work from one code path and there are no
 * window-level listeners to leak.
 */
function useBrushDrag({
  range,
  totalPoints,
  containerRef,
  commit,
}: {
  range: ChartBrushRange
  totalPoints: number
  containerRef: RefObject<HTMLDivElement | null>
  commit: (next: ChartBrushRange, kind?: DragKind) => void
}) {
  const drag = useRef<DragState | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const toIndexDelta = useCallback(
    (px: number) => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0
      if (!width || totalPoints <= 1) return 0
      return Math.round((px / width) * (totalPoints - 1))
    },
    [containerRef, totalPoints],
  )

  const onPointerDown = useCallback(
    (event: ReactPointerEvent, kind: DragKind) => {
      event.preventDefault()
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
      drag.current = { kind, originX: event.clientX, originRange: { ...range } }
      setIsDragging(true)
    },
    [range],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const state = drag.current
      if (!state) return

      const delta = toIndexDelta(event.clientX - state.originX)
      const origin = state.originRange

      if (state.kind === 'start') {
        commit({ startIndex: origin.startIndex + delta, endIndex: origin.endIndex }, 'start')
        return
      }
      if (state.kind === 'end') {
        commit({ startIndex: origin.startIndex, endIndex: origin.endIndex + delta }, 'end')
        return
      }

      const span = origin.endIndex - origin.startIndex
      let start = origin.startIndex + delta
      let end = start + span
      if (start < 0) {
        start = 0
        end = span
      }
      if (end > totalPoints - 1) {
        end = totalPoints - 1
        start = Math.max(0, end - span)
      }
      commit({ startIndex: start, endIndex: end }, 'pan')
    },
    [commit, toIndexDelta, totalPoints],
  )

  const onPointerUp = useCallback((event: ReactPointerEvent) => {
    ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
    drag.current = null
    setIsDragging(false)
  }, [])

  const bind = useCallback(
    (kind: DragKind) => ({
      onPointerDown: (event: ReactPointerEvent) => onPointerDown(event, kind),
      onPointerMove,
      onPointerUp,
    }),
    [onPointerDown, onPointerMove, onPointerUp],
  )

  return { isDragging, bind }
}

export interface ChartBrushProps {
  /** The whole dataset. The strip always draws all of it. */
  data: Record<string, unknown>[]
  config: ChartConfig
  /** Which series the strip draws. Defaults to every key in the config. */
  dataKeys?: string[]
  /** The row field behind a handle's label. */
  xDataKey?: string
  variant?: ChartBrushVariant
  height?: number
  className?: string
  stacked?: boolean
  strokeVariant?: 'solid' | 'dashed'
  connectNulls?: boolean
  barRadius?: number
  startIndex?: number
  endIndex?: number
  defaultStartIndex?: number
  defaultEndIndex?: number
  onChange?: (range: ChartBrushRange) => void
  formatLabel?: (value: unknown, index: number) => string
  curveType?: ComponentProps<typeof Area>['type']
  /** The fewest rows that may stay selected. */
  minSpan?: number
  showLabels?: boolean
  /** Names the control for a screen reader. */
  label?: string
}

/**
 * The range selector under a chart: a miniature of the whole series, with a lit
 * window over the part the chart above is showing.
 *
 * Both handles are real `slider` controls — focusable, arrow-key driven, with
 * `aria-valuetext` reading out the row they sit on. The shape this was ported
 * from was pointer-only, which made zooming a chart something a keyboard user
 * could watch but not do.
 *
 * Position is written as inline style rather than as `start-`/`end-` classes on
 * purpose. The strip's axis is the DATA's, and Recharts lays a cartesian plot
 * out left-to-right in every writing direction — so mirroring the handles under
 * `dir="rtl"` would put the "earlier" handle at the end of a chart that still
 * runs the other way.
 */
export function ChartBrush({
  data,
  config,
  dataKeys,
  xDataKey,
  variant = 'area',
  height = 56,
  className,
  stacked = false,
  strokeVariant = 'solid',
  connectNulls = false,
  barRadius,
  startIndex: controlledStart,
  endIndex: controlledEnd,
  defaultStartIndex = 0,
  defaultEndIndex,
  onChange,
  formatLabel,
  curveType = 'monotone',
  minSpan = 2,
  showLabels = true,
  label = 'Visible range',
}: ChartBrushProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const keys = useMemo(() => dataKeys ?? Object.keys(config), [dataKeys, config])
  const totalPoints = data.length
  const maxIndex = Math.max(0, totalPoints - 1)

  const isControlled = controlledStart !== undefined && controlledEnd !== undefined

  const [range, setRange] = useState<ChartBrushRange>(() => ({
    startIndex: Math.max(0, Math.min(defaultStartIndex, maxIndex)),
    endIndex: Math.max(0, Math.min(defaultEndIndex ?? maxIndex, maxIndex)),
  }))

  const committed = useRef<ChartBrushRange>(range)

  useEffect(() => {
    if (isControlled) return
    setRange((previous) => {
      const adjusted = {
        startIndex: Math.min(previous.startIndex, maxIndex),
        endIndex: Math.min(previous.endIndex, maxIndex),
      }
      committed.current = adjusted
      return adjusted
    })
  }, [isControlled, maxIndex])

  const clamp = useCallback(
    (next: ChartBrushRange, kind?: DragKind): ChartBrushRange => {
      let startIndex = Math.max(0, Math.min(next.startIndex, maxIndex))
      let endIndex = Math.max(0, Math.min(next.endIndex, maxIndex))

      if (kind === 'start') {
        return { startIndex: Math.min(startIndex, Math.max(0, endIndex - minSpan)), endIndex }
      }
      if (kind === 'end') {
        return { startIndex, endIndex: Math.max(endIndex, Math.min(maxIndex, startIndex + minSpan)) }
      }
      if (endIndex - startIndex < minSpan) {
        endIndex = Math.min(startIndex + minSpan, maxIndex)
        if (endIndex - startIndex < minSpan) startIndex = Math.max(0, endIndex - minSpan)
      }
      return { startIndex, endIndex }
    },
    [maxIndex, minSpan],
  )

  const commit = useCallback(
    (next: ChartBrushRange, kind?: DragKind) => {
      const clamped = clamp(next, kind)
      const last = committed.current
      if (last.startIndex === clamped.startIndex && last.endIndex === clamped.endIndex) return

      committed.current = clamped
      setRange(clamped)
      // The handles have to keep up with the pointer; the chart above does not.
      // Deferring lets React drop intermediate slices during a fast drag.
      startTransition(() => onChange?.(clamped))
    },
    [clamp, onChange],
  )

  const { isDragging, bind } = useBrushDrag({ range, totalPoints, containerRef, commit })

  useEffect(() => {
    if (!isControlled || isDragging) return
    const synced = { startIndex: controlledStart, endIndex: controlledEnd }
    setRange(synced)
    committed.current = synced
  }, [controlledEnd, controlledStart, isControlled, isDragging])

  const startPercent = maxIndex > 0 ? (range.startIndex / maxIndex) * 100 : 0
  const endPercent = maxIndex > 0 ? (range.endIndex / maxIndex) * 100 : 100

  const startTarget = useMotionValue(startPercent)
  const endTarget = useMotionValue(endPercent)
  if (startTarget.get() !== startPercent) startTarget.set(startPercent)
  if (endTarget.get() !== endPercent) endTarget.set(endPercent)

  const startSpring = useSpring(startTarget, SPRING)
  const endSpring = useSpring(endTarget, SPRING)
  const startEdge = useTransform(startSpring, (value) => `${value}%`)
  const endEdge = useTransform(endSpring, (value) => `${value}%`)
  const dimBefore = useTransform(startSpring, (value) => `${value}%`)
  const dimAfter = useTransform(endSpring, (value) => `${Math.max(0, 100 - value)}%`)
  const spanWidth = useMotionValue(`${Math.max(0, endPercent - startPercent)}%`)

  const syncSpan = useCallback(() => {
    spanWidth.set(`${Math.max(0, endSpring.get() - startSpring.get())}%`)
  }, [endSpring, spanWidth, startSpring])

  useMotionValueEvent(startSpring, 'change', syncSpan)
  useMotionValueEvent(endSpring, 'change', syncSpan)

  const labelAt = useCallback(
    (index: number) => {
      if (!xDataKey) return String(index)
      const value = data[index]?.[xDataKey]
      return formatLabel ? formatLabel(value, index) : String(value ?? index)
    },
    [data, formatLabel, xDataKey],
  )

  const nudge = useCallback(
    (kind: 'start' | 'end', step: number) => {
      const next =
        kind === 'start'
          ? { startIndex: range.startIndex + step, endIndex: range.endIndex }
          : { startIndex: range.startIndex, endIndex: range.endIndex + step }
      commit(next, kind)
    },
    [commit, range.endIndex, range.startIndex],
  )

  if (totalPoints === 0) return null

  return (
    <div
      ref={containerRef}
      className={cn('group relative select-none', className)}
      style={{ height }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-(--radius-sm)">
        <BrushStrip
          data={data}
          keys={keys}
          config={config}
          variant={variant}
          curveType={curveType}
          stacked={stacked}
          strokeVariant={strokeVariant}
          connectNulls={connectNulls}
          barRadius={barRadius}
        />
      </div>

      {/* The two dimmed shoulders. A wash rather than an opacity change on the
          strip: dimming the strip itself would also dim the selected window. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 rounded-(--radius-sm) bg-(--chart-surface)/70 backdrop-blur-[2px]"
        style={{ left: 0, width: dimBefore }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 rounded-(--radius-sm) bg-(--chart-surface)/70 backdrop-blur-[2px]"
        style={{ right: 0, width: dimAfter }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-y-0 cursor-grab touch-none rounded-(--radius-sm) border border-(--rule-2) active:cursor-grabbing"
        style={{ left: startEdge, width: spanWidth }}
        {...bind('pan')}
      />

      <BrushHandle
        kind="start"
        edge={startEdge}
        label={label}
        valueLabel={labelAt(range.startIndex)}
        showLabel={showLabels}
        index={range.startIndex}
        max={maxIndex}
        bind={bind('start')}
        onNudge={nudge}
      />
      <BrushHandle
        kind="end"
        edge={endEdge}
        label={label}
        valueLabel={labelAt(range.endIndex)}
        showLabel={showLabels}
        index={range.endIndex}
        max={maxIndex}
        bind={bind('end')}
        onNudge={nudge}
      />
    </div>
  )
}

/**
 * One end of the window.
 *
 * A `slider` rather than a styled div: arrow keys step it, Home and End jump it
 * to the edges, and `aria-valuetext` says which row it is on rather than which
 * index — an index is not what the reader is choosing between.
 */
function BrushHandle({
  kind,
  edge,
  label,
  valueLabel,
  showLabel,
  index,
  max,
  bind,
  onNudge,
}: {
  kind: 'start' | 'end'
  edge: MotionValue<string>
  label: string
  valueLabel: string
  showLabel: boolean
  index: number
  max: number
  bind: {
    onPointerDown: (event: ReactPointerEvent) => void
    onPointerMove: (event: ReactPointerEvent) => void
    onPointerUp: (event: ReactPointerEvent) => void
  }
  onNudge: (kind: 'start' | 'end', step: number) => void
}) {
  const isStart = kind === 'start'

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -5,
      PageUp: 5,
    }
    if (event.key === 'Home') {
      event.preventDefault()
      onNudge(kind, -max)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      onNudge(kind, max)
      return
    }
    const step = steps[event.key]
    if (step === undefined) return
    event.preventDefault()
    onNudge(kind, step)
  }

  return (
    <motion.div className="absolute inset-y-0 z-(--z-rule)" style={{ left: edge }}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${label} — ${isStart ? 'start' : 'end'}`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={index}
        aria-valuetext={valueLabel}
        onKeyDown={onKeyDown}
        // The 44px hit target WCAG 2.5.5 asks for, as a pseudo-element so the
        // handle itself can stay 6px wide.
        className={cn(
          'group/handle absolute inset-y-0 flex w-3 cursor-ew-resize touch-none items-center justify-center',
          "after:absolute after:inset-y-0 after:w-11 after:content-['']",
        )}
        // Physical, and deliberately so — see the note on ChartBrush. In a
        // class this would need an `rtl:` twin that would move the handle off
        // the edge it belongs to.
        style={{ left: 0, transform: isStart ? undefined : 'translateX(-100%)' }}
        {...bind}
      >
        <span
          aria-hidden
          className="flex h-4 w-1.5 flex-col items-center justify-center gap-0.5 rounded-(--radius-sm) bg-(--ink-3-aa) transition-colors duration-(--duration-fast) group-hover/handle:bg-(--ink) group-focus-visible/handle:bg-(--ink)"
        >
          <span className="size-[2px] rounded-(--radius-pill) bg-(--chart-surface)/70" />
          <span className="size-[2px] rounded-(--radius-pill) bg-(--chart-surface)/70" />
          <span className="size-[2px] rounded-(--radius-pill) bg-(--chart-surface)/70" />
        </span>
      </div>

      {showLabel && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-3 -translate-y-1/2 rounded-[3px] bg-(--ink) px-1 py-px text-[8px] leading-tight font-medium whitespace-nowrap text-(--paper) opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100"
          style={isStart ? { left: '0.375rem' } : { right: '0.375rem' }}
        >
          {valueLabel}
        </span>
      )}
    </motion.div>
  )
}

/**
 * The miniature series behind the window.
 *
 * Its own gradients rather than the chart's: the strip is a second Recharts
 * tree, and an SVG paint reference cannot cross from one `<svg>` root into
 * another. The custom properties DO cross — they are inherited CSS — which is
 * why the strip needs no config of its own beyond the series list.
 */
function BrushStrip({
  data,
  keys,
  config,
  variant,
  curveType,
  stacked,
  strokeVariant,
  connectNulls,
  barRadius,
}: {
  data: Record<string, unknown>[]
  keys: string[]
  config: ChartConfig
  variant: ChartBrushVariant
  curveType: ComponentProps<typeof Area>['type']
  stacked: boolean
  strokeVariant: 'solid' | 'dashed'
  connectNulls: boolean
  barRadius?: number
}) {
  const id = `brush-${useId().replace(/:/g, '')}`
  const series = useMemo(
    () =>
      Object.entries(config)
        .filter(([key]) => keys.includes(key))
        .map(([dataKey, entry]) => ({ dataKey, stops: colorStops(entry) })),
    [config, keys],
  )

  const dash = strokeVariant === 'dashed' ? '4 4' : undefined

  const defs = (
    <>
      {variant === 'area' && (
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0.15} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      )}
      {series.map(({ dataKey, stops }) => (
        <Fragment key={dataKey}>
          <linearGradient id={`${id}-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            {stops === 1 ? (
              <>
                <stop offset="0%" stopColor={`var(--color-${dataKey}-0)`} />
                <stop offset="100%" stopColor={`var(--color-${dataKey}-0)`} />
              </>
            ) : (
              Array.from({ length: stops }, (_, index) => (
                <stop
                  key={index}
                  offset={`${(index / (stops - 1)) * 100}%`}
                  stopColor={`var(--color-${dataKey}-${index}, var(--color-${dataKey}-0))`}
                />
              ))
            )}
          </linearGradient>
          {variant === 'area' && (
            <>
              <mask id={`${id}-fill-mask-${dataKey}`}>
                <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
              </mask>
              <pattern
                id={`${id}-fill-${dataKey}`}
                patternUnits="userSpaceOnUse"
                width="100%"
                height="100%"
              >
                <rect
                  width="100%"
                  height="100%"
                  fill={`url(#${id}-${dataKey})`}
                  mask={`url(#${id}-fill-mask-${dataKey})`}
                />
              </pattern>
            </>
          )}
        </Fragment>
      ))}
    </>
  )

  if (variant === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>{defs}</defs>
          {keys.map((key) => (
            <Line
              key={key}
              type={curveType}
              dataKey={key}
              stroke={`url(#${id}-${key})`}
              strokeWidth={1}
              strokeOpacity={0.5}
              strokeDasharray={dash}
              connectNulls={connectNulls}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (variant === 'bar') {
    const radius = barRadius ?? 3
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          barGap={2}
          barSize={14}
        >
          <defs>{defs}</defs>
          {keys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`url(#${id}-${key})`}
              fillOpacity={0.35}
              stackId={stacked ? 'brush-stack' : undefined}
              isAnimationActive={false}
              radius={[radius, radius, radius, radius]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>{defs}</defs>
        {keys.map((key) => (
          <Area
            key={key}
            type={curveType}
            dataKey={key}
            stroke={`url(#${id}-${key})`}
            fill={`url(#${id}-fill-${key})`}
            strokeWidth={1}
            strokeOpacity={0.5}
            strokeDasharray={dash}
            connectNulls={connectNulls}
            fillOpacity={1}
            stackId={stacked ? 'brush-stack' : undefined}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

/**
 * Holds the brush's range and hands back the rows the chart above should draw.
 *
 * The slicing runs on a deferred copy of the range: the handles move at pointer
 * cadence while the chart re-renders at whatever cadence it can manage, which
 * is what keeps a drag smooth over a few thousand rows.
 */
export function useChartBrush<TData extends Record<string, unknown>>({
  data,
  defaultStartIndex = 0,
  defaultEndIndex,
}: {
  data: TData[]
  defaultStartIndex?: number
  defaultEndIndex?: number
}) {
  const [range, setRange] = useState<ChartBrushRange>({
    startIndex: defaultStartIndex,
    endIndex: defaultEndIndex ?? Math.max(0, data.length - 1),
  })

  const deferred = useDeferredValue(range)

  useEffect(() => {
    setRange({ startIndex: 0, endIndex: Math.max(0, data.length - 1) })
  }, [data.length])

  const visibleData = useMemo(
    () => data.slice(deferred.startIndex, deferred.endIndex + 1),
    [data, deferred.endIndex, deferred.startIndex],
  )

  return {
    range,
    visibleData,
    brushProps: {
      startIndex: range.startIndex,
      endIndex: range.endIndex,
      onChange: setRange,
    },
  }
}
