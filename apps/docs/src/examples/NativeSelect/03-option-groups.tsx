import { Field, NativeSelect } from '@misoto22/folio'

/**
 * optgroup is the one piece of structure the operating system's picker actually
 * renders, and there is no styled fallback the way SelectLabel gives Select
 * one — so it is how a long native list stays scannable. The width comes from
 * the parent, not from className: className lands on the select itself while
 * the chevron is positioned against the wrapper around it, so a field narrowed
 * that way leaves its own arrow stranded at the far edge of the row.
 */
export function Example() {
  return (
    <Field label="Time zone" className="w-full max-w-xs">
      <NativeSelect defaultValue="Australia/Sydney">
        <optgroup label="Australia">
          <option value="Australia/Perth">Perth</option>
          <option value="Australia/Adelaide">Adelaide</option>
          <option value="Australia/Sydney">Sydney</option>
        </optgroup>
        <optgroup label="Asia">
          <option value="Asia/Singapore">Singapore</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </optgroup>
      </NativeSelect>
    </Field>
  )
}
