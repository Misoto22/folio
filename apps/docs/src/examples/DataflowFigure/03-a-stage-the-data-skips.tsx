import { DataflowFigure } from '@misoto22/folio/diagrams'

/**
 * A stage is a claim about how far something has got, and that axis is what
 * makes the bypass legible: the sampled copy leaves the SDK at stage zero and
 * arrives at stage two without passing the redactor, still carrying its PII
 * chip. The same three flows written out as a list of pairs would hide that,
 * because a list has no axis to skip. The emphasised line is what the pipeline
 * is for; the dashed one is a one per cent sample kept so somebody can debug a
 * payload, which is exactly the kind of path an audit finds last.
 */
export function Example() {
  return (
    <DataflowFigure
      spec={{
        meta: { title: 'Clickstream', subtitle: 'Three stages, and one copy that skips the middle one.' },
        stages: [{ label: 'Collect' }, { label: 'Scrub' }, { label: 'Serve' }],
        nodes: [
          { id: 'sdk', type: 'frontend', label: 'Web SDK', sublabel: 'browser', stage: 0, row: 0, tag: 'raw' },
          { id: 'scrub', type: 'security', label: 'Redactor', sublabel: 'drops identifiers', stage: 1, row: 0 },
          { id: 'lake', type: 'database', label: 'Lake', sublabel: 'partitioned', stage: 2, row: 0, tag: 'curated' },
          { id: 'debug', type: 'database', label: 'Debug bucket', sublabel: '7-day TTL', stage: 2, row: 1 },
        ],
        flows: [
          { id: 'a', from: 'sdk', to: 'scrub', label: 'events', classification: 'PII' },
          { id: 'b', from: 'scrub', to: 'lake', label: 'hourly', classification: 'no PII', variant: 'emphasis' },
          { id: 'c', from: 'sdk', to: 'debug', label: 'sampled 1%', classification: 'PII', variant: 'dashed', fromSide: 'bottom', toSide: 'left' },
        ],
      }}
    />
  )
}
