import { AspectRatio, Text } from '@misoto22/folio'

const NOTE =
  'Adds the five diagram renderers, the canvas chrome around them, and a share-card export at 1200 by 630. The specification types mirror archify, so a document authored for that tool renders here with no translation step.'

/**
 * What the box does when the content does not fit, which is the trade nobody
 * reads about until it bites. Every direct child is taken out of flow and the
 * wrapper hides its overflow, so content longer than the box is CLIPPED rather
 * than allowed to push the height — the ratio was the promise, and it is the
 * promise kept. Where the words have to be readable, give the child its own
 * scroll, as the second box does; where they do not, reach for a box that can
 * grow instead of one that cannot.
 */
export function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <AspectRatio ratio="16 / 9" className="rounded-(--radius) border border-(--rule-2)">
          <Text size="sm" className="p-3">
            {NOTE}
          </Text>
        </AspectRatio>
        <Text as="span" size="xs" tone="muted" className="font-mono">
          clipped
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <AspectRatio ratio="16 / 9" className="rounded-(--radius) border border-(--rule-2)">
          <div className="overflow-y-auto p-3 scroll-slim">
            <Text size="sm">{NOTE}</Text>
          </div>
        </AspectRatio>
        <Text as="span" size="xs" tone="muted" className="font-mono">
          overflow-y-auto on the child
        </Text>
      </div>
    </div>
  )
}
