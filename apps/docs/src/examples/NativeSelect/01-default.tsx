import { Field, NativeSelect } from '@misoto22/folio'

/**
 * The platform's own picker, restyled as far as it can be: appearance-none
 * drops the operating system's arrow and the chevron beside it is ours, so it
 * does not flip or move when the list opens. What it cannot do is look like the
 * system once open — the options are drawn by the OS and carry none of these
 * tokens, which is why this is the escape hatch and Select is the default.
 * Reach for it where the platform genuinely wins: a very long list on a phone,
 * a form that must work without JavaScript, a page counting its last kilobyte.
 */
export function Example() {
  return (
    <Field
      label="Density"
      hint="The platform's own picker — better on a phone, and it works without JavaScript."
      className="w-full max-w-xs"
    >
      <NativeSelect defaultValue="mid">
        <option value="tight">Tight</option>
        <option value="mid">Comfortable</option>
        <option value="loose">Loose</option>
      </NativeSelect>
    </Field>
  )
}
