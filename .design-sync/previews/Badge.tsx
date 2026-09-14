import { Badge } from '@misoto22/folio'

export function Draft() {
  return <Badge>Draft</Badge>
}

export function Private() {
  return <Badge>Private</Badge>
}

export function Featured() {
  return <Badge>Featured</Badge>
}

export function Row() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge>Draft</Badge>
      <Badge>Scheduled</Badge>
      <Badge>Private</Badge>
      <Badge>Featured</Badge>
    </div>
  )
}
