import { Markdown } from '@misoto22/folio'

const ANSWER = `Use \`Tag\` for the facets and keep the button outside it, so the
padding stays on the chip and the target stays on the control.

1. Wrap each tag in a real button
2. Pass \`aria-pressed\` in the same breath as \`active\`
3. Leave one facet off, so the accent still means something

\`\`\`tsx
<button type="button" aria-pressed={on} onClick={toggle}>
  <Tag active={on}>Rust</Tag>
`

/**
 * A model's answer, cut off mid-fence by a token limit — which renders as a
 * code block rather than as an exception, because an unclosed fence runs to the
 * end of the document exactly as CommonMark says. Nothing here is a document,
 * so there is no Article: the fragment goes straight into the box the thread
 * already has, and that box supplies the gap, since Markdown renders no element
 * of its own and every paragraph it makes is margin: 0.
 */
export function Example() {
  return (
    <div className="flex max-w-prose flex-col gap-4">
      <Markdown headingLevelStart={4}>{ANSWER}</Markdown>
    </div>
  )
}
