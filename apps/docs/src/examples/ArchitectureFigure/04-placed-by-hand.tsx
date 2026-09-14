import { ArchitectureFigure } from '@misoto22/folio/diagrams'

/**
 * pos instead of row and col, which is what unlocks a hand-tuned route: via,
 * channelX and channelY are honoured only when BOTH ends of the connection were
 * placed absolutely. Between two grid components they are coordinates in a
 * space this renderer chose rather than the author, so they are dropped and the
 * line is re-routed without a word. Nothing detects a collision either — two
 * components given the same coordinate are drawn one plate over the other and
 * the figure renders, with the summary list beside it still reporting both.
 */
export function Example() {
  return (
    <ArchitectureFigure
      spec={{
        meta: { title: 'Orders, with the retry drawn under the row', subtitle: 'Every box placed by hand, so the loop can be too.' },
        components: [
          { id: 'api', type: 'backend', label: 'Checkout API', sublabel: 'Fastify', pos: [40, 40] },
          { id: 'queue', type: 'messagebus', label: 'SQS orders', sublabel: 'standard queue', pos: [300, 40] },
          { id: 'worker', type: 'backend', label: 'Fulfilment worker', sublabel: 'ECS service', pos: [560, 40] },
          { id: 'dlq', type: 'messagebus', label: 'orders-dlq', sublabel: 'paged on depth > 0', pos: [820, 40] },
        ],
        connections: [
          { id: 'a', from: 'api', to: 'queue', label: 'publish' },
          { id: 'b', from: 'queue', to: 'worker', label: 'consume', variant: 'emphasis' },
          { id: 'c', from: 'worker', to: 'dlq', label: 'after 5 attempts', variant: 'dashed' },
          {
            id: 'retry',
            from: 'worker',
            to: 'queue',
            label: 'retry in 30s',
            variant: 'dashed',
            fromSide: 'bottom',
            toSide: 'bottom',
            via: [
              [652, 180],
              [392, 180],
            ],
          },
        ],
      }}
    />
  )
}
