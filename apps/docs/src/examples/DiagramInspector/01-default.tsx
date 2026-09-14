import { DiagramInspector } from '@misoto22/folio/diagrams'

/**
 * What a selection puts on the screen: the kind of thing it is, its name, the
 * facts too long to print on a plate, and every relationship it takes part in
 * with the direction spelled out. It is a labelled region with aria-live, not a
 * dialog — the reader clicked a node rather than opening a panel, so nothing
 * here traps focus or has to be dismissed before the page works again. mono is
 * for values a reader may retype; the facts are a definition list, so a screen
 * reader can say which value belongs to which label.
 */
export function Example() {
  return (
    <DiagramInspector
      eyebrow="Service"
      title="API"
      description="FastAPI, behind the load balancer. Owns every read the cache misses."
      facts={[
        { label: 'Port', value: '8000', mono: true },
        { label: 'Region', value: 'ap-southeast-2', mono: true },
        { label: 'Id', value: 'api', mono: true },
      ]}
      links={[
        { direction: 'in', label: 'HTTPS', peer: 'CloudFront' },
        { direction: 'out', label: 'read-through', peer: 'Redis' },
        { direction: 'out', label: 'SQL', peer: 'Postgres' },
      ]}
      onClose={() => {}}
    />
  )
}
