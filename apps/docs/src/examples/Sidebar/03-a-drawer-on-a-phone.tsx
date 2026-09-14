'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from '@misoto22/folio'
import { RiHomeLine, RiSettings3Line, RiStackLine } from '@remixicon/react'

/**
 * Under `breakpoint` the rail is not a narrower rail, it is a different
 * component: an overlay that covers the page from its own edge, closes onto a
 * scrim, and is `inert` while shut. That last part is the one everybody skips.
 * A drawer merely translated off-screen still holds focus and is still read
 * aloud, so a closed one puts its whole index between the reader and the page
 * they were on — which is why closing it here removes it from the document
 * rather than moving it.
 *
 * Two settings make this a demonstration rather than a description. `contained`
 * points the overlay at the frame instead of the window, because `fixed`
 * resolves against the viewport wherever the markup sits and a drawer inside a
 * preview would otherwise open across the page it is previewed on. And the
 * breakpoint is the widest step there is, so the state being documented is the
 * state on screen — this frame is never wider than `xl`.
 *
 * A row closes it. Following a link inside an overlay and leaving the overlay
 * up is a reader landing somewhere they cannot see.
 */
export function Example() {
  return (
    <SidebarProvider breakpoint="xl" contained shortcut={null}>
      <div className="relative flex h-72 w-full overflow-hidden rounded-(--radius-lg) border border-(--rule)">
        <Sidebar label="Console" scrimLabel="Close the navigation">
          <SidebarHeader>
            <span className="truncate font-heading text-[15px] text-(--ink)">Console</span>
            <SidebarTrigger className="ms-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Monitor" count={3}>
              <SidebarItem href="#overview" icon={RiHomeLine} active>
                Overview
              </SidebarItem>
              <SidebarItem href="#deploys" icon={RiStackLine} trailing="4">
                Deploys
              </SidebarItem>
              <SidebarItem href="#settings" icon={RiSettings3Line}>
                Settings
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex items-center gap-2 border-b border-(--rule) px-3 py-2.5">
            <SidebarTrigger />
            <span className="font-heading text-[15px] text-(--ink)">Overview</span>
          </div>
          <p className="m-0 p-4 text-sm leading-relaxed text-(--ink-3-aa)">
            The page keeps the whole frame: at this width the rail takes no room until it is asked
            for, and gives it all back the moment a row is taken.
          </p>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
