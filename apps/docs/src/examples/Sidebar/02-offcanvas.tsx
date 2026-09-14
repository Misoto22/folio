'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from '@misoto22/folio'
import { RiFileTextLine, RiHomeLine } from '@remixicon/react'

/**
 * `collapsible` is a choice about the ROWS, not about the animation. Icons suit
 * a fixed set a reader learns the shape of — a workspace, a mail client, five
 * places they visit every day. A long index nobody memorises is better gone
 * entirely: a column of unrecognisable glyphs takes width and answers nothing,
 * which is what offcanvas is for. The trigger stays in the header either way,
 * so it goes with the rail rather than sitting out in a masthead with nothing
 * connecting it to the column it operates.
 */
export function Example() {
  return (
    <SidebarProvider breakpoint={null} collapsible="offcanvas" shortcut={null}>
      <div className="flex h-72 w-full overflow-hidden rounded-(--radius-lg) border border-(--rule)">
        <Sidebar label="Handbook">
          <SidebarHeader>
            <span className="truncate font-heading text-[15px] text-(--ink)">Handbook</span>
            <SidebarTrigger className="ms-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Getting started" count={2}>
              <SidebarItem href="#install" icon={RiHomeLine} active>
                Installation
              </SidebarItem>
              <SidebarItem href="#tokens" icon={RiFileTextLine}>
                Tokens
              </SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Guides" count={2} defaultOpen={false}>
              <SidebarItem href="#theming" icon={RiFileTextLine}>
                Theming
              </SidebarItem>
              <SidebarItem href="#agents" icon={RiFileTextLine}>
                Working with agents
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {/* Gone means gone: the rail takes no width at all, so the page beside
            it gets the whole window rather than a strip of icons it cannot
            read. Something has to bring it back — here, the page does. */}
        <div className="flex flex-1 items-start gap-3 p-6 text-sm text-(--ink-3-aa)">
          <SidebarTrigger className="shrink-0" />
          The page, with the rail away.
        </div>
      </div>
    </SidebarProvider>
  )
}
