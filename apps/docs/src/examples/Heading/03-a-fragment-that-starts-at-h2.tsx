import { Heading, Text } from '@misoto22/folio'

/**
 * A panel dropped into a page that already has its h1. The outline decides
 * level — this opens a section, so it is an h2 and its sub-heads are h3s — and
 * size decides how big it looks, which is the whole reason they are two props.
 * Raising level to reach the larger step would give the page two first-level
 * headings and an outline nobody can navigate, for a difference one prop
 * already covers.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-(--radius-lg) border border-(--rule) bg-(--paper-2) p-5">
      <Heading level={2} size="title">Publish 0.4.1</Heading>
      <div className="flex flex-col gap-2">
        <Heading level={3}>What ships</Heading>
        <Text size="sm">Five display components, and the examples that explain them.</Text>
      </div>
      <div className="flex flex-col gap-2">
        <Heading level={3}>What it breaks</Heading>
        <Text size="sm">Nothing — every export in 0.4.0 is still exported here.</Text>
      </div>
    </div>
  )
}
