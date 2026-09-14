import { stripLocale } from '@/i18n/locales'

/**
 * The site's four top-level sections.
 *
 * Everything used to hang off one sidebar: six "start" rows, four foundations,
 * and seven collapsed component groups, in a single column, with the templates
 * and the themes sitting as two more rows among the six. That column answered
 * "what is in this site" only for someone willing to read all of it, and it
 * gave a reader arriving on a component page no way to see that templates and
 * themes existed at all.
 *
 * Four sections in the masthead answer it in one line, before anything is
 * scrolled — and the sidebar underneath then has one job rather than four.
 * Docs is the writing, Components is the catalogue, Templates is the screens,
 * Themes is the proof that the token layer does what it claims.
 */
export const SECTIONS = ['docs', 'components', 'templates', 'themes'] as const

export type SectionId = (typeof SECTIONS)[number]

/** Where the tab lands, and which paths belong to it. */
export const SECTION_ROOT: Record<SectionId, string> = {
  docs: '/',
  components: '/components/',
  templates: '/templates/',
  themes: '/themes/',
}

/**
 * Which section a path belongs to.
 *
 * Docs is the fallback rather than a prefix match, because it owns the site
 * root, the principles, the foundations and the changelog — four unrelated
 * prefixes, and a fifth would otherwise light up nothing at all.
 */
export function sectionFor(pathname: string): SectionId {
  const path = stripLocale(pathname)
  if (path.startsWith('/components')) return 'components'
  if (path.startsWith('/templates')) return 'templates'
  if (path.startsWith('/themes')) return 'themes'
  return 'docs'
}

/**
 * Every section keeps its rail.
 *
 * Themes briefly had none, on the grounds that a column indexing one page is
 * furniture — which is true of a NAV and false of what that page needs. The
 * thing a reader wants there is the switch, applied to the site they are
 * standing in, so the rail carries a picker instead of a list of links.
 */
export const HAS_SIDEBAR: Record<SectionId, boolean> = {
  docs: true,
  components: true,
  templates: true,
  themes: true,
}
