import { Code, ERROR_ACTION_CLASS, ErrorState } from '@misoto22/folio'

/**
 * Where the reference goes: in the message, never in code. code is set at
 * --fs-title with leading-none and it is aria-hidden, so a request id put there
 * becomes the largest object on the page and is at the same time invisible to
 * the reader most likely to have to quote it down a phone line. Three
 * characters is what that slot is sized for; the id belongs in the sentence,
 * where it is selectable, copyable and read out with the rest of the
 * explanation.
 */
export function Example() {
  return (
    <ErrorState
      className="min-h-0 pt-0"
      level={2}
      code="500"
      heading="We could not load this deploy"
      message={
        <>
          The build service timed out. Quote <Code>req_8f31c0</Code> if you report it — it
          identifies this request.
        </>
      }
      action={<a href="/support" className={ERROR_ACTION_CLASS}>Contact support</a>}
    />
  )
}
