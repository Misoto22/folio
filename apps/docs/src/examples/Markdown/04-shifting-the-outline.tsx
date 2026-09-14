import { Article, Heading, Markdown, slugify } from '@misoto22/folio'

const SECTIONS = ['Installing', 'Upgrading']

const GUIDE = `# Installing

Add the package, then import the stylesheet once at the root of the app.

# Upgrading

Minor versions add exports and never move one, so an upgrade inside a major
is a version bump and nothing else.
`

/**
 * The same document under a heading that already exists. headingLevelStart is
 * the level BELOW the one it sits under, so the guide's # renders as h3 and
 * every level in it shifts together — dropped in unshifted, it would be a
 * second first-level heading and an outline a screen reader cannot navigate.
 * idPrefix namespaces the generated ids so two documents on one page cannot
 * both claim #installing, and slugify is exported for exactly this: the table
 * of contents arrives at the same ids without reading them back off the DOM.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={2}>Getting started</Heading>
      <nav aria-label="Section links" className="flex flex-col gap-1">
        {SECTIONS.map((section) => (
          <a
            key={section}
            href={`#guide-${slugify(section)}`}
            className="text-sm text-(--ink-2) underline decoration-(--rule-2) underline-offset-4"
          >
            {section}
          </a>
        ))}
      </nav>
      <Article>
        <Markdown headingLevelStart={3} idPrefix="guide">{GUIDE}</Markdown>
      </Article>
    </div>
  )
}
