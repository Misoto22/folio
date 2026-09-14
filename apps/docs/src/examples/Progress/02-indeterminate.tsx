import { Progress, Text } from '@misoto22/folio'

/**
 * No value, so the bar sweeps instead of filling and aria-valuenow is dropped —
 * a screen reader is told indeterminate rather than a number that is a guess.
 * The value row only renders when value is a number, so the sweeping bar prints
 * nothing at all and the name has to be on the page some other way, as it is
 * here. Do not leave one of these up indefinitely: under prefers-reduced-motion
 * the sweep rests as a full-width bar at 40% opacity, which is the shape of a
 * bar that has finished, and a reader who asked for less motion is then looking
 * at something that says it is done.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Text size="sm" tone="strong">
        Rebuilding the search index
      </Text>
      <Progress label="Rebuilding the search index" />
      <Text size="xs" tone="muted">
        Started 40 seconds ago. No estimate yet.
      </Text>
    </div>
  )
}
