'use client'

import { AppShell, Card, CardBody, CardTitle, NavItem } from '@misoto22/folio'
import { RiHomeLine, RiSettings3Line, RiShapesLine } from '@remixicon/react'

/**
 * Eight named parts, and the name gives away none of them. The frame is a grid
 * and nothing else — a 15rem sidebar beside a 1fr column from md up, one column
 * below that. The sidebar is a complementary landmark named by sidebarLabel; on
 * a phone it becomes a drawer that slides in from the edge reading STARTS at.
 * Inside it, brand sits in a 3.5rem row above a hairline — the same height as
 * the topbar, so the two rules meet across the column boundary — and the nav is
 * the part that scrolls. The topbar is sticky and rendered whether or not you
 * pass one, so a shell with nothing to put up there still costs 3.5rem and a
 * rule. The toggle and the scrim are phone-only, and openLabel and closeLabel
 * are the toggle's entire accessible name. Last is the content well, centred at
 * the page measure with the page padding already applied.
 */
export function Example() {
  // Boxed so the shell's own full-height layout stays inside the frame.
  return (
    <div className="h-96 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&_[class*=min-h-svh]]:min-h-0">
      <AppShell
        // A page may have only one <main>, and this preview sits inside the
        // documentation site's own.
        contentAs="div"
        // The documentation site has a sidebar of its own, and two
        // complementary landmarks with one name cannot be told apart.
        sidebarLabel="Console sidebar"
        navLabel="Console navigation"
        brand={<span className="font-heading text-base">Console</span>}
        sidebar={
          <>
            <NavItem href="#" icon={RiHomeLine} active>Overview</NavItem>
            <NavItem href="#" icon={RiShapesLine}>Components</NavItem>
            <NavItem href="#" icon={RiSettings3Line}>Settings</NavItem>
          </>
        }
        topbar={<span className="mono-meta text-(--ink-3-aa)">production</span>}
      >
        <Card>
          <CardBody>
            <CardTitle>Content well</CardTitle>
          </CardBody>
        </Card>
      </AppShell>
    </div>
  )
}
