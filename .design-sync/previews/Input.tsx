import { Input } from '@misoto22/folio'

export function Empty() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Input placeholder="Post title" />
    </div>
  )
}

export function Filled() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Input defaultValue="Building a private blog" />
    </div>
  )
}

export function Invalid() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Input invalid defaultValue="building a private blog!" />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Input disabled defaultValue="Archived: 2023 retrospective" />
    </div>
  )
}
