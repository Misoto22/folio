'use client'

import { Badge, Button, Input, Select, SelectItem, Switch, TBody, TD, TH, THead, TR, Table, cn } from '@misoto22/folio'
import { RiAddLine, RiCheckLine, RiFileCopyLine, RiResetLeftLine, RiSubtractLine } from '@remixicon/react'
import { Component, createElement, useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { COMPONENTS } from '@/generated/component-registry'
import type { Locale } from '@/i18n/locales'
import { fill, getMessages } from '@/i18n/messages'
import type { PropRow } from '@/lib/docs'
import { controlFor, type PropControl, type TypeAlias } from '@/lib/prop-controls'

/** One documented prop and the control it earned. */
interface Field {
  row: PropRow
  control: PropControl
}

export interface PropsPlaygroundProps {
  /** The export to drive — the key into the generated component registry. */
  name: string
  /**
   * Every documented prop, with `description` already put through `apiCopy`.
   *
   * Resolved on the server rather than in here. The translated API reference is
   * a few thousand lines of prose keyed by every prop in the package, and a
   * client component that imports it drags the whole table across the boundary
   * to print forty rows of it.
   */
  rows: PropRow[]
  /**
   * The union of EVERY directory's `exportedTypes`, not this one's.
   *
   * The package declares `StatusTone` on `StatusDot` and uses it on
   * `StatusPill`, so a per-directory list silently loses the control on the
   * second one — and losing a control looks exactly like a prop that has none.
   */
  aliases: readonly TypeAlias[]
  /** Type expressions the extractor chose not to enumerate. */
  passthrough: string[]
  /**
   * The read-only props table, rendered on the server.
   *
   * Handed over rather than built here for the same reason as the descriptions
   * above, and it is what the panel falls back to when the preview cannot run.
   */
  fallback: ReactNode
  /** Extra room an open panel needs — see `previewHeight` in the registry. */
  previewHeight?: string
  locale?: Locale
}

/**
 * What the preview frame has to pin for a component to render honestly INSIDE
 * a page that is already a whole application.
 *
 * The site's own opinion, in the same sense as `PREVIEW_HEIGHTS` in the content
 * registry: it describes the frame, not the component, so the package has no
 * business answering it and a hand-kept map here is the honest place for it.
 *
 * `AppShell` states its own case in its prop docs — `contentAs` is documented
 * as the thing "an AppShell rendered INSIDE another page — a preview on a
 * documentation site" must pass, and `sidebarLabel` the same for the pair of
 * `complementary` landmarks that nesting makes. Every AppShell example on the
 * site already passes both. The panel was the one call site that did not.
 *
 * The six `aria-label`s below document no props at all — `Checkbox` is
 * `ComponentProps<typeof CheckboxPrimitive.Root>` and nothing more — so there
 * is no row to seed and no control to offer. Their accessible name comes from
 * the call site, and here the panel IS the call site: a preview of a naked,
 * unnamed checkbox is not the component being honest, it is the panel handing
 * a screen reader a button with nothing to announce.
 *
 * `Slider.label` is the same defect arrived at from the other end. It is a
 * REQUIRED, documented prop — but it types as `string | [string, string]`, one
 * name or one per thumb, and `prop-controls.ts` rightly refuses a union it
 * cannot enumerate. So the row exists, the control is `none`, and `placeholder`
 * does not reach it either: it seeds required ReactNode slots and empty text
 * fields, and this is neither. The panel therefore mounted `<Slider />` with no
 * name at all, and the thumb it renders carries `role="slider"`. It is the only
 * required naming prop in the package that lands this way — `Progress`,
 * `Combobox`, `Select` and `FloatingIconButton` all take a plain `string` and
 * are seeded by `placeholder`, and `Table.caption` likewise.
 *
 * Pinned values are the FRAME's, not the reader's, so they stay out of `Copy
 * JSX`. A documented prop keeps its row and its control, seated at the pinned
 * value rather than at the component's default, and the existing "changed, or
 * required" rule then leaves it out of the snippet until the reader moves it.
 * An undocumented one — the `aria-label`s — has no row to appear in.
 *
 * Nothing keeps this list current except the sweep that made it necessary:
 * `apps/docs/e2e/a11y.spec.ts` runs axe over this panel on every component
 * page, so a new form control with no name fails `button-name` the day it
 * lands.
 */
const PINNED: Record<string, Record<string, unknown>> = {
  AppShell: { contentAs: 'div', sidebarLabel: 'Preview sidebar' },
  RecoveryState: { code: '404', heading: 'Page unavailable', message: 'Choose another destination.', level: 2 },
  Checkbox: { 'aria-label': 'Checkbox' },
  Input: { 'aria-label': 'Input' },
  NativeSelect: { 'aria-label': 'NativeSelect' },
  NumberField: { 'aria-label': 'NumberField' },
  Slider: { label: 'Slider' },
  Switch: { 'aria-label': 'Switch' },
  Textarea: { 'aria-label': 'Textarea' },
}

/** `ReactNode` as the extractor writes it — source text, so both spellings occur. */
const NODE = /^(React\.)?ReactNode$/

/**
 * The stand-in for a REQUIRED prop the panel has nothing to put in.
 *
 * `prop-controls.ts` refuses a non-`children` `ReactNode` on purpose: a slot is
 * a title, an icon, an action, and inventing one is how a panel starts
 * documenting a component nobody wrote. That refusal is right for an OPTIONAL
 * slot — empty is exactly what a call site leaving it out would see. For a
 * required one it renders a state no call site can reach: an `EmptyState` whose
 * heading is empty, a `Progress` whose name is `""`. The reader is then looking
 * at a bug the component does not have, and axe is looking at `empty-heading`.
 *
 * The prop's own name, so what is on screen greps back to the row that put it
 * there.
 */
function placeholder(row: PropRow, control: PropControl): string | undefined {
  if (!row.required) return undefined
  if (control.kind === 'none' && NODE.test(row.type.trim())) return row.name
  if (control.kind === 'text' && control.fallback === '') return row.name
  return undefined
}

/** The same control, resting somewhere else — where the panel has a better start than the type does. */
function reseat(control: PropControl, value: string): PropControl {
  if (control.kind === 'text') return { ...control, fallback: value }
  if (control.kind === 'enum' && control.options.includes(value)) return { ...control, fallback: value }
  return control
}

/**
 * One prop's control, after the panel has had its say about where it starts.
 *
 * A pinned value wins over a placeholder: the frame's requirement is the reason
 * the preview renders at all, and a required slot that is also pinned has
 * already been answered.
 */
function seatedControl(name: string, row: PropRow, aliases: readonly TypeAlias[]): PropControl {
  const control = controlFor(row, aliases)
  const pinned = PINNED[name]?.[row.name]
  if (typeof pinned === 'string') return reseat(control, pinned)

  const seed = placeholder(row, control)
  return seed === undefined ? control : reseat(control, seed)
}

/**
 * The props of a component, as controls attached to a running copy of it.
 *
 * A prop table answers "what may I pass"; it does not answer "what does passing
 * it look like", and that second question is the one a reader actually has. So
 * every prop this system can steer from a type alone gets a control here, and
 * the component above re-renders as they move — which is the difference between
 * a reference and a thing you can try.
 *
 * What is steerable is decided in `lib/prop-controls.ts`, and it refuses far
 * more than it accepts. That is the right bias: a control that guesses wrong
 * does not render a slightly-off row, it renders a broken preview, and a reader
 * has no way to tell whether the component or the documentation is at fault.
 *
 * `className` is dropped here rather than there. It types as `string`, so the
 * rules correctly hand it a text field — but a text field that injects
 * arbitrary classes into the preview is a footgun dressed as a feature, and the
 * rules are about types, not about what belongs on a page.
 */
export function PropsPlayground({
  name,
  rows,
  aliases,
  passthrough,
  fallback,
  previewHeight,
  locale = 'en',
}: PropsPlaygroundProps) {
  const t = getMessages(locale)
  const labelBase = useId()

  const fields = useMemo(
    () =>
      rows
        .filter((row) => row.name !== 'className')
        .map((row) => ({ row, control: seatedControl(name, row, aliases) }))
        // Required first, then alphabetically — the order `PropsTable` and
        // `steerableProps` both use. Two lists of the same props in two orders
        // on one page read as two different components.
        .sort((a, b) => {
          if (a.row.required !== b.row.required) return a.row.required ? -1 : 1
          return a.row.name.localeCompare(b.row.name)
        }),
    [name, rows, aliases],
  )

  const fallbacks = useMemo(() => seed(fields), [fields])
  const [values, setValues] = useState<Record<string, unknown>>(fallbacks)
  const [copied, setCopied] = useState(false)
  // The snippet that threw, rather than a sticky flag: a reader who steers back
  // out of a combination the component could not render gets a working preview
  // again instead of a panel that has given up on them.
  const [failedFor, setFailedFor] = useState<string | null>(null)

  const Subject = COMPONENTS[name]
  const jsx = toJsx(name, fields, values)
  // A full document shell cannot be mounted inside this page's main landmark.
  const failed = failedFor === jsx || name === 'SiteShell'

  // The acknowledgement is a moment, not a state. A button that reads "Copied"
  // for the rest of the visit stops saying anything about the click that just
  // happened — which is the only thing it was there to say.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const reset = () => {
    setValues(fallbacks)
    setCopied(false)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(jsx)
      setCopied(true)
    } catch {
      // Denied in some embedded contexts. The snippet is reachable through the
      // controls either way, and throwing here would take the panel with it.
    }
  }

  // Generated data and the generated registry disagreeing is a build-time
  // mistake rather than a runtime state, and the honest thing to show for it is
  // the page as it was before this panel existed — not a preview frame with an
  // explanation in it that would be a guess.
  if (!Subject) return <>{fallback}</>

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-(--radius-lg) border border-(--rule)">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--rule) bg-(--paper-2) px-2 py-1.5">
          <span className="ps-2 mono-meta text-(--ink-3-aa)">{t.playground.title}</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={copy} className="gap-2">
              {copied ? (
                <RiCheckLine size={14} aria-hidden />
              ) : (
                <RiFileCopyLine size={14} aria-hidden />
              )}
              {copied ? t.playground.copied : t.playground.copy}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset} className="gap-2">
              <RiResetLeftLine size={14} aria-hidden />
              {t.playground.reset}
            </Button>
          </div>
        </div>

        {failed ? (
          <p className="m-0 max-w-(--w-reading) p-8 text-sm leading-relaxed text-(--ink-3-aa)">
            {t.playground.standalone}
          </p>
        ) : (
          <div className={cn('flex min-h-32 items-start justify-center p-8', previewHeight)}>
            {/* Keyed by the snippet, which is the whole of the panel's state,
                so a boundary that has caught once is not the boundary asked to
                render the next combination. */}
            <PreviewBoundary key={jsx} onFail={() => setFailedFor(jsx)}>
              {createElement(Subject, previewProps(name, fields, values))}
            </PreviewBoundary>
          </div>
        )}
      </div>

      {failed ? (
        fallback
      ) : (
        <ControlTable
          name={name}
          fields={fields}
          values={values}
          setValues={setValues}
          labelBase={labelBase}
          locale={locale}
        />
      )}

      {passthrough.length > 0 && !failed && (
        <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">
          {fill(t.table.passthrough, { types: passthrough.join(', ') })}
        </p>
      )}
    </div>
  )
}

/**
 * Every prop, with a control on the ones that have earned one.
 *
 * One table rather than a steerable list above a read-only one. The reader is
 * looking for a prop by name, not by whether this panel happens to be able to
 * drive it, and splitting the list makes them look in two places to find out
 * that the answer is "no control".
 */
function ControlTable({
  name,
  fields,
  values,
  setValues,
  labelBase,
  locale,
}: {
  name: string
  fields: Field[]
  values: Record<string, unknown>
  setValues: (next: (current: Record<string, unknown>) => Record<string, unknown>) => void
  labelBase: string
  locale: Locale
}) {
  const t = getMessages(locale)
  if (fields.length === 0) {
    return <p className="m-0 text-sm text-(--ink-3-aa)">{t.table.noProps}</p>
  }

  const set = (prop: string, value: unknown) =>
    setValues((current) => ({ ...current, [prop]: value }))

  return (
    <Table caption={`${name} props`}>
      <THead>
        <TR>
          <TH>{t.table.prop}</TH>
          <TH className="w-56">{t.table.control}</TH>
          <TH>{t.table.description}</TH>
        </TR>
      </THead>
      <TBody>
        {fields.map(({ row, control }) => {
          const labelId = `${labelBase}-${row.name}`
          return (
            <TR key={row.name}>
              <TD className="align-top">
                <span className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span id={labelId} className="font-mono text-xs text-(--ink)">
                      {row.name}
                    </span>
                    {row.required && <Badge tone="outline">{t.table.required}</Badge>}
                  </span>
                  <code className="font-mono text-xs text-(--ink-3-aa)">{row.type}</code>
                </span>
              </TD>
              <TD className="align-top">
                <Control
                  control={control}
                  name={row.name}
                  labelId={labelId}
                  locale={locale}
                  value={values[row.name]}
                  onChange={(next) => set(row.name, next)}
                />
              </TD>
              <TD className="max-w-(--measure-record) align-top text-[13px] leading-relaxed">
                {row.description || <span className="text-(--ink-3-aa)">—</span>}
              </TD>
            </TR>
          )
        })}
      </TBody>
    </Table>
  )
}

/** The one control a prop's type earned, named by the prop cell beside it. */
function Control({
  control,
  name,
  labelId,
  locale,
  value,
  onChange,
}: {
  control: PropControl
  name: string
  labelId: string
  locale: Locale
  value: unknown
  onChange: (next: unknown) => void
}) {
  const t = getMessages(locale)

  switch (control.kind) {
    case 'boolean':
      return (
        <Switch
          aria-labelledby={labelId}
          checked={value === true}
          onCheckedChange={(next) => onChange(next)}
        />
      )
    case 'enum':
      return (
        <Select label={name} value={String(value ?? control.fallback)} onValueChange={onChange}>
          {control.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
      )
    case 'text':
      return (
        <Input
          aria-labelledby={labelId}
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          aria-labelledby={labelId}
          value={String(value ?? 0)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      )
    case 'nodeCount':
      return (
        <Stepper
          count={typeof value === 'number' ? value : control.fallback}
          onChange={onChange}
          labelId={labelId}
          fewer={t.playground.fewer}
          more={t.playground.more}
        />
      )
    default:
      // `none`. The row stays, because a reader looking a prop up needs to find
      // it; only the control is missing, and the dash says so rather than
      // leaving a cell that looks like a rendering bug.
      return (
        <span aria-hidden className="text-(--rule-2)">
          —
        </span>
      )
  }
}

/** How many children the preview renders. Never below zero — there is no such list. */
function Stepper({
  count,
  onChange,
  labelId,
  fewer,
  more,
}: {
  count: number
  onChange: (next: number) => void
  labelId: string
  fewer: string
  more: string
}) {
  return (
    <span role="group" aria-labelledby={labelId} className="inline-flex items-center gap-2">
      <Button
        iconOnly
        size="sm"
        variant="secondary"
        aria-label={fewer}
        disabled={count <= 0}
        onClick={() => onChange(Math.max(0, count - 1))}
      >
        <RiSubtractLine size={14} aria-hidden />
      </Button>
      <output className="w-4 text-center font-mono text-xs text-(--ink)">{count}</output>
      <Button
        iconOnly
        size="sm"
        variant="secondary"
        aria-label={more}
        onClick={() => onChange(count + 1)}
      >
        <RiAddLine size={14} aria-hidden />
      </Button>
    </span>
  )
}

/**
 * The preview, with a floor under it.
 *
 * Not every export renders on its own: a `DialogContent` outside a `Dialog` and
 * a `TabsTrigger` outside `Tabs` read a context that is not there and throw.
 * Fifty-one pages working and one white screen is a worse documentation site
 * than fifty-two showing a table, so the throw is caught and the panel falls
 * back to exactly what the page had before this existed.
 */
class PreviewBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    // Commit phase, so telling the panel here is legal — and it has to be told,
    // because the controls below steer a component that is not rendering.
    this.props.onFail()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Each control's `fallback`, which is the component's own default wherever one was recorded. */
function seed(fields: Field[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const { row, control } of fields) {
    if (control.kind !== 'none') values[row.name] = control.fallback
  }
  return values
}

/**
 * `n` plausible children.
 *
 * Separate children rather than one joined string, because the count is the
 * whole point of the control. The leading space keeps them from running
 * together in a component that lays its children out inline.
 */
function childLabels(count: number): string[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) =>
    index === 0 ? 'Item 1' : ` Item ${index + 1}`,
  )
}

/**
 * Which props to actually pass, and why it is not simply "all of them".
 *
 * A prop left at its fallback is omitted, so the component applies its own
 * default rather than being handed a copy of it — the two are the same value
 * until someone changes the default in the package, at which point the panel
 * would be the last place still showing the old one.
 *
 * A REQUIRED prop is always passed, even at its fallback. A required prop is
 * required: omitting it does not show the default, it shows the component
 * failing.
 */
function previewProps(
  name: string,
  fields: Field[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  // The frame's pins go down first, so a reader who moves one of them off its
  // seat below overwrites it — and one they never touch survives the "unchanged
  // props are the component's own business" rule that would otherwise drop it.
  const props: Record<string, unknown> = { ...PINNED[name] }
  for (const { row, control } of fields) {
    if (control.kind === 'none') {
      // A required slot with no control still has to hold something. Preview
      // only: there is no control, so there is nothing the reader chose, and
      // `toJsx` leaves it out for exactly that reason.
      const slot = placeholder(row, control)
      if (slot !== undefined) props[row.name] = slot
      continue
    }
    const value = values[row.name]
    if (control.kind === 'nodeCount') {
      props.children = childLabels(Number(value))
      continue
    }
    if (!row.required && value === control.fallback) continue
    props[row.name] = value
  }
  return props
}

/** A string value as a JSX attribute — quoted, or an expression when it cannot be. */
function quote(value: string): string {
  return value.includes('"') ? `{${JSON.stringify(value)}}` : `"${value}"`
}

/**
 * The current state as a call site the reader can paste.
 *
 * Minimal on purpose. A snippet listing every prop at its default is a dump of
 * the table above it, and the reader has to diff it against the defaults to
 * find the two attributes they actually chose — which is the work this button
 * exists to do for them. Same rule as the preview: changed, or required.
 */
function toJsx(name: string, fields: Field[], values: Record<string, unknown>): string {
  const attributes: string[] = []
  let children: string[] = []

  for (const { row, control } of fields) {
    if (control.kind === 'none') continue
    const value = values[row.name]
    if (control.kind === 'nodeCount') {
      children = childLabels(Number(value))
      continue
    }
    if (!row.required && value === control.fallback) continue

    if (control.kind === 'boolean') {
      // A bare attribute is `true`, which is the whole reason JSX allows it.
      attributes.push(value === true ? row.name : `${row.name}={false}`)
    } else if (control.kind === 'number') {
      attributes.push(`${row.name}={${Number(value)}}`)
    } else {
      attributes.push(`${row.name}=${quote(String(value ?? ''))}`)
    }
  }

  const open = [name, ...attributes].join(' ')
  if (children.length === 0) return `<${open} />`
  if (children.length === 1) return `<${open}>${children[0]}</${name}>`
  return [`<${open}>`, ...children.map((child) => `  ${child.trim()}`), `</${name}>`].join('\n')
}
