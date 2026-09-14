import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LinkArrow,
  Separator,
  StatusPill,
  Tag,
} from '@misoto22/folio'
import { RiDeleteBinLine, RiFileCopyLine, RiLinkM, RiMoreLine, RiNotification3Line } from '@remixicon/react'

const FACTS = [
  { label: 'Status', value: 'Mitigated' },
  { label: 'Severity', value: 'SEV-2' },
  { label: 'Component', value: 'image-worker' },
  { label: 'Owner', value: 'Ana Ruiz' },
  { label: 'Opened', value: '2 Sep 2026, 13:41 AEST' },
  { label: 'Mitigated', value: '2 Sep 2026, 14:12 AEST' },
  { label: 'Time to mitigate', value: '31 minutes' },
  { label: 'Customers affected', value: '4 workspaces' },
  { label: 'Linked deploy', value: 'a1b2c3d' },
]

const ACTIVITY = [
  {
    id: 'opened',
    who: 'Ana Ruiz',
    initials: 'AR',
    when: '13:41',
    what: 'Opened the incident after the thumbnail queue passed 20,000 items with no consumer.',
  },
  {
    id: 'escalated',
    who: 'Priya Raman',
    initials: 'PR',
    when: '13:48',
    what: 'Raised it to SEV-2. Uploads still succeed, so nothing is lost — but nothing renders either.',
  },
  {
    id: 'cause',
    who: 'Tom Whelan',
    initials: 'TW',
    when: '14:02',
    what: 'Found it: a1b2c3d changed the queue name and the worker deployment still reads the old one.',
  },
  {
    id: 'mitigated',
    who: 'Tom Whelan',
    initials: 'TW',
    when: '14:12',
    what: 'Rolled the worker forward to the new queue name. Backlog drained in eleven minutes.',
  },
  {
    id: 'follow-up',
    who: 'Ana Ruiz',
    initials: 'AR',
    when: '15:30',
    what: 'Filed the follow-up: the queue name belongs in one place, not in two deployments.',
  },
]

/**
 * One record, in full, assembled from the set.
 *
 * The screen a list exists to reach, and the one place in an application where
 * two columns are genuinely NOT equals. The body is prose on the measure —
 * paragraphs, a callout, a heading or two. The rail beside it is nine short
 * facts, each of them two lines at most. They have completely different natural
 * rhythms, and the failure mode is letting one of them set the other's: a
 * definition list spaced like paragraphs reads as nine separate blocks, and
 * paragraphs spaced like a definition list read as a table of sentences.
 *
 * So the rail is its own vertical scale — a hairline between rows, a mono label
 * above each value — and it is a `<dl>`, because that is what it is. The body
 * keeps the measure and the paragraph spacing it has everywhere else on the
 * site. Nothing tries to align them.
 *
 * The activity list at the bottom is the third rhythm, and the one that has to
 * survive uneven records: one entry is a sentence, another is three lines, and
 * the timestamp column has to hold its position through both.
 *
 * No state, so no `'use client'`. Every element is from the package.
 */
export function DetailPage() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-4 border-b border-(--rule) px-6 py-5 @3xl:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Named, not left on the default. A trail called "Breadcrumb" is
              fine until a second one is on the page — and a template is always
              rendered inside a page that already has one. */}
          <Breadcrumb
            label="Incident"
            items={[
              { label: 'Incidents', href: '#incidents' },
              { label: 'September', href: '#september' },
              { label: 'INC-284' },
            ]}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="gap-2">
              <RiNotification3Line size={14} aria-hidden />
              Subscribe
            </Button>
            <Button size="sm">Write the post-mortem</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" iconOnly aria-label="More actions for INC-284">
                  <RiMoreLine size={14} aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem icon={RiLinkM}>Copy a link</DropdownMenuItem>
                <DropdownMenuItem icon={RiFileCopyLine}>Duplicate as a template</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={RiDeleteBinLine} destructive>
                  Delete the incident
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-meta text-(--ink-3-aa)">INC-284</span>
            <Badge tone="warning">SEV-2</Badge>
            <StatusPill tone="success">Mitigated 31 minutes after it opened</StatusPill>
          </div>
          <h1 className="m-0 max-w-(--measure-record) font-heading text-[length:var(--fs-sub)] font-normal leading-tight text-(--ink)">
            Thumbnails stopped regenerating after the queue was renamed
          </h1>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag>image-worker</Tag>
            <Tag>queue</Tag>
            <Tag>deploy</Tag>
            <Tag>no data loss</Tag>
          </div>
        </div>
      </header>

      <div className="grid gap-8 px-6 py-8 @3xl:grid-cols-[minmax(0,1fr)_16rem] @3xl:px-8 @3xl:gap-10">
        <div className="flex min-w-0 flex-col gap-8">
          <section aria-labelledby="incident-summary" className="flex flex-col gap-4">
            <h2
              id="incident-summary"
              className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
            >
              What happened
            </h2>
            <div className="flex max-w-(--w-reading) flex-col gap-4 text-[15px] leading-relaxed text-(--ink-2)">
              <p className="m-0">
                Deploy a1b2c3d renamed the thumbnail queue from{' '}
                <code className="font-mono text-[13px] text-(--ink)">thumbs</code> to{' '}
                <code className="font-mono text-[13px] text-(--ink)">media.thumbs</code>. The
                producer shipped with that deploy; the worker deployment is a separate manifest and
                still had the old name, so it sat idle against a queue nothing was writing to.
              </p>
              <p className="m-0">
                Uploads kept succeeding the whole time — originals were stored, and nothing was
                lost. What broke was everything downstream of a thumbnail: gallery pages rendered
                empty frames, and four workspaces with scheduled exports got a PDF with holes in it.
              </p>
              <p className="m-0">
                The queue name now comes from one shared configuration value read by both
                manifests. A rename that only lands in one of two places is not a rename; it is an
                outage with a delay on it.
              </p>
            </div>

            <Alert tone="success" title="Mitigated at 14:12 AEST">
              The worker was rolled forward rather than the deploy rolled back, because the
              producer’s change was correct — only the second manifest was behind.
            </Alert>
          </section>

          <Separator />

          <section aria-labelledby="incident-activity" className="flex flex-col gap-5">
            <h2
              id="incident-activity"
              className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
            >
              Activity
            </h2>

            {/* Uneven by nature — one entry is a clause, the next is three
                lines. The timestamp holds its own column so the eye can read
                down the times without the sentences dragging them out of
                line. */}
            <ol className="m-0 flex list-none flex-col divide-y divide-(--rule) p-0">
              {ACTIVITY.map((entry) => (
                <li key={entry.id} className="grid gap-2 py-4 @2xl:grid-cols-[4.5rem_minmax(0,1fr)] @2xl:gap-6">
                  <span className="mono-meta text-(--ink-3-aa)">{entry.when}</span>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar alt="" fallback={entry.initials} size="sm" />
                      <span className="text-[13px] text-(--ink)">{entry.who}</span>
                    </div>
                    <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-2)">
                      {entry.what}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href="#audit"
              className="text-[13px] text-(--ink-2) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:text-(--ink) hover:decoration-(--ink)"
            >
              Full audit log, including the automated entries
              <LinkArrow />
            </a>
          </section>
        </div>

        {/* Its own vertical scale, deliberately. Spacing these nine rows like
            paragraphs turns a reference list into nine unrelated blocks. */}
        <aside aria-labelledby="incident-details" className="flex flex-col gap-4">
          <h2
            id="incident-details"
            className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)"
          >
            Details
          </h2>
          <dl className="m-0 flex flex-col divide-y divide-(--rule) border-y border-(--rule)">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-0.5 py-2.5">
                <dt className="eyebrow text-(--ink-3-aa)">{fact.label}</dt>
                <dd className="m-0 text-[13px] text-(--ink)">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">
            Times are the workspace’s, not the reader’s. An incident that says 14:12 to one person
            and 04:12 to another cannot be discussed.
          </p>
        </aside>
      </div>
    </div>
  )
}
