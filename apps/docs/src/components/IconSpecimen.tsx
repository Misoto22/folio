import { RiDiscordFill, RiFigmaFill, RiGithubFill, RiSlackFill, RiTwitterXFill } from '@remixicon/react'
import { Check, ChevronRight, Minus } from '@misoto22/folio/icons'
import type { Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'

/**
 * The icon scale, drawn at the sizes the package actually renders.
 *
 * Read off `packages/design/src/components`, not off the token file. The two
 * disagree in a way worth showing — `--ico-s`, `--ico-m` and `--ico-l` name
 * three of these six sizes and no component reads any of them — and a specimen
 * built from the tokens alone would show a scale the library does not use.
 *
 * The scale and the boxed marks are the package's own glyphs from
 * `@misoto22/folio/icons`, so the page renders the claim rather than describing
 * it; the brand row is Remix, where those marks come from.
 */

const SIZES: { size: 12 | 14 | 16 | 18 | 20 | 24; token?: string }[] = [
  { size: 12 },
  { size: 14, token: '--ico-s' },
  { size: 16, token: '--ico-m' },
  { size: 18 },
  { size: 20, token: '--ico-l' },
  { size: 24 },
]

/** The two marks a checkbox draws, at the one size that used to force a stroke. */
const IN_A_BOX = [
  { Mark: Check, name: 'Check' },
  { Mark: Minus, name: 'Minus' },
] as const

/** Five brand marks, which the package's own set does not draw. */
const BRANDS = [
  { Mark: RiGithubFill, name: 'RiGithubFill' },
  { Mark: RiTwitterXFill, name: 'RiTwitterXFill' },
  { Mark: RiDiscordFill, name: 'RiDiscordFill' },
  { Mark: RiFigmaFill, name: 'RiFigmaFill' },
  { Mark: RiSlackFill, name: 'RiSlackFill' },
] as const

export function IconSpecimen({ locale }: { locale: Locale }) {
  const t = getMessages(locale).icons

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col divide-y divide-(--rule) border-y border-(--rule)">
        {SIZES.map((step) => (
          <div key={step.size} className="flex items-center gap-5 py-4">
            {/* A fixed box, so the glyphs share a centre line and the scale
                reads as a scale rather than as six left-aligned marks. */}
            <span className="flex w-8 shrink-0 items-center justify-center text-(--ink)">
              <ChevronRight size={step.size} aria-hidden />
            </span>
            <p className="m-0 w-28 shrink-0 mono-meta text-(--ink-3-aa)">
              {step.size}px{step.token ? ` · ${step.token}` : ''}
            </p>
            <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-2)">
              {t.sizes[step.size]}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <p className="m-0 eyebrow text-(--ink-3-aa)">{t.inABoxTitle}</p>
        <div className="flex flex-wrap items-center gap-8">
          {IN_A_BOX.map(({ Mark, name }) => (
            <div key={name} className="flex items-center gap-3">
              {/* Drawn the way Checkbox actually draws it: a light mark on a
                  filled ground, which is where the set this replaced thinned
                  below a hairline and needed its stroke pushed to 3. */}
              <span className="flex size-[18px] items-center justify-center rounded-(--radius-xs) bg-(--accent) text-(--accent-foreground)">
                <Mark size={12} aria-hidden />
              </span>
              <span className="mono-meta text-(--ink-3-aa)">{name}</span>
            </div>
          ))}
        </div>
        <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
          {t.inABoxNote}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <p className="m-0 eyebrow text-(--ink-3-aa)">{t.brandsTitle}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {BRANDS.map(({ Mark, name }) => (
            <div key={name} className="flex items-center gap-2.5 text-(--ink)">
              <Mark size={18} aria-hidden />
              <span className="mono-meta text-(--ink-3-aa)">{name}</span>
            </div>
          ))}
        </div>
        <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
          {t.brandsNote}
        </p>
      </section>
    </div>
  )
}
