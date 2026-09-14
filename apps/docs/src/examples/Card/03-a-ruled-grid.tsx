import { Card, CardBody, CardTitle, Heading, Text } from '@misoto22/folio'

const REGIONS = [
  { name: 'Australia', orders: '1,204', revenue: '$48,210' },
  { name: 'Japan', orders: '862', revenue: '$31,940' },
  { name: 'Singapore', orders: '415', revenue: '$18,704' },
]

/**
 * flat is the ground for a card whose container already draws the rules between
 * cells — three outlined cards inside a bordered grid is three borders where
 * one was wanted. Two other things are load-bearing here. The box brings no
 * padding of its own, so children dropped straight in sit against the edge:
 * CardBody supplies it. And CardTitle is an h3 by default, which is right under
 * the h2 above it and wrong the moment a grid of twelve cards has no heading
 * for them to belong to — pass as to say which level this really is.
 */
export function Example() {
  return (
    <section className="w-full">
      <Heading level={2} size="item" className="mb-4">
        Revenue by region
      </Heading>
      <div className="grid gap-px overflow-hidden rounded-(--radius-lg) border border-(--rule) bg-(--rule) sm:grid-cols-3">
        {REGIONS.map((region) => (
          <Card key={region.name} variant="flat" className="rounded-none bg-(--paper)">
            <CardBody>
              <CardTitle as="h3">{region.name}</CardTitle>
              <Text size="sm" className="mt-2 tabular-nums">
                {region.orders} orders
              </Text>
              <Text size="sm" tone="strong" className="mt-1 tabular-nums">
                {region.revenue}
              </Text>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}
