import { Article, Markdown } from '@misoto22/folio'

const README = `# @misoto22/folio

A monochrome design system, published as one package and one stylesheet.

## Install

\`\`\`bash
pnpm add @misoto22/folio
\`\`\`

Then import the compiled look once, at the root of the app:

1. \`@misoto22/folio/styles.css\` — tokens, fonts and the compiled utilities
2. Or the portable layers on their own:
   - \`tokens.css\` for the primitives
   - \`semantic.css\` for the roles

Everything exported from the package is a [consumer contract](/changelog):
adding an export is cheap, and moving one is a major version.
`

/**
 * A README, straight off a repository, rendered as this system's own
 * components. Nested lists, an ordered list, a fence with its language, inline
 * code and a link all come out of the built-in parser, and none of it goes
 * through dangerouslySetInnerHTML — the nodes are React elements, so there is
 * no sanitiser to configure and none to get wrong. headingLevelStart is 2
 * because the document's own # would otherwise be a second h1 on this page.
 */
export function Example() {
  return (
    <Article>
      <Markdown headingLevelStart={2}>{README}</Markdown>
    </Article>
  )
}
