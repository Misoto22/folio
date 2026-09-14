import {
  Accordion,
  AccordionItem,
  CollapsibleSection,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@misoto22/folio'

/**
 * Three ways to hide the same sentence, and the same consequence in all three:
 * what is closed is unmounted rather than hidden, so find-in-page cannot reach
 * it, a print takes only what happened to be open, and none of the three writes
 * the open one into the URL. Choose by what the reader is doing. Tabs are
 * mutually exclusive views of one subject and cost the reader whatever was
 * typed into the panel they leave. An Accordion is a set that can coordinate —
 * type multiple lets two rows be read against each other, and every row adds an
 * h3 to the outline. A Collapsible is one disclosure with nothing to coordinate
 * with, and it adds no heading at all. Anything that has to be searchable or
 * printable belongs in the page, uncovered.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Tabs — one of several views
        </Text>
        <Tabs defaultValue="usd">
          <TabsList aria-label="Currency">
            <TabsTrigger value="usd">USD</TabsTrigger>
            <TabsTrigger value="aud">AUD</TabsTrigger>
          </TabsList>
          <TabsContent value="usd">
            <Text size="sm">Billed at $18 a seat each month.</Text>
          </TabsContent>
          <TabsContent value="aud">
            <Text size="sm">Billed at A$28 a seat each month.</Text>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Accordion — a set of answers
        </Text>
        <Accordion type="single" collapsible>
          <AccordionItem value="usd" title="What does a seat cost?">
            Billed at $18 a seat each month.
          </AccordionItem>
          <AccordionItem value="cancel" title="Can I cancel mid-month?">
            Yes, and the remainder is refunded.
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Collapsible — detail on one thing
        </Text>
        <div className="border-y border-(--rule)">
          <CollapsibleSection title="Billing detail">
            Billed at $18 a seat each month, on the day you first subscribed.
          </CollapsibleSection>
        </div>
      </div>
    </div>
  )
}
