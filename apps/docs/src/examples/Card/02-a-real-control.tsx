import { Badge, Card, CardBody, CardHeader, CardTitle, Text } from '@misoto22/folio'

/**
 * A whole card that acts as one target, without an onClick on the box. A Card
 * with a click handler is a div with a click handler: not focusable, not
 * announced, and unreachable by keyboard. The fix is a real control inside it,
 * stretched over the box with an absolutely positioned overlay — so what is
 * announced is a link with the title as its name, the focus ring lands on
 * something, and the entire card is still the hit area. The box needs position
 * relative for that to work, and anything the reader must also be able to click
 * separately has to sit above the overlay.
 */
export function Example() {
  return (
    <Card className="relative w-full max-w-sm transition-colors duration-(--duration-fast) hover:border-(--ink)">
      <CardHeader>
        <CardTitle as="h3">
          <a href="#deployments" className="text-inherit no-underline after:absolute after:inset-0">
            api.misoto22.com
          </a>
        </CardTitle>
        <Badge tone="success">live</Badge>
      </CardHeader>
      <CardBody>
        <Text size="sm">Deployed from main four minutes ago, in 2m 14s.</Text>
      </CardBody>
    </Card>
  )
}
