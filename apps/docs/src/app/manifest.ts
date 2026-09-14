import type { MetadataRoute } from 'next'
import { BRAND } from '@misoto22/folio'
import { BRAND_NAME } from '@/lib/brand'

/**
 * Named for the pinned tab and the installed shortcut, not for an app store —
 * the site is a reference, and the manifest exists so a saved link keeps the
 * mark instead of falling back to a screenshot of the page.
 */
/** A route handler under `output: 'export'` has to say it is static. */
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME.en,
    short_name: BRAND_NAME.en,
    description: 'The White Reset — portable tokens and accessible React primitives.',
    start_url: '/',
    display: 'minimal-ui',
    background_color: BRAND.paper,
    theme_color: BRAND.paper,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
