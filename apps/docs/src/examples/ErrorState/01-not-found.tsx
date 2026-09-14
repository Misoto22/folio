import { ERROR_ACTION_CLASS, ErrorState } from '@misoto22/folio'

/**
 * The page that could not be shown. Render it instead of the page rather than
 * inside it: it is a full viewport with its own ground and its own top
 * clearance, so nested in a layout that already has a header it adds a second
 * screen of blank below the fold — the examples here pass min-h-0 to fit the
 * canvas, and level={2} because this page's own h1 sits above them. code sits
 * at the top of the type ladder and is aria-hidden, so the heading immediately
 * after has to say the same thing in words. There is no
 * live region either, so a route that swaps the whole screen for this changes
 * everything a sighted reader can see and says nothing at all.
 */
export function Example() {
  return (
    <ErrorState
      className="min-h-0 pt-0"
      level={2}
      code="404"
      heading="Page not found"
      message="The page you're looking for has moved, or never existed."
      action={<a href="/" className={ERROR_ACTION_CLASS}>Back home</a>}
    />
  )
}
