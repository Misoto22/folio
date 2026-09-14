import { Heading, Kbd, Text } from '@misoto22/folio'

/**
 * The same key, printed at three steps of type. The cap is 0.8em and its
 * padding is in em too, so it takes its size from whatever it sits beside — one
 * component that is right in a heading, in body copy and in a caption. Pinned
 * to a pixel value it is correct in exactly one of them, which is how a single
 * shortcut ended up three sizes on one page.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={3}>
        Press <Kbd>/</Kbd> to search
      </Heading>
      <Text>
        The same <Kbd>/</Kbd> works from anywhere on the page.
      </Text>
      <Text size="xs" tone="muted">
        Shortcut: <Kbd>/</Kbd>
      </Text>
    </div>
  )
}
