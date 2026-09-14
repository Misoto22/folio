import { SequenceFigure } from '@misoto22/folio/diagrams'

/**
 * The asynchronous half of a delivery. The enqueue is dashed because Billing
 * does not wait for it — Billing has no activation bar at all, which is what
 * says the two attempts that follow cost the caller nothing. Both calls out
 * carry the security variant, which the key reads as crossing a trust boundary,
 * and it is true here: the endpoint belongs to the customer. column_fit is
 * spread because Partner webhook endpoint does not fit the fixed 148-unit
 * column, and shortening the name to make it fit would be a different diagram.
 */
export function Example() {
  return (
    <SequenceFigure
      spec={{
        meta: {
          title: 'Webhook delivery',
          subtitle: 'A queue absorbs the retry the caller never waits for.',
          column_fit: 'spread',
        },
        participants: [
          { id: 'billing', type: 'backend', label: 'Billing', sublabel: 'invoice writer' },
          { id: 'outbox', type: 'messagebus', label: 'Outbox', sublabel: 'delivery queue' },
          { id: 'partner', type: 'external', label: 'Partner webhook endpoint', sublabel: 'customer-operated' },
        ],
        segments: [{ from: 262, to: 340, label: 'Retry' }],
        messages: [
          { id: 'enq', from: 'billing', to: 'outbox', y: 150, label: 'enqueue', variant: 'dashed' },
          { id: 'post1', from: 'outbox', to: 'partner', y: 195, label: 'POST /hooks', variant: 'security' },
          { id: 'fail', from: 'partner', to: 'outbox', y: 230, label: '503', variant: 'return' },
          { id: 'post2', from: 'outbox', to: 'partner', y: 290, label: 'attempt 2', variant: 'security' },
          { id: 'ok', from: 'partner', to: 'outbox', y: 325, label: '200', variant: 'return' },
        ],
        activations: [{ participant: 'outbox', from: 145, to: 335, type: 'messagebus' }],
      }}
    />
  )
}
