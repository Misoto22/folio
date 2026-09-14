'use client'

import {
  Badge,
  Button,
  Kbd,
  Sidebar,
  SidebarBranch,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@misoto22/folio'
import { RiAddLine, RiBookOpenLine, RiBuilding2Line, RiDeleteBinLine, RiFileTextLine, RiHomeLine, RiInboxLine } from '@remixicon/react'

/**
 * A rail is composed, not configured: a header, a scrolling middle and a
 * footer, and every product wants different things in all three. What the
 * component owns is the part that is the same everywhere — the width, the edge,
 * the scrolling, and what happens when it closes.
 *
 * Everything else here is composition. The badge beside Agents is a Badge, the
 * count on Inbox is a string, the action at the foot is a Button; none of them
 * is a prop this component had to invent. Teamspaces nests, because a workspace
 * that contains projects is a place containing places rather than a heading
 * over a list — which is the line between SidebarBranch and SidebarGroup.
 *
 * Press the button in the header, or Cmd+B, and watch the labels go: every row
 * stays reachable, because each keeps its label as a tooltip rather than
 * becoming an unnamed glyph.
 */
export function Example() {
  return (
    <SidebarProvider breakpoint={null} collapsible="icon">
      <div className="flex h-[38rem] w-full overflow-hidden rounded-(--radius-lg) border border-(--rule)">
        <Sidebar label="Workspace">
          <SidebarHeader>
            <span className="grid size-6 shrink-0 place-items-center rounded-(--radius-sm) bg-(--ink) text-[11px] text-(--paper)">
              A
            </span>
            <span className="truncate font-heading text-[15px] text-(--ink)">Acme Labs</span>
            <SidebarTrigger className="ms-auto" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup label="Workspace" count={2} collapsible={false}>
              <SidebarItem href="#home" icon={RiHomeLine} active>
                Home
              </SidebarItem>
              <SidebarItem href="#inbox" icon={RiInboxLine} trailing="12">
                Inbox
              </SidebarItem>
            </SidebarGroup>

            <SidebarGroup label="Agents" count={1} badge={<Badge tone="outline">Beta</Badge>}>
              <SidebarItem href="#personal" icon={RiAddLine}>
                Add new
              </SidebarItem>
            </SidebarGroup>

            <SidebarGroup label="Teamspaces" count={2}>
              <SidebarBranch label="Acme HQ" icon={RiBuilding2Line} defaultOpen>
                <SidebarItem href="#hq" icon={RiHomeLine}>
                  Overview
                </SidebarItem>
                <SidebarItem href="#hq-roadmap" icon={RiFileTextLine}>
                  Roadmap
                </SidebarItem>
              </SidebarBranch>
              <SidebarBranch label="Engineering" icon={RiBuilding2Line}>
                <SidebarItem href="#eng-sprints" icon={RiFileTextLine}>
                  Sprints
                </SidebarItem>
              </SidebarBranch>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="#library" icon={RiBookOpenLine}>
              Library
            </SidebarItem>
            <SidebarItem href="#trash" icon={RiDeleteBinLine}>
              Trash
            </SidebarItem>
            <SidebarSeparator />
            {/* `secondary`, so the shortcut key inside it keeps a ground to sit
                on. A Kbd on a filled button is a plate the same colour as the
                thing under it, which reads as a hole rather than as a key. */}
            <Button size="sm" variant="secondary" className="w-full justify-between">
              New chat
              <Kbd>⌘N</Kbd>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 text-sm text-(--ink-3-aa)">The page, beside the rail.</div>
      </div>
    </SidebarProvider>
  )
}
