'use client'

import { useRef, useState, type FC, type ReactNode, type RefObject } from 'react'
import { FileDown, ImageDown, RotateCcw, ZoomIn, ZoomOut } from '../../icons'
import type { IconComponent } from '../../icons'
import { cn } from '../../lib/cn'
import { Button } from '../../components/Button/Button'
import { chartToCsv, chartToPng, downloadBlob, exportFilename } from './export'
import { ChartZoomSurface, type ChartZoom } from './zoom'
import type { ChartColumn } from './figure'

/** Which file a reader can take away. */
export type ChartExportFormat = 'png' | 'csv'

export interface ToolbarProps {
  /**
   * Which files the toolbar offers. `[]` drops the export controls and leaves
   * a zoom-only toolbar.
   */
  exports?: ChartExportFormat[]
  /**
   * Off leaves only the export controls, and the plot stops responding to the
   * wheel, to a drag and to the keyboard. For a chart whose x axis is a handful
   * of categories, where there is nothing to zoom into.
   */
  zoom?: boolean
  /** Base name for a downloaded file. Defaults to the figure's title. */
  filename?: string
  /** Which end of the plot the row sits at. */
  align?: 'start' | 'end'
  /** Fires after a file has been handed to the browser. */
  onExport?: (format: ChartExportFormat) => void
  /**
   * Fires when an export fails — a chart that has not been measured yet, or a
   * canvas tainted by a cross-origin image. Without it the error is logged,
   * because a download that silently does nothing is the worst of the three.
   */
  onExportError?: (error: Error) => void
}

/**
 * Declares the toolbar above a chart: zoom, reset, and taking the figure away
 * as a PNG or a CSV.
 *
 * Renders nothing itself — its PRESENCE among the chart's children turns the
 * toolbar on, and its props configure it, the same shape `<Chart.Brush>` uses.
 * The toolbar is also what switches the plot's own zoom gestures on, so a chart
 * that composes it becomes wheel-, drag- and keyboard-zoomable at the same
 * time.
 *
 * Reach for `<Chart.Brush>` INSTEAD when the reader needs to see the whole
 * series while choosing a slice of it; reach for both when they need to do that
 * and also step the zoom or take the numbers away. The two drive one window, so
 * they cannot disagree.
 *
 * @example
 * <LineChart title="Visitors per day" config={config} data={data} xDataKey="day">
 *   <LineChart.Toolbar exports={['png', 'csv']} />
 *   <LineChart.XAxis dataKey="day" />
 *   <LineChart.Line dataKey="desktop" />
 * </LineChart>
 */
export const Toolbar: FC<ToolbarProps> = () => null

/** One button on the row, or one row in the overflow menu. */
interface ToolbarControl {
  id: string
  /** The accessible name, the tooltip, and the menu row's text. One string. */
  label: string
  icon: IconComponent
  disabled?: boolean
  busy?: boolean
  run: () => void
}

export interface ChartToolbarProps extends ToolbarProps {
  /** The element the PNG export reads the plot out of. */
  targetRef: RefObject<HTMLElement | null>
  /** The figure's title: the toolbar's name, the PNG's caption, the filename. */
  title: string
  /** The rows a CSV export writes. */
  rows: Record<string, unknown>[]
  /** The columns a CSV export writes, in order. */
  columns: ChartColumn[]
  /** The window these controls drive. */
  zoomState: ChartZoom
  className?: string
}

/**
 * The row of controls above a plot.
 *
 * A `group` rather than a `toolbar`: the toolbar role promises roving
 * tabindex, and a row of five ordinary buttons that each take a tab stop is
 * both simpler and correct. Every control is a real `<button>` with a real
 * accessible name, repeated as a native `title` for sighted pointer users.
 *
 * There are five controls at most and no overflow menu, which is a size
 * decision as much as a design one: a row that can never exceed five 44px
 * targets does not need one, and the menu component it would take is Radix
 * Menu — around 60 kB that every consumer of every cartesian chart would ship
 * whether or not they compose a toolbar, because the chart reaches it
 * statically. A caller with less width drops controls (`zoom={false}`,
 * `exports={['csv']}`) rather than hiding them behind a second gesture. The
 * hover hints come off the native `title` for the same reason.
 *
 * Sized `md`, which is 44px at the default density. An icon button is exactly
 * the control where the pointer-target floor is most often quietly missed.
 *
 * ## What each export contains
 *
 * The PNG is a picture of the plot, so it shows the CURRENT window — zoom in
 * and the export follows. The CSV is the whole dataset, like the figure's
 * hidden data table, because a spreadsheet silently missing the rows the
 * reader had scrolled past is data loss they cannot see.
 *
 * Composed for you by `<ChartControls>`; reach for it directly only when you
 * are building a chart root of your own.
 *
 * @example
 * <ChartToolbar
 *   targetRef={plotRef}
 *   title="Visitors per day"
 *   rows={data}
 *   columns={columns}
 *   zoomState={zoom}
 *   exports={['png', 'csv']}
 * />
 */
export function ChartToolbar({
  targetRef,
  title,
  rows,
  columns,
  zoomState,
  exports = ['png', 'csv'],
  zoom = true,
  filename,
  align = 'end',
  onExport,
  onExportError,
  className,
}: ChartToolbarProps) {
  const [busy, setBusy] = useState<ChartExportFormat | null>(null)

  const runExport = async (format: ChartExportFormat) => {
    setBusy(format)
    try {
      if (format === 'csv') {
        const csv = chartToCsv(rows, columns)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        downloadBlob(blob, exportFilename(filename ?? title, 'csv'))
      } else {
        const element = targetRef.current
        if (!element) throw new Error('chart toolbar: the plot is not on the page yet')
        downloadBlob(
          await chartToPng(element, { title }),
          exportFilename(filename ?? title, 'png'),
        )
      }
      onExport?.(format)
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause))
      // Never swallowed: the reader clicked a download and something has to
      // say it did not arrive.
      if (onExportError) onExportError(error)
      else console.error(error)
    } finally {
      setBusy(null)
    }
  }

  const controls: ToolbarControl[] = []

  if (zoom) {
    controls.push(
      {
        id: 'zoom-in',
        label: 'Zoom in',
        icon: ZoomIn,
        disabled: !zoomState.canZoomIn,
        run: () => zoomState.zoomIn(),
      },
      {
        id: 'zoom-out',
        label: 'Zoom out',
        icon: ZoomOut,
        disabled: !zoomState.canZoomOut,
        run: () => zoomState.zoomOut(),
      },
      {
        id: 'reset',
        label: 'Reset zoom',
        icon: RotateCcw,
        disabled: !zoomState.isZoomed,
        run: () => zoomState.reset(),
      },
    )
  }

  if (exports.includes('png')) {
    controls.push({
      id: 'png',
      label: 'Download PNG',
      icon: ImageDown,
      busy: busy === 'png',
      disabled: busy !== null,
      run: () => void runExport('png'),
    })
  }

  if (exports.includes('csv')) {
    controls.push({
      id: 'csv',
      label: 'Download CSV',
      icon: FileDown,
      busy: busy === 'csv',
      disabled: busy !== null,
      run: () => void runExport('csv'),
    })
  }

  if (controls.length === 0) return null

  return (
    <div
      role="group"
      aria-label={`${title} — chart controls`}
      className={cn(
        'flex items-center gap-1',
        align === 'end' ? 'justify-end' : 'justify-start',
        className,
      )}
    >
      {controls.map((control) => (
        <Button
          key={control.id}
          iconOnly
          variant="ghost"
          size="md"
          aria-label={control.label}
          // The same string again as a native hint. `aria-label` is what a
          // screen reader announces and `title` is what a pointer user sees;
          // both read the one label, so they cannot drift apart.
          title={control.label}
          disabled={control.disabled}
          loading={control.busy}
          onClick={control.run}
        >
          {/* Dropped while the spinner is up, so a 44px square never holds
              two glyphs at once. */}
          {control.busy ? null : <control.icon size={16} aria-hidden />}
        </Button>
      ))}
    </div>
  )
}

export interface ChartControlsProps {
  /** The composed `<Chart.Toolbar>` props, or null when the chart has none. */
  toolbar: ToolbarProps | null
  /** The window the toolbar and the plot both drive. */
  zoom: ChartZoom
  /** The figure's title. */
  title: string
  /** The whole dataset — what a CSV export writes, zoomed or not. */
  rows: Record<string, unknown>[]
  /** The series columns, in ramp order. */
  columns: ChartColumn[]
  /** The row field naming each row. Written as the CSV's first column. */
  rowKey?: string
  /** The plot. */
  children: ReactNode
}

/**
 * The toolbar, the plot, and the wiring between them.
 *
 * One component rather than four copies of the same six lines, because every
 * chart that carries a toolbar needs the identical arrangement: the row above,
 * the zoom surface around the plot, and one ref shared between them so the PNG
 * export reads the measured box rather than a guess.
 *
 * With no `<Chart.Toolbar>` composed it renders its children untouched — a
 * chart that did not ask for a toolbar gets no extra element, no extra tab
 * stop, and the layout it had before.
 */
export function ChartControls({
  toolbar,
  zoom,
  title,
  rows,
  columns,
  rowKey,
  children,
}: ChartControlsProps) {
  const plotRef = useRef<HTMLDivElement>(null)

  if (!toolbar) return <>{children}</>

  // The category column first, matching the hidden data table: a CSV whose
  // rows are unlabelled numbers is a CSV nobody can join anything to.
  const csvColumns = rowKey ? [{ key: rowKey, label: rowKey }, ...columns] : columns

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <ChartToolbar
        {...toolbar}
        targetRef={plotRef}
        title={title}
        rows={rows}
        columns={csvColumns}
        zoomState={zoom}
      />
      <ChartZoomSurface ref={plotRef} zoom={zoom} label={title} enabled={toolbar.zoom !== false}>
        {children}
      </ChartZoomSurface>
    </div>
  )
}
