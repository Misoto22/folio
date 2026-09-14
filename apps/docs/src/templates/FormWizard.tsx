'use client'

import {
  Alert,
  Badge,
  Button,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectItem,
  Separator,
  Steps,
  Switch,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Textarea,
} from '@misoto22/folio'
import { RiArrowLeftLine, RiArrowRightLine, RiRocketLine } from '@remixicon/react'
import { useState } from 'react'

/**
 * The steps, and what each one asks for.
 *
 * One list, read twice: `Steps` renders it as the rail, and the switch below
 * renders the fields for `steps[current]`. Keeping the titles in a second
 * literal beside the fields is how a wizard ends up saying "Build" on the rail
 * while showing the variables form.
 */
const STEPS = [
  { id: 'source', title: 'Source', note: 'Repository, branch, root directory' },
  { id: 'build', title: 'Build', note: 'Framework preset and output' },
  { id: 'variables', title: 'Variables', note: 'Environment values and secrets' },
  { id: 'review', title: 'Review', note: 'What will be created' },
]

const VARIABLES = [
  { key: 'DATABASE_URL', value: 'postgres://…@db.internal:5432/site', secret: true },
  { key: 'NEXT_PUBLIC_SITE_URL', value: 'https://staging.longbeach.studio', secret: false },
  { key: 'IMAGE_CDN_TOKEN', value: '••••••••••••••••', secret: true },
]

/**
 * A four-step form, assembled from the set.
 *
 * `Steps` is a display rail. It draws a sequence and marks where the sequence
 * has got to, and that is all it does — it holds no state, owns no fields, and
 * cannot know whether the form under it is showing the step it has marked. That
 * seam is the whole reason this template exists: a wizard is the one screen
 * where the navigation and the content can silently disagree, and the only
 * defence is that both read the SAME list. `STEPS` above is that list. The rail
 * maps it; the form switches on an index into it. There is no second copy of
 * the titles anywhere in this file.
 *
 * The rest is what a wizard has to get right regardless of the system: the back
 * button exists from step two and is never the loud one, the last step reads
 * the entered values back rather than saying "you're all set", and the field
 * that will not be undoable later — the region — is the one carrying the note
 * saying so.
 *
 * Every element is from the package.
 */
export function FormWizard() {
  const [current, setCurrent] = useState(0)
  const [name, setName] = useState('staging')
  const [branch, setBranch] = useState('main')
  const [region, setRegion] = useState('syd')
  const [preset, setPreset] = useState('next')
  const [buildCommand, setBuildCommand] = useState('pnpm build')
  const [protect, setProtect] = useState(true)

  const step = STEPS[current]!
  const last = current === STEPS.length - 1

  return (
    <div className="flex min-h-[34rem] flex-col">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-(--rule) px-6 py-5">
        <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
          New environment
        </h1>
        <span className="mono-meta text-(--ink-3-aa)">
          Step {current + 1} of {STEPS.length}
        </span>
      </header>

      <div className="grid min-w-0 grid-cols-1 @3xl:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="border-b border-(--rule) px-6 py-6 @3xl:border-b-0 @3xl:border-e">
          <Steps
            label="Create an environment"
            steps={STEPS.map((entry, index) => ({
              id: entry.id,
              title: entry.title,
              note: entry.note,
              current: index === current,
            }))}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)">
              {step.title}
            </h2>
            <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
              {step.note}
            </p>
          </div>

          {current === 0 && (
            <div className="flex max-w-(--w-reading) flex-col gap-5">
              <Field label="Environment name" required hint="Lowercase, and it appears in the URL.">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Field label="Repository" required>
                <Input defaultValue="longbeach/studio-site" />
              </Field>
              <div className="grid gap-5 @2xl:grid-cols-2">
                <Field label="Branch" required>
                  <Input value={branch} onChange={(event) => setBranch(event.target.value)} />
                </Field>
                <Field label="Root directory" hint="Leave empty for the repository root.">
                  <Input placeholder="apps/site" />
                </Field>
              </div>
              <Field
                label="Region"
                hint="Where the build runs and the data sits. This cannot be changed after the environment exists."
              >
                <Select label="Region" value={region} onValueChange={setRegion}>
                  <SelectItem value="syd">Sydney (ap-southeast-2)</SelectItem>
                  <SelectItem value="sin">Singapore (ap-southeast-1)</SelectItem>
                  <SelectItem value="fra">Frankfurt (eu-central-1)</SelectItem>
                </Select>
              </Field>
            </div>
          )}

          {current === 1 && (
            <div className="flex max-w-(--w-reading) flex-col gap-5">
              <RadioGroup value={preset} onValueChange={setPreset} aria-label="Framework preset">
                <RadioGroupItem value="next">Next.js — detected from next.config.mjs</RadioGroupItem>
                <RadioGroupItem value="static">Static output — a directory of files</RadioGroupItem>
                <RadioGroupItem value="none">No preset — I will write the commands</RadioGroupItem>
              </RadioGroup>

              <Separator />

              <div className="grid gap-5 @2xl:grid-cols-2">
                <Field label="Build command" required>
                  <Input
                    className="font-mono text-xs"
                    value={buildCommand}
                    onChange={(event) => setBuildCommand(event.target.value)}
                  />
                </Field>
                <Field label="Output directory" required>
                  <Input className="font-mono text-xs" defaultValue="out" />
                </Field>
                <Field label="Install command">
                  <Input className="font-mono text-xs" defaultValue="pnpm install --frozen-lockfile" />
                </Field>
                <Field label="Node version">
                  <Select label="Node version" defaultValue="24">
                    <SelectItem value="24">24.x</SelectItem>
                    <SelectItem value="22">22.x</SelectItem>
                    <SelectItem value="20">20.x — security fixes only</SelectItem>
                  </Select>
                </Field>
              </div>
            </div>
          )}

          {current === 2 && (
            <div className="flex flex-col gap-5">
              <Alert title="Secrets are write-only">
                A value marked secret can be replaced but never read back — not by this form, not by
                the build log, not by anyone on the team.
              </Alert>

              <div className="flex flex-col divide-y divide-(--rule) rounded-(--radius) border border-(--rule)">
                {VARIABLES.map((variable) => (
                  <div key={variable.key} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="font-mono text-xs text-(--ink)">{variable.key}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-(--ink-3-aa)">
                      {variable.value}
                    </span>
                    {variable.secret && <Badge tone="outline">secret</Badge>}
                  </div>
                ))}
              </div>

              <Field
                label="Add more, one per line"
                hint="KEY=value. Paste a .env file and it will be parsed."
                className="max-w-(--w-reading)"
              >
                <Textarea
                  rows={4}
                  className="font-mono text-xs"
                  placeholder={'ANALYTICS_ID=…\nSENTRY_DSN=…'}
                />
              </Field>

              <label className="flex max-w-(--w-reading) cursor-pointer items-center gap-3 text-sm">
                <Switch checked={protect} onCheckedChange={setProtect} />
                <span className={protect ? 'text-(--ink)' : 'text-(--ink-3-aa)'}>
                  Require a password to view this environment
                </span>
              </label>
            </div>
          )}

          {current === 3 && (
            <div className="flex flex-col gap-5">
              {/* The values, read back from the same state the fields wrote —
                  not a summary written by hand, which is the version that says
                  "main" after somebody typed a different branch on step one. */}
              <Table caption="What will be created" borders="grid" density="compact">
                <THead>
                  <TR>
                    <TH>Setting</TH>
                    <TH>Value</TH>
                  </TR>
                </THead>
                <TBody>
                  <TR>
                    <TD>Environment</TD>
                    <TD className="font-mono text-xs">{name}</TD>
                  </TR>
                  <TR>
                    <TD>Branch</TD>
                    <TD className="font-mono text-xs">{branch}</TD>
                  </TR>
                  <TR>
                    <TD>Region</TD>
                    <TD className="font-mono text-xs">{region}</TD>
                  </TR>
                  <TR>
                    <TD>Preset</TD>
                    <TD className="font-mono text-xs">{preset}</TD>
                  </TR>
                  <TR>
                    <TD>Build command</TD>
                    <TD className="font-mono text-xs">{buildCommand}</TD>
                  </TR>
                  <TR>
                    <TD>Variables</TD>
                    <TD>
                      {VARIABLES.length} · {VARIABLES.filter((entry) => entry.secret).length} secret
                    </TD>
                  </TR>
                  <TR>
                    <TD>Password protected</TD>
                    <TD>{protect ? 'Yes' : 'No'}</TD>
                  </TR>
                </TBody>
              </Table>

              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                Creating the environment queues the first build immediately. Nothing is charged
                until it succeeds.
              </p>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-(--rule) pt-5">
            <Button
              variant="ghost"
              className="gap-2"
              disabled={current === 0}
              onClick={() => setCurrent((index) => Math.max(0, index - 1))}
            >
              <RiArrowLeftLine size={14} aria-hidden className="rtl:-scale-x-100" />
              Back
            </Button>
            <span className="mono-meta text-(--ink-3-aa)">{step.title}</span>
            <Button
              className="ms-auto gap-2"
              onClick={() => setCurrent((index) => (last ? index : index + 1))}
            >
              {last ? (
                <>
                  <RiRocketLine size={14} aria-hidden />
                  Create environment
                </>
              ) : (
                <>
                  Continue
                  <RiArrowRightLine size={14} aria-hidden className="rtl:-scale-x-100" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
