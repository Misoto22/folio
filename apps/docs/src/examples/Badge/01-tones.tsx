import { Badge } from '@misoto22/folio'

/**
 * Every tone the badge has, with the neutral default first. Leave it at neutral
 * unless the badge names a STATE: the three status tones are the only chroma
 * this system spends, and a badge that is red because the page wanted red is
 * the thing the scale exists to prevent.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>12</Badge>
      <Badge tone="outline">Draft</Badge>
      <Badge tone="success">Deployed</Badge>
      <Badge tone="warning">Degraded</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
  )
}
