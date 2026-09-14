import { Text } from '@misoto22/folio'

/**
 * as changes the element and nothing else. Inside a sentence that has to be
 * span: a p nested in a p is not nesting — the HTML parser closes the outer one
 * and leaves two paragraphs and a broken layout. Inside a list someone else
 * opened it is li, so the markup says what the content is while the type stays
 * exactly where the size and tone put it.
 */
export function Example() {
  return (
    <div className="flex max-w-prose flex-col gap-4">
      <Text>
        The release went out at 09:14.{' '}
        <Text as="span" tone="strong">Twelve deploys</Text> since the rewrite, and{' '}
        <Text as="span" tone="muted">no rollbacks</Text>.
      </Text>
      <ul className="m-0 flex list-none flex-col gap-1 ps-0">
        <Text as="li" size="sm">Tokens rebuilt from the CSS source</Text>
        <Text as="li" size="sm">Every example carries the sentence that explains it</Text>
        <Text as="li" size="sm">Chinese copy still owed for the newest five</Text>
      </ul>
    </div>
  )
}
