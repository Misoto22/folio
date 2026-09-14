import { LifecycleFigure } from '@misoto22/folio/diagrams'

/**
 * A decision with both of its ends drawn. Approved sits on the rail, so its
 * arrow is implied; Declined sits in a second lane, which is the only way to fan
 * out of a decision here — a fourth state added to the first lane would be joined
 * to its neighbour by the implied rail whether that transition exists or not.
 * The two terminal states are the only marks in the package allowed colour, and
 * this is the figure the tokens were reserved for: the question a reader brings
 * to a state machine is which end a run came out of.
 */
export function Example() {
  return (
    <LifecycleFigure
      spec={{
        meta: { title: 'Card authorisation', subtitle: 'One decision, and the two ends a run can come out of.' },
        lanes: [
          { id: 'flow', label: 'Authorisation' },
          { id: 'refuse', label: 'Refusals' },
        ],
        states: [
          { id: 'submitted', type: 'start', label: 'Submitted', sublabel: 'card token', lane: 'flow', col: 0, step: '01' },
          { id: 'risk', type: 'decision', label: 'Risk score', sublabel: 'model and rules', lane: 'flow', col: 1, step: '02' },
          { id: 'approved', type: 'success', label: 'Approved', sublabel: 'funds held', lane: 'flow', col: 2, step: '03' },
          { id: 'declined', type: 'failure', label: 'Declined', sublabel: 'no retry', lane: 'refuse', col: 0 },
        ],
        transitions: [
          { id: 'no', from: 'risk', to: 'declined', label: 'score above 90', fromSide: 'bottom', toSide: 'top' },
        ],
        cards: [
          { dot: 'emerald', title: 'Two ends', items: ['A run leaves through Approved or through Declined and nowhere else.'] },
          { dot: 'amber', title: 'The rail', items: ['Submitted to Risk score to Approved is drawn without being declared.'] },
        ],
      }}
    />
  )
}
