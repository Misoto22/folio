import { Badge, DescriptionList, Timestamp } from '@misoto22/folio'

/**
 * A record seen from the front. The markup is a real dl/dt/dd, which is what
 * tells a screen reader that "Owner" names the value beside it — a grid of divs
 * looks identical and says nothing. The value is a node, so a state is a Badge
 * and a date is a Timestamp rather than two strings formatted by hand.
 */
export function Example() {
  return (
    <DescriptionList
      items={[
        { term: 'Owner', description: 'Henry Chen' },
        { term: 'Region', description: 'ap-southeast-2' },
        { term: 'Status', description: <Badge tone="success">Deployed</Badge> },
        {
          term: 'Last deploy',
          description: <Timestamp value="2026-01-14T09:30:00.000Z" />,
        },
      ]}
    />
  )
}
