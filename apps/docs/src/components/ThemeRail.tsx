'use client'

import { Button, Separator, cn } from '@misoto22/folio'
import { RiCheckLine, RiResetLeftLine } from '@remixicon/react'
import { useMessages } from '@/i18n/useLocale'
import {
  attribute,
  DEFAULTS,
  LOOK_AXES,
  PRESETS,
  RESET_PRESET,
  useTheme,
  type ThemePreset,
} from './ThemeProvider'

const ORDER = LOOK_AXES

/**
 * EVERY axis, including the ones this preset leaves at the default.
 *
 * It used to write only the axes a preset moves, on the reasoning that the rest
 * are the White Reset. They are not: an unset axis is not "the default", it is
 * whatever the ancestor said — and this rail's ancestor is a document carrying
 * whichever theme the reader applied to the site. So every thumb showed the
 * reader's own corners, rules and face for five of its six axes, and eight
 * previews of eight different themes came out looking like eight previews of
 * the one already on screen. Named defaults are what make opting OUT possible;
 * this is the call site that needs them.
 */
function attributes(preset: ThemePreset) {
  return Object.fromEntries(
    // `attribute()` rather than `data-${axis}`: `chartPalette` is the one axis
    // whose attribute hyphenates, and `data-chartPalette` is not a typo a
    // browser reports — it is an attribute nothing selects.
    ORDER.map((axis) => [attribute(axis), preset.values[axis] ?? DEFAULTS[axis]]),
  )
}

/**
 * A theme's preview: a miniature interface, drawn by the theme itself.
 *
 * Not a colour chip, and not a picture. A chip shows a ground and an accent,
 * which are the two things a reader could have guessed from the name — it says
 * nothing about the corner, the rule weight, the face, or the row height, and
 * those are four of the six axes. A picture would show all of them and go stale
 * the first time a token moved, silently, in a file nobody would think to open.
 *
 * So it is real furniture at a small size: a title in whichever face the theme
 * carries headings in, a filled mark, two ruled rows, and a control. Every one
 * of those reads a token, so the preview cannot disagree with the theme it is
 * previewing. That is the same argument the themes page makes at full size,
 * made again in eighty pixels.
 *
 * The theme's NAME is set into it, large, in the face that theme carries
 * headings in — which is the one thing a specimen this size can say loudly. The
 * caption underneath was doing that job in the site's own face, so eight
 * previews of eight typographic decisions were all announced in the same
 * lettering, and the axis a reader notices first was the axis the list never
 * showed. It sits over the furniture rather than beside it because at eighty
 * pixels there is only one place to look.
 */
function ThemeThumb({ preset, name }: { preset: ThemePreset; name: string }) {
  return (
    <span
      {...attributes(preset)}
      data-accent={preset.values.accent}
      aria-hidden
      className="relative flex h-[5.25rem] w-full flex-col gap-1.5 overflow-hidden border-b border-(--rule) bg-(--paper) p-2.5"
    >
      {/* Over the furniture, and over a wash of the theme's own ground so the
          letters keep their contrast whatever is drawn under them. */}
      <span className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center bg-(--paper)/55">
        <span className="font-heading text-[19px] leading-none tracking-tight text-(--ink)">
          {name}
        </span>
      </span>
      {/* The same argument as the full-size specimen, at a quarter of the size:
          one theme is about what is behind a floating panel, so the preview has
          to float one. */}
      <span className="absolute end-2 top-7 z-1 flex w-14 flex-col gap-0.5 rounded-(--radius) border border-(--panel-border) bg-(--panel-bg) p-1 panel-blur">
        <span className="h-1 w-full rounded-(--radius-pill) bg-(--ink-3-aa) opacity-40" />
        <span className="h-1 w-8 rounded-(--radius-pill) bg-(--ink-3-aa) opacity-25" />
      </span>
      <span className="flex items-center justify-between gap-2">
        <span className="font-heading text-[11px] leading-none text-(--ink)">Deploys</span>
        {/* A status wash, not the accent. The accent is already on the button
            below, and spending it twice in eighty pixels makes the preview look
            like a theme about one colour — which is the reading this whole page
            exists to correct. */}
        <span className="rounded-(--radius-pill) bg-(--success-wash) px-1.5 py-0.5 text-[7px] leading-none text-(--success)">
          passing
        </span>
      </span>
      <span className="flex flex-col gap-1 border-t border-(--rule) pt-1.5">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-8 rounded-(--radius-pill) bg-(--ink-3-aa) opacity-50" />
          <span className="ms-auto h-1 w-4 rounded-(--radius-pill) bg-(--rule-2)" />
        </span>
        <span className="flex items-center gap-1.5 border-t border-(--rule) pt-1.5">
          <span className="h-1 w-10 rounded-(--radius-pill) bg-(--ink-3-aa) opacity-50" />
          <span className="ms-auto h-1 w-3 rounded-(--radius-pill) bg-(--rule-2)" />
        </span>
      </span>
      <span className="mt-auto flex items-center gap-1.5">
        <span className="rounded-(--radius) bg-(--accent) px-2 py-1 text-[7px] leading-none text-(--accent-foreground)">
          Deploy
        </span>
        <span className="rounded-(--radius) border border-(--rule-2) px-2 py-1 text-[7px] leading-none text-(--ink-2)">
          History
        </span>
      </span>
    </span>
  )
}

/**
 * The themes section's index, which is a picker rather than a list of links.
 *
 * Every other section indexes pages, so its sidebar is a nav. This one has ONE
 * page, and a column holding a single row is furniture — which is why it used
 * to have no sidebar at all. But the thing a reader wants on this page is not
 * navigation, it is the switch: seven looks, applied to the site they are
 * standing in. So the rail carries the switch, and the page beside it carries
 * the argument for why the switch is possible.
 *
 * The current theme is a `RiCheckLine`, not a highlight. A preset applies to the
 * whole document, so "which one am I in" is a fact about the site rather than
 * about this list, and it has to survive the list being scrolled past.
 */
export function ThemeRail() {
  const { apply, matching, theme } = useTheme()
  const t = useMessages()

  return (
    // No `<nav>` of its own. The shell's rail IS the navigation landmark and it
    // is already named "Themes" here; a second one inside it with the same name
    // is two landmarks a reader has to tell apart by nothing.
    <div className="flex h-full flex-col gap-4 pb-6">
      <div className="flex flex-col gap-2">
        <p className="m-0 px-1 pb-1 font-mono text-[12px] tracking-[0.06em] text-(--ink-3-aa)">
          {t.themes.title}
        </p>
        {PRESETS.map((preset) => {
          const active = matching?.id === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => apply(preset)}
              className={cn(
                'flex flex-col overflow-hidden rounded-(--radius) border text-start transition-colors duration-(--duration-fast)',
                active
                  ? 'border-(--ink)'
                  : 'border-(--rule) hover:border-(--rule-hard)',
              )}
            >
              <ThemeThumb preset={preset} name={t.themes.presets[preset.id]?.name ?? preset.name} />
              {/* The name is in the picture now, in the theme's own face. What
                  is left down here is the row's accessible name and the three
                  axes that place it — and those are the site's own type, so
                  they stay comparable between rows while the names do not. */}
              <span className="flex items-center gap-2 px-2.5 py-2">
                <span className="sr-only">
                  {t.themes.presets[preset.id]?.name ?? preset.name}
                </span>
                <span className="truncate mono-meta text-(--ink-3-aa)">
                  {t.themes.values[preset.values.surface ?? DEFAULTS.surface]} ·{' '}
                  {t.themes.values[preset.values.radius ?? DEFAULTS.radius]} ·{' '}
                  {t.themes.values[preset.values.type ?? DEFAULTS.type]}
                </span>
                {active && (
                  <RiCheckLine size={14} aria-hidden className="ms-auto shrink-0 text-(--ink)" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-2">
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => apply(RESET_PRESET)}
          disabled={matching?.id === 'reset'}
        >
          <RiResetLeftLine size={13} aria-hidden />
          {t.appearance.reset}
        </Button>
      </div>

      <Separator />

      {/* What the site is set to right now, axis by axis. The picker above says
          which BUNDLE is on; this says what that bundle actually did, which is
          the question a reader who then opens the theme menu is asking.

          The heading is a <p> OUTSIDE the list. A `<dl>` may contain only
          dt/dd pairs and the divs that group them — a heading dropped in among
          them is a term with no definition, and axe says so. */}
      <div className="flex flex-col gap-1.5 px-3">
        <p className="m-0 pb-1 eyebrow text-(--ink-3-aa)">{t.themes.axesTitle}</p>
        <dl className="m-0 flex flex-col gap-1.5">
          {ORDER.map((axis) => (
            <div key={axis} className="flex items-baseline justify-between gap-3">
              <dt className="mono-meta text-(--ink-3-aa)">{t.themes.axes[axis]}</dt>
              <dd className="m-0 text-[13px] text-(--ink-2)">
                {t.themes.values[theme[axis]] ?? theme[axis]}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="mono-meta text-(--ink-3-aa)">{t.appearance.accentTitle}</dt>
            <dd className="m-0 flex items-center gap-1.5 text-[13px] text-(--ink-2)">
              <span
                aria-hidden
                className="size-2.5 rounded-full border border-(--rule-2) bg-(--accent)"
              />
              {theme.accent}
            </dd>
          </div>
        </dl>
      </div>

      <p className="m-0 px-3 text-[12px] leading-relaxed text-(--ink-3-aa)">{t.themes.railNote}</p>
    </div>
  )
}
