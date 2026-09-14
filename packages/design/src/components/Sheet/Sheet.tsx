'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { RiCloseLine } from '@remixicon/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'

/** Radix Dialog root, trigger and close — a sheet IS a dialog, docked. */
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export type SheetSide = 'start' | 'end' | 'top' | 'bottom'

/**
 * Full literal class strings per edge, because Tailwind only generates what it
 * can see verbatim. The inline sides are named in READING order, so a sheet
 * docked to `end` comes from the right in English and the left in Arabic.
 */
const SIDE: Record<SheetSide, string> = {
  start:
    'inset-y-0 start-0 h-full w-[min(24rem,92vw)] border-e data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full',
  end: 'inset-y-0 end-0 h-full w-[min(24rem,92vw)] border-s data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full',
  top: 'inset-x-0 top-0 w-full max-h-[85vh] border-b data-[state=closed]:-translate-y-full',
  bottom:
    'inset-x-0 bottom-0 w-full max-h-[85vh] border-t data-[state=closed]:translate-y-full',
}

export interface SheetContentProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> {
  /** Which edge it is docked to. `end` by default. */
  side?: SheetSide
  title: ReactNode
  description?: ReactNode
  /** Hide the title visually while keeping it for assistive tech. */
  hideTitle?: boolean
  /** Accessible close action, supplied by the host locale. */
  closeLabel?: string
}

/**
 * A panel docked to an edge of the viewport.
 *
 * It is a modal dialog — Radix's, so the focus trap, the escape key, the scroll
 * lock and the `aria-modal` wiring are the same ones `Dialog` gets. The only
 * differences are where it sits and which way it arrives, which is why this
 * shares that implementation rather than reproducing it: a second focus trap is
 * a second focus trap to get wrong.
 *
 * The title is required, visible or not. A modal with no accessible name drops
 * a screen reader into an unnamed region with no way back out.
 *
 * Portals into the element an enclosing `OverlayContainer` names, docking to
 * that element's edge rather than the viewport's when there is one.
 *
 * @example
 * <Sheet>
 *   <SheetTrigger asChild><Button variant="secondary">Filters</Button></SheetTrigger>
 *   <SheetContent title="Filters" description="Narrow the list.">…</SheetContent>
 * </Sheet>
 */
export function SheetContent({
  side = 'end',
  title,
  description,
  hideTitle = false,
  closeLabel = 'Close',
  className,
  children,
  ...rest
}: SheetContentProps) {
  const container = useOverlayContainer()

  return (
    <DialogPrimitive.Portal container={container ?? undefined}>
      <DialogPrimitive.Overlay
        data-folio-animated
        className={cn(
          'inset-0 z-(--z-overlay) bg-(--scrim) data-[state=open]:animate-[folio-fade-in_var(--duration-fast)_var(--ease)] data-[state=closed]:animate-[folio-fade-out_var(--duration-fast)_var(--ease)]',
          container ? 'absolute' : 'fixed',
        )}
      />
      <DialogPrimitive.Content
        data-side={side}
        // The panel's own assertion that its travel is decorative — the scrim
        // beside it always made one and this half never did, so under reduced
        // motion the fade was cancelled and the panel still slid the whole
        // width of itself, which reads worse than leaving both alone. See the
        // reduced-motion block in keyframes.css for what the marker now means:
        // documentation with teeth, over a universal floor that no longer
        // depends on anyone remembering it.
        data-folio-animated
        className={cn(
          'folio-sheet fixed z-(--z-modal) flex flex-col overflow-y-auto border-(--panel-border) bg-(--panel-bg) p-6 shadow-(--panel-lift) panel-blur scroll-slim',
          SIDE[side],
          // Docked to the container's edge, and capped by its box — the widths
          // above are read against the viewport and would overflow a frame.
          container && 'absolute max-h-full max-w-full',
          className,
        )}
        {...rest}
      >
        <div className={cn('mb-4 flex flex-col gap-1 pe-8', hideTitle && 'sr-only')}>
          <DialogPrimitive.Title className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)">
            {title}
          </DialogPrimitive.Title>
          {description !== undefined && (
            <DialogPrimitive.Description className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>

        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute end-3 top-3 grid size-11 place-items-center rounded-(--radius-pill) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)"
        >
          <RiCloseLine size={16} aria-hidden />
        </DialogPrimitive.Close>

        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export default Sheet
