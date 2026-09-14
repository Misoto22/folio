import { DataflowFigure } from '@misoto22/folio/diagrams'

/**
 * Two sources joining at one gate. The mono chip under each label is the
 * classification, printed apart from the wording because a pipeline gets read
 * for what is inside the arrow rather than for what the arrow is called —
 * clickstream and no PII answer different questions, and only one of them is the
 * question a governance reviewer arrived with. The stage headings are the axis,
 * so how far something has got is answered by looking up rather than by tracing.
 */
export function Example() {
  return (
    <DataflowFigure
      spec={{
        meta: { title: 'Event pipeline', subtitle: 'What is in the arrow matters more than the arrow.' },
        stages: [{ label: 'Sources' }, { label: 'Gate' }, { label: 'Store' }],
        nodes: [
          { id: 'web', type: 'frontend', label: 'Web SDK', sublabel: 'browser', stage: 0, row: 0, tag: 'events' },
          { id: 'app', type: 'frontend', label: 'Mobile', sublabel: 'iOS / Android', stage: 0, row: 1, tag: 'events' },
          { id: 'gate', type: 'security', label: 'Consent gate', sublabel: 'policy filter', stage: 1, row: 0, tag: 'PII guard' },
          { id: 'wh', type: 'database', label: 'Warehouse', sublabel: 'analytics tables', stage: 2, row: 0, tag: 'curated' },
        ],
        flows: [
          { id: 'a', from: 'web', to: 'gate', label: 'clickstream', classification: 'user events', variant: 'emphasis' },
          { id: 'b', from: 'app', to: 'gate', label: 'app events', classification: 'device events' },
          { id: 'c', from: 'gate', to: 'wh', label: 'accepted', classification: 'no PII', variant: 'emphasis' },
        ],
      }}
    />
  )
}
