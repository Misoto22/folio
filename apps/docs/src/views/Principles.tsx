import { lawCopy, PAGE_ZH } from '@/i18n/content'
import type { Locale } from '@/i18n/locales'
import { PageIntro } from '@/components/PageIntro'
import { LAWS } from '@/content/principles'
import { LawDemo } from '@/components/LawDemo'

/**
 * The rules, and — more usefully — what each one FORBIDS.
 *
 * A principle that only says what to aim for settles no argument. Each of these
 * is written so that a specific piece of work can be shown to violate it.
 */

export function Principles({ locale }: { locale: Locale }) {
  const copy = locale === 'zh' ? PAGE_ZH.principles : undefined
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 xl:max-w-[70rem]">
      <PageIntro
        eyebrow={locale === 'zh' ? '开始' : 'Start'}
        title={copy?.title ?? 'Principles'}
        summary={
          copy?.summary ??
          'Eight rules, each written so that a specific piece of work can be shown to break it. A principle that only says what to aim for settles no argument.'
        }
        crumbs={[{ label: copy?.title ?? 'Principles' }]}
      />

      <div className="flex flex-col divide-y divide-(--rule) border-y border-(--rule)">
        {LAWS.map((law, index) => {
          const translated = lawCopy(locale, index)
          return (
            <article key={law.n} className="grid gap-4 py-8 md:grid-cols-[3rem_minmax(0,1fr)]">
              <p className="m-0 mono-meta text-(--ink-3-aa)">{law.n}</p>
              <div className="flex flex-col gap-3">
                <h2 className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)">
                  {translated?.title ?? law.title}
                </h2>
                <p className="m-0 max-w-(--w-reading) text-body text-(--ink-2)">
                  {translated?.body ?? law.body}
                </p>
                <p className="m-0 max-w-(--w-reading) border-s border-(--rule-2) ps-4 text-meta leading-relaxed text-(--ink-3-aa)">
                  <span className="eyebrow">{copy?.rulesOut ?? 'Rules out'}</span>
                  <br />
                  {translated?.rules_out ?? law.rules_out}
                </p>
                {/* Built only from the primitives the laws were written
                    against. A rule illustrated with a component added later to
                    satisfy it argues in a circle. */}
                <LawDemo n={law.n} />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
