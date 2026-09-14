'use client'

import { AppShell, NavItem, Separator, Text } from '@misoto22/folio'
import { RiDashboardLine, RiDatabase2Line, RiFileTextLine, RiGitBranchLine, RiGlobalLine, RiGroupLine, RiKey2Line, RiMailLine, RiPulseLine, RiServerLine, RiSettings3Line, RiShieldLine, RiStackLine, RiTerminalBoxLine } from '@remixicon/react'

const SECTIONS = [
  { icon: RiDashboardLine, label: 'Overview' },
  { icon: RiPulseLine, label: 'Metrics' },
  { icon: RiServerLine, label: 'Hosts' },
  { icon: RiStackLine, label: 'Services' },
  { icon: RiGitBranchLine, label: 'Deploys' },
  { icon: RiDatabase2Line, label: 'Databases' },
  { icon: RiGlobalLine, label: 'Domains' },
  { icon: RiMailLine, label: 'Mail' },
  { icon: RiTerminalBoxLine, label: 'Logs' },
  { icon: RiFileTextLine, label: 'Reports' },
  { icon: RiGroupLine, label: 'Members' },
  { icon: RiKey2Line, label: 'API keys' },
  { icon: RiShieldLine, label: 'Audit trail' },
  { icon: RiSettings3Line, label: 'Settings' },
]

/**
 * Fourteen rows in a 15rem column, and the brand still on screen. Put the whole
 * list in the sidebar prop and let the component's own nav scroll it: build the
 * column yourself, with the brand inside the scrolling part, and the first
 * thing a long list does is carry the brand off the top. The nav is the only
 * part that moves, with the slim scrollbar, while the brand row and its hairline
 * stay put. Scroll the list below to see it.
 */
export function Example() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&_[class*=min-h-svh]]:min-h-0">
      <AppShell
        contentAs="div"
        sidebarLabel="Fleet sidebar"
        navLabel="Fleet navigation"
        brand={<span className="font-heading text-base">Fleet</span>}
        sidebar={
          <>
            {SECTIONS.map((section) => (
              <NavItem key={section.label} href="#" icon={section.icon} active={section.label === 'Deploys'}>
                {section.label}
              </NavItem>
            ))}
            <Separator className="my-2" />
            <NavItem href="#">Documentation</NavItem>
          </>
        }
      >
        <Text>
          The sidebar scrolls on its own. The brand row above it does not, and
          neither does the topbar — which is rendered here even though nothing
          was passed to it.
        </Text>
      </AppShell>
    </div>
  )
}
