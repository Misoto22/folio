'use client'

import type { CSSProperties } from 'react'
import { Legend as RechartsLegend } from 'recharts'
import type { DefaultLegendContentProps } from 'recharts'
import { cn } from '../../lib/cn'
import { colorStops, cssName, seriesFromPayload, useChart } from './chart'

/**
 * The shape of a legend's series mark.
 *
 * Seven, because the mark is doing more work here than in a chromatic system:
 * with the monochrome ramp, a bar-shaped swatch beside a bar chart and a
 * dot-shaped one beside a scatter is often the fastest way a reader ties the
 * key to the plot.
 */
export type ChartLegendVariant =
  | 'square'
  | 'circle'
  | 'circle-outline'
  | 'rounded-square'
  | 'rounded-square-outline'
  | 'vertical-bar'
  | 'horizontal-bar'

/** Where the legend sits along the inline axis. Recharts' own vocabulary. */
export type ChartLegendAlign = 'left' | 'center' | 'right'

const ALIGN: Record<ChartLegendAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export interface ChartLegendContentProps extends DefaultLegendContentProps {
  className?: string
  /** Suppresses a config `icon`, falling back to the shape swatch. */
  hideIcon?: boolean
  /** The row field holding a series name, when it is not the `dataKey`. */
  nameKey?: string
  /** The chart's selected series, or null when the whole plot is lit. */
  selected?: string | null
  /** Makes each entry a control that toggles its series. */
  isClickable?: boolean
  onSelectChange?: (selected: string | null) => void
  variant?: ChartLegendVariant
}

/**
 * The key to a plot's series.
 *
 * Required above one series and not decorative: the monochrome ramp separates
 * two series by a step of grey and a texture, and neither is self-describing.
 * The chroma palette does not change that — three of its light steps sit below
 * 3:1 on paper, and the legend is the documented relief.
 *
 * When `isClickable` is set each entry is a real `<button>` with `aria-pressed`
 * rather than a `<div>` with a click handler. That is the difference between a
 * filter a keyboard can reach and one it cannot, and it is why the entry is not
 * simply styled to look pressable.
 */
export function ChartLegendContent({
  className,
  hideIcon = false,
  nameKey,
  payload,
  verticalAlign,
  align = 'right',
  selected,
  onSelectChange,
  isClickable,
  variant = 'rounded-square',
}: ChartLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <ul
      className={cn(
        'm-0 flex list-none items-center gap-4 p-0 select-none',
        ALIGN[align],
        verticalAlign === 'top' ? 'pb-4' : 'pt-4',
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const named =
            nameKey && item.payload ? (item.payload as Record<string, unknown>)[nameKey] : undefined
          const key = `${named ?? item.value ?? item.dataKey ?? 'value'}`
          const series = seriesFromPayload(config, item, key)
          const isLit = selected === null || selected === undefined || selected === key
          const stops = series ? colorStops(series) : 1

          const body = (
            <>
              {series?.icon && !hideIcon ? (
                <series.icon aria-hidden />
              ) : (
                <LegendSwatch variant={variant} seriesKey={key} stops={stops} />
              )}
              {series?.label ?? key}
            </>
          )

          const shared = cn(
            'flex items-center gap-1.5 text-(--ink-2) transition-opacity duration-(--duration-fast) [&>svg]:size-3 [&>svg]:text-(--ink-3-aa)',
            !isLit && 'opacity-30',
          )

          return (
            <li key={key}>
              {isClickable ? (
                <button
                  type="button"
                  aria-pressed={selected === key}
                  onClick={() => onSelectChange?.(selected === key ? null : key)}
                  className={cn(
                    shared,
                    'cursor-pointer rounded-(--radius-sm) hover:text-(--ink)',
                  )}
                >
                  {body}
                </button>
              ) : (
                <span className={shared}>{body}</span>
              )}
            </li>
          )
        })}
    </ul>
  )
}

/**
 * The swatch itself. Each variant is its own branch rather than a size lookup,
 * because the outline forms are built differently from the filled ones and a
 * shared branch would have to carry both.
 */
function LegendSwatch({
  variant,
  seriesKey,
  stops,
}: {
  variant: ChartLegendVariant
  seriesKey: string
  stops: number
}) {
  const fill = paintStyle(seriesKey, stops)
  const outline = { ...fill, ...MASK }

  switch (variant) {
    case 'square':
      return <span aria-hidden className="size-2 shrink-0" style={fill} />
    case 'circle':
      return <span aria-hidden className="size-2 shrink-0 rounded-(--radius-pill)" style={fill} />
    case 'circle-outline':
      return (
        <span
          aria-hidden
          className="size-2.5 shrink-0 rounded-(--radius-pill) p-(--space-swatch)"
          style={outline}
        />
      )
    case 'vertical-bar':
      return <span aria-hidden className="h-3 w-1 shrink-0 rounded-[2px]" style={fill} />
    case 'horizontal-bar':
      return <span aria-hidden className="h-1 w-3 shrink-0 rounded-[2px]" style={fill} />
    case 'rounded-square-outline':
      return <span aria-hidden className="size-2.5 shrink-0 rounded-[3px] p-(--space-swatch)" style={outline} />
    case 'rounded-square':
    default:
      return <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={fill} />
  }
}

/**
 * Punches the middle out of a filled swatch, leaving its border.
 *
 * `border-color` cannot take a gradient, and a swatch whose series is painted
 * with several stops has to show them. Two masks composited with `exclude`
 * leave only the padding box — which follows the border radius, which a border
 * approximated with an inset box-shadow would not.
 */
const MASK: CSSProperties = {
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude',
}

/** A swatch's paint: the series colour, or its gradient across the swatch. */
function paintStyle(seriesKey: string, stops: number): CSSProperties {
  const name = cssName(seriesKey)
  if (stops <= 1) return { backgroundColor: `var(--color-${name}-0)` }

  const gradient = Array.from({ length: stops }, (_, index) => {
    const offset = (index / (stops - 1)) * 100
    return `var(--color-${name}-${index}) ${offset}%`
  }).join(', ')

  return { background: `linear-gradient(to right, ${gradient})` }
}

export const ChartLegend = RechartsLegend
