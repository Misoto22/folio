import { DiagramLegend } from '@misoto22/folio/diagrams'

const OWNERSHIP = [
  {
    key: 'owned',
    label: 'Owned by this team',
    sample: (
      <rect
        x="1"
        y="3"
        width="12"
        height="8"
        rx="2"
        className="fill-(--diagram-node) stroke-(--diagram-rule-hard) [stroke-width:1.2]"
      />
    ),
  },
  {
    key: 'vendor',
    label: 'Bought, not built',
    sample: (
      <rect
        x="1"
        y="3"
        width="12"
        height="8"
        rx="2"
        className="fill-(--diagram-node-2) stroke-(--diagram-rule) [stroke-width:1.2] [stroke-dasharray:3_2]"
      />
    ),
  },
  {
    key: 'retiring',
    label: 'Retiring this quarter',
    sample: (
      <path
        d="M 1 1 L 13 13 M 13 1 L 1 13"
        fill="none"
        className="stroke-(--diagram-line-soft) [stroke-width:1.4]"
      />
    ),
  },
]

/**
 * sample is markup on a 14 by 14 grid rather than a name matched against a fixed
 * list, which is what lets a figure that draws a mark of its own document it —
 * here, three states of ownership that no renderer knows about. Whatever goes in
 * has to be the same mark the artwork drew: a key that invents a form sends a
 * reader looking through the picture for something that was never there. Paint
 * the samples with the diagram tokens rather than with fixed colours, so the key
 * follows the figure into dark mode and onto paper.
 */
export function Example() {
  return (
    <DiagramLegend title="Ownership" entries={OWNERSHIP} />
  )
}
