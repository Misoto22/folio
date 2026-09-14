'use client'

import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  FigureBand,
  Field,
  Input,
  LinkArrow,
  Separator,
  StatusPill,
  Tag,
} from '@misoto22/folio'
import { RiQuillPenLine, RiRulerLine, RiStackLine } from '@remixicon/react'

const PILLARS = [
  {
    icon: RiRulerLine,
    title: 'One ladder',
    body: 'Five heading steps, fluid between a phone and the full page, and nothing above the page title.',
  },
  {
    icon: RiQuillPenLine,
    title: 'No blurred shadow',
    body: 'The system has no light source, so depth is a hairline, a change of ground, or a hard offset.',
  },
  {
    icon: RiStackLine,
    title: 'One pointer',
    body: 'Every component reads one accent token. Re-point it and the whole system follows.',
  },
]

/**
 * A marketing page, assembled from the set.
 *
 * The second half of what a template is for. A console shows the components
 * under density — many of them, close together, in a bounded column. A landing
 * page shows the opposite problem: very few components, a great deal of space,
 * and type doing most of the work. A system that only looks right at one of
 * those densities is a system with one screen in it.
 *
 * Every element is from the package.
 */
export function Landing() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-(--rule) px-6 py-4">
        <span className="font-heading text-[17px] text-(--ink)">Ledger</span>
        <nav aria-label="Marketing" className="flex items-center gap-5">
          <a href="#pricing" className="text-sm text-(--ink-2) hover:text-(--ink)">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-(--ink-2) hover:text-(--ink)">
            FAQ
          </a>
          <Button size="sm">Start free</Button>
        </nav>
      </header>

      <section className="flex flex-col items-start gap-6 px-6 py-16 @2xl:px-10 @5xl:px-16">
        <StatusPill>Now in public beta</StatusPill>
        <h1 className="m-0 max-w-[18ch] font-heading text-[length:var(--fs-title)] font-normal leading-[1.05] text-(--ink)">
          Every number, with the sentence that explains it.
        </h1>
        <p className="m-0 max-w-(--w-reading) text-[17px] leading-relaxed text-(--ink-2)">
          Ledger keeps the reasoning beside the figure, so a report you wrote in March still means
          something in November — to you, and to whoever reads it next.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="secondary">
            Read the docs
            <LinkArrow />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Tag>No card required</Tag>
          <Tag>Export to CSV</Tag>
          <Tag>Self-hostable</Tag>
        </div>
      </section>

      <FigureBand
        label="Ledger in numbers"
        scale="sub"
        figures={[
          { id: 'teams', label: 'Teams', value: '1,240' },
          { id: 'reports', label: 'Reports written', value: '48k', note: 'this year' },
          { id: 'export', label: 'Median export', value: '0.8s' },
          { id: 'uptime', label: 'Uptime', value: '99.99%' },
        ]}
      />

      <section className="grid gap-4 px-6 py-16 @2xl:px-10 @3xl:grid-cols-3 @5xl:px-16">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title}>
            <CardBody className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-(--radius-pill) bg-(--stone) text-(--ink-2)">
                <pillar.icon size={18} aria-hidden />
              </span>
              {/* h2: these are the top-level sections under the hero. As h3 they
                  skipped a level, which is a jump a screen reader has to
                  announce and a reader has to reconstruct. */}
              <CardTitle as="h2">{pillar.title}</CardTitle>
              <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">{pillar.body}</p>
            </CardBody>
          </Card>
        ))}
      </section>

      <Separator weight="edge" />

      <section
        id="pricing"
        className="grid gap-8 px-6 py-16 @2xl:px-10 @5xl:grid-cols-[minmax(0,1fr)_22rem] @5xl:px-16"
      >
        <div className="flex flex-col gap-4">
          <h2 className="m-0 font-heading text-[length:var(--fs-lead)] font-normal text-(--ink)">
            One price, and it does not go up when you grow.
          </h2>
          <p className="m-0 max-w-(--w-reading) text-[15px] leading-relaxed text-(--ink-2)">
            Per workspace, not per seat. Adding the person who reads the reports should never be the
            thing you think twice about.
          </p>
        </div>
        <Card variant="plate">
          <CardBody className="flex flex-col gap-5 text-(--on-feature)">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-[length:var(--fs-lead)]">$24</span>
              <span className="mono-meta text-(--on-feature)/70">per month</span>
            </div>
            <Field label="Work email" className="[&_label]:text-(--on-feature)">
              <Input type="email" placeholder="you@company.com" className="bg-transparent text-(--on-feature) placeholder:text-(--on-feature)/50" />
            </Field>
            <Button className="bg-(--paper) text-(--ink) border-(--paper) hover:opacity-90">
              Start the trial
            </Button>
            <p className="m-0 text-[12px] leading-relaxed text-(--on-feature)/70">
              Fourteen days. No card. Cancel by closing the tab.
            </p>
          </CardBody>
        </Card>
      </section>

      <section id="faq" className="flex flex-col gap-5 px-6 pb-20 @2xl:px-10 @5xl:px-16">
        <div className="flex items-center gap-3">
          <h2 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
            Questions
          </h2>
          <Badge tone="outline">3</Badge>
        </div>
        <Accordion type="single" collapsible className="max-w-(--w-reading)">
          <AccordionItem value="export" title="Can I get my data out?">
            CSV and JSON, from any view, without asking anyone. An export that needs a support
            ticket is not an export.
          </AccordionItem>
          <AccordionItem value="host" title="Can I run it myself?">
            Yes. The same build we run, with a Postgres you own.
          </AccordionItem>
          <AccordionItem value="seats" title="What counts as a seat?">
            Nothing does. The price is per workspace.
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
