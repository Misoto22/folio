import { PageIntro } from '@/components/PageIntro'
import { ThemeGallery } from '@/components/ThemeGallery'
import type { Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'

export function Themes({ locale }: { locale: Locale }) {
  const t = getMessages(locale)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <PageIntro
        eyebrow={t.nav.foundations}
        title={t.themes.title}
        summary={t.themes.lead}
        crumbs={[{ label: t.themes.title }]}
      />
      <ThemeGallery locale={locale} />
    </div>
  )
}
