'use client'

import { PAGE_ZH, templateCopy } from '@/i18n/content'
import { localePath, type Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'
import { Badge, Card, CardBody, CardTitle, Tag, ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import Link from 'next/link'
import { useState } from 'react'
import { PageIntro } from '@/components/PageIntro'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/content/templates'

/** The strip's "no filter" value. Not a category, so it cannot collide with one. */
const ALL = '__all__'

/**
 * The template index, filtered by category.
 *
 * The strip is here because of a number: four entries are a list, twelve are a
 * wall. It is a single-value `ToggleGroup` rather than a row of checkboxes,
 * because a template belongs to exactly one category and a multi-select would
 * announce that picking one unpicks the others.
 *
 * Categories are derived from the entries, not written out again here: a group
 * with nothing in it never appears, and a new one appears the moment an entry
 * claims it. The client boundary buys the filter and nothing else — every card
 * is still in the exported HTML, so the page is whole before any script runs.
 */
export function TemplatesIndex({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  const copy = locale === 'zh' ? PAGE_ZH.templates : undefined
  const [category, setCategory] = useState<string>(ALL)

  const groups = TEMPLATE_CATEGORIES.filter((name) =>
    TEMPLATES.some((template) => template.category === name),
  )
  const shown =
    category === ALL ? TEMPLATES : TEMPLATES.filter((template) => template.category === category)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <PageIntro
        eyebrow={t.nav.start}
        title={copy?.title ?? t.nav.templates}
        summary={
          copy?.summary ??
          'A gallery answers what a Table looks like. These answer the question after it — which components a real screen needs together, and how they space against each other once there are twelve of them rather than one.'
        }
        crumbs={[{ label: copy?.title ?? t.nav.templates }]}
      />

      <div className="flex flex-col gap-4">
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(next) => setCategory(next || ALL)}
          aria-label={t.nav.sections}
          className="flex-wrap"
        >
          <ToggleGroupItem value={ALL} className="text-[13px]">
            {t.nav.allTemplates}
          </ToggleGroupItem>
          {groups.map((name) => (
            <ToggleGroupItem key={name} value={name} className="text-[13px]">
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((template) => (
            <Link
              key={template.slug}
              href={localePath(locale, `/templates/${template.slug}/`)}
              className="group block h-full"
            >
              <Card className="h-full transition-colors duration-(--duration-fast) group-hover:border-(--rule-hard)">
                <CardBody className="flex h-full flex-col gap-4">
                  <p className="m-0 eyebrow text-(--ink-3-aa)">{template.category}</p>
                  <div className="flex items-center gap-3">
                    {/* h2: these sit directly under the page title, with no section
                        heading between. */}
                    <CardTitle as="h2">
                      {templateCopy(locale, template.slug).name ?? template.name}
                    </CardTitle>
                    <Badge tone="outline">
                      {template.uses.length} {t.section.components.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">
                    {templateCopy(locale, template.slug).summary ?? template.summary}
                  </p>
                  <p className="m-0 border-s border-(--rule-2) ps-3 text-[13px] leading-relaxed text-(--ink-2)">
                    {templateCopy(locale, template.slug).tests ?? template.tests}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {template.uses.slice(0, 6).map((name) => (
                      <Tag key={name}>{name}</Tag>
                    ))}
                    {template.uses.length > 6 && <Tag>+{template.uses.length - 6}</Tag>}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
