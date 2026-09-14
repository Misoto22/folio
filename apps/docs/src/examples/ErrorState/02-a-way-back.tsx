import { ERROR_ACTION_CLASS, ErrorState } from '@misoto22/folio'

/**
 * action is required rather than optional, because it is the only focusable
 * thing on the screen — and it has to point at a real destination rather than
 * at history. A reader arrives at an error page cold or from someone else's
 * link at least as often as they arrive from the app, so going back returns
 * them to the page that just failed, or to nothing. Two links are about the
 * most this should carry: the way home, and the page that says whether it is
 * only them.
 */
export function Example() {
  return (
    <ErrorState
      className="min-h-0 pt-0"
      level={2}
      code="500"
      heading="Something went wrong at our end"
      message="The request reached us and failed while it was being handled. Nothing you sent was lost."
      action={
        <div className="flex flex-wrap items-center gap-6">
          <a href="/" className={ERROR_ACTION_CLASS}>Back to the dashboard</a>
          <a href="/status" className={ERROR_ACTION_CLASS}>Service status</a>
        </div>
      }
    />
  )
}
