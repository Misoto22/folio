import { StatusPill } from '@misoto22/folio'

export function Published() {
  return <StatusPill>Published</StatusPill>
}

export function Draft() {
  return <StatusPill pulse={false}>Draft</StatusPill>
}

export function Pair() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <StatusPill>Live</StatusPill>
      <StatusPill pulse={false}>Archived</StatusPill>
    </div>
  )
}
