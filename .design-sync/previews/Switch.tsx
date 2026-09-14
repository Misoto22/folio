import { Switch } from '@misoto22/folio'

export function On() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--foreground)' }}>
      <Switch defaultChecked /> Publish immediately
    </label>
  )
}

export function Off() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--foreground)' }}>
      <Switch /> Private post
    </label>
  )
}

export function Group() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--foreground)' }}>
        <Switch defaultChecked /> Publish immediately
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--foreground)' }}>
        <Switch /> Private post
      </label>
    </div>
  )
}
