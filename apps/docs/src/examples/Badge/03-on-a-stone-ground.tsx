import { Badge } from '@misoto22/folio'

/**
 * The same two words on the ground one of them disappears into. Neutral fills
 * itself with --stone and draws a transparent border, so on a stone panel it is
 * a chip with no visible edge at all; outline is the tone that keeps its
 * hairline. Reach for outline whenever the badge sits on a filled surface.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-(--radius) bg-(--stone) p-4">
      <Badge>Neutral</Badge>
      <Badge tone="outline">Outline</Badge>
    </div>
  )
}
