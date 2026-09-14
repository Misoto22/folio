'use client'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from '@misoto22/folio'
import { RiCheckLine, RiPaletteLine, RiResetLeftLine } from '@remixicon/react'
import { useMessages } from '@/i18n/useLocale'
import { ACCENTS, SWATCH } from './AccentProvider'
import { AXES, DEFAULTS, LOOK_AXES, PRESETS, RESET_PRESET, useTheme } from './ThemeProvider'

/** The order the axes are offered in — ground first, then shape, then feel. */
/** The panel shows every axis a preset sets, so the two cannot drift apart. */
const ORDER = LOOK_AXES

/**
 * The theme panel.
 *
 * It changes the ground, the corners, the rules the system draws, which face
 * carries a heading, how fast anything moves, and how tight the rows are — and
 * none of it touches a component. That is the claim the token layer has been
 * making all along, and this is where it is testable.
 *
 * TWO TABS, not one long scroll. The previous version stacked the presets on
 * top of the axes in one column: the panel opened showing four preset rows and
 * nothing else, so it read as a theme picker and the six axes below the fold
 * were found by people who already knew they were there. A reader should not
 * have to scroll to learn that a control exists — a tab strip says it in the
 * first line, before anything is scrolled at all.
 *
 * Presets open first, because most readers want a look rather than six
 * decisions; the axes are one click away, because the ones who want the
 * decisions should not have to accept somebody's bundle to get at them.
 */
export function ThemeMenu() {
  const { theme, set, apply, matching } = useTheme()
  const t = useMessages()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button iconOnly size="sm" variant="ghost" aria-label={t.appearance.theme}>
          <RiPaletteLine size={16} aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        label={t.appearance.theme}
        align="end"
        className="flex max-h-[min(34rem,80vh)] w-[21rem] flex-col p-0"
      >
        <div className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-4">
          <h2 className="m-0 font-heading text-[length:var(--fs-item)] text-(--ink)">
            {t.appearance.theme}
          </h2>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => apply(RESET_PRESET)}
            disabled={matching?.id === 'reset'}
          >
            <RiResetLeftLine size={13} aria-hidden />
            {t.appearance.reset}
          </Button>
        </div>

        <Tabs
          defaultValue="presets"
          className="flex min-h-0 flex-1 flex-col"
          aria-label={t.appearance.theme}
        >
          <TabsList className="shrink-0 px-3">
            <TabsTrigger value="presets">{t.appearance.presetsTab}</TabsTrigger>
            <TabsTrigger value="custom">{t.appearance.customTab}</TabsTrigger>
          </TabsList>

          <TabsContent
            value="presets"
            className="min-h-0 flex-1 overflow-y-auto p-2 pt-2 scroll-slim"
          >
            {/* `group/presets`: the current preset is drawn filled and so is the
                one under the pointer, which is two rows claiming to be the
                answer. While the pointer is in this list the fill is the
                pointer's; it goes back to the current preset when the pointer
                leaves, and `aria-pressed` never moves. */}
            <div className="group/presets flex flex-col gap-1">
              {PRESETS.map((preset) => {
                const active = matching?.id === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => apply(preset)}
                    className="flex flex-col items-start gap-0.5 rounded-(--radius-row) px-2.5 py-2 text-start transition-colors duration-(--duration-fast) hover:bg-(--stone) aria-pressed:bg-(--accent-muted) group-hover/presets:not-hover:bg-transparent"
                  >
                    <span className="flex w-full items-center gap-2 text-sm text-(--ink)">
                      {t.themes.presets[preset.id]?.name ?? preset.name}
                      {active && (
                        <span className="ms-auto flex items-center gap-1 mono-meta text-(--ink-3-aa)">
                          <RiCheckLine size={12} aria-hidden />
                          {t.appearance.current}
                        </span>
                      )}
                    </span>
                    <span className="text-[12px] leading-snug text-(--ink-3-aa)">
                      {t.themes.presets[preset.id]?.note ?? preset.note}
                    </span>
                  </button>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent
            value="custom"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pt-4 scroll-slim"
          >
            {ORDER.map((axis) => (
              <div key={axis} className="flex flex-col gap-1.5">
                <span className="eyebrow text-(--ink-3-aa)">{t.themes.axes[axis]}</span>
                <ToggleGroup
                  type="single"
                  value={theme[axis]}
                  aria-label={t.themes.axes[axis]}
                  // A strip cannot be emptied: unpicking the ground leaves the
                  // page with no ground, so an empty value falls back.
                  onValueChange={(next) => set(axis, next || DEFAULTS[axis])}
                  className="w-full"
                >
                  {AXES[axis].map((option) => (
                    <ToggleGroupItem key={option} value={option} className="flex-1 text-[13px]">
                      {t.themes.values[option] ?? option}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <span className="eyebrow text-(--ink-3-aa)">{t.appearance.accentTitle}</span>
              <div className="flex flex-wrap gap-1.5">
                {ACCENTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={theme.accent === option.id}
                    aria-label={option.name}
                    title={option.name}
                    onClick={() => set('accent', option.id)}
                    className="grid size-8 place-items-center rounded-(--radius-sm) border border-transparent transition-colors duration-(--duration-fast) hover:border-(--rule-2) aria-pressed:border-(--ink)"
                  >
                    <span
                      aria-hidden
                      data-accent={option.id}
                      className="size-4 rounded-full border border-(--rule-2)"
                      style={{ background: SWATCH }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <p className="m-0 text-[12px] leading-relaxed text-(--ink-3-aa)">
              {t.appearance.axesNote}
            </p>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
