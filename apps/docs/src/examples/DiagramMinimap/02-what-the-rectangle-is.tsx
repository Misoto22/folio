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
const FRAME = { width: 420, height: 200 }

const STATES = [
  { caption: 'At rest', view: { scale: 1, x: 0, y: 0 } },
  { caption: 'Panned right', view: { scale: 1, x: -320, y: -70 } },
  { caption: 'Zoomed to 200%', view: { scale: 2, x: -320, y: -70 } },
]

/**
 * Three copies of one map, differing in nothing but view. The rectangle is
 * arithmetic on those three numbers — the content point at the frame’s top-left
 * is the negated offset over the zoom, scaled to the map — so there is no second
 * copy of where the viewport is and nothing to keep in step. Zooming in shrinks
 * the rectangle rather than moving it, which is the reading a reader wants: it
 * says how much of the whole they are currently looking at. None of these takes
 * onSeek, so they are readouts rather than controls and the pointer keeps its
 * ordinary cursor.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {STATES.map((state) => (
        <div key={state.caption} className="flex flex-col gap-2">
          <DiagramMinimap
            content={CONTENT}
            frame={FRAME}
            view={state.view}
            width={150}
            label={`Overview, ${state.caption.toLowerCase()}`}
          >
            <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
          </DiagramMinimap>
          <span className="mono-meta text-(--ink-3-aa)">{state.caption}</span>
        </div>
      ))}
    </div>
  )
}
