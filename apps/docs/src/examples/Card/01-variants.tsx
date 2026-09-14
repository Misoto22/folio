import { Badge, Card, CardBody, CardFooter, CardHeader, CardTitle } from '@misoto22/folio'

/**
 * The bounded surface and the one reversed one, side by side. There is no
 * shadow under either: a card that needs to read as raised is a plate, which
 * separates by reversal because this system has no elevation ramp to raise it
 * with. Spend plate once per screen — a band of them is a band with no ground
 * left to reverse against. Use CardTitle inside it rather than your own
 * heading, too: plate re-points --card-title to --on-feature, and a title that
 * reads --ink directly comes out at 1.25:1 on that ground, invisible on the one
 * variant whose whole job is to look different.
 */
export function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent deploys</CardTitle>
          <Badge tone="success">green</Badge>
        </CardHeader>
        <CardBody>Twelve releases in the last thirty days, none rolled back.</CardBody>
        <CardFooter>Updated 4 minutes ago</CardFooter>
      </Card>
      <Card variant="plate">
        <CardHeader className="border-(--ink-3)">
          <CardTitle className="text-(--on-feature)">The reversed plate</CardTitle>
        </CardHeader>
        <CardBody className="text-(--on-feature)/80">
          One per screen. It separates by reversal, because this system has no blur to raise it with.
        </CardBody>
      </Card>
    </div>
  )
}
