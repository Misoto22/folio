'use client'

import { Alert, Button, toast } from '@misoto22/folio'

/**
 * The same failure twice: once in the page, once on a timer. Nothing a reader
 * must act on belongs in the one that vanishes — four seconds is a deadline
 * they were never told about, and the close button lives in a portal at the end
 * of body that a keyboard reaches last. Nothing they must read twice belongs
 * there either: there is no history, so once the timer expires the reference is
 * out of the DOM and unrecoverable. Press the button and watch the number go;
 * the Alert above it is still there, and still says what to do.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert tone="danger" title="Payment declined">
        The card was declined. Quote reference pay_4Kd91 when you call the bank.
      </Alert>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error('The card was declined. Quote reference pay_4Kd91 when you call the bank.')
        }
      >
        The same message as a toast
      </Button>
    </div>
  )
}
