import { Field, Input } from '@misoto22/folio'

/**
 * The same idea locked two ways. readOnly keeps the field in the tab order and
 * in the submitted form data; disabled takes it out of both, so the server
 * hears nothing about a field the reader can plainly see — reach for readOnly
 * whenever the value is real but not editable. Nothing styles readOnly here:
 * the control dims on :disabled only, so a read-only field is pixel-identical
 * to an editable one and the hint has to say so. A Tooltip cannot fill that gap
 * on the disabled row either, because a disabled input receives no hover.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field
        label="Workspace address"
        htmlFor="workspace-host"
        hint="Fixed at sign-up. Copy it, but it cannot be edited here."
      >
        <Input id="workspace-host" name="workspace" readOnly defaultValue="studio-nine.example.com" />
      </Field>
      <Field
        label="Seats"
        htmlFor="workspace-seats"
        hint="Locked while an invoice is outstanding — this one sends nothing on submit."
      >
        <Input id="workspace-seats" disabled defaultValue="24" />
      </Field>
    </div>
  )
}
