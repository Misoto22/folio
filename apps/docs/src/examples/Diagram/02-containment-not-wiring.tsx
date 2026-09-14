import { Diagram } from '@misoto22/folio'

/**
 * Structure with no flow in it: no edges, just nesting. A node WITH children is
 * drawn as a labelled hairline band and a node without is a plate, which is
 * what keeps a figure three levels deep from carrying three borders around
 * anything inside it. That also means accent paints only on a plate — set on a
 * container it compiles, type-checks and shows nothing, because a band has no
 * fill to take.
 */
export function Example() {
  return (
    <Diagram
      spec={{
        direction: 'column',
        caption: 'What the package contains, and who contains the package.',
        nodes: [
          {
            label: 'Consumers',
            note: 'two hosts',
            children: [
              { label: 'misoto22.com', note: 'the public site' },
              { label: 'Admin console', note: 'behind a login' },
            ],
          },
          {
            label: '@misoto22/folio',
            note: 'one package',
            direction: 'column',
            children: [
              {
                label: 'Components',
                note: 'React, server-rendered',
                children: [
                  { label: 'Display' },
                  { label: 'Forms' },
                  { label: 'Overlays' },
                ],
              },
              { label: 'Tokens', note: 'CSS and TypeScript, one source' },
            ],
          },
        ],
      }}
    />
  )
}
