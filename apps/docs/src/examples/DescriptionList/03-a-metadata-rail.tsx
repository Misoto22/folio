import { Badge, DescriptionList, Heading, Text, Timestamp } from '@misoto22/folio'

/**
 * The shape it was built for: a detail page with the record on the left and its
 * metadata in a rail beside it. The rail is stacked and undivided — it is
 * already inside a bordered column, and a second set of hairlines inside one
 * box is a grid pretending to be a table. Everything in the rail is a fact
 * about the thing rather than part of it, which is the line to draw when
 * deciding what belongs here: the title and the body are the record, the owner
 * and the last deploy are what the page knows about it.
 */
export function Example() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="flex flex-col gap-3">
        <Heading level={3}>ui.misoto22.com</Heading>
        <Text size="sm">
          The documentation site for the design package. Statically exported, so every
          page is HTML on a CDN and the only JavaScript is the parts a reader touches.
        </Text>
      </div>
      <aside className="rounded-(--radius) border border-(--rule-2) p-4">
        <DescriptionList
          layout="stacked"
          divided={false}
          items={[
            { term: 'Owner', description: 'Henry Chen' },
            { term: 'Status', description: <Badge tone="success">Deployed</Badge> },
            { term: 'Region', description: 'ap-southeast-2' },
            {
              term: 'Last deploy',
              description: <Timestamp value="2026-08-28T22:14:00.000Z" />,
            },
          ]}
        />
      </aside>
    </div>
  )
}
