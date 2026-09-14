'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { RiCloseLine } from '@remixicon/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'
import { DEV, warn } from '../../lib/warn'

/** Radix Dialog root + trigger + close, re-exported as typed passthroughs. */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

/** Title + description stack; renders nothing when both are omitted. */
function DialogHeader({
  title,
  description,
  hidden,
}: {
  title?: ReactNode
  description?: ReactNode
  hidden: boolean
}) {
  if (title === undefined && description === undefined) return null
  return (
    <div className={cn('mb-4 flex flex-col gap-1 pe-8', hidden && 'sr-only')}>
      {title !== undefined && (
        <DialogPrimitive.Title className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)">
          {title}
        </DialogPrimitive.Title>
      )}
      {description !== undefined && (
        <DialogPrimitive.Description className="m-0 text-sm leading-relaxed text-(--ink-3-aa)">
          {description}
        </DialogPrimitive.Description>
      )}
    </div>
  )
}

export interface DialogContentProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title' | 'className'> {
  /**
   * Heading text.
   *
   * Pass one even when `hideTitle` is set. Radix requires a title, so omitting
   * it renders a hidden fallback reading the literal word "Dialog" — which
   * satisfies an automated accessibility check and announces every unnamed
   * modal in the application as the same thing. Development says so out loud.
   */
  title?: ReactNode
  /** Sub-heading under the title. */
  description?: ReactNode
  className?: string
  /** Show the top-right close control (default true). */
  showClose?: boolean
  /**
   * Keeps the title for assistive tech and hides it visually.
   *
   * For a surface whose purpose is obvious to anyone who can see it — a command
   * palette, a media lightbox — where a printed heading would be furniture. The
   * title itself is never optional: Radix requires one, and a modal with no
   * accessible name drops a screen reader into an unnamed region.
   */
  hideTitle?: boolean
}

/**
 * A modal surface: portal → scrim → centred panel.
 *
 * Radix owns the focus trap, the escape key, the scroll lock and the
 * `aria-modal` wiring — all of which a hand-rolled dialog gets subtly wrong,
 * usually by leaving focus behind in the page underneath.
 *
 * Radix requires a `Dialog.Title` whether or not one is shown, so a dialog
 * without a visible heading still renders a hidden one rather than shipping an
 * unnamed modal — and warns in development, because the fallback it renders is
 * the literal word "Dialog" and a placeholder that passes an accessibility
 * check is how the problem survives a review.
 *
 * Portals into the element an enclosing `OverlayContainer` names, and switches
 * from viewport positioning to container positioning when there is one. A
 * `fixed` panel covers the page whatever it is portalled into, so honouring
 * the container without that swap would have moved the markup and left the
 * picture unchanged.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button>Delete</Button></DialogTrigger>
 *   <DialogContent title="Delete file" description="This cannot be undone.">
 *     <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
 *   </DialogContent>
 * </Dialog>
 */
export function DialogContent({
  title,
  description,
  children,
  className,
  showClose = true,
  hideTitle = false,
  ...rest
}: DialogContentProps) {
  const container = useOverlayContainer()

  if (DEV && title === undefined) {
    warn({
      code: 'DIALOG_TITLE_MISSING',
      problem:
        'DialogContent has no title, so its accessible name is the fallback string "Dialog". Every unnamed modal in the app announces identically, and the check that would have caught it passes.',
      field: 'title',
      fix: 'Give it a title that says what the dialog asks. Add hideTitle when the heading would be furniture on screen.',
      component: 'Dialog',
    })
  }

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
        data-folio-animated
        className={cn(
          'fixed left-1/2 top-1/2 z-(--z-modal) max-h-[85vh] w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) p-6 shadow-(--panel-lift) panel-blur scroll-slim',
          'data-[state=open]:animate-[folio-panel-in_var(--duration-base)_var(--ease)] data-[state=closed]:animate-[folio-fade-out_var(--duration-fast)_var(--ease)]',
          // Against the container's box rather than the viewport's, and capped
          // by it: 92vw inside a 400px frame is not a cap at all.
          container && 'absolute max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)]',
          className,
        )}
        {...rest}
      >
        <DialogHeader title={title} description={description} hidden={hideTitle} />

        {title === undefined && (
          <DialogPrimitive.Title className="sr-only">Dialog</DialogPrimitive.Title>
        )}

        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute end-3 top-3 grid size-9 place-items-center rounded-(--radius-pill) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)"
          >
            <RiCloseLine size={16} aria-hidden />
          </DialogPrimitive.Close>
        )}

        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export default Dialog
