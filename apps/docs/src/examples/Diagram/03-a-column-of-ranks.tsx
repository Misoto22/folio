import { Diagram } from '@misoto22/folio'

/**
 * The same machinery turned on its side. spec.direction stacks the top rank and
 * the arrows turn with it, which is also what a row does on its own below the
 * sm breakpoint — so a row of six plates that reads as a pipeline on a desktop
 * is six stacked boxes and five arrows on a phone. A child rank keeps its own
 * axis: direction is read from the node that HAS children and never inherits
 * from the rank above, which is why the three stores below still sit in a row.
 */
export function Example() {
  return (
    <Diagram
      spec={{
        direction: 'column',
        caption: 'A search query, top to bottom.',
        edges: [
          { from: 'query', to: 'embed', label: 'text' },
          { from: 'embed', to: 'search', label: '1024-d vector' },
        ],
        nodes: [
          { id: 'query', label: 'Query', note: 'typed by a reader' },
          { id: 'embed', label: 'Embedding', note: 'Voyage 3.5-lite' },
          {
            id: 'search',
            label: 'pgvector',
            note: 'top 5 by cosine',
            direction: 'row',
            children: [
              { label: 'Posts' },
              { label: 'Projects' },
              { label: 'Profile' },
            ],
          },
        ],
      }}
    />
  )
}
