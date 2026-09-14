import { DiagramLegend, kindLegend, stateLegend } from '@misoto22/folio/diagrams'

/**
 * Two of the sets the renderers build for themselves. kindLegend draws each
 * sigil with the same component the plates draw it with, and labels it with the
 * same word the plate’s eyebrow prints, so a key and the figure above it cannot
 * drift apart; stateLegend draws each state as the plate itself, colour and dash
 * included. title defaults to Key, which is why the second one is renamed — two
 * keys stacked in a column and both headed Key say nothing about which is which.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-6">
      <DiagramLegend entries={kindLegend(['frontend', 'backend', 'database', 'messagebus', 'security'])} />
      <DiagramLegend title="States" entries={stateLegend(['start', 'active', 'decision', 'success', 'failure'])} />
    </div>
  )
}
