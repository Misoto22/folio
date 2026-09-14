import type { Locale } from '@/i18n/locales'

/**
 * The site's name, as each locale prints it.
 *
 * One constant rather than the word typed into every surface that shows it —
 * the masthead, the footer, the title, the share card, the manifest and the
 * agent index — because a name typed six times is renamed five times.
 *
 * A name rather than a translation: 册页 is the Chinese reader's own word for
 * the same thing, not a gloss on Folio, so neither is printed beside the other.
 *
 * Self-contained on purpose. The browser suite imports it, and that suite runs
 * against a downloaded export without the generator — anything this file pulls
 * in at runtime would have to exist there too.
 */
export const BRAND_NAME: Record<Locale, string> = {
  en: 'Folio',
  zh: '册页',
}
