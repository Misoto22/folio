import { changelogText } from '@/i18n/changelog'
import { PAGE_ZH } from '@/i18n/content'
import type { Locale } from '@/i18n/locales'
import { fill, getMessages } from '@/i18n/messages'
import { Badge } from '@misoto22/folio'
import { ChangelogDetail } from '@/components/ChangelogDetail'
import { PageIntro } from '@/components/PageIntro'
import { Prose } from '@/components/Prose'
import changelog from '@/generated/changelog.json'

interface Block {
  kind: 'paragraph' | 'bullet'
  text: string
}
interface Item {
  kind: 'item' | 'paragraph'
  text: string
  /** The pull request the entry shipped in, lifted out of the sentence. */
  pr?: number
  prUrl?: string
  /** The changeset's own body: its paragraphs and its nested list. */
  body?: Block[]
}
interface Section {
  title: string
  items: Item[]
}
interface Release {
  version: string
  date?: string
  sections: Section[]
}

const RELEASES = changelog as Release[]

/**
 * The changelog, read from the package's own `CHANGELOG.md`.
 *
 * Not a second hand-kept "what's new" list. The file that ships with the
 * package and the page a reader lands on are the same words — which is the only
 * arrangement where they cannot disagree, and disagreeing is what a
 * documentation changelog does within two releases.
 *
 * An entry is a headline, an optional body, and the pull request it shipped in.
 * release-please writes one line per merged pull request, so a release-please
 * entry has no body; the bodies below belong to the entries changesets wrote,
 * which stay in the file because release-please prepends above them.
 *
 * THE HEADLINES ARE THE PAGE and those bodies are folded under them. The older
 * entries carry their reasoning, which is the reason to read one and the reason
 * the page could not be scanned: 0.9.0 is two and a half thousand words, and a
 * reader looking for the version that changed `Sidebar` was reading an essay
 * about line boxes on the way past. Folding keeps the argument and gives back
 * the index — and a pull-request title, which is what an entry is now, is short
 * enough that the index needs nothing else done to it.
 */
export function Changelog({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  const copy = locale === 'zh' ? PAGE_ZH.changelog : undefined
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <PageIntro
        eyebrow={t.nav.start}
        title={copy?.title ?? t.nav.changelog}
        summary={
          copy?.summary ??
          'Entries come from the Conventional Commit titles of the pull requests that shipped them, so a release says exactly what merged into it — in the words of the person who merged it, not a summary written afterwards.'
        }
        crumbs={[{ label: copy?.title ?? t.nav.changelog }]}
      />

      <div className="flex flex-col divide-y divide-(--rule) border-y border-(--rule)">
        {RELEASES.map((release) => (
          <article
            key={release.version}
            className="grid gap-6 py-8 md:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <div className="flex flex-col gap-2 md:sticky md:top-(--scroll-offset) md:self-start">
              <h2 className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink)">
                {release.version}
              </h2>
              {release.date && <time className="mono-meta text-(--ink-3-aa)">{release.date}</time>}
            </div>

            <div className="flex flex-col gap-6">
              {release.sections.map((section, index) => (
                <section key={section.title || index} className="flex flex-col gap-4">
                  {section.title && (
                    <Badge tone="outline" className="self-start">
                      {changelogText(locale, section.title)}
                    </Badge>
                  )}
                  {section.items.map((item, itemIndex) =>
                    item.kind === 'item' ? (
                      <div
                        key={itemIndex}
                        className="flex max-w-(--w-reading) flex-col gap-2 border-s border-(--rule-2) ps-4"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <Prose text={changelogText(locale, item.text)} className="max-w-none" />
                          {item.prUrl && (
                            <a
                              href={item.prUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="shrink-0 mono-meta text-(--ink-3-aa) underline decoration-(--rule-2) underline-offset-4 hover:text-(--ink) hover:decoration-(--ink)"
                            >
                              #{item.pr}
                            </a>
                          )}
                        </div>
                        {item.body && item.body.length > 0 && (
                          <ChangelogDetail
                            more={fill(t.changelog.more, { count: item.body.length })}
                            less={t.changelog.less}
                          >
                            {item.body.map((block, blockIndex) =>
                              block.kind === 'bullet' ? (
                                <div key={blockIndex} className="flex gap-2.5">
                                  {/* A rule rather than a glyph: the system has
                                      one list marker and it is a hairline. */}
                                  <span
                                    aria-hidden
                                    className="mt-[0.7em] h-px w-2.5 shrink-0 bg-(--rule-2)"
                                  />
                                  <Prose text={changelogText(locale, block.text)} small className="max-w-none" />
                                </div>
                              ) : (
                                <Prose key={blockIndex} text={changelogText(locale, block.text)} small />
                              ),
                            )}
                          </ChangelogDetail>
                        )}
                      </div>
                    ) : (
                      <Prose key={itemIndex} text={changelogText(locale, item.text)} />
                    ),
                  )}
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
