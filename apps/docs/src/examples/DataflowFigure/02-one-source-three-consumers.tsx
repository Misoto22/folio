import { DataflowFigure } from '@misoto22/folio/diagrams'

/**
 * A fan-out, and the reason classification is a field rather than a word in the
 * label: one table feeds three consumers and each arrow leaves carrying
 * something different. Three flows share a single face here, so the router
 * spreads their ports across it — stacked on the face midpoint instead, three
 * arrowheads would read as one. The ad partner is the only consumer outside the
 * account, which is why its flow is the one drawn as crossing a boundary.
 */
export function Example() {
  return (
    <DataflowFigure
      spec={{
        meta: { title: 'What leaves the events table', subtitle: 'One source, three consumers, three payloads.' },
        stages: [{ label: 'Source' }, { label: 'Consumers' }],
        nodes: [
          { id: 'events', type: 'database', label: 'Events table', sublabel: 'raw', stage: 0, row: 1, tag: 'PII' },
          { id: 'bi', type: 'cloud', label: 'BI dashboards', sublabel: 'internal', stage: 1, row: 0 },
          { id: 'ml', type: 'backend', label: 'Model training', sublabel: 'nightly', stage: 1, row: 1 },
          { id: 'ads', type: 'external', label: 'Ad partner', sublabel: 'third party', stage: 1, row: 2 },
        ],
        flows: [
          { id: 'a', from: 'events', to: 'bi', label: 'daily rollup', classification: 'aggregated' },
          { id: 'b', from: 'events', to: 'ml', label: 'training set', classification: 'hashed ids' },
          { id: 'c', from: 'events', to: 'ads', label: 'conversions', classification: 'no PII', variant: 'security' },
        ],
        cards: [
          { dot: 'rose', title: 'Leaving the estate', items: ['Only the ad partner sits outside the account.', 'That is the arrow a reviewer reads first.'] },
        ],
      }}
    />
  )
}
