import { NavItem } from '@misoto22/folio'
import { RiPaletteLine, RiShapesLine, RiText } from '@remixicon/react'

/**
 * A sidebar column with one current row. active is three signals in one move —
 * a --stone fill, medium weight and aria-current="page" — so the row survives
 * monochrome printing and low contrast, where a colour on its own would not.
 * The icon is aria-hidden and contributes nothing to the name; children are the
 * whole accessible name of the row. Derive active from the router's current
 * path rather than from the last click, or a sidebar tracking its own clicks
 * tells a reader they are on the row they pressed instead of the page they are
 * actually on.
 */
export function Example() {
  return (
    <nav className="flex w-56 flex-col gap-1" aria-label="Example">
      <NavItem href="#" icon={RiShapesLine} active>Components</NavItem>
      <NavItem href="#" icon={RiPaletteLine}>Colour</NavItem>
      <NavItem href="#" icon={RiText}>Typography</NavItem>
    </nav>
  )
}
