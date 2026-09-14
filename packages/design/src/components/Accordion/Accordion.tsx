'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { RiAddLine } from '@remixicon/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Radix root, re-exported. Pass `type="single" collapsible` for an FAQ and
 * `type="multiple"` for a settings stack; Radix's own discriminated union then
 * types `value` correctly for each.
 */
export const Accordion = AccordionPrimitive.Root

export interface AccordionItemProps
  extends Omit<ComponentProps<typeof AccordionPrimitive.Item>, 'children' | 'title'> {
  /** The row's summary — what the reader clicks. Named `title` rather than
   *  inherited from the DOM attribute of the same name, which is a tooltip. */
  title: ReactNode
  children: ReactNode
}

/**
 * One disclosure row: a hairline-ruled trigger and its panel.
 *
 * The marker is a plus that rotates into a minus, not a chevron. A chevron says
 * "there is more below"; a plus says "this opens" — and in a stack of rows the
 * difference decides whether the reader expects navigation or expansion.
 *
 * The panel animates on Radix's own `--radix-accordion-content-height`, so it
 * opens to its real height without measuring anything at the call site.
 *
 * @example
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="ship" title="How do I ship it?">Push to main.</AccordionItem>
 * </Accordion>
 */
export function AccordionItem({ title, children, className, ...rest }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b border-(--rule)', className)}
      {...rest}
    >
      <AccordionPrimitive.Header className="m-0">
        <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-start font-sans text-sm text-(--ink) transition-colors duration-(--duration-fast) hover:text-(--ink-2)">
          {title}
          <RiAddLine
            size={16}
            aria-hidden
            className="shrink-0 text-(--ink-3-aa) transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-data-[state=open]:rotate-45"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        data-folio-animated
        className="overflow-hidden text-sm leading-relaxed text-(--ink-2) data-[state=closed]:animate-[folio-accordion-up_var(--duration-base)_var(--ease)] data-[state=open]:animate-[folio-accordion-down_var(--duration-base)_var(--ease)]"
      >
        <div className="pb-4 pe-8">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

export default Accordion
