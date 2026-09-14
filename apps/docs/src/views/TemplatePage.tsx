import { PAGE_ZH, templateCopy } from '@/i18n/content'
import { localePath, type Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'
import { Tag } from '@misoto22/folio'
import { notFound } from 'next/navigation'
import { CodeBlock } from '@/components/CodeBlock'
import { PageIntro, SectionHeading } from '@/components/PageIntro'
import { TemplateFrame } from '@/components/TemplateFrame'
import { TEMPLATE_BY_SLUG } from '@/content/templates'
import { templateSource } from '@/lib/docs'

export async function TemplatePage({ locale, slug }: { locale: Locale; slug: string }) {
  const template = TEMPLATE_BY_SLUG.get(slug)
  if (!template) notFound()

  const t = getMessages(locale)
  const zh = templateCopy(locale, template.slug)
  const source = templateSource(template.id)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <PageIntro
        eyebrow={`${t.nav.templates} · ${template.category}`}
        title={zh.name ?? template.name}
        summary={zh.summary ?? template.summary}
        crumbs={[
          { label: t.nav.templates, href: localePath(locale, '/templates/') },
          { label: zh.name ?? template.name },
        ]}
      >
        <p className="m-0 max-w-(--w-reading) border-s border-(--rule-2) ps-4 text-sm leading-relaxed text-(--ink-2)">
          {zh.tests ?? template.tests}
        </p>
      </PageIntro>

      <TemplateFrame templateId={template.id} name={zh.name ?? template.name} />

      <section className="flex flex-col gap-4">
        <SectionHeading id="uses">{t.section.builtFrom}</SectionHeading>
        <div className="flex flex-wrap gap-1.5">
          {template.uses.map((name) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </div>
        <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-3-aa)">
          {locale === 'zh'
            ? PAGE_ZH.templates.builtNote
            : 'Nothing here was styled specially for the template. That is the only arrangement where it stays honest as the system changes — a template with its own CSS stops being a test of the components and becomes a screenshot.'}
        </p>
      </section>

      {source && (
        <section className="flex flex-col gap-4">
          <SectionHeading id="source">{t.section.source}</SectionHeading>
          <CodeBlock {...source} label={`${template.name} source`} />
        </section>
      )}
    </div>
  )
}
