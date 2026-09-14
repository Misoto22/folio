'use client'

import { Button, Toaster, toast } from '@misoto22/folio'

/**
 * The three types, and the single Toaster they all reach. Mount exactly one,
 * near the app root: every toast call reaches every Toaster listening, so a
 * second one in a nested layout renders the same message twice, in two corners.
 * The region is aria-live polite for every type — there is no assertive path
 * here — so a failure reported with toast.error queues behind whatever the
 * screen reader was already saying, and can be removed by the timer before its
 * turn comes. Report failures in the page as well.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button variant="secondary" onClick={() => toast('Draft saved')}>Neutral</Button>
      <Button variant="secondary" onClick={() => toast.success('Deployed to production')}>Success</Button>
      <Button variant="secondary" onClick={() => toast.error('Could not reach the API')}>Error</Button>
    </div>
  )
}
