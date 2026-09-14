import { Field, NativeSelect } from '@misoto22/folio'

/**
 * An empty first option, disabled, with defaultValue pointing at it. A select
 * nobody touches has its first option selected already, so a list that opens on
 * Australia submits Australia on behalf of a reader who never saw the field.
 * Naming that option “Select a country” only moves the problem: it is announced
 * as a choosable value and it is still what an untouched form sends. The name
 * belongs in the Field. Note that required is on the select as well — Field's
 * own required is the asterisk and aria-required, and never reaches the
 * control's attribute, so it is the one here that makes the browser refuse the
 * submit.
 */
export function Example() {
  return (
    <Field
      label="Country"
      required
      hint="Where the invoice is issued from."
      className="w-full max-w-xs"
    >
      <NativeSelect defaultValue="" required>
        <option value="" disabled>
          Select a country
        </option>
        <option value="au">Australia</option>
        <option value="jp">Japan</option>
        <option value="nz">New Zealand</option>
        <option value="sg">Singapore</option>
      </NativeSelect>
    </Field>
  )
}
