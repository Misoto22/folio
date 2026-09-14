import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Kbd,
  LinkArrow,
  Separator,
  Steps,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from '@misoto22/folio'
import { RiBookOpenLine, RiPuzzleLine, RiStackLine, RiTerminalBoxLine } from '@remixicon/react'

const SIDEBAR = [
  { href: '#start', label: 'Getting started', icon: RiBookOpenLine },
  { href: '#cli', label: 'CLI', icon: RiTerminalBoxLine },
  { href: '#queues', label: 'Queues', icon: RiStackLine, active: true },
  { href: '#adapters', label: 'Adapters', icon: RiPuzzleLine },
]

const CONTENTS = [
  { id: 'signature', text: 'Signature', level: 2 },
  { id: 'options', text: 'Options', level: 2 },
  { id: 'ordering', text: 'Ordering guarantees', level: 3 },
  { id: 'lifecycle', text: 'What happens after', level: 2 },
  { id: 'failure', text: 'When it throws', level: 2 },
]

/**
 * "1", "2" for sections and "1.1" beneath, computed once.
 *
 * Written out rather than derived inside the map: the same sum inside the JSX
 * was a scan of the whole list per row, and a reader trying to follow the
 * numbering had to read a filter inside a findLastIndex to see what it counted.
 */
const NUMBERS: string[] = (() => {
  let major = 0
  let minor = 0
  return CONTENTS.map((item) => {
    if (item.level === 2) {
      major += 1
      minor = 0
      return String(major)
    }
    minor += 1
    return `${major}.${minor}`
  })
})()

const OPTIONS = [
  {
    name: 'delay',
    type: 'number',
    fallback: '0',
    note: 'Milliseconds to hold the job before any worker may claim it.',
  },
  {
    name: 'attempts',
    type: 'number',
    fallback: '3',
    note: 'Total tries, not retries. Setting 1 disables retrying.',
  },
  {
    name: 'backoff',
    type: "'fixed' | 'exponential'",
    fallback: "'exponential'",
    note: 'How the delay grows between attempts. Exponential starts at one second.',
  },
  {
    name: 'dedupeKey',
    type: 'string',
    fallback: '—',
    note: 'Two jobs with the same key inside the window collapse into one.',
  },
  {
    name: 'priority',
    type: 'number',
    fallback: '0',
    note: 'Higher is claimed first. Equal priorities are FIFO.',
  },
]

/**
 * A reference page, assembled from the set.
 *
 * The three-column documentation layout, and the reason it earns a template of
 * its own: it is the narrowest middle column in this whole set. A sidebar on
 * one side and a contents rail on the other leave the article with less width
 * than a blog post, a settings form or a detail page — and that is precisely
 * the width at which the blocks a reference page is MADE of stop fitting.
 *
 * Three of them, and each has a different answer:
 *
 *   the table    scrolls on its own axis. `Table` wraps itself in a focusable
 *                scrolling region for exactly this, so the page never scrolls
 *                sideways as a whole while a five-column API table does.
 *   the code     wraps rather than scrolls, because a signature broken across
 *                two lines is still readable and a signature you have to drag
 *                is not.
 *   the callout  gets the full column width, since it is prose and the measure
 *                is already the constraint.
 *
 * The contents rail is `sticky`, one step of indent for an h3, and marked
 * `aria-label="Contents"` so it is a second navigation landmark a reader
 * can skip rather than an unnamed list of links.
 *
 * No state, so no `'use client'`. Every element is from the package.
 */
export function DocsShell() {
  return (
    <SidebarProvider breakpoint={null} collapsible="icon" shortcut={null}>
    <div className="flex min-h-[38rem]">
      {/* Named for the product, not for the section. The trail on this page is
          already a navigation landmark called "Reference", and two of those is a
          reader hearing the same answer twice — which only became true when this
          rail stopped being an <aside> and became a <nav>. */}
      <Sidebar label="Ferry" className="hidden @3xl:flex">
        <SidebarHeader>
          <span className="font-heading text-[15px] text-(--ink)">Ferry</span>
          <span className="mono-meta text-(--ink-3-aa)">v2.4</span>
          <SidebarTrigger className="ms-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Reference" count={SIDEBAR.length} collapsible={false}>
            {SIDEBAR.map((item) => (
              <SidebarItem key={item.href} href={item.href} icon={item.icon} active={item.active}>
                {item.label}
              </SidebarItem>
            ))}
          </SidebarGroup>
          <Separator className="my-1" />
          <p className="m-0 px-3 text-[13px] leading-relaxed text-(--ink-3-aa)">
            Reference for 2.4. The 1.x pages are still published and marked as such.
          </p>
        </SidebarContent>
      </Sidebar>

      <article className="flex min-w-0 flex-1 flex-col gap-7 px-6 py-8">
        <div className="flex flex-col gap-3">
          {/* Named, not left on the default: the page this renders inside has
              a trail of its own, and two navigation landmarks both called
              "Breadcrumb" are indistinguishable by ear. */}
          <Breadcrumb
            label="Reference"
            items={[
              { label: 'Docs', href: '#docs' },
              { label: 'Queues', href: '#queues' },
              { label: 'enqueue' },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
              queue.enqueue()
            </h1>
            <Badge tone="outline">stable</Badge>
            <Badge>async</Badge>
          </div>
          <p className="m-0 max-w-(--w-reading) text-[15px] leading-relaxed text-(--ink-2)">
            Puts one job on a queue and returns as soon as the broker has it. It does not wait for a
            worker, and it is the only call in Ferry that writes.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Tag>queues</Tag>
            <Tag>write</Tag>
            <Tag>since 1.0</Tag>
          </div>
        </div>

        <Separator />

        <section aria-labelledby="signature" className="flex min-w-0 flex-col gap-3">
          <h2
            id="signature"
            className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
          >
            Signature
          </h2>
          {/* Wraps rather than scrolls. In the narrowest column in the set, a
              signature you have to drag sideways is a signature nobody reads. */}
          <pre className="m-0 overflow-hidden whitespace-pre-wrap break-words rounded-(--radius) border border-(--rule) bg-(--paper-2) p-4 font-mono text-xs leading-relaxed text-(--ink-2)">
            {`await queue.enqueue(name: string, payload: Json, options?: EnqueueOptions): Promise<JobId>`}
          </pre>
          <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
            The payload is serialised once, at the call site, so a value that cannot be represented
            as JSON fails here rather than inside a worker forty minutes later.
          </p>
        </section>

        <section aria-labelledby="options" className="flex min-w-0 flex-col gap-3">
          <h2
            id="options"
            className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
          >
            Options
          </h2>
          {/* Five columns in the narrowest column of any template here. The
              table takes its own scrollbar rather than making the page take
              one. */}
          <Table caption="EnqueueOptions" borders="grid" density="compact">
            <THead>
              <TR>
                <TH>Option</TH>
                <TH>Type</TH>
                <TH>Default</TH>
                <TH>Description</TH>
              </TR>
            </THead>
            <TBody>
              {OPTIONS.map((option) => (
                <TR key={option.name}>
                  <TD className="whitespace-nowrap font-mono text-xs text-(--ink)">
                    {option.name}
                  </TD>
                  <TD className="whitespace-nowrap font-mono text-xs text-(--ink-3-aa)">
                    {option.type}
                  </TD>
                  <TD className="whitespace-nowrap font-mono text-xs text-(--ink-3-aa)">
                    {option.fallback}
                  </TD>
                  <TD className="text-(--ink-2)">{option.note}</TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <h3
            id="ordering"
            className="m-0 mt-2 font-heading text-[15px] font-normal text-(--ink)"
          >
            Ordering guarantees
          </h3>
          <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
            Jobs of equal priority are claimed in the order they were accepted by the broker, which
            is not necessarily the order you called <code className="font-mono text-xs text-(--ink)">enqueue</code> in
            — two calls in the same tick can reach different brokers. If the order matters, it
            belongs in the payload.
          </p>
        </section>

        <section aria-labelledby="lifecycle" className="flex min-w-0 flex-col gap-3">
          <h2
            id="lifecycle"
            className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
          >
            What happens after
          </h2>
          <Steps
            label="The life of a job"
            marker="rule"
            steps={[
              { title: 'Accepted', note: 'The broker has it; enqueue resolves with the id.' },
              { title: 'Claimed', note: 'A worker leases it for the visibility timeout.' },
              { title: 'Running', note: 'Your handler. Anything it throws counts as an attempt.' },
              { title: 'Settled', note: 'Completed, or moved to the dead letter queue.', current: true },
            ]}
          />
        </section>

        <section aria-labelledby="failure" className="flex min-w-0 flex-col gap-3">
          <h2
            id="failure"
            className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
          >
            When it throws
          </h2>
          <Alert tone="warning" title="A rejected enqueue means the job does not exist">
            There is no partial state and nothing to clean up. Catch it where you would catch a
            failed database write, because that is what it is.
          </Alert>
          <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
            In the playground below, <Kbd>⌘</Kbd> <Kbd>Enter</Kbd> runs the snippet and{' '}
            <Kbd>Esc</Kbd> restores the original.
          </p>
        </section>

        <Separator />

        <nav aria-label="Page order" className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm">
            Queues overview
          </Button>
          <a
            href="#dead-letter"
            className="text-sm text-(--ink) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-(--ink)"
          >
            Dead letter queues
            <LinkArrow />
          </a>
        </nav>
      </article>

      {/* Numbered, and at the size of a row rather than of a footnote — the
          same shape the site's own contents rail settled on. An outline whose
          entries are smaller than everything they point at reads as small
          print beside the document rather than as a map of it. */}
      {/* "Contents", not "On this page". The documentation site's own rail
          beside this template carries that name, and two navigation landmarks
          with one accessible name is a reader hearing the same answer twice
          with nothing to tell them apart. */}
      <nav
        aria-label="Contents"
        className="w-48 shrink-0 border-s border-(--rule) p-6 max-@5xl:hidden"
      >
        <div className="sticky top-6 flex flex-col">
          <p className="m-0 mb-3 eyebrow text-(--ink-3-aa)">Contents</p>
          <ul className="m-0 flex list-none flex-col border-s border-(--rule) p-0">
            {CONTENTS.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`flex items-baseline gap-2.5 leading-snug text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) ${
                    item.level === 3 ? 'py-1.5 ps-8 text-[13px]' : 'py-2 ps-4 text-sm'
                  }`}
                >
                  <span aria-hidden className="mono-meta shrink-0 text-[11px] tabular-nums">
                    {NUMBERS[index]}
                  </span>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
    </SidebarProvider>
  )
}
