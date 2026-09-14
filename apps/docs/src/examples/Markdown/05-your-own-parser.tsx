import { Article, Markdown, parseMarkdown, type MarkdownNode } from '@misoto22/folio'

const CHECKLIST = `## Before 0.5.0

- [x] Tokens rebuilt from the CSS source
- [x] Every example carries the sentence that explains it
- [ ] Chinese copy for the five newest components
`

/** Checked and unchecked boxes, as marks the built-in grammar understands. */
function withTaskMarks(source: string): MarkdownNode[] {
  return parseMarkdown(
    source.replace(/^(\s*[-*+] )\[x\] /gim, '$1✓ ').replace(/^(\s*[-*+] )\[ \] /gm, '$1○ '),
  )
}

/**
 * Task lists are not in the built-in grammar, so a bracketed x arrives as
 * literal text and nothing else happens — quiet rather than broken, which is
 * the shape every unsupported feature takes here. parse is the seam: any
 * function from a string to MarkdownNode values, so it takes a whole pipeline
 * (markdown-it, remark, an AST you already have) or, as here, a rewrite of the
 * one thing the grammar does not know before the parser that ships handles the
 * rest.
 */
export function Example() {
  return (
    <Article>
      <Markdown parse={withTaskMarks} headingLevelStart={3}>{CHECKLIST}</Markdown>
    </Article>
  )
}
