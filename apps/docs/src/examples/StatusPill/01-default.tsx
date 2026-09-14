import { StatusPill } from '@misoto22/folio'

/**
 * The whole pill rather than a dot and a span assembled at the call site, which
 * is how the same "available for work" chip came out at three dot sizes and two
 * pulse timings on one site. tone reaches only the dot and the dot is
 * aria-hidden, so the words have to name the state: "Partial outage" in a
 * warning pill and in a neutral one are the same sentence to anyone who cannot
 * see the colour.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill>Available for work</StatusPill>
      <StatusPill tone="warning" pulse={false}>Partial outage</StatusPill>
    </div>
  )
}
