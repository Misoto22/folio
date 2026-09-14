import { Article, Markdown } from '@misoto22/folio'

const REPLY = `## Why the tokens ship as CSS

Because a consumer that already compiles Tailwind should not have to run our
build to get \`--ink\`. The three portable layers — tokens, semantic, keyframes —
are importable on their own:

\`\`\`ts
import '@misoto22/folio/tokens.css'
\`\`\`

- The compiled bundle is for an app with no build of its own
- The layers are for one that has
`

/**
 * Prose this side wrote, then a string it did not, in one column. Markdown
 * renders a FRAGMENT rather than a wrapper, which is exactly what makes this
 * work: Article's rhythm is a direct-child combinator, so anything between the
 * two would cost every block its spacing. It is also the safe half of the pair
 * — Markdown parses to components with no dangerouslySetInnerHTML in the path,
 * where Article's html prop sets innerHTML and is for trusted markup only.
 * headingLevelStart is 2 because the column already opens on a heading; left at
 * its default the comment's own # would be a second first-level heading.
 */
export function Example() {
  return (
    <Article>
      <h2>Notes from the review</h2>
      <p>
        One question came back on the packaging, and the answer is worth keeping
        with the code rather than in the thread it was asked in.
      </p>
      <Markdown headingLevelStart={2} idPrefix="reply">
        {REPLY}
      </Markdown>
    </Article>
  )
}
