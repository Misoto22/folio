import { LifecycleFigure } from '@misoto22/folio/diagrams'

/**
 * Two states of type failure, drawn identically, and only one of them ends the
 * run. Nothing on a plate says whether a failure is terminal — the difference is
 * a real edge in the machine, so Timed out has an arrow back to Sending and
 * Rejected has none, and a reader tells them apart by following arrows rather
 * than by reading an adjective. The retry edge carries a note under its wording,
 * which is where a count or a condition goes when folding it into the label
 * would make the label too long to sit in the gap it has.
 */
export function Example() {
  return (
    <LifecycleFigure
      spec={{
        meta: { title: 'A delivery attempt', subtitle: 'Two failures on the same plate; one of them is not the end.' },
        lanes: [
          { id: 'run', label: 'Delivery' },
          { id: 'faults', label: 'Faults' },
        ],
        states: [
          { id: 'queued', type: 'start', label: 'Queued', sublabel: 'accepted', lane: 'run', col: 0, step: '01' },
          { id: 'sending', type: 'active', label: 'Sending', sublabel: 'attempt n', lane: 'run', col: 1, step: '02', tag: 'HTTP' },
          { id: 'delivered', type: 'success', label: 'Delivered', sublabel: '2xx', lane: 'run', col: 3, step: '03' },
          { id: 'timeout', type: 'failure', label: 'Timed out', sublabel: 'no response', lane: 'faults', col: 0 },
          { id: 'rejected', type: 'failure', label: 'Rejected', sublabel: 'no retry', lane: 'faults', col: 1 },
        ],
        transitions: [
          { id: 'slow', from: 'sending', to: 'timeout', label: 'no reply in 10s', toSide: 'top' },
          { id: 'retry', from: 'timeout', to: 'sending', label: 'retry', note: 'up to 5 times', variant: 'emphasis', fromSide: 'left', toSide: 'bottom' },
          { id: 'bad', from: 'sending', to: 'rejected', label: '400 invalid body', fromSide: 'bottom', toSide: 'top' },
        ],
        cards: [
          { dot: 'amber', title: 'Same plate, different run', items: ['Timed out and Rejected are drawn identically.', 'Only the arrow leaving Timed out says the run continues.'] },
        ],
      }}
    />
  )
}
