'use client'

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
  type FC,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  Area as RechartsArea,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
} from 'recharts'
import { useReducedMotion } from 'motion/react'
import { ChartContainer, percentTick, type ChartConfig } from '../lib/chart'
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
import { ChartDot, type ChartDotVariant } from '../lib/dot'
import {
  ChartLegend,
  ChartLegendContent,
  type ChartLegendAlign,
  type ChartLegendVariant,
} from '../lib/legend'
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartTooltipRoundness,
  type ChartTooltipVariant,
} from '../lib/tooltip'
import { Brush, ChartBrush, type BrushProps, type ChartBrushRange } from '../lib/brush'
import { ChartControls, Toolbar, type ToolbarProps } from '../lib/toolbar'
import { useChartZoom } from '../lib/zoom'
import { LoadingIndicator, LoadingShimmer, LOADING_KEY, useLoadingRows } from '../lib/loading'
import {
  AnimatedDashedStroke,
  AreaDottedFill,
  AreaGradientFill,
  AreaGradientReverseFill,
  AreaHatchedFill,
  AreaLinesFill,
  AreaSolidFill,
  RevealMask,
  SeriesGradient,
  UnselectedFill,
  type ChartRevealType,
} from '../lib/paint'

/** The series stroke, in pixels. Thin by default — law 1 is a thin mark. */
const STROKE_WIDTH = 0.8

/** Every stacked area shares one id, which is what makes them stack. */
const STACK_ID = 'folio-area-stack'

/**
 * Room around the plot, so the first and last tick labels are not sliced by the
 * container's edge. Recharts' own default is 5px on every side, which is not
 * enough for a label centred on the axis's first point.
 */
const CHART_MARGIN = { top: 8, right: 12, bottom: 0, left: 12 }

/** How an area's curve is interpolated between points. */
export type ChartCurveType = ComponentProps<typeof RechartsArea>['type']

/**
 * How an area meets the plot.
 *
 * In the monochrome default this is the PRIMARY way two series are told apart
 * — the ramp is the second encoding — so a chart with more than one area
 * should vary this before it varies anything else.
 */
export type AreaVariant = 'gradient' | 'gradient-reverse' | 'solid' | 'dotted' | 'lines' | 'hatched'

/** How the line on top of an area is drawn. */
export type AreaStrokeVariant = 'solid' | 'dashed' | 'animated-dashed'

/** How several areas combine: side by side, stacked, or normalised to 100%. */
export type AreaStackType = 'default' | 'stacked' | 'expanded'

interface AreaChartContextValue {
  config: ChartConfig
  /** The rows on screen, so a mark can label its own extremes. */
  rows: Record<string, unknown>[]
  curveType: ChartCurveType
  animationType: ChartRevealType
  isStacked: boolean
  isExpanded: boolean
  isLoading: boolean
  selectedDataKey: string | null
  selectDataKey: (dataKey: string | null) => void
}

const AreaChartContext = createContext<AreaChartContextValue | null>(null)

function useAreaChart(): AreaChartContextValue {
  const context = useContext(AreaChartContext)
  if (!context) throw new Error('An area chart part must be rendered inside <AreaChart>')
  return context
}

/** Fails the build when a config names a series the rows do not have. */
type ValidateKeys<TData, TConfig> = {
  [K in keyof TConfig]: K extends keyof TData ? ChartConfig[string] : never
}

export interface AreaChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> {
  /** Series keys → their label and paint. Declaration order is ramp order. */
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
  chartProps?: ComponentProps<typeof RechartsAreaChart>
  /** The curve every `<AreaChart.Area>` inherits. */
  curveType?: ChartCurveType
  /** The intro wipe every `<AreaChart.Area>` inherits. */
  animationType?: ChartRevealType
  /** How several marks combine: side by side, stacked, or normalised to 100%. */
  stackType?: AreaStackType
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
  /** How many points the skeleton draws. */
  loadingPoints?: number
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
 * A filled series over a category axis — the shape for a magnitude that is
 * continuous, where the area under the line means something.
 *
 * Composed rather than configured: axes, grid, tooltip, legend and the areas
 * themselves are children, so a chart renders exactly the parts it asked for
 * and nothing is switched on by a prop nobody can see.
 *
 * Reach for `<LineChart>` instead when the reader is comparing several series
 * against each other rather than reading one total, and for `<BarChart>` when
 * the categories are discrete.
 *
 * @example
 * <AreaChart title="Visitors per month" config={config} data={data} xDataKey="month">
 *   <AreaChart.Grid />
 *   <AreaChart.XAxis dataKey="month" />
 *   <AreaChart.Tooltip />
 *   <AreaChart.Area dataKey="desktop" variant="gradient" />
 * </AreaChart>
 */
export function AreaChart<
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
  curveType = 'linear',
  animationType = 'forward',
  stackType = 'default',
  defaultSelectedDataKey = null,
  selectedDataKey: controlledDataKey,
  onSelectionChange,
  isLoading = false,
  loadingPoints,
  xDataKey,
  hideDataTable = false,
  empty,
}: AreaChartProps<TData, TConfig>) {
  const chartId = useId().replace(/:/g, '')
  const { rows: loadingData, onShimmerExit } = useLoadingRows(isLoading, loadingPoints)
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

  const columns = useMemo(
    () => Object.entries(config).map(([key, series]) => ({ key, label: series.label })),
    [config],
  )

  const isExpanded = stackType === 'expanded'
  const isStacked = stackType === 'stacked' || isExpanded
  const showBrush = brushSlot.present && !isLoading
  const showToolbar = toolbarSlot !== null && !isLoading
  // `empty === false` keeps the axes, for a chart whose emptiness is the
  // reading — a monitoring panel that should show a flat, silent range rather
  // than a message.
  const isEmpty = !isLoading && empty !== false && data.length === 0
  const displayData =
    isLoading ? loadingData : showBrush || showToolbar ? zoom.visibleData : data

  // The rows on screen, so a brushed range sounds like what it looks like. A
  // skeleton or an empty chart yields no finite value, which is what leaves the
  // control disabled rather than playing silence.
  const sonifySeries = useChartSonifySeries(
    sonifySlot,
    displayData as Record<string, unknown>[],
    config,
    xDataKey,
  )

  const [selectedDataKey, selectDataKey] = useChartSelection(
    controlledDataKey,
    defaultSelectedDataKey,
    onSelectionChange,
  )

  const context = useMemo<AreaChartContextValue>(
    () => ({
      config,
      rows: displayData as Record<string, unknown>[],
      curveType,
      animationType,
      isStacked,
      isExpanded,
      isLoading,
      selectedDataKey,
      selectDataKey,
    }),
    [
      animationType,
      config,
      curveType,
      displayData,
      isExpanded,
      isLoading,
      isStacked,
      selectDataKey,
      selectedDataKey,
    ],
  )

  return (
    <AreaChartContext.Provider value={context}>
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
                variant="area"
                curveType={curveType}
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
          <RechartsAreaChart
            id={chartId}
            accessibilityLayer
            margin={CHART_MARGIN}
            stackOffset={isExpanded ? 'expand' : undefined}
            data={displayData}
            {...chartProps}
          >
            {chartChildren}
            {isLoading && (
              <LoadingArea chartId={chartId} curveType={curveType} onShimmerExit={onShimmerExit} />
            )}
          </RechartsAreaChart>
        </ChartContainer>
        </ChartControls>
        <LoadingIndicator isLoading={isLoading} />
      </ChartFigure>
    </AreaChartContext.Provider>
  )
}

export interface AreaProps {
  /** The series to draw. Must exist on both the rows and the config. */
  dataKey: string
  variant?: AreaVariant
  strokeVariant?: AreaStrokeVariant
  strokeWidth?: number
  curveType?: ChartCurveType
  animationType?: ChartRevealType
  connectNulls?: boolean
  /** Lets a click on this area select it, dimming the rest. */
  isClickable?: boolean
  /** `<AreaChart.Dot>`, `<AreaChart.ActiveDot>` and `<AreaChart.Values>`. */
  children?: ReactNode
  areaProps?: ComponentProps<typeof RechartsArea>
}

/**
 * One filled series.
 *
 * Every area scopes its own gradients and patterns under a unique id, so any
 * number of them — each with its own variant, stroke and clickability — can
 * share a chart without one overwriting another's definitions.
 */
function Area({
  dataKey,
  variant = 'gradient',
  strokeVariant = 'dashed',
  strokeWidth = STROKE_WIDTH,
  curveType,
  animationType,
  connectNulls = false,
  isClickable = false,
  children,
  areaProps,
}: AreaProps) {
  const {
    config,
    curveType: defaultCurve,
    animationType: defaultAnimation,
    isStacked,
    isExpanded,
    isLoading,
    rows,
    selectedDataKey,
    selectDataKey,
  } = useAreaChart()
  const id = useId().replace(/:/g, '')
  const reduceMotion = useReducedMotion()

  if (isLoading) return null

  const reveal: ChartRevealType = reduceMotion ? 'none' : (animationType ?? defaultAnimation)
  const maskId = reveal === 'none' ? undefined : `${id}-reveal-mask`

  const isSelected = selectedDataKey === dataKey
  const hasSelection = selectedDataKey !== null
  const dimmed = hasSelection && !isSelected
  // The variant's own mask carries the fill strength now (`--chart-fill`), so
  // a base multiplier here would darken paper and erase ink a second time.
  // What is left is the SELECTION dim, which is a multiplier by definition.
  const opacity = dimmed
    ? { fill: 0.25, stroke: 0.3, dot: 0.3 }
    : { fill: 1, stroke: 1, dot: 1 }

  const { dot, activeDot } = resolveDots(children, id, dataKey, opacity.dot, maskId)
  const labels = resolveValues(
    findSlot<ValuesProps>(children, Values),
    rows.map((row) => Number(row[dataKey])).filter(Number.isFinite),
  )

  // An animated dash is a SMIL loop, which `keyframes.css` cannot reach — so it
  // is gated here rather than in CSS. It is also dropped while another series
  // is selected: a crawling dash on a dimmed line reads as the live one.
  const animateDash = strokeVariant === 'animated-dashed' && !hasSelection && !reduceMotion
  const isDashed = strokeVariant !== 'solid'

  return (
    <>
      <RechartsArea
        type={curveType ?? defaultCurve}
        dataKey={dataKey}
        connectNulls={connectNulls}
        fillOpacity={opacity.fill}
        strokeOpacity={opacity.stroke}
        fill={`url(#${id}-${dimmed ? 'unselected' : variant}-${dataKey})`}
        stroke={`url(#${id}-colors-${dataKey})`}
        stackId={isStacked ? STACK_ID : undefined}
        dot={dot}
        activeDot={activeDot}
        strokeWidth={strokeWidth}
        strokeDasharray={isDashed ? '3 3' : undefined}
        // Recharts' own area animation draws the fill and the dots on separate
        // clocks, so the markers arrive before the line reaches them. The mask
        // below wipes fill, stroke and dots in together instead.
        isAnimationActive={false}
        style={{
          ...(maskId ? { mask: `url(#${maskId})` } : {}),
          ...(isClickable ? { cursor: 'pointer' } : {}),
        }}
        onClick={() => {
          if (!isClickable) return
          selectDataKey(isSelected ? null : dataKey)
        }}
        {...areaProps}
      >
        {animateDash && <AnimatedDashedStroke />}
        {labels}
      </RechartsArea>
      <defs>
        {reveal !== 'none' && <RevealMask id={id} type={reveal} />}
        <SeriesGradient
          id={id}
          dataKey={dataKey}
          config={config}
          gradientUnits={isExpanded ? 'userSpaceOnUse' : 'objectBoundingBox'}
        />
        {variant === 'gradient' && <AreaGradientFill id={id} dataKey={dataKey} />}
        {variant === 'gradient-reverse' && <AreaGradientReverseFill id={id} dataKey={dataKey} />}
        {variant === 'solid' && <AreaSolidFill id={id} dataKey={dataKey} />}
        {variant === 'dotted' && <AreaDottedFill id={id} dataKey={dataKey} />}
        {variant === 'lines' && <AreaLinesFill id={id} dataKey={dataKey} />}
        {variant === 'hatched' && <AreaHatchedFill id={id} dataKey={dataKey} />}
        {dimmed && <UnselectedFill id={id} dataKey={dataKey} />}
      </defs>
    </>
  )
}

export interface DotProps {
  variant?: ChartDotVariant
}

/**
 * The resting point marker for the area it is composed inside. A slot: it
 * renders nothing, and the parent reads its variant.
 */
const Dot: FC<DotProps> = () => null

/** The marker under the pointer. Same slot shape as `<Dot>`. */
const ActiveDot: FC<DotProps> = () => null

/** Lifts `<Dot>` and `<ActiveDot>` out of an area's children. */
function resolveDots(
  children: ReactNode,
  id: string,
  dataKey: string,
  dotOpacity: number,
  maskId: string | undefined,
) {
  let dot: ComponentProps<typeof RechartsArea>['dot'] = false
  let activeDot: ComponentProps<typeof RechartsArea>['activeDot'] = false

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const { variant } = (child as ReactElement<DotProps>).props

    if (child.type === Dot) {
      // The resting dot shares the intro wipe so it appears with its own line.
      dot = (
        <ChartDot
          variant={variant}
          dataKey={dataKey}
          chartId={id}
          fillOpacity={dotOpacity}
          maskId={maskId}
        />
      )
    }
    if (child.type === ActiveDot) {
      // The active dot is never masked: it only exists on hover, long after
      // the intro has finished, and a stale mask would hide it entirely.
      activeDot = (
        <ChartDot variant={variant} dataKey={dataKey} chartId={id} fillOpacity={dotOpacity} />
      )
    }
  })

  return { dot, activeDot }
}

/** The category axis. Flat by default; every Recharts prop passes through. */
function XAxis({
  tickLine = false,
  axisLine = false,
  tickMargin = 8,
  minTickGap = 8,
  label,
  ...rest
}: ChartXAxisProps) {
  const { isLoading } = useAreaChart()
  if (isLoading) return null
  return (
    <RechartsXAxis
      tickLine={tickLine}
      axisLine={axisLine}
      tickMargin={tickMargin}
      minTickGap={minTickGap}
      {...rest}
    >
      {axisLabel(label, 'x')}
    </RechartsXAxis>
  )
}

/**
 * The value axis. Formats as a percentage on its own when the stack is
 * expanded, and steps aside for a `tickFormatter` of your own.
 */
function YAxis({
  tickLine = false,
  axisLine = false,
  tickMargin = 8,
  minTickGap = 8,
  width = 'auto',
  tickFormatter,
  label,
  ...rest
}: ChartYAxisProps) {
  const { isLoading, isExpanded } = useAreaChart()
  if (isLoading) return null
  return (
    <RechartsYAxis
      tickLine={tickLine}
      axisLine={axisLine}
      tickMargin={tickMargin}
      minTickGap={minTickGap}
      width={width}
      // A caller's formatter wins over the expanded stack's own, rather than
      // being dropped by it: an axis that silently ignores what it was handed
      // is indistinguishable from one that was handed a typo.
      tickFormatter={tickFormatter ?? (isExpanded ? percentTick : defaultTick)}
      {...rest}
    >
      {axisLabel(label, 'y')}
    </RechartsYAxis>
  )
}

/** Horizontal dashed rules. Vertical ones are off — they rarely earn their ink. */
function Grid({
  vertical = false,
  strokeDasharray = '3 3',
  ...rest
}: ComponentProps<typeof CartesianGrid>) {
  return <CartesianGrid vertical={vertical} strokeDasharray={strokeDasharray} {...rest} />
}

export interface ChartTooltipSlotProps {
  variant?: ChartTooltipVariant
  roundness?: ChartTooltipRoundness
  /** Shows the tooltip at this row before anything is hovered. */
  defaultIndex?: number
  /** The crosshair that follows the pointer along the axis. */
  cursor?: boolean
}

/** The hover panel. Dims with the plot when a series is selected. */
function Tooltip({ variant, roundness, defaultIndex, cursor = true }: ChartTooltipSlotProps) {
  const { isLoading, selectedDataKey } = useAreaChart()
  if (isLoading) return null

  return (
    <ChartTooltip
      defaultIndex={defaultIndex}
      cursor={cursor ? { strokeDasharray: '3 3', strokeWidth: STROKE_WIDTH } : false}
      content={
        <ChartTooltipContent selected={selectedDataKey} roundness={roundness} variant={variant} />
      }
    />
  )
}

export interface ChartLegendSlotProps {
  variant?: ChartLegendVariant
  align?: ChartLegendAlign
  verticalAlign?: 'top' | 'middle' | 'bottom'
  /** Makes each entry a button that selects its series. */
  isClickable?: boolean
}

/**
 * The key. Required above one series: with the monochrome ramp two areas differ
 * by a step of grey and a texture, and neither names itself.
 */
function Legend({
  variant,
  align = 'right',
  verticalAlign = 'top',
  isClickable = false,
}: ChartLegendSlotProps) {
  const { selectedDataKey, selectDataKey } = useAreaChart()

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
  const { isLoading } = useAreaChart()
  if (isLoading) return null
  return <ChartBackground variant={variant} />
}

/** The skeleton drawn in place of the real areas while data is in flight. */
function LoadingArea({
  chartId,
  curveType,
  onShimmerExit,
}: {
  chartId: string
  curveType: ChartCurveType
  onShimmerExit: () => void
}) {
  return (
    <>
      <RechartsArea
        type={curveType}
        dataKey={LOADING_KEY}
        fillOpacity={0.05}
        fill="currentColor"
        stroke="currentColor"
        strokeOpacity={0.5}
        isAnimationActive={false}
        legendType="none"
        tooltipType="none"
        activeDot={false}
        dot={false}
        className="text-(--ink)"
        style={{ mask: `url(#${chartId}-loading-mask)` }}
      />
      <defs>
        <LoadingShimmer id={chartId} onShimmerExit={onShimmerExit} />
      </defs>
    </>
  )
}

// Every part hangs off the root, so one import brings the whole vocabulary and
// no two charts collide over a name like `Tooltip`.
AreaChart.Area = Area
AreaChart.Dot = Dot
AreaChart.ActiveDot = ActiveDot
AreaChart.XAxis = XAxis
AreaChart.YAxis = YAxis
AreaChart.Grid = Grid
AreaChart.Tooltip = Tooltip
AreaChart.Legend = Legend
AreaChart.Background = Background
AreaChart.ReferenceLine = ReferenceLine
AreaChart.ReferenceBand = ReferenceBand
AreaChart.Annotation = Annotation
AreaChart.Values = Values
AreaChart.Brush = Brush
AreaChart.Toolbar = Toolbar
AreaChart.Sonify = Sonify

export default AreaChart
