import { Button } from '@misoto22/folio'

export function Primary() {
  return <Button>Publish post</Button>
}

export function Secondary() {
  return <Button variant="secondary">Save draft</Button>
}

export function WithKeycap() {
  return <Button keycap="S">Save</Button>
}

export function Pair() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="secondary">Cancel</Button>
      <Button>Publish</Button>
    </div>
  )
}

export function AsLink() {
  return (
    <Button href="https://misoto22.com" variant="secondary">
      View on site
    </Button>
  )
}

export function Disabled() {
  return <Button disabled>Publishing…</Button>
}
