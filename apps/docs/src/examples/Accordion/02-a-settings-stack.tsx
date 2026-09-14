'use client'

import { Accordion, AccordionItem, Field, Input, Switch } from '@misoto22/folio'

/**
 * type multiple, because these two rows have to be read against each other —
 * single closes the one the reader was holding in order to open the one they
 * wanted to compare it with. defaultValue opens the group they came for. The
 * panel is overflow-hidden, which is what lets its measured height animate, so
 * anything inside that has to escape the row's box — a select's menu, a
 * popover — must portal out of it or be cut off at the row's edge.
 */
export function Example() {
  return (
    <Accordion type="multiple" defaultValue={['retries']} className="w-full max-w-md">
      <AccordionItem value="retries" title="Retries">
        <Field label="Attempts" hint="How many times a failed job is tried again.">
          <Input type="number" defaultValue={3} />
        </Field>
      </AccordionItem>
      <AccordionItem value="notifications" title="Notifications">
        <Field
          layout="row"
          label="Email me when a job fails"
          description="One message per failure, not per attempt."
        >
          <Switch defaultChecked />
        </Field>
      </AccordionItem>
    </Accordion>
  )
}
