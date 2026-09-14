import { Avatar, Text } from '@misoto22/folio'

/**
 * The arrangement that makes the avatar readable: the name printed next to it.
 * alt is deliberately empty here because the text beside it already says who
 * this is — and alt only reaches the DOM when src does, while the initials are
 * aria-hidden, so a person with no photograph has no accessible text in this
 * circle at all, however carefully alt was written.
 */
export function Example() {
  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      <li className="flex items-center gap-3">
        <Avatar alt="" fallback="HC" />
        <div className="flex flex-col">
          <Text as="span" size="sm" tone="strong">Henry Chen</Text>
          <Text as="span" size="xs" tone="muted">Design systems</Text>
        </div>
      </li>
      <li className="flex items-center gap-3">
        <Avatar alt="" fallback="RW" />
        <div className="flex flex-col">
          <Text as="span" size="sm" tone="strong">Rui Wang</Text>
          <Text as="span" size="xs" tone="muted">Infrastructure</Text>
        </div>
      </li>
    </ul>
  )
}
