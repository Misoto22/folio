'use client'

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { SURFACE_PANEL_QUIET } from '../../lib/surface'
import type { CanvasView } from '../DiagramCanvas/DiagramCanvas'

export interface DiagramMinimapProps {
  /** The whole artwork, at its natural size in CSS pixels. */
  content: { width: number; height: number }
  /**
   * The frame the artwork is being looked at through, in CSS pixels.
   *
   * Optional because a `DiagramCanvas` now reports its own frame on every view
   * it emits: wire `onViewChange` straight through and this is already right.
   * Pass it only for a frame this component cannot be told about.
   */
  frame?: { width: number; height: number }
  /** Where that frame currently sits — a `DiagramCanvas`'s `onViewChange`. */
  view: CanvasView
  /** A miniature of the artwork. Usually the same figure, rendered again. */
  children?: ReactNode
  /** Called with a point in CONTENT coordinates when the reader picks one. */
  onSeek?: (x: number, y: number) => void
  /** How wide the map is, in CSS pixels. Height follows the aspect ratio. */
  width?: number
  className?: string
  label?: string
}

/**
 * Where you are in something bigger than the window.
 *
 * Two things at once, and both are needed: a miniature of the whole artwork,
 * and a rectangle showing which part of it the frame is currently over. The
 * miniature alone answers "what is there"; the rectangle answers "and where am
 * I", which is the question a reader who has just panned twice actually has.
 *
 * THE RECTANGLE IS DERIVED, never stored. Its position comes out of the
 * canvas's own view — the same three numbers the canvas is already transforming
 * by — divided by the map's scale, and clamped to the plate: a viewport that
 * has been panned past the edge of the artwork is a viewport half over blank
 * paper, and drawing the rectangle out there claims the map extends somewhere
 * it does not. Keeping a second copy of "where the viewport is" is how a
 * minimap comes to disagree with the thing it is a map of, and a map that
 * disagrees is worse than none.
 *
 * NOTHING IS DRAWN UNTIL THE ARTWORK HAS A SIZE. `content` is usually a
 * measurement, and a measurement's first value is zero — so the scale would be
 * 1, the miniature would be the artwork's top-left corner at full size, and the
 * rectangle would sit over it meaning nothing. An empty plate for one frame is
 * the honest version of "not yet".
 *
 * CLICKING RECENTRES rather than jumping. `onSeek` reports a point in CONTENT
 * coordinates, which is what a canvas's `centerOn` takes. The minimap does not
 * move anything itself: it has no authority over the view, it only says where
 * the reader pointed. A drag keeps seeking, and only a drag that STARTED on the
 * map does — a button held down somewhere else and dragged across is not this
 * component's gesture to answer.
 *
 * @example
 * const canvas = useRef<DiagramCanvasHandle>(null)
 * const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
 * // …
 * <DiagramMinimap
 *   content={{ width: 1400, height: 620 }}
 *   view={view}
 *   onSeek={(x, y) => canvas.current?.centerOn(x, y)}
 * >
 *   <ArchitectureFigure spec={spec} heading={false} legend="hidden" cards={false} />
 * </DiagramMinimap>
 */
export function DiagramMinimap({
  content,
  frame,
  view,
  children,
  onSeek,
  width = 200,
  className,
  label = 'Diagram overview',
}: DiagramMinimapProps) {
  const dragging = useRef(false)

  const measured = content.width > 0 && content.height > 0
  const scale = measured ? width / content.width : 0
  // Half the width is a neutral plate to hold the space, not a claim about the
  // artwork's shape — nothing here knows it yet.
  const height = measured ? Math.max(1, content.height * scale) : Math.round(width / 2)

  const box = frame ?? view.frame
  const rect = measured && box ? clamp(box, view, scale, width, height) : null

  function seek(event: ReactPointerEvent<HTMLDivElement>) {
    if (!onSeek || !measured) return
    const map = event.currentTarget.getBoundingClientRect()
    onSeek((event.clientX - map.left) / scale, (event.clientY - map.top) / scale)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-(--radius) border',
        SURFACE_PANEL_QUIET,
        className,
      )}
      style={{ width, height }}
      role="group"
      aria-label={label}
    >
      {/* The miniature is decorative: the figure it mirrors already publishes
          its own accessible summary, and a second copy would read the whole
          diagram out twice. */}
      {measured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-0 origin-top-left"
          style={{ width: content.width, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      )}

      <div
        data-seek=""
        className={cn('absolute inset-0', onSeek && measured && 'cursor-crosshair')}
        onPointerDown={(event) => {
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          seek(event)
        }}
        onPointerMove={(event) => {
          if (dragging.current && event.buttons === 1) seek(event)
        }}
        onPointerUp={(event) => {
          dragging.current = false
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
      >
        {rect && (
          <div
            aria-hidden="true"
            data-viewport=""
            className="absolute rounded-[2px] border border-(--accent) bg-(--accent-wash)"
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.w}px`,
              height: `${rect.h}px`,
            }}
          />
        )}
      </div>
    </div>
  )
}

/**
 * The frame's rectangle in map space, cut to the map.
 *
 * `view.x` is how far the stage has been pushed, so the content coordinate at
 * the frame's top-left corner is its negation over the zoom. The intersection
 * with the plate is what keeps the rectangle a statement about the artwork: a
 * frame wider than the whole diagram used to draw a box hanging off both edges,
 * which reads as "there is more over there" and there is not.
 */
function clamp(
  frame: { width: number; height: number },
  view: CanvasView,
  scale: number,
  width: number,
  height: number,
): { x: number; y: number; w: number; h: number } {
  const x = (-view.x / view.scale) * scale
  const y = (-view.y / view.scale) * scale
  const left = Math.min(Math.max(x, 0), width)
  const top = Math.min(Math.max(y, 0), height)
  return {
    x: left,
    y: top,
    // Floored at a few pixels so a deep zoom still leaves something to see.
    w: Math.max(4, Math.min(x + (frame.width / view.scale) * scale, width) - left),
    h: Math.max(4, Math.min(y + (frame.height / view.scale) * scale, height) - top),
  }
}

export default DiagramMinimap
