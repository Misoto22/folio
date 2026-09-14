'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'

/**
 * Wrap the app — or the smallest subtree that has tooltips — once. Radix needs
 * it to share the open/close timing between neighbouring triggers, which is
 * what stops a row of icon buttons flashing a tooltip per hover.
 */
export const TooltipProvider = TooltipPrimitive.Provider

export interface TooltipProps
  extends Pick<ComponentProps<typeof TooltipPrimitive.Root>, 'open' | 'defaultOpen' | 'onOpenChange' | 'delayDuration'> {
  /** The element the tooltip describes. Must be focusable. */
  children: ReactNode
  /**
   * The tip. Keep it to a phrase — a tooltip is unreachable on touch and
   * invisible to a reader who is scanning, so anything a user NEEDS belongs on
   * the page instead.
   */
  content: ReactNode
  side?: ComponentProps<typeof TooltipPrimitive.Content>['side']
  sideOffset?: number
}

/**
 * A short label on hover and on focus.
 *
 * `asChild` on the trigger by design: the tooltip must not add a wrapper that
 * swallows the trigger's own focus ring or breaks a flex row. It also means the
 * child has to be focusable — a `<div>` trigger gets no keyboard tooltip, which
 * is the failure this API shape makes obvious rather than silent.
 *
 * Not a replacement for an accessible name. An icon-only button still needs its
 * own `aria-label`; the tooltip repeats that name for sighted pointer users.
 *
 * @example
 * <TooltipProvider>
 *   <Tooltip content="Copy to clipboard">
 *     <Button iconOnly aria-label="Copy"><Copy size={16} /></Button>
 *   </Tooltip>
 * </TooltipProvider>
 */
export function Tooltip({
  children,
  content,
  side = 'top',
  sideOffset = 6,
  ...root
}: TooltipProps) {
  const container = useOverlayContainer()

  return (
    <TooltipPrimitive.Root {...root}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal container={container ?? undefined}>
        <TooltipPrimitive.Content
        collisionBoundary={container ?? undefined}
        collisionPadding={8}
          side={side}
          sideOffset={sideOffset}
          data-folio-animated
          className={cn(
            'z-(--z-toast) max-w-64 rounded-(--radius) bg-(--feature-surface) px-2.5 py-1.5 font-mono text-[11px] leading-snug text-(--on-feature)',
            'data-[state=delayed-open]:animate-[folio-fade-in_var(--duration-fast)_var(--ease)]',
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export default Tooltip
