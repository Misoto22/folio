import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { BRAND } from '@misoto22/folio'
import { getMessages } from '@/i18n/messages'
import { BRAND_NAME } from '@/lib/brand'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${BRAND_NAME.en} — ${getMessages('en').tagline}`
/** Drawn once at build time; `output: 'export'` has no runtime to draw it in. */
export const dynamic = 'force-static'

/**
 * The share card, drawn from the same two rules the site is built on: the
 * heading face, and a shadow that does not blur.
 *
 * Satori reads WOFF but not WOFF2, and the package ships only WOFF2, so the
 * face comes from `@fontsource` — a build-time dependency, never served.
 */
export default async function OpengraphImage() {
  const dir = '../../node_modules/@fontsource/hanken-grotesk/files'
  const [medium, semibold] = await Promise.all([
    readFile(new URL(`${dir}/hanken-grotesk-latin-400-normal.woff`, import.meta.url)),
    readFile(new URL(`${dir}/hanken-grotesk-latin-600-normal.woff`, import.meta.url)),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BRAND.paper,
          padding: 80,
          fontFamily: 'Hanken Grotesk',
        }}
      >
        {/* Three solid plates rather than a bordered one: Satori leaks the
            plate beneath through a rounded border's anti-aliasing. */}
        <div style={{ display: 'flex', position: 'relative', width: 132, height: 132 }}>
          <div style={{ position: 'absolute', left: 34, top: 34, width: 96, height: 96, borderRadius: 16, background: BRAND.ink }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: 96, height: 96, borderRadius: 16, background: BRAND.ink }} />
          <div style={{ position: 'absolute', left: 10, top: 10, width: 76, height: 76, borderRadius: 8, background: BRAND.paper }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 600, color: BRAND.ink, letterSpacing: -2 }}>
            {BRAND_NAME.en}
          </div>
          <div style={{ fontSize: 34, color: BRAND.body, maxWidth: 900, lineHeight: 1.35 }}>
            The White Reset — portable tokens and accessible React primitives.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: BRAND.muted }}>
          <span>ui.misoto22.com</span>
          <span>tokens · components · templates</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Hanken Grotesk', data: medium, weight: 400, style: 'normal' },
        { name: 'Hanken Grotesk', data: semibold, weight: 600, style: 'normal' },
      ],
    },
  )
}
