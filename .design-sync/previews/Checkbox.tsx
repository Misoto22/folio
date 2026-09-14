import { Checkbox } from '@misoto22/folio'

export function Checked() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
      <Checkbox defaultChecked /> Feature on homepage
    </label>
  )
}

export function Unchecked() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
      <Checkbox /> Send newsletter
    </label>
  )
}

export function Group() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
        <Checkbox defaultChecked /> Feature on homepage
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
        <Checkbox /> Send newsletter
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
        <Checkbox defaultChecked /> Allow comments
      </label>
    </div>
  )
}
