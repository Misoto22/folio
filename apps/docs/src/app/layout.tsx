import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DocsShell } from '@/components/DocsShell'
import { THEME_SCRIPT } from '@/lib/theme-script'
import { BRAND } from '@misoto22/folio'
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
