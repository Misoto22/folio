import { AspectRatio, Text } from '@misoto22/folio'

const RATIOS = ['16 / 9', '4 / 3', '1 / 1']

/**
 * Three boxes that know their height before anything is inside them. Each child
 * here has no intrinsic size at all — it is an empty div — and the box holds
 * open anyway, because every direct child is taken out of flow and stretched to
 * fill it. That is the whole mechanism: nothing inside can contribute a height,
 * so nothing inside can break the ratio.
 */
export function Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {RATIOS.map((ratio) => (
        <div key={ratio} className="flex flex-col gap-2">
          <AspectRatio
            ratio={ratio}
            className="rounded-(--radius) border border-(--rule-2) bg-(--stone)"
          >
            <div />
          </AspectRatio>
          <Text as="span" size="xs" tone="muted" className="font-mono">
            {ratio}
          </Text>
        </div>
      ))}
    </div>
  )
}
