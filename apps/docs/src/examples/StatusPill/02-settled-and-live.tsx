import { StatusPill } from '@misoto22/folio'

/**
 * Every tone, with the pulse spent on the one state that is actually happening.
 * The halo means "right now", so an archived or shipped pill left pulsing tells
 * the reader something is live when nothing is. The pill is also a plain span
 * and not a live region: a state that flips from Live to Degraded while the
 * reader is on the page changes silently unless the call site wraps it in
 * role="status".
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill>Live</StatusPill>
      <StatusPill tone="warning" pulse={false}>Degraded</StatusPill>
      <StatusPill tone="danger" pulse={false}>Incident open</StatusPill>
      <StatusPill tone="neutral" pulse={false}>Archived</StatusPill>
    </div>
  )
}
