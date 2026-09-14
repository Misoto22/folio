'use client'

import { ArchitectureFigure, DiagramCanvas } from '@misoto22/folio/diagrams'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'client', type: 'external' as const, label: 'Browser', row: 0, col: 0 },
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', sublabel: 'CDN', row: 0, col: 1 },
    { id: 'api', type: 'backend' as const, label: 'API', sublabel: 'FastAPI', row: 0, col: 2 },
    { id: 'db', type: 'database' as const, label: 'Postgres', row: 0, col: 3 },
  ],
  connections: [
    { id: 'a', from: 'client', to: 'edge', label: 'HTTPS' },
    { id: 'b', from: 'edge', to: 'api' },
    { id: 'c', from: 'api', to: 'db', label: 'SQL' },
  ],
}

/**
 * A figure wider than the room it is given, in a frame that can be moved around
 * it. A drag pans, the plate in the corner zooms, and the percentage between its
 * two buttons is the reset; a plain wheel is deliberately left to the page, so
 * only Command or Control with the wheel zooms. The frame is a real tab stop, so
 * plus, minus, zero and the arrow keys do the same work with no pointer at all.
 * The figure’s own heading, key and cards are turned off here because the canvas
 * is holding artwork, not an article.
 */
export function Example() {
  return (
    <DiagramCanvas height="16rem" label="Request path">
      <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
    </DiagramCanvas>
  )
}
