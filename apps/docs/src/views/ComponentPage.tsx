import { apiCopy } from '@/i18n/api'
import { componentCopy, componentName, groupName } from '@/i18n/content'
import { exampleCopy, exampleTitle } from '@/i18n/examples'
import { localePath, type Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'
import { Alert, Badge, Kbd, Separator, TBody, TD, TH, THead, TR, Table } from '@misoto22/design'
import { RiCheckLine, RiCloseLine } from '@remixicon/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CodeBlock } from '@/components/CodeBlock'
import { ExampleCanvas } from '@/components/ExampleCanvas'
import { PageIntro, SectionHeading } from '@/components/PageIntro'
import { PageTabs } from '@/components/PageTabs'
import { Prose } from '@/components/Prose'
import { PropsPlayground } from '@/components/PropsPlayground'
import { PropsTable } from '@/components/PropsTable'
import { TocRail } from '@/components/TocRail'
import { BY_SLUG, COMPONENTS } from '@/content/registry'
import { componentExamples, componentSource, componentTypes } from '@/lib/docs'

/**
 * A one-line snippet in the shape Shiki emits, without the highlighting.
 *
 * Shiki runs in `generate.mjs`, over files on disk. This line is composed per
 * component at render time and has no file to be read from, and hand-writing
 * token spans for it would be a second copy of the theme kept by hand. So it
 * renders in plain ink: one import, four identifiers, and nothing that a colour
 * was carrying anyway.
 */
function plainBlock(code: string): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<pre class="shiki"><code><span class="line">${escaped}</span></code></pre>`
}

export async function ComponentPage({ locale, slug }: { locale: Locale; slug: string }) {
  const entry = BY_SLUG.get(slug)
  if (!entry) notFound()

  const t = getMessages(locale)
  const zh = componentCopy(locale, entry.slug)
  const source = componentSource(entry.dir)
  const examples = componentExamples(entry.dir)
  const types = componentTypes(entry.dir)

  // The export that shares the directory's name is the component the page is
  // about; the rest are its named parts (CardHeader, TabsTrigger) and are
  // documented under it rather than each getting a page of their own.
  const primary = source.components.find((component) => component.name === entry.dir)
    ?? source.components.find((component) => /^[A-Z]/.test(component.name))
  const parts = source.components.filter(
    (component) => component.name !== primary?.name && !component.reexport,
  )
  const reexports = source.components.filter((component) => component.reexport)
  const related = (entry.related ?? []).map((s) => BY_SLUG.get(s)).filter(Boolean)

  const subject = primary?.name ?? entry.name
  // The specifier, not the root: `@misoto22/design/charts` and
  // `@misoto22/design/diagrams` are separate entry points, and a root import of
  // AreaChart does not render a blank page — it throws. `entry.entry` is
  // emitted from the tree the directory sits in, never authored beside it.
  const importLine = `import { ${subject} } from '${entry.entry}'`

  // Every alias the package exports, not this directory's. `StatusTone` is
  // declared by StatusDot and used by StatusPill, so a per-directory list is
  // exactly how the second component loses the only control it has.
  const aliases = COMPONENTS.flatMap((item) => componentSource(item.dir).exportedTypes)

  // Resolved here rather than inside the panel: the panel is a client
  // component, and `api.ts` is a few thousand lines of translated prose keyed
  // by every prop in the package. Forty rows are not worth the whole table.
  const propRows = (primary?.props ?? []).map((row) => ({
    ...row,
    description: apiCopy(locale, `${entry.dir}.${subject}#${row.name}`, row.description),
  }))

  // Both tables are translated positionally, so both are resolved here, before
  // anything reorders or filters them. `practices` in particular is split into
  // two halves further down, and a lookup by index inside that filter would be
  // indexing the half rather than the list the translation was written against.
  const anatomy = (entry.anatomy ?? []).map((part, index) => ({
    ...part,
    element: zh.anatomy?.[index]?.element ?? part.element,
    description: zh.anatomy?.[index]?.description ?? part.description,
  }))
  const practices = (entry.practices ?? []).map((practice, index) => ({
    ...practice,
    text: zh.practices?.[index] ?? practice.text,
  }))

  const overview = (
    <>
      <section className="flex flex-col gap-4">
        <SectionHeading id="usage">{t.section.usage}</SectionHeading>
        {(zh.when ?? entry.when) && (
          <Alert title={t.section.whenToReach} hideIcon>
            {zh.when ?? entry.when}
          </Alert>
        )}
        {/* Which specifier this ships from, printed only when it is not the
            root. The import line below already names it, but a split entry is
            invisible until it bites, and a reader who reaches for the root out
            of habit gets a module-not-found error with nothing on the page to
            explain it. Every component carries the field, so this compares
            rather than tests for its presence. */}
        {entry.entry !== '@misoto22/design' && (
          <p className="m-0 flex flex-wrap items-baseline gap-2">
            <span className="eyebrow text-(--ink-3-aa)">{t.section.shipsFrom}</span>
            <code className="font-mono text-[13px] text-(--ink)">{entry.entry}</code>
          </p>
        )}
        <CodeBlock
          html={plainBlock(importLine)}
          source={importLine}
          lang="tsx"
          label={`${subject} import`}
        />
      </section>

      {primary?.description && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="notes">{t.section.notes}</SectionHeading>
          <Prose text={apiCopy(locale, `${entry.dir}.${primary.name}`, primary.description)} />
        </section>
      )}

      {anatomy.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="anatomy">{t.section.anatomy}</SectionHeading>
          <Table caption={`${entry.name} anatomy`}>
            <THead>
              <TR>
                <TH className="w-48">{t.table.element}</TH>
                <TH>{t.table.description}</TH>
              </TR>
            </THead>
            <TBody>
              {anatomy.map((part) => (
                <TR key={part.element}>
                  <TD className="align-top">
                    <span className="text-sm text-(--ink)">{part.element}</span>
                    {part.required && (
                      <Badge tone="outline" className="ms-2 align-middle">
                        {t.table.required}
                      </Badge>
                    )}
                  </TD>
                  <TD className="max-w-(--measure-record) align-top text-[13px] leading-relaxed">
                    {part.description}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>
      )}

      {practices.length > 0 && (
        <section className="flex flex-col gap-5">
          <SectionHeading id="best-practices">{t.section.practices}</SectionHeading>
          {/* Two lists, and the half a reader is in is said by an icon AND a
              word. A green tick beside a red cross is one distinction spent
              twice; either alone would leave the page unreadable to the eight
              percent of men who cannot tell them apart. */}
          <div className="grid gap-6 sm:grid-cols-2">
            {PRACTICE_HALVES.map(({ kind, icon: Icon, tone }) => {
              const half = practices.filter((practice) => practice.kind === kind)
              if (half.length === 0) return null
              return (
                <div key={kind} className="flex flex-col gap-3">
                  <h3 className="m-0 flex items-center gap-2 eyebrow text-(--ink)">
                    <Icon size={15} aria-hidden className={tone} />
                    {kind === 'do' ? t.practice.do : t.practice.dont}
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {half.map((practice) => (
                      <li
                        key={practice.text}
                        className="max-w-(--w-reading) border-s border-(--rule-2) ps-4 text-sm leading-relaxed text-(--ink-2)"
                      >
                        {practice.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {examples.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionHeading id="examples">{t.section.examples}</SectionHeading>
          {examples.map((example) => (
            <div key={example.id} className="flex flex-col gap-3">
              {/* The kicker and its sentence are one unit and sit closer to
                  each other than either does to the canvas — otherwise the
                  description reads as a caption for the preview below it
                  rather than as the answer to the heading above it. */}
              <div className="flex flex-col gap-2">
                {/* An <h3>, not a styled <p>. It was the one part of the page a
                    reader three screens down could not navigate to, and half of
                    what is worth reading on a component page is under it. */}
                <h3
                  id={`example-${example.id}`}
                  className="m-0 scroll-mt-(--scroll-offset) eyebrow text-(--ink-3-aa)"
                >
                  {exampleTitle(locale, `${entry.dir}/${example.id}`, example.title)}
                </h3>
                {example.description && (
                  <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
                    {exampleCopy(locale, `${entry.dir}/${example.id}`, example.description)}
                  </p>
                )}
              </div>
              <ExampleCanvas
                exampleKey={`${entry.dir}/${example.id}`}
                html={example.html}
                snippet={example.snippet}
                previewHeight={entry.previewHeight}
              />
            </div>
          ))}
        </section>
      )}

      {parts.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionHeading id="parts">{t.section.parts}</SectionHeading>
          <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-3-aa)">
            {t.section.partsNote}
          </p>
          {parts.map((part) => (
            <div key={part.name} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <h3 className="m-0 font-mono text-sm text-(--ink)">{part.name}</h3>
              </div>
              {part.description && (
                <Prose text={apiCopy(locale, `${entry.dir}.${part.name}`, part.description)} small />
              )}
              <PropsTable
                name={part.name}
                dir={entry.dir}
                rows={part.props}
                passthrough={part.passthrough}
                locale={locale}
              />
            </div>
          ))}
        </section>
      )}

      {reexports.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="reexports">{t.section.reexports}</SectionHeading>
          <div className="flex flex-col gap-3">
            {reexports.map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <code className="font-mono text-sm text-(--ink)">
                  {item.name} = {item.reexport}
                </code>
                {item.description && (
                  <Prose text={apiCopy(locale, `${entry.dir}.${item.name}`, item.description)} small />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {types && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="types">{t.section.types}</SectionHeading>
          <CodeBlock {...types} />
        </section>
      )}

      {entry.keyboard && entry.keyboard.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="keyboard">{t.section.keyboard}</SectionHeading>
          <Table caption={`${entry.name} keyboard interactions`}>
            <THead>
              <TR>
                <TH className="w-48">{t.table.key}</TH>
                <TH>{t.table.does}</TH>
              </TR>
            </THead>
            <TBody>
              {entry.keyboard.map((row, index) => (
                <TR key={row.keys.join('+')}>
                  <TD className="align-top">
                    <span className="flex flex-wrap gap-1.5">
                      {row.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </TD>
                  <TD className="max-w-(--measure-record) align-top text-[13px] leading-relaxed">
                    {zh.keyboard?.[index] ?? row.does}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>
      )}

      {entry.accessibility && entry.accessibility.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="accessibility">{t.section.accessibility}</SectionHeading>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {(zh.accessibility ?? entry.accessibility).map((note) => (
              <li
                key={note}
                className="max-w-(--w-reading) border-s border-(--rule-2) ps-4 text-sm leading-relaxed text-(--ink-2)"
              >
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <>
          <Separator />
          <section className="flex flex-col gap-4">
            <SectionHeading id="related">{t.section.related}</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {related.map((item) => (
                <Link key={item!.slug} href={localePath(locale, `/components/${item!.slug}/`)}>
                  <Badge tone="outline">{item!.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )

  const properties = (
    <section className="flex flex-col gap-5">
      <SectionHeading id="props">{t.section.props}</SectionHeading>
      <PropsPlayground
        name={subject}
        rows={propRows}
        aliases={aliases}
        passthrough={primary?.passthrough ?? []}
        previewHeight={entry.previewHeight}
        locale={locale}
        fallback={
          <PropsTable
            name={subject}
            dir={entry.dir}
            rows={primary?.props ?? []}
            passthrough={primary?.passthrough ?? []}
            locale={locale}
          />
        }
      />
    </section>
  )

  return (
    // Two real columns, not a centred one with something floated beside it:
    // the rail is a column, so it can never sit over the prose. It appears
    // from `xl` up, where there is room for it without taking width off the
    // reading column.
    //
    // NO `items-start`. The rail is a `sticky` block INSIDE its column, and a
    // sticky element travels only as far as its containing block reaches — so
    // a column sized to its own content gives it a few hundred pixels and
    // then lets it scroll away with the page, which is the exact bug the rail
    // was built to fix. Stretched, the column is as tall as the article and
    // the rail holds its place the whole way down.
    <div className="mx-auto flex w-full max-w-4xl gap-10 xl:max-w-[70rem]">
      <article className="flex min-w-0 flex-1 flex-col gap-8">
        <PageIntro
          eyebrow={groupName(locale, entry.group)}
          title={componentName(locale, entry.slug, entry.name)}
          summary={zh.summary ?? entry.summary}
          crumbs={[
            { label: t.section.components, href: localePath(locale, '/components/') },
            { label: componentName(locale, entry.slug, entry.name) },
          ]}
        />

        <PageTabs
          label={componentName(locale, entry.slug, entry.name)}
          tabs={[
            {
              value: 'overview',
              label: t.section.overview,
              anchors: OVERVIEW_ANCHORS,
              panel: overview,
            },
            {
              value: 'properties',
              label: t.section.properties,
              anchors: ['props'],
              panel: properties,
            },
          ]}
        />
      </article>

      <TocRail label={t.section.onThisPage} className="hidden w-56 shrink-0 xl:block" />
    </div>
  )
}

/** The two halves of "best practices", and the second signal each one carries. */
const PRACTICE_HALVES = [
  { kind: 'do' as const, icon: RiCheckLine, tone: 'text-(--ok)' },
  { kind: 'dont' as const, icon: RiCloseLine, tone: 'text-(--danger)' },
]

/**
 * Every heading the overview panel owns.
 *
 * Written out rather than derived, because the panel is JSX and the ids are
 * spread through it — and a link that has worked since this page existed must
 * not stop working because a section moved behind a tab.
 */
const OVERVIEW_ANCHORS = [
  'usage',
  'notes',
  'anatomy',
  'best-practices',
  'examples',
  'parts',
  'reexports',
  'types',
  'keyboard',
  'accessibility',
  'related',
]
