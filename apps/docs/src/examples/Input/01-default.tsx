import { Input } from '@misoto22/folio'

/**
 * Resting, invalid, disabled. invalid paints the border with --danger and sets
 * aria-invalid, and that is all it does — the border says something is wrong
 * and never what, so an invalid input outside a Field with an error message is
 * a red box with no reason attached. Each of these carries aria-label because
 * it stands alone here; in a form that is Field's job, and a placeholder is
 * never the name because it leaves the moment anyone types.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input placeholder="Resting" aria-label="Resting" />
      <Input invalid defaultValue="not-an-email" aria-label="Invalid" />
      <Input disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  )
}
