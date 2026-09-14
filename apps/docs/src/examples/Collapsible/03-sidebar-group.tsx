'use client'

import { CollapsibleSection, NavItem } from '@misoto22/folio'
import { RiHomeLine } from '@remixicon/react'
import { useState } from 'react'

/**
 * Controlled, because something outside has to be able to open it: the group
 * holding the current route must already be expanded when the reader arrives,
 * and a component that owns its own state cannot be told that. Do not build a
 * set out of these — two sections cannot close each other, so the reader ends
 * with every group open and a column to scroll past. That coordination is the
 * whole of what an accordion's single value buys, and it is the reason to
 * reach for one instead once there are three groups.
 */
export function Example() {
  const [open, setOpen] = useState(true)

  return (
    <nav className="flex w-56 flex-col gap-1" aria-label="Docs sections">
      <NavItem href="#" icon={RiHomeLine}>Overview</NavItem>
      <CollapsibleSection title="Components" open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-1 ps-3">
          <NavItem href="#">Button</NavItem>
          <NavItem href="#" active>Pagination</NavItem>
          <NavItem href="#">Tabs</NavItem>
        </div>
      </CollapsibleSection>
    </nav>
  )
}
