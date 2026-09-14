import { ArchitectureFigure, DiagramMinimap } from '@misoto22/folio/diagrams'

const SPEC = {
  meta: { title: 'Request path' },
  components: [
    { id: 'edge', type: 'cloud' as const, label: 'CloudFront', row: 0, col: 0 },
    { id: 'api', type: 'backend' as const, label: 'API', row: 0, col: 1 },
    { id: 'db', type: 'database' as const, label: 'Postgres', row: 0, col: 2 },
    { id: 'queue', type: 'messagebus' as const, label: 'SQS', row: 1, col: 1 },
  ],
  connections: [
    { id: 'a', from: 'edge', to: 'api' },
    { id: 'b', from: 'api', to: 'db' },
    { id: 'c', from: 'api', to: 'queue' },
  ],
}

const CONTENT = { width: 900, height: 340 }

/**
 * The two cases side by side. On the left the frame is a window on something
 * four times its area, so the rectangle picks out a part and the map answers
 * where you are; on the right the frame already holds the whole artwork, the
 * rectangle covers the map edge to edge, and every pixel of it says the one
 * thing the reader can already see. Render a minimap only in the first case —
 * in the second it is a second drawing of the diagram that costs a render and
 * tells nobody anything.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-2">
        <DiagramMinimap
          content={CONTENT}
          frame={{ width: 400, height: 190 }}
          view={{ scale: 1, x: -240, y: -60 }}
          width={150}
          label="Overview, a window on the diagram"
        >
          <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
        </DiagramMinimap>
        <span className="mono-meta text-(--ink-3-aa)">400 × 190 of 900 × 340</span>
      </div>
      <div className="flex flex-col gap-2">
        <DiagramMinimap
          content={CONTENT}
          frame={CONTENT}
          view={{ scale: 1, x: 0, y: 0 }}
          width={150}
          label="Overview, the whole diagram in frame"
        >
          <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
        </DiagramMinimap>
        <span className="mono-meta text-(--ink-3-aa)">900 × 340 of 900 × 340</span>
      </div>
    </div>
  )
}
