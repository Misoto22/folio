import { Heading, Text } from '@misoto22/folio'

/**
 * Two headings a table of contents can link into. Every Heading carries
 * scroll-margin-top: var(--scroll-offset), so one given an id comes to rest
 * below the masthead rather than under it — nothing else on a page does that,
 * which is why an anchor into a hand-rolled h2 lands with its own title hidden
 * behind the bar. The id is the caller's, and it has to be stable: it is what
 * every link to this section already says.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Section links" className="flex flex-col gap-1">
        <a href="#installation" className="text-sm text-(--ink-2) underline decoration-(--rule-2) underline-offset-4">
          Installation
        </a>
        <a href="#upgrading" className="text-sm text-(--ink-2) underline decoration-(--rule-2) underline-offset-4">
          Upgrading
        </a>
      </nav>
      <Heading level={2} id="installation">Installation</Heading>
      <Text size="sm">One package, and one stylesheet next to it.</Text>
      <Heading level={2} id="upgrading">Upgrading</Heading>
      <Text size="sm">Minor versions add exports; they never move one.</Text>
    </div>
  )
}
