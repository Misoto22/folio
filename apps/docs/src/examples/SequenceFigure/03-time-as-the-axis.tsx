import { SequenceFigure } from '@misoto22/folio/diagrams'

/**
 * What an explicit y buys. The first three calls sit 12 units apart because they
 * left the gateway together, and the vendor reply is 186 units below its call
 * because that is how long it took — placed from an index instead, the six
 * messages would space evenly and that difference would be gone. The activation
 * bars carry the same fact a second way: two close early while the third runs to
 * the bottom of the figure, which is the tail, visible before anyone reads a
 * label.
 */
export function Example() {
  return (
    <SequenceFigure
      spec={{
        meta: { title: 'A slow dependency', subtitle: 'Three calls in 24 units, then 186 of waiting.' },
        participants: [
          { id: 'gw', type: 'backend', label: 'Gateway' },
          { id: 'search', type: 'backend', label: 'Search' },
          { id: 'rank', type: 'backend', label: 'Ranker' },
          { id: 'vendor', type: 'external', label: 'Pricing vendor' },
        ],
        messages: [
          { id: 'q', from: 'gw', to: 'search', y: 150, label: 'query' },
          { id: 'f', from: 'gw', to: 'rank', y: 162, label: 'features' },
          { id: 'p', from: 'gw', to: 'vendor', y: 174, label: 'quote', variant: 'emphasis' },
          { id: 'hits', from: 'search', to: 'gw', y: 205, label: 'hits', variant: 'return' },
          { id: 'scores', from: 'rank', to: 'gw', y: 225, label: 'scores', variant: 'return' },
          { id: 'price', from: 'vendor', to: 'gw', y: 360, label: 'price', variant: 'return' },
        ],
        activations: [
          { participant: 'gw', from: 145, to: 368, type: 'backend' },
          { participant: 'search', from: 155, to: 210, type: 'backend' },
          { participant: 'rank', from: 167, to: 230, type: 'backend' },
          { participant: 'vendor', from: 179, to: 365, type: 'external' },
        ],
        cards: [
          { dot: 'rose', title: 'The tail', items: ['Search and Ranker both answer within 75 units of the first call.', 'The vendor holds its request open for 186.'] },
        ],
      }}
    />
  )
}
