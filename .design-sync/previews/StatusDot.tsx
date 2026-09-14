import { StatusDot } from '@misoto22/folio'

export function PulsingMd() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <StatusDot size="md" pulse />
      <span style={{ color: 'var(--secondary-text)' }}>Live now</span>
    </span>
  )
}

export function Static() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <StatusDot size="md" pulse={false} />
      <span style={{ color: 'var(--secondary-text)' }}>Published</span>
    </span>
  )
}

export function Small() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <StatusDot size="sm" pulse />
      <span style={{ color: 'var(--secondary-text)' }}>Syncing drafts</span>
    </span>
  )
}
