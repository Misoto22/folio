'use client'

import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Pagination,
  Select,
  SelectItem,
  StatusDot,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  ToggleGroup,
  ToggleGroupItem,
  type SortDirection,
} from '@misoto22/folio'
import { RiAddLine, RiDeleteBinLine, RiDownloadLine, RiFileCopyLine, RiMoreLine, RiSearchLine, RiSendPlaneLine } from '@remixicon/react'
import { useMemo, useState } from 'react'

type State = 'paid' | 'open' | 'overdue'

interface Invoice {
  id: string
  client: string
  issued: string
  due: string
  cents: number
  state: State
}

const INVOICES: Invoice[] = [
  { id: 'INV-2051', client: 'Marram Records', issued: '28 Aug', due: '27 Sep', cents: 412000, state: 'open' },
  { id: 'INV-2049', client: 'Tessellate Press', issued: '26 Aug', due: '25 Sep', cents: 96500, state: 'paid' },
  { id: 'INV-2047', client: 'Hallow Bay Cider', issued: '19 Aug', due: '18 Sep', cents: 231000, state: 'open' },
  { id: 'INV-2044', client: 'Marram Records', issued: '11 Aug', due: '10 Sep', cents: 78000, state: 'paid' },
  { id: 'INV-2041', client: 'Northline Ferries', issued: '2 Aug', due: '1 Sep', cents: 1544000, state: 'overdue' },
  { id: 'INV-2038', client: 'Tessellate Press', issued: '24 Jul', due: '23 Aug', cents: 52500, state: 'paid' },
  { id: 'INV-2035', client: 'Kestrel Foundry', issued: '17 Jul', due: '16 Aug', cents: 689000, state: 'overdue' },
  { id: 'INV-2033', client: 'Hallow Bay Cider', issued: '9 Jul', due: '8 Aug', cents: 118000, state: 'paid' },
]

const STATES: Record<State, { label: string; tone: 'success' | 'neutral' | 'danger' }> = {
  paid: { label: 'Paid', tone: 'success' },
  open: { label: 'Open', tone: 'neutral' },
  overdue: { label: 'Overdue', tone: 'danger' },
}

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * A data table with the controls a real one comes with.
 *
 * The Dashboard already shows a table; this shows what happens to it once the
 * screen around it is finished. Four things arrive at the same time, and each
 * one is fine alone:
 *
 *   filtering   a search box, a client select and a state strip, which together
 *               are wide enough to need their own wrap rules above a table that
 *               scrolls on its own axis
 *   sorting     one column, opt-in, whose header is now a button competing with
 *               a checkbox for the same header row
 *   selection   a header box that has to say "some" as well as "all or none",
 *               which is the state a plain unchecked box reports as its
 *               opposite
 *   pagination  which is what makes the selection count a lie unless the copy
 *               says "on this page"
 *
 * The bulk bar is drawn OVER the table rather than inserted above it — it is
 * sticky at the bottom edge — so selecting a row does not push every row under
 * the pointer down by forty pixels while the reader is still clicking.
 *
 * Filtering to nothing lands in an `EmptyState` rather than a blank rectangle,
 * which is the case a table demo never has and every real table hits on its
 * first day.
 *
 * Every element is from the package.
 */
export function TableFilter() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('all')
  const [client, setClient] = useState('all')
  const [sort, setSort] = useState<SortDirection>('descending')
  const [selected, setSelected] = useState<string[]>([])

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = INVOICES.filter(
      (invoice) =>
        (state === 'all' || invoice.state === state) &&
        (client === 'all' || invoice.client === client) &&
        (needle === '' ||
          invoice.id.toLowerCase().includes(needle) ||
          invoice.client.toLowerCase().includes(needle)),
    )
    if (sort === 'none') return filtered
    return [...filtered].sort((a, b) =>
      sort === 'ascending' ? a.cents - b.cents : b.cents - a.cents,
    )
  }, [query, state, client, sort])

  const visible = rows.map((invoice) => invoice.id)
  const chosen = selected.filter((id) => visible.includes(id))
  const all = chosen.length > 0 && chosen.length === visible.length
  const some = chosen.length > 0 && !all

  return (
    <div className="flex min-h-[34rem] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-(--rule) px-5 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
            Invoices
          </h1>
          <span className="mono-meta text-(--ink-3-aa)">
            {rows.length} of {INVOICES.length} shown · 3 pages
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="gap-2">
            <RiDownloadLine size={14} aria-hidden />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <RiAddLine size={14} aria-hidden />
            New invoice
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-b border-(--rule) px-5 py-3">
        <div className="relative w-full @xl:w-60">
          <RiSearchLine
            size={14}
            aria-hidden
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-(--ink-3-aa)"
          />
          <Input
            aria-label="Search invoices"
            placeholder="Number or client…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="ps-9"
          />
        </div>

        <Select label="Client" value={client} onValueChange={setClient} className="w-44">
          <SelectItem value="all">All clients</SelectItem>
          <SelectItem value="Marram Records">Marram Records</SelectItem>
          <SelectItem value="Tessellate Press">Tessellate Press</SelectItem>
          <SelectItem value="Hallow Bay Cider">Hallow Bay Cider</SelectItem>
          <SelectItem value="Northline Ferries">Northline Ferries</SelectItem>
          <SelectItem value="Kestrel Foundry">Kestrel Foundry</SelectItem>
        </Select>

        <ToggleGroup
          type="single"
          value={state}
          onValueChange={(next) => setState(next || 'all')}
          aria-label="State"
          className="ms-auto"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="overdue">Overdue</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          className="py-16"
          icon={RiSearchLine}
          title="No invoice matches those filters"
          description="Nothing here is paid, open and overdue at once. Widen the state strip, or clear the client."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('')
                setState('all')
                setClient('all')
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <Table caption="Invoices" density="compact">
          <THead>
            <TR>
              <TH className="w-10">
                <Checkbox
                  aria-label="Select every invoice on this page"
                  checked={some ? 'indeterminate' : all}
                  onCheckedChange={(next) => setSelected(next === true ? visible : [])}
                />
              </TH>
              <TH>Invoice</TH>
              <TH>Client</TH>
              <TH>Issued</TH>
              <TH>Due</TH>
              <TH>State</TH>
              {/* The only sortable column, because it is the only one whose
                  order means anything: sorting by client name is a filter
                  people reach for by accident. */}
              <TH
                align="end"
                sortable
                sortDirection={sort}
                onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}
              >
                Amount
              </TH>
              {/* `relative` is load-bearing. `sr-only` is `position: absolute`,
                  and an absolutely positioned box is clipped by an overflow
                  ancestor only when that ancestor sits between it and its
                  containing block. With nothing positioned in the table, this
                  label's containing block was the document, so it escaped the
                  table's own scroll container AND the frame around it — and
                  made a phone scroll sideways by the table's full width. */}
              <TH className="relative w-10">
                <span className="sr-only">Actions</span>
              </TH>
            </TR>
          </THead>
          {/* A selected row gets a change of ground, not a tint: the system has
              one accent and spending it on "you ticked this" leaves nothing for
              the action the row is heading towards. */}
          <TBody>
            {/* Every cell is `align-middle`. The row action is a 36px button
                and the values are one line, so the row is twenty pixels taller
                than its own contents — top-aligned, every column but the button
                hangs at the top of that and the table reads as if a column has
                slipped. TD is top by default because the common table in this
                system holds paragraphs; this one holds values. */}
            {rows.map((invoice) => (
              <TR
                key={invoice.id}
                className={chosen.includes(invoice.id) ? 'bg-(--paper-2)' : undefined}
              >
                <TD className="align-middle">
                  <Checkbox
                    aria-label={`Select ${invoice.id}`}
                    checked={chosen.includes(invoice.id)}
                    onCheckedChange={(next) =>
                      setSelected((previous) =>
                        next === true
                          ? [...previous, invoice.id]
                          : previous.filter((id) => id !== invoice.id),
                      )
                    }
                  />
                </TD>
                <TD className="font-mono text-xs text-(--ink) align-middle">{invoice.id}</TD>
                <TD className="align-middle">{invoice.client}</TD>
                <TD className="text-(--ink-3-aa) align-middle">{invoice.issued}</TD>
                <TD className="text-(--ink-3-aa) align-middle">{invoice.due}</TD>
                <TD className="align-middle">
                  <span className="flex items-center gap-2">
                    <StatusDot tone={STATES[invoice.state].tone} />
                    {STATES[invoice.state].label}
                  </span>
                </TD>
                <TD align="end" className="tabular-nums align-middle">
                  {money(invoice.cents)}
                </TD>
                <TD align="end" className="align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        iconOnly
                        aria-label={`Actions for ${invoice.id}`}
                      >
                        <RiMoreLine size={14} aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem icon={RiSendPlaneLine}>Send a reminder</DropdownMenuItem>
                      <DropdownMenuItem icon={RiFileCopyLine}>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem icon={RiDownloadLine}>Download PDF</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem icon={RiDeleteBinLine} destructive>
                        Void this invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-(--rule) px-5 py-3">
        <span className="mono-meta text-(--ink-3-aa)">Page 1 of 3</span>
        <Pagination page={1} pageCount={3} onPageChange={() => {}} label="Invoices" />
      </div>

      {/* Sticky over the last rows rather than inserted above the first one.
          Inserting it is the version that moves every row down the instant a
          box is ticked, under a pointer that is still there. The count says
          "on this page" because pagination makes any other count untrue. */}
      {chosen.length > 0 && (
        <div className="sticky bottom-0 z-(--z-sticky) flex flex-wrap items-center gap-3 border-t border-(--rule-hard) bg-(--paper) px-5 py-3">
          <Badge>{chosen.length} selected on this page</Badge>
          <div className="ms-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
            <Button size="sm" variant="secondary" className="gap-2">
              <RiSendPlaneLine size={14} aria-hidden />
              Send reminders
            </Button>
            <Button size="sm" variant="danger">
              Void
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
