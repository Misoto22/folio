'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { createContext, useContext, useLayoutEffect, useRef, useState, type ComponentProps } from 'react'
import { cn } from '../../lib/cn'

const MotionContext = createContext<{ value?: string; change: (value: string) => void; swipe: boolean; automatic: boolean } | null>(null)

/** Accessible tabs with a moving marker and optional horizontal drag gestures. */
export function Tabs({ value, defaultValue, onValueChange, swipe = true, orientation = 'horizontal', activationMode = 'automatic', className, ...rest }: ComponentProps<typeof TabsPrimitive.Root> & { swipe?: boolean }) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const change = (next: string) => { if (value === undefined) setInternal(next); onValueChange?.(next) }
  return <MotionContext.Provider value={{ value: current, change, swipe: swipe && orientation === 'horizontal', automatic: activationMode === 'automatic' }}><TabsPrimitive.Root {...rest} activationMode={activationMode} orientation={orientation} value={current} onValueChange={change} className={cn('folio-tabs', className)} /></MotionContext.Provider>
}

/**
 * The tab strip.
 *
 * Scrolls horizontally rather than wrapping. A wrapped second row of tabs moves
 * every tab below it when the strip grows, and the reader loses the one they
 * were about to click.
 *
 * @example
 * <Tabs defaultValue="preview">
 *   <TabsList>
 *     <TabsTrigger value="preview">Preview</TabsTrigger>
 *     <TabsTrigger value="code">Code</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="preview">…</TabsContent>
 * </Tabs>
 */
export function TabsList({ className, ref: forwardedRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClickCapture, ...rest }: ComponentProps<typeof TabsPrimitive.List>) {
  const motion = useContext(MotionContext)
  const list = useRef<HTMLDivElement>(null)
  const gesture = useRef<{ x: number; y: number; id: number; dragged: boolean } | null>(null)
  const suppressClick = useRef(false)
  const previousX = useRef<number | undefined>(undefined)
  useLayoutEffect(() => {
    const element = list.current
    if (!element) return
    const measure = () => {
      const active = element.querySelector<HTMLElement>('[role=tab][data-state=active]')
      if (!active) return
      if (previousX.current !== undefined && previousX.current !== active.offsetLeft) element.closest<HTMLElement>('.folio-tabs')?.style.setProperty('--tab-enter-x', active.offsetLeft > previousX.current ? '16px' : '-16px')
      previousX.current = active.offsetLeft
      element.style.setProperty('--tab-x', `${active.offsetLeft}px`)
      element.style.setProperty('--tab-y', `${active.offsetTop}px`)
      element.style.setProperty('--tab-width', `${active.offsetWidth}px`)
      element.style.setProperty('--tab-height', `${active.offsetHeight}px`)
      element.dataset.measured = 'true'
      if (element.clientWidth > 0) {
        const viewport = element.getBoundingClientRect()
        const item = active.getBoundingClientRect()
        const delta = item.left < viewport.left ? item.left - viewport.left : item.right > viewport.right ? item.right - viewport.right : 0
        if (delta) element.scrollBy({ left: delta, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      }
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(element)
    element.querySelectorAll('[role=tab]').forEach(tab => observer?.observe(tab))
    return () => observer?.disconnect()
  }, [motion?.value])
  const reset = () => { gesture.current = null; list.current?.style.setProperty('--tab-drag-x', '0px'); list.current?.removeAttribute('data-dragging') }
  return (
    <TabsPrimitive.List
      ref={element => { list.current = element; if (typeof forwardedRef === 'function') forwardedRef(element); else if (forwardedRef) forwardedRef.current = element }}
      data-swipe={motion?.swipe || undefined}
      onPointerDown={event => {
        onPointerDown?.(event)
        if (event.defaultPrevented || !motion?.swipe || event.button !== 0 || !event.isPrimary) return
        suppressClick.current = false
        gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId, dragged: false }
      }}
      onPointerMove={event => {
        onPointerMove?.(event)
        const start = gesture.current
        if (!start || event.pointerId !== start.id) return
        const dx = event.clientX - start.x
        if (Math.abs(event.clientY - start.y) > Math.abs(dx) && !start.dragged) { reset(); return }
        if (Math.abs(dx) > 8) {
          start.dragged = true
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.dataset.dragging = 'true'
          event.currentTarget.style.setProperty('--tab-drag-x', `${Math.max(-64, Math.min(64, dx * .4))}px`)
        }
      }}
      onPointerUp={event => {
        onPointerUp?.(event)
        const start = gesture.current
        if (!start) return
        const dx = event.clientX - start.x
        suppressClick.current = start.dragged
        if (start.dragged && Math.abs(dx) >= 36) {
          const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role=tab]:not([disabled])'))
          const index = tabs.findIndex(tab => tab.dataset.state === 'active')
          const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
          const next = tabs[index + ((dx > 0) !== rtl ? 1 : -1)]
          if (next?.dataset.tabValue) {
            const alreadyFocused = document.activeElement === next
            next.focus({ preventScroll: true })
            if (!motion?.automatic || alreadyFocused) motion?.change(next.dataset.tabValue)
          }
        }
        reset()
      }}
      onPointerCancel={event => { onPointerCancel?.(event); reset() }}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false } else onClickCapture?.(event) }}
      className={cn(
        // `overflow-y-hidden` is not decoration. A strip only ever scrolls
        // sideways, but `overflow-x: auto` on its own computes `overflow-y` to
        // `auto` as well — and the active trigger's `-mb-px` rule leaves the
        // content exactly one pixel taller than the box, which is enough for a
        // vertical scrollbar to appear beside a row of tabs that has nothing
        // to scroll.
        'folio-tabs-list flex items-center overflow-x-auto overflow-y-hidden gap-1 border-b border-(--rule-2) scroll-slim',
        className,
      )}
      {...rest}
    />
  )
}

/**
 * One tab.
 *
 * The active marker is a 2px ink rule pulled onto the strip's own border with
 * `-mb-px`, so the two occupy the same line instead of stacking into a 3px
 * edge. 44px tall, because a tab is a pointer target like any other.
 */
export function TabsTrigger({ className, onMouseDown, onClick, ...rest }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const motion = useContext(MotionContext)
  return (
    <TabsPrimitive.Trigger
      data-tab-value={rest.value}
      onMouseDown={event => { onMouseDown?.(event); if (motion?.swipe && !event.defaultPrevented && event.button === 0) event.preventDefault() }}
      onClick={event => { onClick?.(event); if (motion?.swipe && !event.defaultPrevented) { const alreadyFocused = document.activeElement === event.currentTarget; event.currentTarget.focus(); if (!motion.automatic || alreadyFocused) motion.change(rest.value) } }}
      className={cn(
        '-mb-px min-h-(--control-h-md) shrink-0 whitespace-nowrap border-b-2 border-transparent px-3.5 py-2 text-sm text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) data-[state=active]:border-(--accent) data-[state=active]:text-(--accent-on-muted)',
        className,
      )}
      {...rest}
    />
  )
}

/** The panel paired to a {@link TabsTrigger} by matching `value`. */
export function TabsContent({ className, onTouchStart, onTouchEnd, onTouchCancel, ...rest }: ComponentProps<typeof TabsPrimitive.Content>) {
  const motion = useContext(MotionContext)
  const start = useRef<{ x: number; y: number } | null>(null)
  return (
    <TabsPrimitive.Content
      data-folio-animated
      onTouchStart={event => {
        onTouchStart?.(event)
        start.current = null
        if (!motion?.swipe || event.defaultPrevented || event.touches.length !== 1 || (event.target as HTMLElement).closest('.folio-tabs') !== event.currentTarget.closest('.folio-tabs') || (event.target as HTMLElement).closest('a,button,input,textarea,select,pre,code,[contenteditable=true],[data-no-swipe]')) return
        const touch = event.touches[0]
        if (touch) start.current = { x: touch.clientX, y: touch.clientY }
      }}
      onTouchEnd={event => {
        onTouchEnd?.(event)
        const origin = start.current
        start.current = null
        if (!origin || event.defaultPrevented || !event.changedTouches[0] || window.getSelection()?.toString()) return
        const dx = event.changedTouches[0].clientX - origin.x
        const dy = event.changedTouches[0].clientY - origin.y
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return
        const list = event.currentTarget.closest('.folio-tabs')?.querySelector('[role=tablist]')
        if (!list) return
        const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role=tab]:not([disabled])'))
        const index = tabs.findIndex(tab => tab.dataset.state === 'active')
        const rtl = getComputedStyle(list).direction === 'rtl'
        const next = tabs[index + ((dx < 0) !== rtl ? 1 : -1)]
        if (next?.dataset.tabValue) {
          const alreadyFocused = document.activeElement === next
          next.focus({ preventScroll: true })
          if (!motion?.automatic || alreadyFocused) motion?.change(next.dataset.tabValue)
        }
      }}
      onTouchCancel={event => { start.current = null; onTouchCancel?.(event) }}
      className={cn('folio-tabs-panel pt-5', className)}
      {...rest}
    />
  )
}

export default Tabs
