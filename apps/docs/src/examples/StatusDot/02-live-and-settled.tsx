import { StatusDot } from '@misoto22/folio'

/**
 * The same tone, twice: pulsing means something is happening right now, and it
 * is the default — so a dot for a build that finished, or a status that will
 * not change today, announces work that is not being done unless pulse is set
 * to false. The halo is motion-safe, so a reader who asked for less motion gets
 * the still dot either way.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-3 text-sm text-(--ink-2)">
      <span className="inline-flex items-center gap-2">
        <StatusDot /> Deploying 0.4.1 to production
      </span>
      <span className="inline-flex items-center gap-2">
        <StatusDot pulse={false} /> Deployed 0.4.0, fourteen minutes ago
      </span>
    </div>
  )
}
