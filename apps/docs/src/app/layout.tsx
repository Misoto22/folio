import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DocsShell } from '@/components/DocsShell'
import { BRAND } from '@misoto22/design'
import './globals.css'
import { COMPONENTS } from '@/content/registry'
import { getMessages } from '@/i18n/messages'
import { BRAND_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  metadataBase: new URL('https://ui.misoto22.com'),
  title: {
    default: `${BRAND_NAME.en} — ${getMessages('en').tagline}`,
    template: `%s · ${BRAND_NAME.en}`,
  },
  // Counted, not typed: it said 34 while the package shipped 52, and a number
  // in a meta description is the kind nobody re-reads.
  description: `A pure-white monochrome design system for software, writing and photography: portable tokens and ${COMPONENTS.length} accessible React primitives.`,
  openGraph: {
    type: 'website',
    siteName: BRAND_NAME.en,
    url: 'https://ui.misoto22.com',
  },
  alternates: {
    languages: {
      en: 'https://ui.misoto22.com',
      'zh-Hans': 'https://ui.misoto22.com/zh',
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND.paper },
    { media: '(prefers-color-scheme: dark)', color: BRAND.paperDark },
  ],
}

/**
 * Resolves the theme before the first paint.
 *
 * Inline and synchronous on purpose: any deferred script — including React's own
 * hydration — runs after the browser has already painted, so a dark reader sees
 * a white flash on every navigation. Reading `localStorage` here and stamping
 * the attribute on `<html>` costs a millisecond and removes the flash entirely.
 */
const THEME_SCRIPT = `
try {
  var stored = localStorage.getItem('m22-mode')
  var system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.dataset.mode = stored === 'light' || stored === 'dark' ? stored : system
  var accent = localStorage.getItem('m22-accent')
  if (accent) document.documentElement.dataset.accent = accent
  // Every other axis, restored the same way and for the same reason: a theme
  // applied on hydration is a theme the reader watches being applied.
  var theme = JSON.parse(localStorage.getItem('m22-theme') || '{}')
  var defaults = { surface: 'paper', radius: 'soft', rules: 'hairline', type: 'editorial', motion: 'calm', density: 'comfortable', chartPalette: 'mono' }
  for (var axis in defaults) {
    if (theme[axis] && theme[axis] !== defaults[axis]) document.documentElement.dataset[axis] = theme[axis]
  }
} catch (_) {
  document.documentElement.dataset.mode = 'light'
}
// The root layout sits above the locale routes and has no params, so the
// document's language is set from the path here — before first paint, so the
// element is correct for anything reading it afterwards rather than being
// corrected on hydration.
var zh = location.pathname === '/zh' || location.pathname.indexOf('/zh/') === 0
document.documentElement.lang = zh ? 'zh-Hans' : 'en'
`.trim()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* The same site, written for a reader that does not render CSS.
            Declared here so an agent finds it without being told. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt" />
        {/* The index again, under the extension an agent appends to a URL
            rather than one it has to be told. Same bytes as /llms.txt. */}
        <link rel="alternate" type="text/markdown" href="/index.md" title="index.md" />
      </head>
      <body>
        <ThemeProvider>
          <DocsShell>{children}</DocsShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
