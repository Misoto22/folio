import { Button } from '@misoto22/folio'

/**
 * The four variants, in the order they compete for attention. variant defaults
 * to primary, so keep one to a view and give every other control secondary or
 * ghost; danger is a state rather than emphasis, and spending it on the merely
 * important leaves nothing that reads as destructive when something is.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  )
}
