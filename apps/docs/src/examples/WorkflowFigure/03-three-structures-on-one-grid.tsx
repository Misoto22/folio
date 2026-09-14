import { WorkflowFigure } from '@misoto22/folio/diagrams'

/**
 * Lanes answer who, the phase captions on the header rule answer when, and the
 * group frame answers what is in scope — three structures on one grid, because a
 * runbook gets read for all three questions and by three different people. The
 * frame is dashed because that group carries variant security, which is the one
 * claim on the figure a reader can check without tracing an arrow. The receipt
 * leaves the main path and is drawn dashed rather than solid, which is the whole
 * difference between an email that may be late and a shipment that may not.
 */
export function Example() {
  return (
    <WorkflowFigure
      spec={{
        schema_version: 2,
        meta: { title: 'Order fulfilment', subtitle: 'Three teams, three stages, one hop nobody waits for.' },
        lanes: [
          { id: 'store', label: 'Storefront' },
          { id: 'ops', label: 'Fulfilment' },
          { id: 'finance', label: 'Finance' },
        ],
        phases: [
          { id: 'take', label: 'Take', fromCol: 0, toCol: 0 },
          { id: 'settle', label: 'Settle', fromCol: 1, toCol: 2 },
          { id: 'ship', label: 'Ship', fromCol: 3, toCol: 3 },
        ],
        groups: [{ id: 'pci', label: 'PCI scope', lane: 'finance', fromCol: 1, toCol: 2, variant: 'security' }],
        nodes: [
          { id: 'cart', lane: 'store', col: 0, type: 'frontend', label: 'Checkout', sublabel: 'web' },
          { id: 'receipt', lane: 'store', col: 2, type: 'messagebus', label: 'Receipt email', sublabel: 'queued' },
          { id: 'pick', lane: 'ops', col: 3, type: 'backend', label: 'Pick and pack', sublabel: 'warehouse' },
          { id: 'auth', lane: 'finance', col: 1, type: 'security', label: 'Authorise', sublabel: 'card network', tag: 'PCI' },
          { id: 'capture', lane: 'finance', col: 2, type: 'backend', label: 'Capture', sublabel: 'settled' },
        ],
        mainPath: ['cart', 'auth', 'capture', 'pick'],
        edges: [
          { id: 'a', from: 'cart', to: 'auth', label: 'card token' },
          { id: 'b', from: 'auth', to: 'capture', label: 'approved' },
          { id: 'c', from: 'capture', to: 'pick', label: 'paid', fromSide: 'right', toSide: 'bottom' },
          { id: 'd', from: 'capture', to: 'receipt', label: 'confirmation', role: 'async', variant: 'dashed' },
        ],
        cards: [
          { dot: 'amber', title: 'PCI scope', items: ['Only the two boxes inside the dashed frame see a card number.'] },
          { dot: 'slate', title: 'Off the path', items: ['The receipt is queued, so a slow mailer cannot hold up a shipment.'] },
        ],
      }}
    />
  )
}
