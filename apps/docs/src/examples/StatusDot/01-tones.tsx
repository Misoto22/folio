import { StatusDot } from '@misoto22/folio'

/**
 * The four tones, each next to the word that names it. The dot is aria-hidden
 * without exception, so the tone is the one part of this component assistive
 * tech never sees and the label has to carry the state on its own — an
 * aria-label on the dot buys nothing, because a hidden element has no name to
 * give. Only the live one pulses; everything settled sets pulse to false.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-(--ink-2)">
      <span className="inline-flex items-center gap-2"><StatusDot /> Live</span>
      <span className="inline-flex items-center gap-2"><StatusDot tone="warning" pulse={false} /> Degraded</span>
      <span className="inline-flex items-center gap-2"><StatusDot tone="danger" pulse={false} /> Down</span>
      <span className="inline-flex items-center gap-2"><StatusDot tone="neutral" pulse={false} /> Idle</span>
    </div>
  )
}
