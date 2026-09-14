'use client'

import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  LinkArrow,
  Separator,
  StatusPill,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  ToggleGroup,
  ToggleGroupItem,
} from '@misoto22/folio'
import { RiCheckLine, RiSubtractLine } from '@remixicon/react'
import { useState } from 'react'

interface Plan {
  id: string
  name: string
  monthly: number
  annual: number
  blurb: string
  includes: string[]
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    monthly: 19,
    annual: 15,
    blurb: 'One person, one machine, jobs that have to run whether or not you are awake.',
    includes: [
      '100,000 jobs a month',
      'One queue, 3 workers',
      '7 days of job history',
      'Email when a job dies',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    monthly: 59,
    annual: 47,
    blurb: 'The plan most people are on. Per workspace, not per seat — invite the whole studio.',
    includes: [
      '2 million jobs a month',
      'Unlimited queues, 40 workers',
      '90 days of job history',
      'Dead letter queue with replay',
      'Slack and webhook alerts',
    ],
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 179,
    annual: 143,
    blurb: 'Region pinning, an audit trail, and someone answering the phone during your hours.',
    includes: [
      '20 million jobs a month',
      'Unlimited workers',
      '1 year of job history',
      'SAML SSO and SCIM',
      'Region pinning and an audit log',
    ],
  },
]

type Cell = boolean | string

const COMPARISON: { feature: string; solo: Cell; team: Cell; business: Cell }[] = [
  { feature: 'Jobs a month', solo: '100k', team: '2M', business: '20M' },
  { feature: 'Concurrent workers', solo: '3', team: '40', business: 'Unlimited' },
  { feature: 'Job history', solo: '7 days', team: '90 days', business: '1 year' },
  { feature: 'Dead letter queue', solo: false, team: true, business: true },
  { feature: 'Scheduled and repeating jobs', solo: true, team: true, business: true },
  { feature: 'Replay a failed job', solo: false, team: true, business: true },
  { feature: 'SAML SSO and SCIM', solo: false, team: false, business: true },
  { feature: 'Region pinning', solo: false, team: false, business: true },
  { feature: 'Audit log export', solo: false, team: false, business: true },
  { feature: 'Support', solo: 'Email', team: 'Email, 1 day', business: 'Email, 2 hours' },
]

/** A cell that is a yes or a no, with the meaning in text as well as in a mark. */
function Mark({ value }: { value: Cell }) {
  if (typeof value === 'string') return <span className="text-(--ink-2)">{value}</span>
  return value ? (
    <>
      <RiCheckLine size={15} aria-hidden className="text-(--ok)" />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <RiSubtractLine size={15} aria-hidden className="text-(--ink-3-aa)" />
      <span className="sr-only">Not included</span>
    </>
  )
}

/**
 * A pricing page, assembled from the set.
 *
 * The Landing template already has a price on it — one plate, one number — and
 * that is not this problem. Three plans side by side is a specific and harder
 * one, because the whole convention for solving it elsewhere is unavailable
 * here: there is no second brand colour to paint the middle card, no gradient,
 * and no shadow to lift it off the page. This system has one accent and depth
 * is a hairline.
 *
 * So "recommended" is carried by three things that are already in the system:
 * the `plate` variant, which is the one reversed surface and is limited to one
 * card per screen; a badge sitting inside the card rather than floating over
 * its corner; and the plate's own contrast doing the work a drop shadow would
 * do somewhere else. If that reads as an error rather than as emphasis, the
 * depth ramp is wrong — which is the thing this template is here to show.
 *
 * The comparison table is the second half. Ten rows of yes and no in a
 * monochrome system cannot be a wall of green ticks, so every mark carries its
 * meaning in text as well: `Included` and `Not included` are read aloud, and
 * the tick is `aria-hidden`.
 *
 * Every element is from the package.
 */
export function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual')
  const annual = cycle === 'annual'

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center gap-5 px-6 py-14 text-center @3xl:px-10">
        <StatusPill>No card to start · cancel by closing the tab</StatusPill>
        <h1 className="m-0 max-w-[22ch] font-heading text-[length:var(--fs-lead)] font-normal leading-[1.1] text-(--ink)">
          Priced per workspace, so nobody has to argue about a seat
        </h1>
        <p className="m-0 max-w-(--w-reading) text-[15px] leading-relaxed text-(--ink-2)">
          Ferry runs your background jobs. Every plan includes the whole product — what changes is
          how much of it you use, and how long we keep the history.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <ToggleGroup
            type="single"
            value={cycle}
            onValueChange={(next) => setCycle((next as 'monthly' | 'annual') || 'annual')}
            aria-label="Billing cycle"
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
          </ToggleGroup>
          <Badge tone="success">Annual is two months free</Badge>
        </div>
      </section>

      <section
        aria-labelledby="plans"
        className="grid gap-4 px-6 pb-14 @3xl:grid-cols-3 @3xl:px-10"
      >
        <h2 id="plans" className="sr-only">
          Plans
        </h2>
        {PLANS.map((plan) => (
          <Card key={plan.id} variant={plan.featured ? 'plate' : 'outline'}>
            <CardBody className="flex h-full flex-col gap-5">
              <div className="flex items-center gap-3">
                {/* h3: the section heading above these is "Plans", so a plan
                    title is one step under it. */}
                <CardTitle as="h3">{plan.name}</CardTitle>
                {plan.featured && (
                  <span className="rounded-(--radius-pill) border border-(--on-feature)/40 px-2 py-0.5 mono-meta text-(--on-feature)">
                    most chosen
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                {/* Coloured explicitly rather than left to inherit. The plate
                    hands its children `--on-feature`, but the heading face
                    carries its own ink, and inherited-looking type on a
                    reversed surface is exactly where a contrast failure hides
                    in a monochrome system. */}
                <span
                  className={
                    plan.featured
                      ? 'font-heading text-[length:var(--fs-sub)] leading-none text-(--on-feature)'
                      : 'font-heading text-[length:var(--fs-sub)] leading-none text-(--ink)'
                  }
                >
                  ${annual ? plan.annual : plan.monthly}
                </span>
                <span
                  className={
                    plan.featured
                      ? 'mono-meta text-(--on-feature)/70'
                      : 'mono-meta text-(--ink-3-aa)'
                  }
                >
                  per month{annual ? ', billed yearly' : ''}
                </span>
              </div>

              <p
                className={
                  plan.featured
                    ? 'm-0 text-[13px] leading-relaxed text-(--on-feature)/80'
                    : 'm-0 text-[13px] leading-relaxed text-(--ink-3-aa)'
                }
              >
                {plan.blurb}
              </p>

              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className={
                      plan.featured
                        ? 'flex items-start gap-2 text-[13px] leading-relaxed text-(--on-feature)'
                        : 'flex items-start gap-2 text-[13px] leading-relaxed text-(--ink-2)'
                    }
                  >
                    {/* The success green is a paper-ground token. On the
                        reversed plate it is the one mark that would fall below
                        contrast, so the plate spends its own ink instead. */}
                    <RiCheckLine
                      size={14}
                      aria-hidden
                      className={
                        plan.featured
                          ? 'mt-0.5 shrink-0 text-(--on-feature)'
                          : 'mt-0.5 shrink-0 text-(--ok)'
                      }
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                {plan.featured ? (
                  <Button className="w-full border-(--paper) bg-(--paper) text-(--ink) hover:opacity-90">
                    Start on Team
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full">
                    Start on {plan.name}
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Separator weight="edge" />

      <section
        aria-labelledby="compare"
        className="flex flex-col gap-5 px-6 py-14 @3xl:px-10"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2
            id="compare"
            className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)"
          >
            Every line of it
          </h2>
          <Tag>{COMPARISON.length} rows</Tag>
        </div>
        <Table caption="Plan comparison" borders="grid" density="compact">
          <THead>
            <TR>
              <TH>Feature</TH>
              <TH align="center">Solo</TH>
              <TH align="center">Team</TH>
              <TH align="center">Business</TH>
            </TR>
          </THead>
          <TBody>
            {COMPARISON.map((row) => (
              <TR key={row.feature}>
                <TD>{row.feature}</TD>
                {/* `relative` on the wrapper, not decoration: `sr-only` is
                    `position: absolute`, and with nothing positioned inside the
                    table its containing block was the document — so the
                    hidden word escaped the table's scroll container and the
                    frame around it, and pushed a phone sideways. */}
                <TD align="center">
                  <span className="relative inline-flex items-center justify-center text-[13px]">
                    <Mark value={row.solo} />
                  </span>
                </TD>
                <TD align="center">
                  <span className="relative inline-flex items-center justify-center text-[13px]">
                    <Mark value={row.team} />
                  </span>
                </TD>
                <TD align="center">
                  <span className="relative inline-flex items-center justify-center text-[13px]">
                    <Mark value={row.business} />
                  </span>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </section>

      <Separator weight="edge" />

      <section aria-labelledby="questions" className="flex flex-col gap-5 px-6 py-14 @3xl:px-10">
        <h2
          id="questions"
          className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)"
        >
          What people ask before paying
        </h2>
        <Accordion type="single" collapsible className="max-w-(--w-reading)">
          <AccordionItem value="overage" title="What happens when I go past the job limit?">
            Jobs keep running. You get one email at 80% and another at 100%, and the overage is
            billed at $2 per hundred thousand — never a queue that silently stops accepting work.
          </AccordionItem>
          <AccordionItem value="seats" title="How many people can I invite?">
            All of them. The price is per workspace. Charging for the person who reads the dead
            letter queue is how nobody reads the dead letter queue.
          </AccordionItem>
          <AccordionItem value="downgrade" title="Can I move back down a plan?">
            At any time, effective at the next cycle. History beyond the lower plan's window stops
            being queryable but is not deleted for thirty days.
          </AccordionItem>
          <AccordionItem value="self-host" title="Can I run Ferry myself?">
            Yes, on the Business plan or on the open-source core. The core is the same broker; the
            paid product is the dashboard, the history and the alerting around it.
          </AccordionItem>
        </Accordion>
        <a
          href="#contact"
          className="text-sm text-(--ink) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-(--ink)"
        >
          Something not answered here? Ask us before you buy
          <LinkArrow />
        </a>
      </section>
    </div>
  )
}
