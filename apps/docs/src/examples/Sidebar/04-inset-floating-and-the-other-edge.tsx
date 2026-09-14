'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  type SidebarSide,
  type SidebarVariant,
} from '@misoto22/folio'
import { RiHomeLine, RiInboxLine } from '@remixicon/react'

const ARRANGEMENTS: { variant: SidebarVariant; side: SidebarSide; note: string }[] = [
  { variant: 'flush', side: 'start', note: 'flush' },
  { variant: 'floating', side: 'start', note: 'floating' },
  { variant: 'inset', side: 'end', note: 'inset · side="end"' },
]

/**
 * Three arrangements of the same two pieces, and the difference between them is
 * which one is the panel.
 *
 * `flush` is a column and a page divided by a hairline — one surface, one line.
 * `floating` lifts the RAIL off the ground as its own bordered panel. `inset`
 * is the same gesture the other way up: the rail becomes the ground and
 * `SidebarInset` draws the page as the panel. That is why the setting lives on
 * the provider rather than on either piece — it is one decision that both of
 * them have to make the same way, and a `variant` on the rail alone would let a
 * caller set half of it.
 *
 * Both lifted variants need a ground, so the frame is `--stone`. A `--paper`
 * panel on a `--paper` page is a border with nothing on either side of it.
 *
 * `side="end"` is logical, not "right": it is the right in this document and
 * the left in an Arabic one, and the hairline, the collapse glyph and the row
 * tooltips all move with it rather than being written twice.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-4">
      {ARRANGEMENTS.map(({ variant, side, note }) => (
        <div key={note} className="flex flex-col gap-1.5">
          <span className="mono-meta text-(--ink-3-aa)">{note}</span>
          <SidebarProvider
            variant={variant}
            side={side}
            collapsible="none"
            breakpoint={null}
            shortcut={null}
          >
            <div
              className={`flex h-40 overflow-hidden rounded-(--radius-lg) border border-(--rule) ${
                variant === 'flush' ? 'bg-(--paper)' : 'bg-(--stone)'
              } ${side === 'end' ? 'flex-row-reverse' : ''}`}
            >
              <Sidebar label={`Rail ${note}`}>
                <SidebarHeader>
                  <span className="truncate font-heading text-[15px] text-(--ink)">Acme</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup label="Inbox" count={2} collapsible={false}>
                    <SidebarItem href="#all" icon={RiInboxLine} active>
                      All mail
                    </SidebarItem>
                    <SidebarItem href="#home" icon={RiHomeLine}>
                      Home
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <p className="m-0 p-4 text-sm leading-relaxed text-(--ink-3-aa)">
                  The page. Under <code>inset</code> this is the panel and the rail is the ground.
                </p>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      ))}
    </div>
  )
}
