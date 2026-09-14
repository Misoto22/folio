'use client'

import { Button, toast } from '@misoto22/folio'

/**
 * Four seconds is the default, and four seconds is roughly ten words read
 * aloud: anything longer than a short sentence needs a duration of its own, or
 * the rest of it is removed from the page before it has been read. Keep the
 * message to what happened, too — three toasts are visible at once and the rest
 * queue, so a loop that toasts per item shows the last three and delivers the
 * others after the reader has moved on. There is no Toaster in this example on
 * purpose: the one mounted by the first example on this page is the only one
 * the page should have.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={() => toast('Draft saved')}>
        Four seconds
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast('Draft saved. The version from 14:02 is still in the history if you want it back.', {
            duration: 8000,
          })
        }
      >
        Eight seconds
      </Button>
    </div>
  )
}
