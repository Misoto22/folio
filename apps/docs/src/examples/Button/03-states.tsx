import { Button } from '@misoto22/folio'

/**
 * A control in flight, a control that is off, and a control advertising a
 * shortcut. Reach for loading rather than swapping the label by hand: it holds
 * the label, sets aria-busy and blocks the click in one move, so the box does
 * not collapse under the pointer that just hit it. The keycap is real text and
 * joins the accessible name, so write one only where a key is actually bound.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving…</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary" keycap="P">View projects</Button>
    </div>
  )
}
