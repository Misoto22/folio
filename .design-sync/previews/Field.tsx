import { Field, Input } from '@misoto22/folio'

export function WithHint() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Field label="Post title" htmlFor="post-title" hint="Shown as the page heading">
        <Input id="post-title" defaultValue="Building a private blog" />
      </Field>
    </div>
  )
}

export function Required() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Field label="Slug" htmlFor="post-slug" required hint="Lowercase, used in the URL">
        <Input id="post-slug" defaultValue="building-a-private-blog" />
      </Field>
    </div>
  )
}

export function WithError() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Field label="Slug" htmlFor="post-slug-taken" required error="Slug already taken">
        <Input id="post-slug-taken" invalid defaultValue="building-a-private-blog" />
      </Field>
    </div>
  )
}
