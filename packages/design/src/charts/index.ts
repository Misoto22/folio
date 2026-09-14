/**
 * @misoto22/folio/charts — the data-visualisation entry.
 *
 * Separate from the main entry on purpose. Charts need a rendering engine and
 * an animation runtime that nothing else in the package does, and both are
 * peer dependencies:
 *
 *   pnpm add recharts motion
 *   import { AreaChart } from '@misoto22/folio/charts'
 *
 * Keeping them behind their own entry is what stops an app that renders a
 * Badge from paying for Recharts, and it is why the package's size budget
 * still describes the core (DESIGN-ARCH-001).
 *
 * The look ships with the rest of the system — `styles.css`, or the portable
 * `tokens.css` + `semantic.css` layers. A chart reads `--series-1…8` and the
 * `--chart-*` roles from there and defines no colour of its own.
 *
 * Everything below is a consumer contract. Adding an export is cheap; changing
 * or removing one is a breaking change (DESIGN-API-001).
 */

// ─── Cartesian ───
export { AreaChart } from './AreaChart/AreaChart'
export type {
  AreaChartProps,
  AreaProps,
  AreaStackType,
  AreaStrokeVariant,
  AreaVariant,
  ChartCurveType,
  ChartLegendSlotProps,
  ChartTooltipSlotProps,
} from './AreaChart/AreaChart'

export { BarChart } from './BarChart/BarChart'
export type {
  BarChartProps,
  BarOrientation,
  BarProps,
  BarStackType,
  BarVariant,
} from './BarChart/BarChart'

export { LineChart } from './LineChart/LineChart'
export type { LineChartProps, LineProps, LineStrokeVariant } from './LineChart/LineChart'

export { ComposedChart } from './ComposedChart/ComposedChart'
export type {
  ComposedBarProps,
  ComposedChartProps,
  ComposedLineProps,
} from './ComposedChart/ComposedChart'

export { ScatterChart } from './ScatterChart/ScatterChart'
export type {
  ScatterChartProps,
  ScatterProps,
  ScatterShape,
  ScatterTable,
  ScatterVariant,
} from './ScatterChart/ScatterChart'

// ─── Polar ───
export { PieChart } from './PieChart/PieChart'
export type { PieChartProps, PieLabelProps, PieProps, PieVariant } from './PieChart/PieChart'

export { RadarChart } from './RadarChart/RadarChart'
export type { RadarChartProps, RadarProps, RadarVariant } from './RadarChart/RadarChart'

export { RadialChart } from './RadialChart/RadialChart'
export type { RadialBarProps, RadialChartProps, RadialVariant } from './RadialChart/RadialChart'

export { FunnelChart } from './FunnelChart/FunnelChart'
export type {
  FunnelChartProps,
  FunnelLabelProps,
  FunnelProps,
  FunnelVariant,
} from './FunnelChart/FunnelChart'

export { TreemapChart } from './TreemapChart/TreemapChart'
export type {
  TreemapChartProps,
  TreemapExtras,
  TreemapNode,
  TreemapVariant,
} from './TreemapChart/TreemapChart'

// ─── Grid and inline ───
// Neither needs a rendering engine: a heatmap is a table with weighted cells,
// and a sparkline is one path. Both are usable with `recharts` absent.
export { Heatmap } from './Heatmap/Heatmap'
export type { HeatmapCell, HeatmapProps, HeatmapScale } from './Heatmap/Heatmap'

export { CalendarHeatmap } from './CalendarHeatmap/CalendarHeatmap'
export type {
  CalendarHeatmapProps,
  CalendarHeatmapValue,
} from './CalendarHeatmap/CalendarHeatmap'

export { Sparkline } from './Sparkline/Sparkline'
export type { SparklineProps, SparklineVariant } from './Sparkline/Sparkline'

export { BarList } from './BarList/BarList'
export type { BarListItem, BarListProps } from './BarList/BarList'

export { BigNumber } from './BigNumber/BigNumber'
export type { BigNumberDelta, BigNumberProps, DeltaIntent } from './BigNumber/BigNumber'

// ─── Flow ───
export { SankeyChart } from './SankeyChart/SankeyChart'
export type {
  LinkProps as SankeyLinkSlotProps,
  NodeLabelProps as SankeyNodeLabelProps,
  NodeProps as SankeyNodeSlotProps,
  SankeyChartProps,
  SankeyLabelPosition,
  SankeyLinkVariant,
} from './SankeyChart/SankeyChart'

// ─── Shared pieces ───
export { ChartContainer, SERIES_SLOTS, percentTick, useChart } from './lib/chart'
export type { ChartConfig, ChartContainerProps, ChartSeries } from './lib/chart'

export { ChartFigure, ChartDataTable } from './lib/figure'
export type { ChartColumn, ChartDataTableProps, ChartFigureProps } from './lib/figure'

export { ChartBackground } from './lib/background'
export type { ChartBackgroundProps, ChartBackgroundVariant } from './lib/background'

export { ChartDot } from './lib/dot'
export type { ChartDotProps, ChartDotVariant } from './lib/dot'

export { ChartLegend, ChartLegendContent } from './lib/legend'
export type {
  ChartLegendAlign,
  ChartLegendContentProps,
  ChartLegendVariant,
} from './lib/legend'

export { ChartTooltip, ChartTooltipContent } from './lib/tooltip'
export type {
  ChartTooltipContentProps,
  ChartTooltipIndicator,
  ChartTooltipRoundness,
  ChartTooltipVariant,
} from './lib/tooltip'

export { Brush, ChartBrush, useChartBrush } from './lib/brush'
export type { BrushProps, ChartBrushProps, ChartBrushRange, ChartBrushVariant } from './lib/brush'

export type { ChartRevealDirection, ChartRevealType } from './lib/paint'

// ─── Distribution and contribution ───
// The statistical family. Each one hides something specific, and each says so
// in its own description rather than in a footnote: a box plot hides
// multimodality and sample size, a histogram's shape is a property of its bin
// width, a bullet's bands are a judgement drawn in the same ink as the
// measurement, and a waterfall's connectors imply a sequence that usually is
// not one.
export { BoxPlot } from './BoxPlot/BoxPlot'
export type {
  BoxPlotBoxesProps,
  BoxPlotDatum,
  BoxPlotOrientation,
  BoxPlotProps,
  BoxPlotSample,
  BoxPlotSummary,
} from './BoxPlot/BoxPlot'

export { Histogram } from './Histogram/Histogram'
export type {
  HistogramBarsProps,
  HistogramBin,
  HistogramMode,
  HistogramProps,
} from './Histogram/Histogram'

export { WaterfallChart } from './WaterfallChart/WaterfallChart'
export type {
  WaterfallBarsProps,
  WaterfallChartProps,
  WaterfallDirection,
  WaterfallStep,
  WaterfallStepType,
} from './WaterfallChart/WaterfallChart'

// Engine-free, like Heatmap and BarList: plain HTML with logical properties,
// server-renderable, and correct in a right-to-left document.
export { BulletChart } from './BulletChart/BulletChart'
export type { BulletChartProps, BulletMeasure } from './BulletChart/BulletChart'

// ─── Small multiples ───
// The same chart once per group, on one shared scale. The shared domain is the
// default and the whole point: on independent scales a group peaking at 40 and
// one peaking at 4,000 draw the same shape, and the comparison the reader came
// for is not merely lost but inverted.
export { Facet } from './Facet/Facet'
export type { FacetProps, FacetOverflowInfo } from './Facet/Facet'
export { buildPanels, groupRows, niceDomain, sortGroups, statsOf } from './Facet/panels'
export type {
  FacetGroup,
  FacetOptions,
  FacetOverflow,
  FacetPanel,
  FacetResult,
  FacetScales,
  FacetSort,
  FacetSortKey,
  FacetStats,
} from './Facet/panels'

// ─── Sonification ───
// The data as sound, for a reader who cannot see the plot. Never autoplays;
// sound only ever starts from an explicit user action.
export {
  createSonification,
  describeSeries,
  hasAudioSupport,
  sonifyDomain,
  sonifyDuration,
  sonifyTimeline,
  valueToFrequency,
  SONIFY_DEFAULTS,
} from './lib/sonify'
export type {
  SonifyController,
  SonifyOptions,
  SonifyPoint,
  SonifySeries,
  SonifyState,
  SonifyStep,
  SonifyWave,
} from './lib/sonify'

export {
  ChartSonifyButton,
  Sonify,
  chartSonifySeries,
  useChartSonifySeries,
  useSonify,
} from './lib/sonify-control'
export type {
  ChartSonifyButtonProps,
  SonifyAlign,
  SonifyProps,
  UseSonifyOptions,
  UseSonifyResult,
} from './lib/sonify-control'

// ─── Toolbar, zoom and export ───
// Zoom and the brush are two views of ONE window: `useChartZoom` owns it and
// hands the brush a controlled range, so dragging a handle moves the toolbar's
// window and "reset" is unambiguous.
export { Toolbar, ChartToolbar, ChartControls } from './lib/toolbar'
export type {
  ChartExportFormat,
  ChartToolbarProps,
  ChartControlsProps,
  ToolbarProps,
} from './lib/toolbar'

export { useChartZoom, ChartZoomSurface, clampWindow, panWindow, zoomWindow } from './lib/zoom'
export type { ChartZoom, ChartZoomOptions, ChartZoomSurfaceProps } from './lib/zoom'

export { chartToCsv, chartToPng, downloadBlob, exportFilename } from './lib/export'
export type { ChartPngOptions } from './lib/export'

// ─── Annotation layer ───
// A target line, a shaded period, a note on the plot. Drawn in the order
// editorial charting settled on: bands behind the grid, lines above the data,
// text above both.
export { Annotation, ReferenceBand, ReferenceLine, ANNOTATION_LAYER } from './lib/annotations'
export type {
  AnnotationProps,
  AnnotationWeight,
  ReferenceBandProps,
  ReferenceLineProps,
} from './lib/annotations'

export { Values } from './lib/values'
export type { ValueLabelMode, ValuesProps } from './lib/values'

export { ChartEmpty } from './lib/empty'
export type { ChartEmptyProps } from './lib/empty'

export { defaultTick, formatNumber } from './lib/format'
export type { NumberFormatOptions, NumberStyle } from './lib/format'
