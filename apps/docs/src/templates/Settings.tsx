'use client'

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectItem,
  Separator,
  Switch,
  Textarea,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from '@misoto22/folio'
import { RiBankCardLine, RiEqualizerLine, RiNotification3Line, RiShieldCheckLine } from '@remixicon/react'
import { useState } from 'react'

const NOTIFICATIONS = [
  {
    id: 'deploys',
    label: 'Deploy finished',
    note: 'Every environment, whether it passed or failed.',
    on: true,
  },
  {
    id: 'budget',
    label: 'Spend reaches 80% of the cap',
    note: 'Once per billing cycle, to the billing contact only.',
    on: true,
  },
  {
    id: 'digest',
    label: 'Weekly digest',
    note: 'Monday 09:00, in the workspace time zone.',
    on: false,
  },
  {
    id: 'mentions',
    label: 'Mentions in comments',
    note: 'Only threads you are already part of.',
    on: false,
  },
]

/**
 * A workspace settings screen, assembled from the set.
 *
 * The first of the eight application screens, and the one that puts the form
 * controls under the pressure they are never checked under: a checkbox row, a
 * switch row, a radio row and four labelled fields, stacked down one column
 * with section rules between them. Each of those is spaced correctly on its own
 * page in the gallery. Stacked, they have to agree on what a row is — the same
 * label step, the same gap to the description under it, the same distance to
 * the rule — and any one of them that was tuned in isolation is visible here as
 * a limp in the rhythm.
 *
 * The save bar is the second thing it tests. It is `sticky bottom-0`, so it
 * pins over the section the reader is in rather than waiting at the end of the
 * page, and it only exists once something changed: a bar that is always there
 * teaches people to ignore it, and a page with no bar at all leaves them
 * hunting for the button that commits their edit.
 *
 * Every element is from the package.
 */
export function Settings() {
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(NOTIFICATIONS.map((item) => [item.id, item.on])),
  )
  const [dirty, setDirty] = useState(false)

  return (
    <SidebarProvider breakpoint={null} collapsible="icon" shortcut={null}>
    <div className="flex min-h-[40rem]">
      <Sidebar label="Settings" className="hidden @3xl:flex">
        <SidebarHeader>
          <Avatar alt="" fallback="LB" size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] leading-tight text-(--ink)">
              Longbeach Studio
            </span>
            <span className="mono-meta text-(--ink-3-aa)">Team plan</span>
          </div>
          <SidebarTrigger className="ms-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Account" count={4} collapsible={false}>
            <SidebarItem href="#general" icon={RiEqualizerLine} active>
              General
            </SidebarItem>
            <SidebarItem href="#notifications" icon={RiNotification3Line}>
              Notifications
            </SidebarItem>
            <SidebarItem href="#access" icon={RiShieldCheckLine}>
              Access
            </SidebarItem>
            <SidebarItem href="#billing" icon={RiBankCardLine}>
              Billing
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex min-w-0 flex-col">
        <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-(--rule) px-6 py-5">
          <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
            Workspace settings
          </h1>
          <span className="mono-meta text-(--ink-3-aa)">longbeach.studio</span>
        </header>

        <div className="flex flex-col gap-9 px-6 py-8">
          <section id="general" aria-labelledby="settings-general" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2
                id="settings-general"
                className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
              >
                General
              </h2>
              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                What this workspace is called everywhere it appears — invitations, the status page,
                the footer of every export.
              </p>
            </div>

            <div className="grid gap-5 @2xl:grid-cols-2">
              <Field label="Workspace name" required>
                <Input defaultValue="Longbeach Studio" onChange={() => setDirty(true)} />
              </Field>
              <Field label="Slug" hint="Changing it breaks existing invitation links.">
                <Input defaultValue="longbeach" onChange={() => setDirty(true)} />
              </Field>
              <Field label="Time zone">
                <Select
                  label="Time zone"
                  defaultValue="melbourne"
                  onValueChange={() => setDirty(true)}
                >
                  <SelectItem value="melbourne">Australia/Melbourne</SelectItem>
                  <SelectItem value="tokyo">Asia/Tokyo</SelectItem>
                  <SelectItem value="london">Europe/London</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </Select>
              </Field>
              <Field label="Billing contact" hint="Receives invoices and spend alerts.">
                <Input type="email" defaultValue="accounts@longbeach.studio" onChange={() => setDirty(true)} />
              </Field>
            </div>

            <Field
              label="Description"
              hint="Shown to anyone you invite, before they accept."
              className="max-w-(--w-reading)"
            >
              <Textarea
                rows={3}
                defaultValue="Photography and print work for record labels. Two studios, one darkroom, and a lot of scanning."
                onChange={() => setDirty(true)}
              />
            </Field>
          </section>

          <Separator />

          <section
            id="notifications"
            aria-labelledby="settings-notifications"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <h2
                id="settings-notifications"
                className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
              >
                Notifications
              </h2>
              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                Sent to accounts@longbeach.studio. Nothing here is marketing; turning all of it off
                is a supported choice.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-(--rule) rounded-(--radius) border border-(--rule)">
              {NOTIFICATIONS.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-4 px-4 py-3.5"
                >
                  <Switch
                    className="mt-0.5"
                    checked={notifications[item.id]}
                    onCheckedChange={(next) => {
                      setNotifications((previous) => ({ ...previous, [item.id]: next }))
                      setDirty(true)
                    }}
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className={
                        notifications[item.id]
                          ? 'text-sm text-(--ink) transition-colors duration-(--duration-fast)'
                          : 'text-sm text-(--ink-3-aa) transition-colors duration-(--duration-fast)'
                      }
                    >
                      {item.label}
                    </span>
                    <span className="text-[13px] leading-relaxed text-(--ink-3-aa)">
                      {item.note}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <Separator />

          <section id="access" aria-labelledby="settings-access" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2
                id="settings-access"
                className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
              >
                Access
              </h2>
              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                What someone can do the moment they accept an invitation, before anyone gets around
                to adjusting it.
              </p>
            </div>

            <RadioGroup
              defaultValue="contributor"
              aria-label="Default role for new members"
              onValueChange={() => setDirty(true)}
            >
              <RadioGroupItem value="viewer">Viewer — read everything, change nothing</RadioGroupItem>
              <RadioGroupItem value="contributor">
                Contributor — edit drafts, but not published work
              </RadioGroupItem>
              <RadioGroupItem value="admin">Admin — including billing and members</RadioGroupItem>
            </RadioGroup>

            <div className="flex flex-col gap-3 border-s border-(--rule-2) ps-4">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-(--ink-2)">
                <Checkbox defaultChecked onCheckedChange={() => setDirty(true)} />
                Require two-factor authentication
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-(--ink-2)">
                <Checkbox onCheckedChange={() => setDirty(true)} />
                Allow anyone with a longbeach.studio address to join without an invitation
              </label>
            </div>
          </section>

          <Separator />

          <section id="billing" aria-labelledby="settings-billing" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2
                id="settings-billing"
                className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
              >
                Billing
              </h2>
              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                Charged per workspace on the first of the month. Seats are not counted.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-(--radius) border border-(--rule) px-4 py-3.5">
              <span className="text-sm text-(--ink)">Team</span>
              <Badge tone="success">active</Badge>
              <span className="mono-meta text-(--ink-3-aa)">$96 / month · renews 1 Oct</span>
              <Button size="sm" variant="secondary" className="ms-auto">
                Change plan
              </Button>
            </div>

            <Alert tone="warning" title="Card expires next month">
              Visa ending 4417 expires 10/26. Update it before the October invoice, or the workspace
              drops to read-only rather than being deleted.
            </Alert>
          </section>
        </div>

        {/* Sticky rather than parked at the end of the page: the reader is in a
            section, not at the bottom, and a commit button they have to scroll
            to find is one they will forget to press. It appears only once
            something changed — an always-present bar is one people stop
            seeing. */}
        {dirty && (
          <div className="sticky bottom-0 z-(--z-sticky) mt-auto flex flex-wrap items-center gap-3 border-t border-(--rule-hard) bg-(--paper) px-6 py-3.5">
            <span className="text-[13px] text-(--ink-2)">Unsaved changes</span>
            <div className="ms-auto flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setDirty(false)}>
                Discard
              </Button>
              <Button size="sm" onClick={() => setDirty(false)}>
                Save changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </SidebarProvider>
  )
}
