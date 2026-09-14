import { Field, Textarea } from '@misoto22/folio'

/**
 * The wrong state, and the reason the message repeats the rule. hint and error
 * share one slot, so a format written only in the hint vanishes the instant the
 * field is wrong — which is the one moment anyone needed it. Field's error is
 * also the whole of the invalid state: it sets aria-invalid on the textarea,
 * which is the spelling the danger border reads, so there is nothing to pass
 * twice.
 */
export function Example() {
  return (
    <Field
      label="Release notes"
      required
      error="Open with a line starting Added, Fixed or Changed — that first word groups the entry in the changelog."
      className="w-full max-w-sm"
    >
      <Textarea rows={4} defaultValue="tidied up the release script a bit" />
    </Field>
  )
}
