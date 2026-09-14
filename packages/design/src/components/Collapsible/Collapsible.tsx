'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Radix Collapsible root, as a typed passthrough. */
export const Collapsible = CollapsiblePrimitive.Root

/**
 * The trigger and the panel, unstyled, for a disclosure that needs its own
 * layout — a sidebar group whose header carries a count and a chevron on
 * opposite sides, say. `CollapsibleSection` is the composed version and is what
 * most call sites want; these two exist so the ones that do not have to reach
 * for Radix directly and re-derive the keyboard and `aria-expanded` wiring.
 *
 * The panel animates on `--radix-collapsible-content-height`, which Radix
 * measures — so it opens to its real height rather than to a guessed
 * `max-height`, which is what makes a long group and a short one take the same
 * time instead of the long one appearing to stall.
 */
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger

export function CollapsibleContent({
  className,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-folio-animated
      className={cn(
        'overflow-hidden data-[state=closed]:animate-[folio-collapsible-up_var(--duration-base)_var(--ease)] data-[state=open]:animate-[folio-collapsible-down_var(--duration-base)_var(--ease)]',
        className,
      )}
      {...props}
    />
  )
}

export interface CollapsibleSectionProps
  extends Omit<ComponentProps<typeof CollapsiblePrimitive.Root>, 'children' | 'title'> {
  /** What the trigger says. */
  title: ReactNode
  children: ReactNode
}

/**
 * One thing that opens, on its own.
 *
 * The difference from `Accordion` is arithmetic: an accordion is a SET, and a
 * set can coordinate — opening one closes another. A collapsible is one
 * disclosure with nothing to coordinate with. Reaching for an accordion of one
 * gets you a component managing a value you never read.
 *
 * The marker here is a chevron rather than the accordion's plus, and
 * deliberately: this reveals more of the same thing, where an accordion row
 * opens a distinct answer.
 *
 * @example
 * <CollapsibleSection title="Advanced settings">
 *   <Field label="Retries"><Input type="number" /></Field>
 * </CollapsibleSection>
 */
export function CollapsibleSection({
  title,
  children,
  className,
  ...props
}: CollapsibleSectionProps) {
  return (
    <CollapsiblePrimitive.Root className={cn('w-full', className)} {...props}>
      <CollapsiblePrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-3 text-start text-sm text-(--ink) transition-colors duration-(--duration-fast) hover:text-(--ink-2)">
        {title}
        <RiArrowDownSLine
          size={16}
          aria-hidden
          className="shrink-0 text-(--ink-3-aa) transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-data-[state=open]:rotate-180"
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content
        data-folio-animated
        className="overflow-hidden text-sm leading-relaxed text-(--ink-2) data-[state=closed]:animate-[folio-collapsible-up_var(--duration-base)_var(--ease)] data-[state=open]:animate-[folio-collapsible-down_var(--duration-base)_var(--ease)]"
      >
        <div className="pb-3">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

export default Collapsible
