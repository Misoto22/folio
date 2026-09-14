import { SequenceFigure } from '@misoto22/folio/diagrams'

/**
 * A cache miss read down the page, where the vertical axis is time rather than
 * layout: the 50 units between the miss and the query are a real gap, and an
 * evenly spaced list of six calls would have erased it while looking tidier. The
 * activation bars carry the fact a list of calls cannot — Redis is busy for 45
 * units inside the 210 the API spends open. Returns are dashed and take an open
 * head, two signals rather than one, because the reply is what a reader picks out
 * of a dense trace first.
 */
export function Example() {
  return (
    <SequenceFigure
      spec={{
        meta: { title: 'A cache miss', subtitle: 'The vertical axis is time, not layout.' },
        participants: [
          { id: 'web', type: 'frontend', label: 'Web app', sublabel: 'React' },
          { id: 'api', type: 'backend', label: 'API', sublabel: 'handler' },
          { id: 'cache', type: 'database', label: 'Redis' },
          { id: 'db', type: 'database', label: 'Postgres' },
        ],
        segments: [
          { from: 130, to: 250, label: 'Request' },
          { from: 260, to: 380, label: 'Fallback' },
        ],
        messages: [
          { id: 'get', from: 'web', to: 'api', y: 160, label: 'GET /me', variant: 'emphasis' },
          { id: 'read', from: 'api', to: 'cache', y: 200, label: 'read' },
          { id: 'miss', from: 'cache', to: 'api', y: 235, label: 'miss', variant: 'return' },
          { id: 'query', from: 'api', to: 'db', y: 285, label: 'select', variant: 'emphasis' },
          { id: 'rows', from: 'db', to: 'api', y: 320, label: 'rows', variant: 'return' },
          { id: 'json', from: 'api', to: 'web', y: 360, label: '200 JSON', variant: 'return' },
        ],
        activations: [
          { participant: 'api', from: 155, to: 365, type: 'backend' },
          { participant: 'cache', from: 195, to: 240, type: 'database' },
          { participant: 'db', from: 280, to: 325, type: 'database' },
        ],
      }}
    />
  )
}
