import { LinkArrow } from '@misoto22/folio'

/**
 * Three links, one arrow. It marks a CHANGE of destination, so an index where
 * every row carries one marks nothing at all and pays 0.22em a row for it. The
 * outbound link says "opens in a new tab" in its own text, because neither the
 * arrow nor target="_blank" is announced — without those words the glyph is the
 * only warning anyone gets, and only if they can see it.
 */
export function Example() {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-(--ink-2)">
      <li>
        <a href="#tokens" className="text-(--ink) underline decoration-(--rule-2) underline-offset-4">
          Tokens, further down this page
        </a>
      </li>
      <li>
        <a href="#changelog" className="text-(--ink) underline decoration-(--rule-2) underline-offset-4">
          What changed in 0.4.0
        </a>
      </li>
      <li>
        <a
          href="https://www.w3.org/TR/WCAG22/"
          target="_blank"
          rel="noreferrer"
          className="text-(--ink) underline decoration-(--rule-2) underline-offset-4"
        >
          WCAG 2.2 on w3.org, opens in a new tab
          <LinkArrow />
        </a>
      </li>
    </ul>
  )
}
