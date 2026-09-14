import { LinkArrow } from '@misoto22/folio'

/**
 * The mark, inside the anchor and as its last child. Outside it, it is an arrow
 * pointing at a link the pointer misses by 0.22em. The glyph is set in em so it
 * tracks the type beside it rather than competing with it, and it is
 * aria-hidden — nothing is announced by putting it here, so the link's own
 * words still have to say where they go.
 */
export function Example() {
  return (
    <p className="m-0 text-sm text-(--ink-2)">
      <a
        href="https://misoto22.com"
        className="text-(--ink) underline decoration-(--rule-2) underline-offset-4 hover:decoration-(--ink)"
      >
        Read the whole thing
        <LinkArrow />
      </a>
    </p>
  )
}
