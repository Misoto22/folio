import { Tag } from '@misoto22/folio'

export function Single() {
  return <Tag>rust</Tag>
}

export function Row() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag>nextjs</Tag>
      <Tag>typescript</Tag>
      <Tag>self-hosting</Tag>
    </div>
  )
}
