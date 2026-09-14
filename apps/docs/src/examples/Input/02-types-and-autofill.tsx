import { Field, Input } from '@misoto22/folio'

/**
 * type, inputMode and autoComplete, spelled out on every row. An Input that
 * says nothing is type="text": the email field then gets a phone keyboard with
 * no @ on it and no browser validation at all, and a password field that never
 * says current-password is one a manager fills with the wrong value and no
 * browser offers to save. The mobile row is type="tel" rather than
 * type="number" — number is for quantities, and it drops a leading zero and
 * changes value under a scroll wheel.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Email" htmlFor="signin-email">
        <Input
          id="signin-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="maya.chen@studio.example"
        />
      </Field>
      <Field label="Password" htmlFor="signin-password">
        <Input id="signin-password" type="password" autoComplete="current-password" />
      </Field>
      <Field label="Mobile" htmlFor="signin-mobile" hint="Australian numbers keep their leading zero.">
        <Input
          id="signin-mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="0412 345 678"
        />
      </Field>
    </div>
  )
}
