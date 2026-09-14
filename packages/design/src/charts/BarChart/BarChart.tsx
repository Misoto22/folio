'use client'

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import {
  Bar as RechartsBar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Rectangle,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
} from 'recharts'
import type { RectRadius } from 'recharts/types/shape/Rectangle'
import { motion, useReducedMotion } from 'motion/react'
import { ChartContainer, type ChartConfig } from '../lib/chart'
import { ChartFigure } from '../lib/figure'
import { useChartSelection } from '../lib/selection'
import { type ChartEmptyProps } from '../lib/empty'
import { axisLabel } from '../lib/axis'
import { defaultTick } from '../lib/format'
import { Annotation, ReferenceBand, ReferenceLine } from '../lib/annotations'
import { Values, findSlot, resolveValues, type ValuesProps } from '../lib/values'
import {
  ChartSonifyButton,
  Sonify,
  useChartSonifySeries,
  type SonifyProps,
} from '../lib/sonify-control'

/**
 * The axis props, with `label` narrowed to a string.
 *
 * Recharts' own `label` accepts a render function and a config object, neither
 * of which a call site should be reaching for to name an axis — and both of
 * which would let a consumer opt out of the system's own axis type styling
 * without noticing.
 */
export type ChartXAxisProps = Omit<ComponentProps<typeof RechartsXAxis>, 'label'> & {
  /** What this axis measures. Say the unit here or in the series label, once. */
  label?: string
}

export type ChartYAxisProps = Omit<ComponentProps<typeof RechartsYAxis>, 'label'> & {
  /** What this axis measures. Say the unit here or in the series label, once. */
  label?: string
}

import { ChartBackground, type ChartBackgroundVariant } from '../lib/background'
import { ChartLegend, ChartLegendContent } from '../lib/legend'
import { ChartTooltip, ChartTooltipContent } from '../lib/tooltip'
import { Brush, ChartBrush, type BrushProps, type ChartBrushRange } from '../lib/brush'
import { ChartControls, Toolbar, type ToolbarProps } from '../lib/toolbar'
import { useChartZoom } from '../lib/zoom'
import { LoadingIndicator, LoadingShimmer, LOADING_KEY, useLoadingRows } from '../lib/loading'
import {
  BarBufferFill,
  BarDuotoneFill,
  BarGradientFill,
  BarHatchedFill,
  BarStrippedFill,
  GlowFilter,
  REVEAL_EASE,
  SeriesGradient,
  type ChartRevealType,
} from '../lib/paint'
import type { ChartLegendSlotProps, ChartTooltipSlotProps } from '../AreaChart/AreaChart'

/** The corner every bar rounds to unless it says otherwise. */
const BAR_RADIUS = 2

/** One bar's grow-in, in seconds. */
const GROW_DURATION = 0.5

/** How long each bar waits behind the one before it. */
const GROW_STAGGER = 0.05

const STACK_ID = 'folio-bar-stack'

/**
 * Room around the plot, so the first and last tick labels are not sliced by the
 * container's edge. Recharts' own default is 5px on every side, which is not
 * enough for a label centred on the axis's first point.
 */
const CHART_MARGIN = { top: 8, right: 12, bottom: 0, left: 12 }

/**
 * The gap between a bar's foot and its neighbour below in a stack, plus the
 * hairline.
 */
const FOOT_GAP = 3

/**
 * The shortest a bar with a value on it may be drawn.
 *
 * Below `FOOT_GAP` the trim used to take the whole bar: a count of two on a
 * scale topping out at a thousand rendered at zero height and was
 * pixel-identical to a category with no rows at all. The full-column hit rect
 * still caught the pointer, so the reader could hover a bar that was not there.
 * One pixel is not much of a bar, and it is the difference between "small" and
 * "absent" — which is the whole reading.
 */
const MIN_BAR_LENGTH = 1

/** How a bar meets the plot. The primary carrier of identity in monochrome. */
export type BarVariant = 'default' | 'hatched' | 'duotone' | 'duotone-reverse' | 'gradient' | 'stripped'

/** How several bars combine: side by side, stacked, or normalised to 100%. */
export type BarStackType = 'default' | 'stacked' | 'percent'

/**
 * Which way the bars run.
 *
 * `vertical` stands them up from a category axis along the bottom — the default,
 * and what a time series wants. `horizontal` lays them out from a category axis
 * down the side, which is what long category NAMES want: a label that would be
 * rotated 45° to fit under a column reads straight beside a row.
 */
export type BarOrientation = 'vertical' | 'horizontal'

interface BarChartContextValue {
  config: ChartConfig
  /** The rows on screen, so a mark can label its own extremes. */
  rows: Record<string, unknown>[]
  isStacked: boolean
  isHorizontal: boolean
  isLoading: boolean
  barRadius: number
  animationType: ChartRevealType
  introStartedAt: number
  dataLength: number
  /**
   * Where the last row of `data` sits in the window on screen, or -1 when it is
   * outside it. What `buffer` hatches.
   */
  bufferIndex: number
  selectedDataKey: string | null
  selectDataKey: (dataKey: string | null) => void
  isPointerInChart: boolean
}

const BarChartContext = createContext<BarChartContextValue | null>(null)

function useBarChart(): BarChartContextValue {
  const context = useContext(BarChartContext)
  if (!context) throw new Error('A bar chart part must be rendered inside <BarChart>')
  return context
}

type ValidateKeys<TData, TConfig> = {
  [K in keyof TConfig]: K extends keyof TData ? ChartConfig[string] : never
}

export interface BarChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> {
  config: TConfig & ValidateKeys<TData, TConfig>
  /** The rows the chart draws. One entry per point, bar or category. */
  data: TData[]
  /**
   * What the chart shows, in a sentence a reader could act on. Required, and
   * announced to a screen reader even when it is not printed.
   */
  title: string
  /** Prints the title above the plot instead of hiding it from sight. */
  showTitle?: boolean
  /** A line under the title — the unit, the window, the caveat. */
  description?: ReactNode
  /**
   * The composed parts — axes, grid, tooltip, legend, and the marks
   * themselves.
   */
  children: ReactNode
  /** Merged onto the figure, last, so a call site can size or space it. */
  className?: string
  /** Escape hatch onto the raw Recharts chart element. */
  chartProps?: ComponentProps<typeof RechartsBarChart>
  /** How several marks combine: side by side, stacked, or normalised to 100%. */
  stackType?: BarStackType
  /**
   * Which way the bars run. Reach for `horizontal` when the category names are
   * long enough to need rotating under a column.
   */
  orientation?: BarOrientation
  /** The corner every `<BarChart.Bar>` inherits. */
  barRadius?: number
  /** The grow-in order every `<BarChart.Bar>` inherits. */
  animationType?: ChartRevealType
  /** Gap between bars inside one category. */
  barGap?: number
  /** Gap between categories. */
  barCategoryGap?: number
  /** The series lit on first render, when the chart keeps its own selection. */
  defaultSelectedDataKey?: string | null
  /**
   * The selected series, driven from outside.
   *
   * Give this and the chart follows it; leave it undefined and the chart keeps
   * its own, starting from `defaultSelectedDataKey`.
   */
  selectedDataKey?: string | null
  /** Fires when the selection changes, and with null when it is cleared. */
  onSelectionChange?: (selectedDataKey: string | null) => void
  /**
   * Swaps the marks for an animated skeleton, keeping the measured height so
   * the page does not jump when the data lands.
   */
  isLoading?: boolean
  /** How many bars the skeleton draws. */
  loadingBars?: number
  /**
   * The row field on the category axis. Needed by the brush and by the table
   * view.
   */
  xDataKey?: keyof TData & string
  /**
   * Drops the hidden table view. Only correct when the page prints the data
   * itself.
   */
  hideDataTable?: boolean
  /**
   * What the chart shows when it has nothing to draw.
   *
   * Rendered instead of the plot whenever `data` is empty and the chart is not
   * loading — the state a real dashboard reaches within a week, and the one an
   * empty pair of axes is indistinguishable from a failed load. `false` keeps
   * the axes, for a chart whose emptiness is itself the reading.
   */
  empty?: ChartEmptyProps | false
}

/**
 * Discrete categories compared by length — the shape for "how much, per thing".
 *
 * Reach for `<AreaChart>` or `<LineChart>` when the axis is continuous and the
 * reader is following a trend rather than comparing buckets.
 *
 * @example
 * <BarChart title="Visitors by month" config={config} data={data} xDataKey="month">
 *   <BarChart.Grid />
 *   <BarChart.XAxis dataKey="month" />
 *   <BarChart.Tooltip />
 *   <BarChart.Bar dataKey="desktop" variant="duotone" />
 * </BarChart>
 */
export function BarChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  config,
  data,
  title,
  showTitle,
  description,
  children,
  className,
  chartProps,
  stackType = 'default',
  orientation = 'vertical',
  barRadius = BAR_RADIUS,
  animationType = 'forward',
  barGap,
  barCategoryGap,
  defaultSelectedDataKey = null,
  selectedDataKey: controlledDataKey,
  onSelectionChange,
  isLoading = false,
  loadingBars,
  xDataKey,
  hideDataTable = false,
  empty,
}: BarChartProps<TData, TConfig>) {
  const chartId = useId().replace(/:/g, '')
  // Stamped once, on the first render. The grow-in reads elapsed time from
  // here rather than from mount, because Recharts remounts every bar on any
  // re-render — a mount-anchored animation would replay on every hover.
  const [introStartedAt] = useState(() => Date.now())
  const [isPointerInChart, setIsPointerInChart] = useState(false)
  const { rows: loadingData, onShimmerExit } = useLoadingRows(isLoading, loadingBars ?? 12)
  // One window, two views of it: the brush strip below the plot and the
  // toolbar above it both read and write this. See `useChartZoom` for why they
  // are not two separate windows.
  const zoom = useChartZoom({ data, xDataKey })

  // The brush, the toolbar and the sonify control are declared as children but
  // never rendered into the Recharts tree — they live in the figure, outside
  // the SVG.
  const { brushSlot, toolbarSlot, sonifySlot, chartChildren } = useMemo(() => {
    const parts = Children.toArray(children)
    const element = parts.find((child) => isValidElement(child) && child.type === Brush)
    const props = (isValidElement(element) ? element.props : {}) as BrushProps
    return {
      brushSlot: { present: isValidElement(element), ...props },
      toolbarSlot: findSlot<ToolbarProps>(parts, Toolbar),
      sonifySlot: findSlot<SonifyProps>(parts, Sonify),
      chartChildren: parts.filter(
        (child) =>
          !(
            isValidElement(child) &&
            (child.type === Brush || child.type === Toolbar || child.type === Sonify)
          ),
      ),
    }
  }, [children])

  const isStacked = stackType === 'stacked' || stackType === 'percent'
  const isHorizontal = orientation === 'horizontal'
  const columns = useMemo(
    () => Object.entries(config).map(([key, series]) => ({ key, label: series.label })),
    [config],
  )

  const showBrush = brushSlot.present && !isLoading
  const showToolbar = toolbarSlot !== null && !isLoading
  // `empty === false` keeps the axes, for a chart whose emptiness is the
  // reading — a monitoring panel that should show a flat, silent range rather
  // than a message.
  const isEmpty = !isLoading && empty !== false && data.length === 0
  const displayData = showBrush || showToolbar ? zoom.visibleData : data

  // Which bar on screen is the open period, if any is. Derived from the last
  // ROW rather than from the last bar drawn: brushed or zoomed back into the
  // middle of the range, the last bar in the window is a month that closed long
  // ago, and hatching it says it is still being counted.
  const bufferIndex =
    data.length > 0 && displayData[displayData.length - 1] === data[data.length - 1]
      ? displayData.length - 1
      : -1

  // The rows on screen, so a brushed range sounds like what it looks like. The
  // skeleton's rows carry no real series, which is what leaves the control
  // disabled while data is in flight rather than playing yesterday's numbers.
  const sonifySeries = useChartSonifySeries(
    sonifySlot,
    (isLoading ? loadingData : displayData) as Record<string, unknown>[],
    config,
    xDataKey,
  )

  const [selectedDataKey, selectDataKey] = useChartSelection(
    controlledDataKey,
    defaultSelectedDataKey,
    onSelectionChange,
  )

  const context = useMemo<BarChartContextValue>(
    () => ({
      config,
      rows: displayData as Record<string, unknown>[],
      isStacked,
      isHorizontal,
      isLoading,
      barRadius,
      animationType,
      introStartedAt,
      dataLength: displayData.length,
      bufferIndex,
      selectedDataKey,
      selectDataKey,
      isPointerInChart,
    }),
    [
      animationType,
      barRadius,
      bufferIndex,
      config,
      displayData,
      introStartedAt,
      isHorizontal,
      isLoading,
      isPointerInChart,
      isStacked,
      selectDataKey,
      selectedDataKey,
    ],
  )

  return (
    <BarChartContext.Provider value={context}>
      <ChartFigure
        title={title}
        showTitle={showTitle}
        description={description}
        className={className}
        table={
          hideDataTable
            ? false
            : { rows: data, rowKey: xDataKey, columns }
        }
        isEmpty={isEmpty}
        empty={empty}
      >
        {sonifySlot && (
          <ChartSonifyButton {...sonifySlot} title={title} series={sonifySeries} />
        )}
        <ChartControls
          toolbar={showToolbar ? toolbarSlot : null}
          zoom={zoom}
          title={title}
          rows={data}
          columns={columns}
          rowKey={xDataKey}
        >
        <ChartContainer
          config={config}
          footer={
            showBrush && (
              <ChartBrush
                data={data}
                config={config}
                xDataKey={xDataKey}
                variant="bar"
                barRadius={barRadius}
                height={brushSlot.height}
                formatLabel={brushSlot.formatLabel}
                stacked={isStacked}
                className="mt-1"
                {...zoom.brushProps}
                onChange={(range: ChartBrushRange) => {
                  zoom.brushProps.onChange(range)
                  brushSlot.onChange?.(range)
                }}
              />
            )
          }
        >
          <RechartsBarChart
            id={chartId}
            accessibilityLayer
            margin={CHART_MARGIN}
            // Recharts' `layout` names the axis the CATEGORIES run along, which
            // is the opposite of what a reader means by a horizontal bar chart.
            // The flip is done once, here.
            layout={isHorizontal ? 'vertical' : 'horizontal'}
            data={isLoading ? loadingData : displayData}
            barGap={barGap}
            barCategoryGap={barCategoryGap}
            stackOffset={stackType === 'percent' ? 'expand' : undefined}
            onMouseEnter={() => setIsPointerInChart(true)}
            onMouseLeave={() => setIsPointerInChart(false)}
            {...chartProps}
          >
            {chartChildren}
            {isLoading && <LoadingBar chartId={chartId} onShimmerExit={onShimmerExit} />}
          </RechartsBarChart>
        </ChartContainer>
        </ChartControls>
        <LoadingIndicator isLoading={isLoading} />
      </ChartFigure>
    </BarChartContext.Provider>
  )
}

export interface BarProps {
  dataKey: string
  variant?: BarVariant
  radius?: number
  animationType?: ChartRevealType
  /** Lets a click on this series select it, dimming the rest. */
  isClickable?: boolean
  /** Dims this series while another bar in the same column is hovered. */
  enableHoverHighlight?: boolean
  /** A halo behind the bars — for the one series that is the point of the figure. */
  glowing?: boolean
  /**
   * Draws the last row of `data` as an open hatch rather than a solid bar.
   *
   * The idiom for a period still in progress: the bar is the same height as any
   * other but is visibly not the same kind of fact.
   *
   * Tied to the last ROW, not to the last bar on screen. Brush or zoom into the
   * middle of the range and no bar is hatched, because none of the periods in
   * the window is still being counted.
   */
  buffer?: boolean
  /** `<BarChart.Values>`. */
  children?: ReactNode
  barProps?: ComponentProps<typeof RechartsBar>
}

/**
 * One bar series. Scopes its own patterns under a unique id, so any number of
 * series with different variants can share a chart.
 */
function Bar({
  dataKey,
  variant = 'default',
  radius,
  animationType,
  isClickable = false,
  enableHoverHighlight = false,
  glowing = false,
  buffer = false,
  children,
  barProps,
}: BarProps) {
  const {
    config,
    isStacked,
    isHorizontal,
    isLoading,
    rows,
    barRadius: defaultRadius,
    animationType: defaultAnimation,
    introStartedAt,
    dataLength,
    bufferIndex,
    selectedDataKey,
    selectDataKey,
    isPointerInChart,
  } = useBarChart()
  const id = useId().replace(/:/g, '')
  const reduceMotion = useReducedMotion()

  if (isLoading) return null

  const resolvedRadius = radius ?? defaultRadius
  const isSelected = selectedDataKey === dataKey
  const reveal: ChartRevealType = reduceMotion ? 'none' : (animationType ?? defaultAnimation)

  const shared = {
    id,
    dataKey,
    variant,
    barRadius: resolvedRadius,
    glowing,
    buffer,
    isClickable,
    enableHoverHighlight,
    isPointerInChart,
    isHorizontal,
    introStartedAt,
    selectedDataKey,
    dataLength,
    bufferIndex,
    onSelect: () => {
      if (!isClickable) return
      selectDataKey(isSelected ? null : dataKey)
    },
  }

  return (
    <>
      <RechartsBar
        dataKey={dataKey}
        stackId={isStacked ? STACK_ID : undefined}
        fill={`url(#${id}-colors-${dataKey})`}
        radius={resolvedRadius}
        isAnimationActive={false}
        style={isClickable || enableHoverHighlight ? { cursor: 'pointer' } : undefined}
        shape={(props: unknown) => (
          <BarShape {...(props as BarGeometry)} {...shared} animationType={reveal} />
        )}
        // The hovered bar re-renders through `activeBar`; without forcing the
        // animation off here it would replay its grow-in under the pointer.
        activeBar={(props: unknown) => (
          <BarShape {...(props as BarGeometry)} {...shared} animationType="none" />
        )}
        {...barProps}
      >
        {resolveValues(
          findSlot<ValuesProps>(children, Values),
          rows.map((row) => Number(row[dataKey])).filter(Number.isFinite),
        )}
      </RechartsBar>
      <defs>
        <SeriesGradient id={id} dataKey={dataKey} config={config} direction="vertical" />
        {variant === 'hatched' && <BarHatchedFill id={id} dataKey={dataKey} />}
        {variant === 'duotone' && <BarDuotoneFill id={id} dataKey={dataKey} config={config} />}
        {variant === 'duotone-reverse' && (
          <BarDuotoneFill id={id} dataKey={dataKey} config={config} reverse />
        )}
        {variant === 'gradient' && <BarGradientFill id={id} dataKey={dataKey} />}
        {variant === 'stripped' && <BarStrippedFill id={id} dataKey={dataKey} />}
        {buffer && <BarBufferFill id={id} dataKey={dataKey} />}
        {glowing && <GlowFilter id={id} dataKey={dataKey} />}
      </defs>
    </>
  )
}

/** The geometry Recharts hands a custom bar shape. */
interface BarGeometry {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  isActive?: boolean
  [key: string]: unknown
}

interface BarShapeProps extends BarGeometry {
  id: string
  dataKey: string
  variant: BarVariant
  barRadius: number
  glowing: boolean
  buffer: boolean
  isClickable: boolean
  enableHoverHighlight: boolean
  isPointerInChart: boolean
  isHorizontal: boolean
  animationType: ChartRevealType
  introStartedAt: number
  selectedDataKey: string | null
  dataLength: number
  bufferIndex: number
  onSelect: () => void
}

/**
 * One drawn bar.
 *
 * Two rectangles, and the second one is the reason this is a custom shape: an
 * invisible full-height rect keeps the whole COLUMN hoverable and clickable, so
 * a 3px bar at the bottom of the scale is as easy to hit as a full-height one.
 * The painted bar sits inside it and is the only part that animates.
 */
function BarShape(props: BarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    id,
    dataKey,
    variant,
    barRadius,
    glowing,
    buffer,
    isClickable,
    enableHoverHighlight,
    isPointerInChart,
    isHorizontal,
    animationType,
    introStartedAt,
    selectedDataKey,
    isActive,
    dataLength,
    bufferIndex,
    onSelect,
  } = props

  const index = typeof props.index === 'number' ? props.index : -1
  const isBufferBar = buffer && index >= 0 && index === bufferIndex
  const isStripped = variant === 'stripped'
  const grow = growAnimation(animationType, index, dataLength, isHorizontal, introStartedAt)

  const fill = isBufferBar ? `url(#${id}-buffer-${dataKey})` : variantFill(variant, id, dataKey)
  const opacity = barOpacity({
    isClickable,
    selectedDataKey,
    dataKey,
    enableHoverHighlight,
    isPointerInChart,
    isActive,
  })

  // Stripped rounds only the cap; every other variant rounds all four corners.
  const radius: RectRadius = isStripped ? [barRadius, barRadius, 0, 0] : barRadius

  const painted = (
    <>
      <Rectangle
        x={x}
        y={y}
        width={width}
        // Three pixels off the foot, which is the 2px surface gap between a bar
        // and its neighbour above in a stack, plus the hairline — but never all
        // the way to nothing while there is still a bar to draw.
        height={height <= 0 ? 0 : Math.max(MIN_BAR_LENGTH, height - FOOT_GAP)}
        opacity={opacity}
        radius={radius}
        fill={fill}
        filter={glowing ? `url(#${id}-glow-${dataKey})` : undefined}
        stroke={isBufferBar ? `url(#${id}-colors-${dataKey})` : undefined}
        strokeWidth={isBufferBar ? 1 : undefined}
      />
      {isStripped && (
        <Rectangle
          x={x}
          y={y - 4}
          width={width}
          height={2}
          radius={1}
          fill={`url(#${id}-colors-${dataKey})`}
        />
      )}
    </>
  )

  return (
    <g
      style={isClickable || enableHoverHighlight ? { cursor: 'pointer' } : undefined}
      onClick={onSelect}
    >
      <Rectangle {...props} fill="transparent" />
      {grow ? (
        <motion.g
          initial={grow.initial}
          animate={grow.animate}
          transition={grow.transition}
          style={grow.style}
        >
          {painted}
        </motion.g>
      ) : (
        painted
      )}
    </g>
  )
}

/**
 * The grow-in for a single bar, or `null` when it should render static.
 *
 * The animation is anchored to when the CHART started rather than to when this
 * bar mounted, because Recharts remounts every bar on every re-render — a hover
 * anywhere in the plot would otherwise replay the whole intro. Reading elapsed
 * time makes it a true one-shot: a bar past its window renders flat, and a bar
 * caught mid-grow resumes from where it should already be.
 */
function growAnimation(
  animationType: ChartRevealType,
  index: number,
  dataLength: number,
  isHorizontal: boolean,
  introStartedAt: number,
) {
  if (animationType === 'none' || index < 0 || dataLength <= 0) return null

  const lastIndex = dataLength - 1
  const centre = lastIndex / 2

  let step: number
  switch (animationType) {
    case 'reverse':
      step = lastIndex - index
      break
    case 'center-out':
      step = Math.abs(index - centre)
      break
    case 'edges-in':
      step = centre - Math.abs(index - centre)
      break
    default:
      step = index
  }

  const startMs = step * GROW_STAGGER * 1000
  const endMs = startMs + GROW_DURATION * 1000
  const elapsed = Date.now() - introStartedAt

  if (elapsed >= endMs) return null

  const from = elapsed <= startMs ? 0 : (elapsed - startMs) / (GROW_DURATION * 1000)
  const transition = {
    duration: (endMs - Math.max(elapsed, startMs)) / 1000,
    ease: REVEAL_EASE,
    delay: Math.max(0, startMs - elapsed) / 1000,
  }

  return isHorizontal
    ? { initial: { scaleX: from }, animate: { scaleX: 1 }, transition, style: { originX: 0 } }
    : { initial: { scaleY: from }, animate: { scaleY: 1 }, transition, style: { originY: 1 } }
}

/** The paint reference for a variant. */
function variantFill(variant: BarVariant, id: string, dataKey: string): string {
  if (variant === 'default') return `url(#${id}-colors-${dataKey})`
  return `url(#${id}-${variant}-${dataKey})`
}

/** How lit a bar is, given the click selection and the hover highlight. */
function barOpacity({
  isClickable,
  selectedDataKey,
  dataKey,
  enableHoverHighlight,
  isPointerInChart,
  isActive,
}: {
  isClickable: boolean
  selectedDataKey: string | null
  dataKey: string
  enableHoverHighlight: boolean
  isPointerInChart: boolean
  isActive?: boolean
}) {
  const inSelection = selectedDataKey === null || selectedDataKey === dataKey
  const selectionOpacity = isClickable && selectedDataKey !== null ? (inSelection ? 1 : 0.15) : 1

  if (enableHoverHighlight && isPointerInChart) {
    return isActive ? selectionOpacity : selectionOpacity * 0.3
  }
  return selectionOpacity
}

/**
 * The category axis when the bars stand up, the value axis when they lie down.
 * The type is resolved from the orientation so a consumer never has to know
 * which way round Recharts wants it.
 */
function XAxis({
  tickLine = false,
  axisLine = false,
  tickMargin = 8,
  minTickGap = 8,
  type,
  label,
  ...rest
}: ChartXAxisProps) {
  const { isLoading, isHorizontal } = useBarChart()
  if (isLoading) return null
  return (
    <RechartsXAxis
      tickLine={tickLine}
      axisLine={axisLine}
      tickMargin={tickMargin}
      minTickGap={minTickGap}
      type={type ?? (isHorizontal ? 'number' : 'category')}
      {...rest}
    >
      {axisLabel(label, 'x')}
    </RechartsXAxis>
  )
}

/** The other axis, resolved the same way. */
function YAxis({
  tickLine = false,
  axisLine = false,
  tickMargin = 8,
  minTickGap = 8,
  width = 'auto',
  type,
  label,
  tickFormatter,
  ...rest
}: ChartYAxisProps) {
  const { isLoading, isHorizontal } = useBarChart()
  if (isLoading) return null
  return (
    <RechartsYAxis
      tickLine={tickLine}
      axisLine={axisLine}
      tickMargin={tickMargin}
      minTickGap={minTickGap}
      width={width}
      type={type ?? (isHorizontal ? 'category' : 'number')}
      tickFormatter={tickFormatter ?? defaultTick}
      {...rest}
    >
      {axisLabel(label, 'y')}
    </RechartsYAxis>
  )
}

/** Rules across the value axis — whichever axis that is for this orientation. */
function Grid({
  strokeDasharray = '3 3',
  vertical,
  horizontal,
  ...rest
}: ComponentProps<typeof CartesianGrid>) {
  const { isHorizontal } = useBarChart()
  return (
    <CartesianGrid
      strokeDasharray={strokeDasharray}
      vertical={vertical ?? isHorizontal}
      horizontal={horizontal ?? !isHorizontal}
      {...rest}
    />
  )
}

/**
 * The hover panel.
 *
 * No crosshair by default, unlike the line and area charts: a bar already marks
 * its own category, and a cursor over it draws a second edge on a shape that
 * has four already.
 */
function Tooltip({ variant, roundness, defaultIndex, cursor = false }: ChartTooltipSlotProps) {
  const { isLoading, selectedDataKey } = useBarChart()
  if (isLoading) return null

  return (
    <ChartTooltip
      cursor={cursor}
      defaultIndex={defaultIndex}
      content={
        <ChartTooltipContent selected={selectedDataKey} roundness={roundness} variant={variant} />
      }
    />
  )
}

/** The key. Required above one series. */
function Legend({
  variant,
  align = 'right',
  verticalAlign = 'top',
  isClickable = false,
}: ChartLegendSlotProps) {
  const { selectedDataKey, selectDataKey } = useBarChart()

  return (
    <ChartLegend
      verticalAlign={verticalAlign}
      align={align}
      content={
        <ChartLegendContent
          selected={selectedDataKey}
          onSelectChange={selectDataKey}
          isClickable={isClickable}
          variant={variant}
        />
      }
    />
  )
}

/** The decorative plate behind the plot. */
function Background({ variant }: { variant: ChartBackgroundVariant }) {
  const { isLoading } = useBarChart()
  if (isLoading) return null
  return <ChartBackground variant={variant} />
}

/** The skeleton drawn in place of the real bars while data is in flight. */
function LoadingBar({ chartId, onShimmerExit }: { chartId: string; onShimmerExit: () => void }) {
  return (
    <>
      <RechartsBar
        dataKey={LOADING_KEY}
        fill="currentColor"
        fillOpacity={0.15}
        radius={BAR_RADIUS}
        isAnimationActive={false}
        legendType="none"
        className="text-(--ink)"
        style={{ mask: `url(#${chartId}-loading-mask)` }}
      />
      <defs>
        <LoadingShimmer id={chartId} onShimmerExit={onShimmerExit} />
      </defs>
    </>
  )
}

BarChart.Bar = Bar
BarChart.XAxis = XAxis
BarChart.YAxis = YAxis
BarChart.Grid = Grid
BarChart.Tooltip = Tooltip
BarChart.Legend = Legend
BarChart.Background = Background
BarChart.ReferenceLine = ReferenceLine
BarChart.ReferenceBand = ReferenceBand
BarChart.Annotation = Annotation
BarChart.Values = Values
BarChart.Brush = Brush
BarChart.Toolbar = Toolbar
BarChart.Sonify = Sonify

export default BarChart
