'use client'

import {
  AppShell,
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Heading,
  NavItem,
  Text,
} from '@misoto22/folio'
import { RiDashboardLine, RiGitBranchLine, RiStackLine } from '@remixicon/react'

/**
 * The well already centres its children at the page measure and supplies the
 * page padding either side, so children add neither: wrap them in your own
 * max-width and the content ends up in the middle of the middle. What goes in
 * is the page itself, starting at h1 — the shell contributes no heading of its
 * own, and a console whose pages all begin at h2 has an outline with nothing at
 * the top. contentAs is div here only because this preview sits inside the
 * documentation site's own main; in a real application leave it alone and let
 * the well be the main landmark.
 */
export function Example() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&_[class*=min-h-svh]]:min-h-0">
      <AppShell
        contentAs="div"
        sidebarLabel="Project sidebar"
        navLabel="Project navigation"
        brand={<span className="font-heading text-base">misoto22</span>}
        sidebar={
          <>
            <NavItem href="#" icon={RiDashboardLine}>Overview</NavItem>
            <NavItem href="#" icon={RiGitBranchLine} active>Deploys</NavItem>
            <NavItem href="#" icon={RiStackLine}>Packages</NavItem>
          </>
        }
        topbar={<Badge tone="success">all green</Badge>}
      >
        <Heading level={1} size="heading">
          Deploys
        </Heading>
        <Text className="mt-3">
          Twelve releases in the last thirty days, none rolled back. No wrapper
          around this column — the well is the measure.
        </Text>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle as="h2">api</CardTitle>
              <Badge tone="success">live</Badge>
            </CardHeader>
            <CardBody>Deployed from main, 2m 14s ago.</CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as="h2">web</CardTitle>
              <Badge tone="warning">building</Badge>
            </CardHeader>
            <CardBody>Started 40 seconds ago on codex/ui-library.</CardBody>
          </Card>
        </div>
      </AppShell>
    </div>
  )
}
