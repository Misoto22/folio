import { DataflowFigure } from '@misoto22/folio/diagrams'

/**
 * Four stages, because minimisation is a stage: the reviewer's question is
 * whether anything still labelled PII reaches the warehouse, and the answer is
 * a line you follow rather than a paragraph you trust. Every classification is
 * folded into the accessible summary as well as printed on the chip, so a
 * reader who cannot see the picture gets card and email — PII rather than card
 * and email alone. Keep the wording and the classification apart even when they
 * feel like one phrase; the moment they merge, the chip stops being a field
 * anything can be checked against.
 */
export function Example() {
  return (
    <DataflowFigure
      spec={{
        meta: { title: 'Card data, minimised', subtitle: 'Read for what crosses each stage, not for what talks to what.' },
        stages: [{ label: 'Collected' }, { label: 'Minimised' }, { label: 'Stored' }, { label: 'Served' }],
        nodes: [
          { id: 'checkout', type: 'frontend', label: 'Checkout form', sublabel: 'browser', stage: 0, row: 0, tag: 'raw' },
          { id: 'support', type: 'frontend', label: 'Support inbox', sublabel: 'ticket bodies', stage: 0, row: 1, tag: 'raw' },
          { id: 'vault', type: 'security', label: 'Tokeniser', sublabel: 'Vault transit', stage: 1, row: 0 },
          { id: 'wh', type: 'database', label: 'Warehouse', sublabel: 'order tables', stage: 2, row: 0 },
          { id: 'bi', type: 'backend', label: 'Dashboards', sublabel: 'finance team', stage: 3, row: 0 },
        ],
        flows: [
          { id: 'a', from: 'checkout', to: 'vault', label: 'card and email', classification: 'PII', variant: 'emphasis' },
          { id: 'b', from: 'support', to: 'vault', label: 'free text', classification: 'PII, unstructured' },
          { id: 'c', from: 'vault', to: 'wh', label: 'order rows', classification: 'tokenised, no PAN', variant: 'emphasis' },
          { id: 'd', from: 'wh', to: 'bi', label: 'daily rollup', classification: 'aggregated' },
        ],
      }}
    />
  )
}
