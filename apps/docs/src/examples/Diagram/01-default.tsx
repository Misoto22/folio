import { Diagram } from '@misoto22/folio'

/**
 * A request, drawn as three ranks with the work nested inside the middle one.
 * Only the nodes an edge names carry an id, and each edge is written in the
 * order the array runs: an edge is matched against the node immediately before
 * this one, so one written to-from, or between two nodes that are not
 * neighbours, draws nothing — and says so in development, as
 * DIAGRAM_EDGE_NOT_ADJACENT, or DIAGRAM_EDGE_UNKNOWN_NODE when the id belongs
 * to no node at all. Three more spec mistakes warn the same way:
 * DIAGRAM_DUPLICATE_ID, DIAGRAM_ACCENT_ON_CONTAINER for accent on a node with
 * children, which is drawn as a band and has no fill to take, and
 * DIAGRAM_DIRECTION_ON_LEAF for direction on a node with none. The caption
 * names the figure for a screen reader as well as for a reader.
 */
export function Example() {
  return (
    <Diagram
      spec={{
        caption: 'One request, from the edge to the row it reads.',
        edges: [
          { from: 'edge', to: 'app', label: 'HTTPS' },
          { from: 'app', to: 'data', label: 'SQL' },
        ],
        nodes: [
          { id: 'edge', label: 'Edge', note: 'CDN + WAF', footnote: 'Cached for 60s' },
          {
            id: 'app',
            label: 'Application',
            note: 'one process',
            direction: 'column',
            children: [
              { label: 'Router' },
              { label: 'Handlers', accent: true, note: 'where the work is' },
              { label: 'Serialisers' },
            ],
          },
          { id: 'data', label: 'Postgres', note: 'primary' },
        ],
      }}
    />
  )
}
