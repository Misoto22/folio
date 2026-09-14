import { Heading, Text } from '@misoto22/folio'

/**
 * The one place lead belongs: the standfirst that carries a piece, directly
 * under its title. It is --fs-item, the bottom rung of the heading ladder, and
 * the ladder is where it stops — a paragraph larger than a record title is a
 * heading that has not admitted it, and a p at that size is invisible to the
 * heading list a screen reader navigates by. The gaps here come from the
 * column, because every Text is margin: 0.
 */
export function Example() {
  return (
    <div className="flex max-w-prose flex-col gap-3">
      <Heading level={2}>The White Reset</Heading>
      <Text size="lead">
        A monochrome system for software and writing, published as one package
        and one stylesheet.
      </Text>
      <Text>
        Structure is carried by weight, rules and space rather than by colour,
        which leaves the two status hues free to mean something when they appear.
      </Text>
      <Text size="sm" tone="muted">Updated this morning</Text>
    </div>
  )
}
