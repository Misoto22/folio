'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { RiCloseLine } from '@remixicon/react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'

/** Radix Popover root, trigger, anchor and close, as typed passthroughs. */
export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverClose = PopoverPrimitive.Close

export interface PopoverContentProps
  extends ComponentProps<typeof PopoverPrimitive.Content> {
  /** Names the panel for assistive tech. Required — a popover is a dialog. */
  label: string
  /** Show the top-end close control. */
  showClose?: boolean
}

/**
 * A panel anchored to a control, holding content the reader can interact with.
 *
 * The line against `Tooltip` is not visual, it is behavioural: a tooltip
 * describes and cannot be entered; a popover holds things you tab to. Anything
 * with a link, a field or a button in it is a popover, and putting that inside
 * a tooltip makes it unreachable — the tooltip closes as soon as focus tries to
 * move into it.
 *
 * Against `DropdownMenu`: a menu is a list of actions with menu semantics and
 * arrow-key navigation. A popover is free-form, and its contents Tab like the
 * rest of the page.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild><Button variant="secondary">Filters</Button></PopoverTrigger>
 *   <PopoverContent label="Filters">
 *     <Field label="Status"><Select>…</Select></Field>
 *   </PopoverContent>
 * </Popover>
 */
export function PopoverContent({
  label,
  showClose = false,
  className,
  sideOffset = 8,
  children,
  ...rest
}: PopoverContentProps) {
  const container = useOverlayContainer()

  return (
    <PopoverPrimitive.Portal container={container ?? undefined}>
      <PopoverPrimitive.Content
        collisionBoundary={container ?? undefined}
        collisionPadding={8}
        aria-label={label}
        sideOffset={sideOffset}
        data-folio-animated
        className={cn(
          'z-(--z-dropdown) w-72 rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) p-4 shadow-(--panel-lift) panel-blur',
          'data-[state=open]:animate-[folio-pop-in_var(--duration-fast)_var(--ease-out-expo)] data-[state=closed]:animate-[folio-pop-out_var(--duration-fast)_var(--ease)] origin-(--radix-popper-transform-origin)',
          className,
        )}
        {...rest}
      >
        {children}
        {showClose && (
          <PopoverPrimitive.Close
            aria-label="Close"
            className="absolute end-2 top-2 grid size-8 place-items-center rounded-(--radius-pill) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)"
          >
            <RiCloseLine size={14} aria-hidden />
          </PopoverPrimitive.Close>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export default Popover
