'use client'

import { Badge, Button } from '@misoto22/folio'
import { RiCheckLine, RiResetLeftLine } from '@remixicon/react'
import type { Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'
import { SectionHeading } from './PageIntro'
import {
  attribute,
  AXES,
  DEFAULTS,
  LOOK_AXES,
  RESET_PRESET,
  useTheme,
  type Axis,
} from './ThemeProvider'
import { ThemeShowcase } from './ThemeShowcase'

/**
 * The themes page.
 *
 * It used to be a wall: eight preset cards side by side, each holding a
 * four-hundred-pixel copy of the same small specimen. That arrangement proves
 * the themes DIFFER, which nobody doubted, and proves nothing about whether any
 * of them is a place you would want to work — a look is what happens when a
 * heading, a table, a form and a chart are on screen together and have to
 * agree, and none of that is legible at thumbnail size.
 *
 * So the comparison and the judgement are split, and each gets the size it
 * needs. The RAIL holds all eight at once, small, which is the only scale at
 * which eight things can be compared at all. The page holds ONE, at full width,
 * on the furniture a real product has. Picking in the rail changes both, and
 * the whole site with them — which is the claim this page exists to make and
 * cannot make from inside a frame.
 *
 * The dials themselves are named in the rail, beside the theme they add up to,
 * and set one at a time in the masthead panel. They were briefly a section on
 * this page — six rows of nineteen small chips, one per value — and that was a
 * reference table for a question this page is not asking. What a reader wants
 * here is a look; what a reader wants from an axis is to turn it, which is a
 * control, not a picture of one.
 */
export function ThemeGallery({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  const { theme, apply, matching } = useTheme()
  const copy = matching ? t.themes.presets[matching.id] : undefined

  // The exact attributes, complete rather than only the ones that move: this is
  // the line a reader pastes into their own root element, and an unset axis
  // there is not "the default", it is whatever their ancestor said.
  const snippet = LOOK_AXES.map((axis) => `${attribute(axis)}="${theme[axis]}"`).join(' ')

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
            {copy?.name ?? matching?.name ?? t.themes.custom}
          </h2>
          {matching ? (
            <Badge tone="outline">
              <RiCheckLine size={12} aria-hidden />
              {t.appearance.current}
            </Badge>
          ) : (
            <Badge tone="outline">{t.themes.customBadge}</Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ms-auto gap-1.5"
            onClick={() => apply(RESET_PRESET)}
            disabled={matching?.id === 'reset'}
          >
            <RiResetLeftLine size={13} aria-hidden />
            {t.appearance.reset}
          </Button>
        </div>
        <p className="m-0 max-w-(--w-reading) text-[13px] leading-relaxed text-(--ink-2)">
          {copy?.note ?? matching?.note ?? t.themes.customNote}
        </p>
        {/* The whole of what a theme IS, in one line a reader can take away.
            Astryx's page is right about this much: the deliverable is not the
            picture, it is the attributes that produce it. */}
        {/* `tabIndex`, because it scrolls sideways. A region a pointer can
            scroll and a keyboard cannot is `scrollable-region-focusable`, and
            the content here is the one line on the page worth taking away. */}
        <p
          tabIndex={0}
          aria-label={t.themes.attributesLabel}
          className="m-0 overflow-x-auto rounded-(--radius) border border-(--rule) bg-(--stone) px-3 py-2 font-mono text-[12px] whitespace-nowrap text-(--ink-2) scroll-slim"
        >
          &lt;html {snippet} data-accent=&quot;{theme.accent}&quot;&gt;
        </p>

        <ThemeShowcase />
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <SectionHeading id="chart-palette">{t.themes.axes.chartPalette}</SectionHeading>
          <p className="m-0 max-w-(--w-reading) text-[13px] leading-relaxed text-(--ink-2)">
            {t.themes.paletteLead}
          </p>
        </div>
        <PaletteRow locale={locale} />
      </section>
    </div>
  )
}

/**
 * The seventh axis, shown as what it produces rather than as a control.
 *
 * The rack sets it like any other axis now — a themed console whose charts
 * stayed grey was the axis being unreachable rather than being separate. What
 * belongs HERE is the thing a toggle cannot say: three ramps side by side, so
 * a reader picking between them is looking at the colours rather than at three
 * words.
 */
function PaletteRow({ locale }: { locale: Locale }) {
  const t = getMessages(locale)
  const SERIES = ['--series-1', '--series-2', '--series-3', '--series-4', '--series-5']

  return (
    <div className="flex flex-wrap gap-6">
      {AXES.chartPalette.map((value) => (
        <figure
          key={value}
          data-chart-palette={value}
          className="m-0 flex flex-col gap-2 rounded-(--radius-lg) border border-(--rule-2) p-4"
        >
          <div className="flex items-end gap-1.5" aria-hidden>
            {SERIES.map((token, index) => (
              <span
                key={token}
                style={{ background: `var(${token})`, height: `${1.25 + index * 0.5}rem` }}
                className="w-6 rounded-(--radius-sm)"
              />
            ))}
          </div>
          <figcaption className="flex items-baseline gap-2.5">
            <span className="text-sm text-(--ink)">{t.themes.values[value] ?? value}</span>
            <code className="mono-meta text-(--ink-3-aa)">
              {attribute('chartPalette')}=&quot;{value}&quot;
            </code>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** Re-exported so nothing else has to know where the axis list lives. */
export type { Axis }
export { DEFAULTS }
