import { Code, Kbd, Text } from '@misoto22/folio'

/**
 * The two chips a reader cannot tell apart by eye, in one sentence each. Code
 * is a literal the machine reads and a person types out; Kbd is a key they
 * press. The choice is entirely about meaning, because the elements are
 * announced differently — and a code chip shaped like a key invites a press
 * nothing answers.
 */
export function Example() {
  return (
    <div className="flex max-w-prose flex-col gap-3">
      <Text size="sm">
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the palette, then type{' '}
        <Code>Markdown</Code> to reach the component.
      </Text>
      <Text size="sm">
        The flag is <Code>--force</Code>; the key that cancels the run is <Kbd>Esc</Kbd>.
      </Text>
    </div>
  )
}
