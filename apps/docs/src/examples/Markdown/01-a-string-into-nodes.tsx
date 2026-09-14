import { Article, Markdown } from '@misoto22/folio'

const SOURCE = `# Release notes

The parser covers the subset this system styles: headings, prose, \`code\`,
**strong**, [links](/changelog), lists and fences. A link pointing at a scheme
that is not http, https, mailto or tel renders as text instead.

- One rung of the ink ladder per tone
- A hairline dash for a marker, never a filled disc

> Depth is a hairline and a change of ground, never a blur.

\`\`\`bash
pnpm add @misoto22/folio
\`\`\`
`

/**
 * A string nobody on this side wrote, rendered as the system's own components —
 * no dangerouslySetInnerHTML anywhere in the path, so there is no sanitiser to
 * configure and none to get wrong. headingLevelStart is 2 because this sits
 * under the page's own headings, and the ids the headings get are slugged from
 * their text so a table of contents can link into them. Article is the reading
 * column; Markdown makes the nodes that sit in it, which is why it renders no
 * element of its own.
 */
export function Example() {
  return (
    <Article>
      <Markdown headingLevelStart={2}>{SOURCE}</Markdown>
    </Article>
  )
}
