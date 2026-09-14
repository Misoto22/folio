import { COMPONENTS } from '@/content/registry'
import { FOUNDATIONS } from '@/content/foundations'
import { TEMPLATES } from '@/content/templates'

/**
 * Every page the site publishes, derived from the same registries the pages
 * are generated from.
 *
 * Not a hand-written list: a new component would then get a page nobody ever
 * checked, which is the failure mode a documentation site's own tests exist to
 * prevent.
 */
const EN_ROUTES: string[] = [
  '/',
  '/principles/',
  '/components/',
  '/changelog/',
  '/templates/',
  '/themes/',
  ...FOUNDATIONS.map((page) => `/foundations/${page.slug}/`),
  ...COMPONENTS.map((entry) => `/components/${entry.slug}/`),
  ...TEMPLATES.map((template) => `/templates/${template.slug}/`),
]

/**
 * Both languages, from one list.
 *
 * The Chinese pages are the same routes under `/zh`, so enumerating them
 * separately would only create a way for the two to fall out of step — which is
 * precisely the failure an accessibility sweep is meant to catch rather than
 * inherit.
 */
export const ROUTES: string[] = [
  ...EN_ROUTES,
  ...EN_ROUTES.map((route) => (route === '/' ? '/zh/' : `/zh${route}`)),
]
