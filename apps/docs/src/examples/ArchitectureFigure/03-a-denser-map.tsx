import { ArchitectureFigure } from '@misoto22/folio/diagrams'

/**
 * Eight boxes and eight lines on a grid tightened through layout, which is what
 * a real system looks like and also what density costs: at this count nobody
 * traces a path, they scan for one. The two emphasised connections and the cards
 * underneath are the repair — the heavier run says where to start, and the cards
 * state the conclusions so the reader is not asked to derive them. A map this
 * size with every line at one weight is a wall the reader is invited to solve.
 */
export function Example() {
  return (
    <ArchitectureFigure
      spec={{
        meta: { title: 'The platform', subtitle: 'Eight services, and one path through them.' },
        layout: { gapX: 58, gapY: 58 },
        components: [
          { id: 'web', type: 'frontend', label: 'Web', sublabel: 'Next.js', row: 0, col: 0 },
          { id: 'mobile', type: 'frontend', label: 'Mobile', sublabel: 'iOS', row: 1, col: 0 },
          { id: 'gw', type: 'backend', label: 'Gateway', sublabel: 'routing', row: 0, col: 1 },
          { id: 'auth', type: 'security', label: 'Auth', sublabel: 'OIDC', row: 1, col: 1 },
          { id: 'orders', type: 'backend', label: 'Orders', sublabel: 'service', row: 0, col: 2 },
          { id: 'search', type: 'backend', label: 'Search', sublabel: 'service', row: 1, col: 2 },
          { id: 'db', type: 'database', label: 'Postgres', sublabel: 'primary', row: 0, col: 3 },
          { id: 'index', type: 'database', label: 'OpenSearch', sublabel: 'index', row: 1, col: 3 },
        ],
        connections: [
          { id: 'a', from: 'web', to: 'gw' },
          { id: 'b', from: 'mobile', to: 'gw', fromSide: 'right', toSide: 'left' },
          { id: 'c', from: 'gw', to: 'auth', label: 'verify' },
          { id: 'd', from: 'gw', to: 'orders', label: 'REST', variant: 'emphasis' },
          { id: 'e', from: 'gw', to: 'search', label: 'REST' },
          { id: 'f', from: 'orders', to: 'db', label: 'SQL', variant: 'emphasis' },
          { id: 'g', from: 'search', to: 'index', label: 'query' },
          { id: 'h', from: 'orders', to: 'index', label: 'reindex', variant: 'dashed' },
        ],
        cards: [
          { dot: 'cyan', title: 'Checkout', items: ['Gateway to Orders to Postgres carries every paid order.'] },
          { dot: 'slate', title: 'Coupling', items: ['Orders writes the index Search reads.', 'Only Orders and Search reach a datastore at all.'] },
        ],
      }}
    />
  )
}
