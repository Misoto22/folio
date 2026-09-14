import { ArchitectureFigure } from '@misoto22/folio/diagrams'

/**
 * A request path on the default grid: every component names a row and a column,
 * so nothing here is solved for and the markup a server sends is the markup the
 * browser keeps. The region boundary is what makes ap-southeast-2 a place rather
 * than a sixth box, and it is what puts the browser visibly outside it. One
 * connection carries emphasis — without it four arrows of equal weight leave a
 * reader to work out unaided which one the diagram is about.
 */
export function Example() {
  return (
    <ArchitectureFigure
      spec={{
        meta: { title: 'One request, end to end', subtitle: 'The edge, the service, the row it reads.' },
        components: [
          { id: 'client', type: 'external', label: 'Browser', sublabel: 'Safari / Chrome', row: 0, col: 0 },
          { id: 'edge', type: 'cloud', label: 'CloudFront', sublabel: 'CDN', row: 0, col: 1 },
          { id: 'api', type: 'backend', label: 'API', sublabel: 'FastAPI', row: 0, col: 2, tag: ':8000' },
          { id: 'cache', type: 'database', label: 'Redis', sublabel: 'read-through', row: 1, col: 2 },
          { id: 'db', type: 'database', label: 'Postgres', sublabel: 'primary', row: 0, col: 3 },
        ],
        boundaries: [{ kind: 'region', label: 'ap-southeast-2', wraps: ['api', 'cache', 'db'] }],
        connections: [
          { id: 'a', from: 'client', to: 'edge', label: 'HTTPS', variant: 'emphasis' },
          { id: 'b', from: 'edge', to: 'api' },
          { id: 'c', from: 'api', to: 'cache', label: 'read-through' },
          { id: 'd', from: 'api', to: 'db', label: 'SQL' },
        ],
        cards: [
          { dot: 'cyan', title: 'Edge', items: ['Every request is fronted by the CDN.'] },
          { dot: 'emerald', title: 'Application', items: ['Reads go through Redis first.', 'Postgres is the source of truth.'] },
        ],
      }}
    />
  )
}
