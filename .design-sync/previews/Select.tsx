import { Select } from '@misoto22/folio'

export function Category() {
  return (
    <div style={{ maxWidth: 280 }}>
      <Select defaultValue="engineering">
        <option value="engineering">Engineering</option>
        <option value="design">Design</option>
        <option value="personal">Personal</option>
      </Select>
    </div>
  )
}

export function Status() {
  return (
    <div style={{ maxWidth: 280 }}>
      <Select defaultValue="draft">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="private">Private</option>
      </Select>
    </div>
  )
}
