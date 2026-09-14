'use client'

import { Field, Input, Select, SelectItem, Textarea } from '@misoto22/folio'

/**
 * The four shapes a row takes: required, wrong, a control that has to name
 * itself, and a longer answer. hint and error are one slot rather than two
 * stacked messages — when a field is wrong, the thing to read is what is wrong
 * with it, so the hint steps aside instead of queueing under the error. The
 * Region row says Region twice on purpose: Radix's select root renders no DOM
 * node, so the label binds to nothing and the control's own label prop is the
 * only name it has.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Field label="Email" required hint="We never share it.">
        <Input type="email" placeholder="you@example.com" />
      </Field>
      <Field label="Full name" error="Name is required.">
        <Input />
      </Field>
      <Field label="Region">
        <Select label="Region" defaultValue="au">
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="nz">New Zealand</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
        </Select>
      </Field>
      <Field label="Notes" hint="Markdown is fine.">
        <Textarea rows={3} placeholder="Anything else?" />
      </Field>
    </div>
  )
}
