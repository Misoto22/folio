'use client'

import { Field, Select, SelectItem } from '@misoto22/folio'

/**
 * The one control on this base that does not read aria-invalid. Field's error
 * paints Input, Textarea and NativeSelect on its own, because all three read
 * either spelling — the Select trigger looks only at invalid, so a row given
 * the error and nothing else ends up with a red message under a resting border.
 * Pass both. Note the placeholder rather than a defaultValue: a select that
 * opens already answered is one nobody has actually answered.
 */
export function Example() {
  return (
    <Field label="Plan" required error="Choose a plan before inviting your team." className="w-full max-w-xs">
      <Select label="Plan" invalid placeholder="Select a plan">
        <SelectItem value="solo">Solo — one seat</SelectItem>
        <SelectItem value="studio">Studio — ten seats</SelectItem>
        <SelectItem value="agency">Agency — unlimited seats</SelectItem>
      </Select>
    </Field>
  )
}
