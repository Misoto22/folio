import { Badge, StatusDot } from '@misoto22/folio'

/**
 * A dot inside the chip rather than beside it. Badge spaces its children 6px
 * apart, so a StatusDot needs no wrapper of its own — and the dot is
 * aria-hidden, so the word next to it has to name the state on its own. Reach
 * for this in a table cell where the row already supplies the subject; a state
 * that is the whole line is a StatusPill.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="success">
        <StatusDot size="sm" pulse={false} /> Deployed
      </Badge>
      <Badge tone="warning">
        <StatusDot size="sm" tone="warning" pulse={false} /> Degraded
      </Badge>
      <Badge tone="danger">
        <StatusDot size="sm" tone="danger" pulse={false} /> Failed
      </Badge>
    </div>
  )
}
