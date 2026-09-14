import { componentCopy, componentName, groupName, PAGE_ZH } from '@/i18n/content'
import { localePath, type Locale } from '@/i18n/locales'
import { fill } from '@/i18n/messages'
import { Badge, Card, CardBody, CardTitle } from '@misoto22/folio'
import Link from 'next/link'
import { PageIntro, SectionHeading } from '@/components/PageIntro'
import { COMPONENTS, groupedComponents } from '@/content/registry'
import { ComponentThumb } from '@/components/ComponentThumb'
import { componentExamples } from '@/lib/docs'

/** The key of a component's first example, or nothing if it has none. */
function first(dir: string): string | undefined {
  const example = componentExamples(dir)[0]
  return example ? `${dir}/${example.id}` : undefined
}

export function ComponentsIndex({ locale }: { locale: Locale }) {
  const sections = groupedComponents()
  const copy = locale === 'zh' ? PAGE_ZH.components : undefined

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
      <PageIntro
        eyebrow={locale === 'zh' ? '参考' : 'Reference'}
        title={copy?.title ?? 'Components'}
        summary={
          copy
            ? fill(copy.summary, { count: COMPONENTS.length })
            : `${COMPONENTS.length} primitives, grouped by what they do rather than by what they are made of. Every one is styled against the token layer, so none of them carries a colour of its own.`
        }
        crumbs={[{ label: copy?.title ?? 'Components' }]}
      />

      {sections.map((section) => (
        <section key={section.group} className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <SectionHeading id={section.group.toLowerCase()}>
              {groupName(locale, section.group)}
            </SectionHeading>
            <Badge tone="outline">{section.entries.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {section.entries.map((entry) => (
              // The card is NOT the link. It holds a live example, and an
              // example is allowed to contain an anchor — `LinkArrow`'s does —
              // which inside a wrapping `<a>` is invalid HTML and a hydration
              // error React reports on every visit. The title carries the link
              // and stretches over the card with a pseudo-element instead, so
              // the whole card is still one click target and the anchor nests
              // in nothing.
              <Card
                key={entry.slug}
                className="group relative h-full overflow-hidden transition-colors duration-(--duration-fast) hover:border-(--rule-hard)"
              >
                <CardBody className="flex h-full flex-col">
                  {first(entry.dir) && <ComponentThumb exampleKey={first(entry.dir)!} />}
                  {/* A fixed block, so every card in the row is the same height
                      and the band above it is the same size on all of them.
                      Summaries run from four words to thirty, and left to
                      themselves they made a card whose preview was smaller than
                      its own caption. Two lines is what the longest of them
                      needs; anything past that is a summary that should be
                      shorter, and the page now says so. */}
                  {/* Block layout, not flex. `line-clamp` needs
                      `display: -webkit-box`, and a flex ITEM has its display
                      blockified to `flow-root` — so inside a flex column the
                      clamp silently does nothing and the third line is simply
                      cut off by the card instead. */}
                  <div className="h-20">
                    <CardTitle>
                      <Link
                        href={localePath(locale, `/components/${entry.slug}/`)}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {componentName(locale, entry.slug, entry.name)}
                      </Link>
                    </CardTitle>
                    <p className="m-0 mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-(--ink-3-aa)">
                      {componentCopy(locale, entry.slug).summary ?? entry.summary}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
