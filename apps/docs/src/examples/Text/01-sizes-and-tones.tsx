import { Text } from '@misoto22/folio'

/**
 * Four steps of type against three rungs of ink. The default is base on body,
 * which is --ink-2 rather than --ink on purpose: a page whose paragraphs are
 * all full-strength ink has spent the top of the ladder on its body copy and
 * has nothing left for the headings. Every Text has margin: 0, so the gap
 * between these comes from the container, not from the paragraph.
 */
export function Example() {
  return (
    <div className="flex max-w-prose flex-col gap-4">
      <Text size="lead" tone="strong">
        A monochrome system for software and writing.
      </Text>
      <Text>
        Body copy at the base step, on the second rung of the ink ladder. Use{' '}
        <Text as="span" tone="strong">
          strong
        </Text>{' '}
        for a run that has to carry, and nothing above lead.
      </Text>
      <Text size="sm" tone="muted">
        Updated just now — the muted rung is --ink-3-aa, which clears AA on any
        ground in the system.
      </Text>
    </div>
  )
}
