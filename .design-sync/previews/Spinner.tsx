import { Spinner } from '@misoto22/folio'

export function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner size="sm" label="Loading posts" />
      <Spinner size="md" label="Loading posts" />
      <Spinner size="lg" label="Loading posts" />
    </div>
  )
}

export function WithLabel() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Spinner size="sm" label="Saving draft" />
      <span style={{ color: 'var(--secondary-text)' }}>Saving…</span>
    </span>
  )
}
