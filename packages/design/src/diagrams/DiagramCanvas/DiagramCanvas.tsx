'use client'

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'

const MIN_SCALE = 0.35
const MAX_SCALE = 4
const STEP = 1.25

export interface CanvasView {
  scale: number
  x: number
  y: number
  /**
   * How big the frame was, in CSS pixels, when this view was reported.
   *
   * Carried on the view because everything that consumes a view needs it and
   * nothing outside this component can measure it: a `DiagramMinimap`'s
   * viewport rectangle is the frame's size over the zoom, and a caller who had
   * to hand-declare that number was hand-declaring the one number that makes
   * the map lie. Absent until the frame has been measured — the first render
   * has no box yet — which is exactly when a map should draw nothing.
   */
  frame?: { width: number; height: number }
}

/** What a caller can do to the canvas from outside it. */
export interface DiagramCanvasHandle {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  /** Pans so a point in CONTENT coordinates sits in the middle of the frame. */
  centerOn: (x: number, y: number) => void
  view: CanvasView
}

export interface DiagramCanvasProps {
  children: ReactNode
  className?: string
  /** How tall the frame is. Anything CSS accepts. */
  height?: string
  /** Told about every view change, for a minimap or a percentage readout. */
  onViewChange?: (view: CanvasView) => void
  /** Hides the built-in zoom controls, for a caller supplying its own. */
  controls?: boolean
  /** Names the region for assistive tech. */
  label?: string
  ref?: Ref<DiagramCanvasHandle>
}

/**
 * A frame that a picture larger than it can be moved around inside.
 *
 * Pan with a drag, zoom with the controls or with ⌘/Ctrl and the wheel, and
 * reset with a key. That is the whole of it — this is deliberately a VIEWPORT
 * and not a diagram editor: nothing here knows what a node is, so it works for
 * any oversized figure, an SVG, an image, a table that will not fold.
 *
 * Three decisions here are not obvious.
 *
 * **A plain wheel scrolls the page, not the diagram.** A canvas that swallows
 * the wheel is a scroll trap: a reader flicking down an article hits the figure
 * and the page stops moving for no reason they can see. Zooming needs the
 * modifier — which is also the platform gesture for zoom everywhere else, and
 * is what a trackpad pinch already sends.
 *
 * **The transform is on a wrapper, not on the content.** The child keeps its
 * own coordinate space, so a figure inside can still be measured, exported and
 * read by anything that walks it. Scaling the child directly would make every
 * `getBoundingClientRect` inside it a lie.
 *
 * **Keyboard first, and the frame is a real tab stop.** `+` / `-` / `0` and the
 * arrow keys move the view; the frame takes focus so they can be pressed at
 * all. A canvas that only answers a drag is a canvas half the readers cannot
 * operate.
 *
 * @example
 * <DiagramCanvas height="26rem" label="Request path">
 *   <ArchitectureFigure spec={spec} heading={false} legend="hidden" cards={false} />
 * </DiagramCanvas>
 */
export function DiagramCanvas({
  children,
  className,
  height = '24rem',
  onViewChange,
  controls = true,
  label = 'Diagram canvas',
  ref,
}: DiagramCanvasProps) {
  const uid = useId().replace(/:/g, '')
  const frame = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<CanvasView>({ scale: 1, x: 0, y: 0 })
  const drag = useRef<{ pointer: number; x: number; y: number } | null>(null)

  /** The frame's own size, or nothing when it has not been laid out yet. */
  const measure = useCallback(() => {
    const box = frame.current?.getBoundingClientRect()
    return box && box.width > 0 ? { width: box.width, height: box.height } : undefined
  }, [])

  const apply = useCallback(
    (next: CanvasView) => {
      const measured = { ...next, frame: measure() }
      setView(measured)
      onViewChange?.(measured)
    },
    [measure, onViewChange],
  )

  /**
   * Zooms about a fixed point in FRAME coordinates.
   *
   * The arithmetic is what makes the pointer stay on the thing it is over:
   * the content point under the cursor must land back under the cursor, so the
   * offset moves by the difference the scale change opened up. Without it, a
   * zoom drifts toward the origin and a reader chases the node they were
   * looking at.
   */
  const zoomAbout = useCallback(
    (factor: number, originX?: number, originY?: number) => {
      const box = frame.current?.getBoundingClientRect()
      const cx = originX ?? (box ? box.width / 2 : 0)
      const cy = originY ?? (box ? box.height / 2 : 0)

      setView((current) => {
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor))
        const ratio = scale / current.scale
        const next = {
          scale,
          x: cx - (cx - current.x) * ratio,
          y: cy - (cy - current.y) * ratio,
          frame: measure(),
        }
        onViewChange?.(next)
        return next
      })
    },
    [measure, onViewChange],
  )

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomAbout(STEP),
      zoomOut: () => zoomAbout(1 / STEP),
      reset: () => apply({ scale: 1, x: 0, y: 0 }),
      centerOn: (x: number, y: number) => {
        const box = frame.current?.getBoundingClientRect()
        if (!box) return
        setView((current) => {
          const next = {
            ...current,
            x: box.width / 2 - x * current.scale,
            y: box.height / 2 - y * current.scale,
            frame: measure(),
          }
          onViewChange?.(next)
          return next
        })
      },
      view,
    }),
    [apply, measure, onViewChange, view, zoomAbout],
  )

  // Registered imperatively because React marks `wheel` passive, and a passive
  // listener cannot call preventDefault — so the modifier-wheel zoom would also
  // scroll the page underneath it.
  useEffect(() => {
    const node = frame.current
    if (!node) return

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const box = node.getBoundingClientRect()
      zoomAbout(
        event.deltaY < 0 ? STEP : 1 / STEP,
        event.clientX - box.left,
        event.clientY - box.top,
      )
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoomAbout])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    drag.current = { pointer: event.pointerId, x: event.clientX - view.x, y: event.clientY - view.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.pointer !== event.pointerId) return
    apply({ ...view, x: event.clientX - state.x, y: event.clientY - state.y })
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== event.pointerId) return
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const zoomPercent = `${Math.round(view.scale * 100)}%`

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-(--radius-lg) border border-(--rule) bg-(--diagram-surface)',
        className,
      )}
      style={{ height }}
    >
      <div
        ref={frame}
        role="group"
        aria-label={label}
        aria-describedby={`${uid}-hint`}
        tabIndex={0}
        className="size-full cursor-grab touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-inset active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          const nudge = event.shiftKey ? 80 : 24
          switch (event.key) {
            case '+':
            case '=':
              event.preventDefault()
              zoomAbout(STEP)
              break
            case '-':
              event.preventDefault()
              zoomAbout(1 / STEP)
              break
            case '0':
              event.preventDefault()
              apply({ scale: 1, x: 0, y: 0 })
              break
            case 'ArrowLeft':
              event.preventDefault()
              apply({ ...view, x: view.x + nudge })
              break
            case 'ArrowRight':
              event.preventDefault()
              apply({ ...view, x: view.x - nudge })
              break
            case 'ArrowUp':
              event.preventDefault()
              apply({ ...view, y: view.y + nudge })
              break
            case 'ArrowDown':
              event.preventDefault()
              apply({ ...view, y: view.y - nudge })
              break
            default:
              break
          }
        }}
      >
        <div
          className="origin-top-left will-change-transform"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          data-diagram-stage=""
        >
          {children}
        </div>
      </div>

      <p id={`${uid}-hint`} className="sr-only">
        Drag to pan. Plus and minus zoom, zero resets, the arrow keys pan.
      </p>

      {controls && (
        <div className="absolute bottom-3 end-3 flex items-center gap-px rounded-(--radius) border border-(--rule-2) bg-(--panel-bg) p-0.5">
          <CanvasButton label="Zoom out" onClick={() => zoomAbout(1 / STEP)}>
            <span aria-hidden>−</span>
          </CanvasButton>
          {/* The name leads with the percentage the button shows, so a voice
              user who says "click 100%" reaches it (WCAG 2.5.3). */}
          <button
            type="button"
            onClick={() => apply({ scale: 1, x: 0, y: 0 })}
            aria-label={`${zoomPercent}, reset the view`}
            className="min-w-12 rounded-(--radius-xs) px-1.5 py-1 mono-meta text-(--ink-2) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring)"
          >
            {zoomPercent}
          </button>
          <CanvasButton label="Zoom in" onClick={() => zoomAbout(STEP)}>
            <span aria-hidden>+</span>
          </CanvasButton>
        </div>
      )}
    </div>
  )
}

function CanvasButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-(--radius-xs) font-mono text-[13px] leading-none text-(--ink-2) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring)"
    >
      {children}
    </button>
  )
}

export default DiagramCanvas
