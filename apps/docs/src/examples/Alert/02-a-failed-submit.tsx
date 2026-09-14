import { Alert, Button, Field, Input } from '@misoto22/folio'

/**
 * An error that has to persist, with the way out inside it. Put the retry in
 * action rather than describing it in the prose: action sits inside the live
 * region, which is the difference between the announcement telling the reader
 * what to do and merely telling them something is wrong. Mount the Alert when
 * there is something to say and unmount it when there is not — a region kept
 * permanently in the page announces only when its words change, so a second
 * failed submit carrying the same message is announced to nobody. Move focus to
 * it, or to the field it names: it announces and then stays put, so a keyboard
 * reader hears the error from wherever they were standing.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Alert
        tone="danger"
        title="We could not send the invitation"
        action={<Button size="sm" variant="secondary">Try again</Button>}
      >
        The address bounced when we checked it.
      </Alert>
      <Field label="Email" error="Enter an address we can deliver to.">
        <Input defaultValue="henry@exmaple.com" />
      </Field>
    </div>
  )
}
