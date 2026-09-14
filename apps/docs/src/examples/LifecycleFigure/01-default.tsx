import { LifecycleFigure } from '@misoto22/folio/diagrams'

/**
 * The rail across the top is not in the spec. A lifecycle diagram gives its
 * first lane to the ordered phases, and the arrows between consecutive columns
 * there are drawn for you at the emphasis weight, so an author declares only the
 * edges that leave the spine — here, the three that pass through Blocked. This
 * is also the one figure allowed colour, and it spends exactly two tokens: one
 * on the completed state, one on the failed one. Every other kind is carried by
 * shape, so a greyscale print loses the two outcomes and keeps every other
 * distinction.
 */
export function Example() {
  return (
    <LifecycleFigure
      spec={{
        meta: { title: 'A job run', subtitle: 'The only figure that spends colour, on the two outcomes.' },
        lanes: [
          { id: 'main', label: 'Phases' },
          { id: 'wait', label: 'Interruptions' },
          { id: 'exit', label: 'Terminal' },
        ],
        states: [
          { id: 'queued', type: 'start', label: 'Queued', sublabel: 'accepted', lane: 'main', col: 0, step: '01' },
          { id: 'running', type: 'active', label: 'Running', sublabel: 'tool calls', lane: 'main', col: 1, step: '02' },
          { id: 'review', type: 'decision', label: 'Review', sublabel: 'quality gate', lane: 'main', col: 2, step: '03' },
          { id: 'done', type: 'success', label: 'Completed', sublabel: 'final answer', lane: 'main', col: 3, step: '04' },
          { id: 'blocked', type: 'waiting', label: 'Blocked', sublabel: 'missing input', lane: 'wait', col: 0 },
          { id: 'failed', type: 'failure', label: 'Failed', sublabel: 'timed out', lane: 'exit', col: 0 },
        ],
        transitions: [
          { id: 'a', from: 'review', to: 'blocked', label: 'needs input' },
          { id: 'b', from: 'blocked', to: 'failed', label: 'expired', note: 'after 24h', variant: 'dashed' },
          { id: 'c', from: 'blocked', to: 'running', label: 'answered', variant: 'emphasis' },
        ],
      }}
    />
  )
}
