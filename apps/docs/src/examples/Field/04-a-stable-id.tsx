'use client'

import { Button, Field, Input } from '@misoto22/folio'

/**
 * htmlFor, and the same id on the control. Leave it off and the field generates
 * a useId value — a string nothing outside the row can predict — so a form
 * library, a test, or the button below has no way to reach the input that
 * failed. Pass it whenever something outside the row has to address the
 * control; inside the row, the generated id is already doing its job.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Email" htmlFor="checkout-email" hint="The receipt goes here.">
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          defaultValue="maya.chen@studio.example"
        />
      </Field>
      <Field label="Postcode" htmlFor="checkout-postcode" error="Enter a four-digit postcode.">
        <Input
          id="checkout-postcode"
          inputMode="numeric"
          autoComplete="postal-code"
          defaultValue="20o0"
        />
      </Field>
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => document.getElementById('checkout-postcode')?.focus()}
      >
        Jump to the first error
      </Button>
    </div>
  )
}
