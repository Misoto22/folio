import { Heading, Text } from '@misoto22/folio'

/**
 * The two decisions, apart. level is the document outline — what a screen
 * reader navigates by — and size is the page. The default binds them through
 * the system ladder, which SKIPS a step between the first two: --fs-lead over
 * --fs-heading is a ratio of 1.14 and reads as an accident, where --fs-title
 * over --fs-heading is 1.86 and reads as a hierarchy. The mono eyebrow is the
 * ladder's fifth rung, worn here by an h4 so this run does not skip a level in
 * the outline; the last pair is a semantically-correct h3 that had to look
 * like a page title.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-5">
      <Heading level={1}>The White Reset</Heading>
      <Heading level={2}>A record title</Heading>
      <Heading level={3}>A sub-head inside it</Heading>
      <Heading level={4} size="label">
        Metadata
      </Heading>
      <Heading level={3} size="title">
        Third level, page-title sized
      </Heading>
      <Text size="sm" tone="muted">
        The last one is an h3. Nothing about the outline moved.
      </Text>
    </div>
  )
}
