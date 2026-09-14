'use client'

import { Accordion, AccordionItem, Text } from '@misoto22/folio'

/**
 * title is the accessible name of the panel as well as of the trigger, so a row
 * called More opens a region called More — and a reader moving between regions
 * gets a list of them that names nothing. Write the whole question. The rows on
 * the right say what is behind them before they are opened, which is also what
 * makes the closed stack readable: a column of one-word triggers is a table of
 * contents for a book with no chapter titles.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Opens a region called More
        </Text>
        <Accordion type="single" collapsible>
          <AccordionItem value="a" title="More">
            Invoices are issued on the first working day of the month.
          </AccordionItem>
          <AccordionItem value="b" title="Details">
            Payment is due 30 days after the issue date.
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Opens a region called by its question
        </Text>
        <Accordion type="single" collapsible>
          <AccordionItem value="a" title="When are invoices issued?">
            Invoices are issued on the first working day of the month.
          </AccordionItem>
          <AccordionItem value="b" title="When is payment due?">
            Payment is due 30 days after the issue date.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
