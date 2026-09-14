import { NavItem } from '@misoto22/folio'
import { RiBookOpenLine, RiFileTextLine, RiLayoutRowLine, RiPaletteLine, RiShapesLine } from '@remixicon/react'

/**
 * Two sections, one aria-current between them. Do not also mark the section a
 * page belongs to: active means aria-current="page", and two of them is a
 * reader told they are in two places at once. A group heading is a label rather
 * than a row — these kickers are not focusable and they do not navigate. Do not
 * tighten the rows either; they sit at --control-h-sm, 36px comfortable and
 * 30px under compact density, and a padding class below that leaves a column of
 * targets a thumb has to aim at.
 *
 * The nav is named for the example rather than for what it depicts. This page
 * is itself served out of a nav named "Documentation", and two landmarks of the
 * same role sharing a name cannot be told apart by anyone navigating by
 * landmark — including axe, which fails the page for it.
 */
export function Example() {
  return (
    <nav className="flex w-56 flex-col gap-5" aria-label="Sectioned example">
      <div className="flex flex-col gap-1">
        <span className="px-3 pb-1 mono-meta text-(--ink-3-aa)">Learn</span>
        <NavItem href="#" icon={RiBookOpenLine}>Getting started</NavItem>
        <NavItem href="#" icon={RiFileTextLine}>Principles</NavItem>
      </div>
      <div className="flex flex-col gap-1">
        <span className="px-3 pb-1 mono-meta text-(--ink-3-aa)">Reference</span>
        <NavItem href="#" icon={RiShapesLine} active>Components</NavItem>
        <NavItem href="#" icon={RiPaletteLine}>Colour</NavItem>
        <NavItem href="#" icon={RiLayoutRowLine}>Tokens</NavItem>
      </div>
    </nav>
  )
}
