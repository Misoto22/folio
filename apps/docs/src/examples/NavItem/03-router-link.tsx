import { NavItem } from '@misoto22/folio'
import { RiHomeLine, RiShapesLine } from '@remixicon/react'

/**
 * asChild hands the row to a router's own Link — a plain anchor stands in for
 * one here. It forwards the classes and aria-current and nothing else, so
 * repeat href on the child: a link that does not carry its own href is a row
 * that navigates nowhere. Put the icon inside the child too, because the icon
 * prop is not rendered in this mode at all, and a whole sidebar can go out
 * looking like a column of rows with their icons silently dropped. Slot accepts
 * exactly one child, which is why the icon goes inside the link rather than
 * beside it.
 */
export function Example() {
  return (
    <nav className="flex w-56 flex-col gap-1" aria-label="Router example">
      <NavItem asChild href="/">
        <a href="/">
          <RiHomeLine size={18} aria-hidden className="shrink-0" />
          Overview
        </a>
      </NavItem>
      <NavItem asChild href="/components" active>
        <a href="/components">
          <RiShapesLine size={18} aria-hidden className="shrink-0" />
          Components
        </a>
      </NavItem>
    </nav>
  )
}
