'use client'

import { ChevronDown, ChevronLeft, ChevronRight } from '../../icons'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  DayPicker,
  formatDay,
  labelDayButton,
  labelGridcell,
  useDayPicker,
  type DayPickerProps,
  type MonthCaptionProps,
} from 'react-day-picker'
import { cn } from '../../lib/cn'

/**
 * The strings the month-and-year picker says, none of which react-day-picker
 * knows about — its own `labels` prop covers its own chrome, and this panel is
 * ours. English by default, and exposed for the same reason `AppShell` exposes
 * `openLabel`: every one of these controls is an icon or a bare number, so the
 * string IS the control as far as a screen reader is concerned.
 *
 * The month names already follow `locale`, which is what made the chrome around
 * them read as an oversight rather than as a policy.
 */
export interface CalendarLabels {
  /** Names the panel showing twelve months. */
  monthPanelLabel?: string
  /** Names the panel showing a page of years. */
  yearPanelLabel?: string
  /** The two chevrons that browse a year at a time, inside the month panel. */
  previousYearLabel?: string
  nextYearLabel?: string
  /** The two chevrons that page the year grid, twenty-four at a time. */
  earlierYearsLabel?: string
  laterYearsLabel?: string
}

export type CalendarProps = DayPickerProps & CalendarLabels

/** Ten years either side of now — see the note on `startMonth` below. */
const DEFAULT_SPAN = 10

/** How many years one page of the year grid holds: four columns, six rows. */
const YEAR_PAGE = 24

type View = 'months' | 'years'

interface PickerOpen {
  /** Which displayed month has its picker open. */
  index: number
  view: View
  /** The first year of the page the year grid is showing, when it is showing. */
  anchor?: number
  /**
   * The year the MONTH grid is showing, when it is not the displayed month's.
   *
   * The picker browses; it does not navigate. Stepping the year used to call
   * `goToMonth` and close the panel, so `‹` on "2026" left the reader looking
   * at a different month with the picker gone — one click that did two things,
   * neither of them the one asked for. Now the arrows move this, the grid
   * re-renders under them, and the calendar moves only when a month is chosen.
   */
  year?: number
}

/** Every label resolved, so nothing downstream has to know the defaults. */
type ResolvedLabels = Required<CalendarLabels>

const DEFAULT_LABELS: ResolvedLabels = {
  monthPanelLabel: 'Month and year',
  yearPanelLabel: 'Year',
  previousYearLabel: 'Previous year',
  nextYearLabel: 'Next year',
  earlierYearsLabel: 'Earlier years',
  laterYearsLabel: 'Later years',
}

interface PickerState {
  open: PickerOpen | null
  setOpen: (next: PickerOpen | null) => void
  startMonth: Date
  endMonth: Date
  labels: ResolvedLabels
}

const PickerContext = createContext<PickerState>({
  open: null,
  setOpen: () => {},
  startMonth: new Date(),
  endMonth: new Date(),
  labels: DEFAULT_LABELS,
})

/** `Intl` beats the library's formatter here: it takes a plain BCP 47 tag. */
function useLabels() {
  const { dayPickerProps } = useDayPicker()
  const code = dayPickerProps.locale?.code ?? 'en-US'
  return useMemo(
    () => ({
      caption: new Intl.DateTimeFormat(code, { month: 'long', year: 'numeric' }),
      month: new Intl.DateTimeFormat(code, { month: 'short' }),
    }),
    [code],
  )
}

/**
 * A day button's name, led by the number the button shows.
 *
 * The library's own name is the full date alone — "Friday, October 2nd, 2026"
 * on a button that reads "2". A voice-control user says what they see, and
 * "click 2" matches nothing, because "2nd" is not "2" (WCAG 2.5.3, Label in
 * Name). `formatDay` is the call that draws the number, so the prefix is the
 * button's own text. The library's localised long date, with its "Today" and
 * "selected" notes, follows it unchanged — rewriting that date by hand would
 * have hard-coded one language's word order.
 */
const nameDayButton: typeof labelDayButton = (date, modifiers, options, dateLib) =>
  `${formatDay(date, options, dateLib)}, ${labelDayButton(date, modifiers, options, dateLib)}`

/** The same name for the cell a calendar with no `mode` draws instead of a button. */
const nameGridcell: typeof labelGridcell = (date, modifiers, options, dateLib) =>
  `${formatDay(date, options, dateLib)}, ${labelGridcell(date, modifiers, options, dateLib)}`

/** The calendar's chrome buttons: the same corner every other control draws. */
const STEP =
  'grid size-8 shrink-0 place-items-center rounded-(--radius) text-(--ink-2) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none'

const CELL =
  'rounded-(--radius-row) py-2 text-sm transition-colors duration-(--duration-fast) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none'
/** The one that is showing, marked the way a chosen day is marked. */
const CELL_ON = 'bg-(--accent) text-(--accent-foreground)'
const CELL_OFF = 'text-(--ink-2) hover:bg-(--stone) hover:text-(--ink)'

/**
 * The month and year picker, drawn IN PLACE of the day grid.
 *
 * The previous arrangement was two `Select`s in the caption, which portalled
 * their option lists over the grid — a ten-rem box showing three months at a
 * time with a scroll arrow at each end, floating on top of the calendar the
 * reader opened it to change. Three visible options out of twelve is not a
 * picker, and it covered the thing being picked for.
 *
 * Twelve months fit in a 3×4 grid at the exact size of the grid they replace,
 * so nothing overlaps, nothing scrolls, and the panel is the same shape as the
 * surface underneath it. Twenty years fit the same box in 4×5, which is why the
 * default span is ten years either side: one page, no paging.
 */
function MonthYearPanel({
  index,
  view,
  anchor,
  year: browsing,
  month,
}: {
  index: number
  view: View
  anchor?: number
  year?: number
  month: Date
}) {
  const { setOpen, startMonth, endMonth, labels: names } = useContext(PickerContext)
  const { goToMonth } = useDayPicker()
  const labels = useLabels()

  /** The year being browsed, which is the displayed one until an arrow moves it. */
  const year = browsing ?? month.getFullYear()
  /** The month marked as current — only when the browsed year IS the shown one. */
  const showing = year === month.getFullYear() ? month.getMonth() : -1
  const firstYear = startMonth.getFullYear()
  const lastYear = endMonth.getFullYear()

  /**
   * The offset is what makes this work in a two-month range picker: `goToMonth`
   * always sets the FIRST displayed month, so picking September in the
   * right-hand pane has to ask for August.
   */
  const go = (nextYear: number, nextMonth: number) => {
    goToMonth(new Date(nextYear, nextMonth - index, 1))
    setOpen(null)
  }

  const inRange = (nextYear: number, nextMonth: number) => {
    const value = nextYear * 12 + nextMonth
    const low = startMonth.getFullYear() * 12 + startMonth.getMonth()
    const high = endMonth.getFullYear() * 12 + endMonth.getMonth()
    return value >= low && value <= high
  }

  if (view === 'years') {
    /**
     * Pages TILE the range from its first year, rather than being centred on
     * whichever year is showing. Centring left the first year of a range on no
     * page at all when the range was not a whole number of pages long — the
     * calendar offered a year it could never reach, and nothing said so.
     */
    const page = (candidate: number) =>
      Math.floor((candidate - firstYear) / YEAR_PAGE) * YEAR_PAGE + firstYear
    const start = anchor ?? page(year)
    const years = Array.from({ length: YEAR_PAGE }, (_, offset) => start + offset).filter(
      (candidate) => candidate >= firstYear && candidate <= lastYear,
    )
    const back = start - YEAR_PAGE >= firstYear
    const forward = start + YEAR_PAGE <= lastYear
    const move = (delta: number) =>
      setOpen({ index, view: 'years', anchor: start + delta * YEAR_PAGE })

    return (
      <Panel key="years" label={names.yearPanelLabel}>
        <div className="mb-1 flex items-center justify-between gap-1">
          <button
            type="button"
            aria-label={names.earlierYearsLabel}
            disabled={!back}
            onClick={() => move(-1)}
            className={STEP}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <span className="mono-meta tabular-nums text-(--ink-3-aa)">
            {years[0]} – {years.at(-1)}
          </span>
          <button
            type="button"
            aria-label={names.laterYearsLabel}
            disabled={!forward}
            onClick={() => move(1)}
            className={STEP}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
        <div data-picker-grid className="grid grid-cols-4 gap-1">
          {years.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-current={candidate === year ? 'true' : undefined}
              onClick={() => setOpen({ index, view: 'months', year: candidate })}
              className={cn(CELL, 'tabular-nums', candidate === year ? CELL_ON : CELL_OFF)}
            >
              {candidate}
            </button>
          ))}
        </div>
      </Panel>
    )
  }

  return (
    <Panel key="months" label={names.monthPanelLabel}>
      <div className="mb-1 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label={names.previousYearLabel}
          disabled={year <= firstYear}
          onClick={() => setOpen({ index, view: 'months', year: year - 1 })}
          className={STEP}
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setOpen({ index, view: 'years', anchor })}
          className="rounded-(--radius-row) px-3 py-1 font-heading text-[length:var(--fs-item)] tabular-nums text-(--ink) transition-colors duration-(--duration-fast) hover:bg-(--stone)"
        >
          {year}
        </button>
        <button
          type="button"
          aria-label={names.nextYearLabel}
          disabled={year >= lastYear}
          onClick={() => setOpen({ index, view: 'months', year: year + 1 })}
          className={STEP}
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
      <div data-picker-grid className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <button
            key={monthIndex}
            type="button"
            aria-current={monthIndex === showing ? 'true' : undefined}
            disabled={!inRange(year, monthIndex)}
            onClick={() => go(year, monthIndex)}
            className={cn(CELL, monthIndex === showing ? CELL_ON : CELL_OFF)}
          >
            {labels.month.format(new Date(year, monthIndex, 1))}
          </button>
        ))}
      </div>
    </Panel>
  )
}

/**
 * The panel's box.
 *
 * `top-12` is the caption's own height plus the gap under it, so the panel
 * starts exactly where the weekday row does and ends where the last week does.
 * Sized against the grid rather than given a height of its own, because a fixed
 * height would be wrong in the month that needs a sixth week.
 *
 * Focus moves in when it opens and the month showing is what receives it, so a
 * keyboard reader lands on the current value rather than at the top of a grid
 * they then have to traverse. Tab then WRAPS inside the panel: it is drawn in
 * `--paper` over a day grid that is still mounted and still focusable, so Tab
 * used to leave the reader on a day they could not see, past the caption that
 * owns the Escape handler and therefore with no way back.
 *
 * `dialog` follows from that rather than decorating it. The role was `group`
 * for as long as Tab walked out — announcing a dialog nobody is held inside is
 * worse than announcing nothing — and the same rule, read the other way, is
 * what makes `dialog` correct now. No `aria-modal`: the panel covers this
 * month's grid, not the page, and the rest of the document is still there.
 */
function Panel({ label, children }: { label: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)

  // Keyed by view at the call site, so switching from months to years remounts
  // this and the effect runs again. Without that the year grid replaced the
  // button that had just been clicked, focus fell back to `<body>`, and Escape
  // no longer reached the handler that closes the panel.
  useEffect(() => {
    // The current value if the panel is showing it, and otherwise the first
    // cell in the grid. Browsing to another year leaves nothing marked current,
    // and a panel that focuses nothing drops focus to `<body>` — where Escape
    // no longer reaches the handler that closes it.
    const grid = box.current?.querySelector('[data-picker-grid]')
    const target =
      box.current?.querySelector<HTMLButtonElement>('[aria-current]') ??
      grid?.querySelector<HTMLButtonElement>('button:not(:disabled)')
    target?.focus()
  }, [])

  // Every stop in here is a button; there is nothing else to collect, and a
  // general focusable-element query would be a guess about markup this file
  // writes itself. Disabled months are out of range and out of the tab order.
  const stops = () =>
    Array.from(box.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [])

  const wrap = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const buttons = stops()
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (!first || !last) return

    const [edge, opposite] = event.shiftKey ? [first, last] : [last, first]
    if (document.activeElement !== edge) return

    event.preventDefault()
    opposite.focus()
  }

  return (
    <div
      ref={box}
      role="dialog"
      aria-label={label}
      onKeyDown={wrap}
      className="absolute inset-x-0 bottom-0 top-12 z-2 flex flex-col justify-center bg-(--paper)"
    >
      {children}
    </div>
  )
}

/**
 * The caption: the month and year, as one control that opens the picker.
 *
 * One button rather than two dropdowns. "September 2026" is how the date is
 * said, and splitting it into two controls with a chevron each put four
 * interactive things in a 250px caption that also has to hold two arrows.
 */
function CalendarCaption({ calendarMonth, displayIndex, className, ...rest }: MonthCaptionProps) {
  const { open, setOpen } = useContext(PickerContext)
  const labels = useLabels()
  const trigger = useRef<HTMLButtonElement>(null)
  const mine = open !== null && open.index === displayIndex

  return (
    <div
      className={className}
      // Escape closes the picker and puts focus back where it came from. A
      // panel that covers the grid and cannot be dismissed from the keyboard is
      // a trap, however briefly.
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !mine) return
        event.stopPropagation()
        setOpen(null)
        trigger.current?.focus()
      }}
      {...rest}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={mine}
        onClick={() => setOpen(mine ? null : { index: displayIndex, view: 'months' })}
        className="group flex items-center gap-1.5 rounded-(--radius-row) px-2 py-1 font-heading text-[length:var(--fs-item)] text-(--ink) transition-colors duration-(--duration-fast) hover:bg-(--stone)"
      >
        {labels.caption.format(calendarMonth.date)}
        <ChevronDown
          size={16}
          aria-hidden
          className={cn(
            'shrink-0 text-(--ink-3-aa) transition-transform duration-(--duration-fast)',
            mine && 'rotate-180',
          )}
        />
      </button>
      {mine && open !== null && (
        <MonthYearPanel
          index={displayIndex}
          view={open.view}
          anchor={open.anchor}
          year={open.year}
          month={calendarMonth.date}
        />
      )}
    </div>
  )
}

/**
 * A month, as a grid of days.
 *
 * Wraps react-day-picker rather than building a calendar, and the reason is the
 * long tail: a month grid is easy, and everything around it is not — the
 * keyboard contract (arrows move a day, Page moves a month, Home and End reach
 * the week's ends), the `aria-live` announcement when the month changes, week
 * numbering, the first day of the week varying by locale, and the fact that
 * "today" and "selected" are different states a screen reader must hear apart.
 *
 * Every class is replaced rather than layered over the library's stylesheet, so
 * nothing here depends on a CSS file this package does not control — but the
 * library's OWN class is kept on each slot, because passing a class REPLACES it
 * and every `.rdp-*` selector downstream depends on those.
 *
 * The month names follow `locale`. The picker's own chrome — the two panels and
 * the four chevrons that browse them — follows `CalendarLabels`, because
 * `locale` cannot supply strings this package invented.
 *
 * @example
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * @example
 * // A birth date: widen the years, since the default span is deliberately short.
 * <Calendar mode="single" startMonth={new Date(1920, 0)} endMonth={new Date()} />
 */
export function Calendar({
  className,
  classNames,
  components,
  monthPanelLabel,
  yearPanelLabel,
  previousYearLabel,
  nextYearLabel,
  earlierYearsLabel,
  laterYearsLabel,
  ...props
}: CalendarProps) {
  const now = new Date()
  const [open, setOpen] = useState<PickerState['open']>(null)

  // Destructured out of `props` above rather than forwarded: everything left in
  // `props` goes to DayPicker, and these six are this package's own.
  const labels: ResolvedLabels = {
    monthPanelLabel: monthPanelLabel ?? DEFAULT_LABELS.monthPanelLabel,
    yearPanelLabel: yearPanelLabel ?? DEFAULT_LABELS.yearPanelLabel,
    previousYearLabel: previousYearLabel ?? DEFAULT_LABELS.previousYearLabel,
    nextYearLabel: nextYearLabel ?? DEFAULT_LABELS.nextYearLabel,
    earlierYearsLabel: earlierYearsLabel ?? DEFAULT_LABELS.earlierYearsLabel,
    laterYearsLabel: laterYearsLabel ?? DEFAULT_LABELS.laterYearsLabel,
  }

  // Ten years either side, NOT a century. A hundred-and-eleven-row year list is
  // a scroll, not a choice — and the case that needs one (a birth date) is rare
  // enough to ask for it explicitly. Both ends are props, so widening is one
  // line at the call site.
  const startMonth = props.startMonth ?? new Date(now.getFullYear() - DEFAULT_SPAN, 0)
  const endMonth = props.endMonth ?? new Date(now.getFullYear() + DEFAULT_SPAN, 11)

  /**
   * A one-day range is marked start AND end AND middle, all three.
   *
   * That is what made the earlier arrangement collapse: `range_middle` cleared
   * the button's fill so a middle day would not look chosen, and on a one-day
   * range that same rule cleared the fill of the only day there was. Deciding
   * by mode instead of fighting it with `!important` means the two never
   * describe the same button — in a range the fill belongs to the ends, and in
   * single mode it belongs to `selected`.
   */
  const isRange = props.mode === 'range'
  const FILL =
    '[&>button]:bg-(--accent) [&>button]:text-(--accent-foreground) [&>button:hover]:bg-(--accent) [&>button:hover]:text-(--accent-foreground)'

  return (
    <PickerContext value={{ open, setOpen, startMonth, endMonth, labels }}>
      <DayPicker
        showOutsideDays
        // The caption is one control that swaps the grid for a month picker, so
        // the library's own dropdown layout is not wanted.
        captionLayout="label"
        startMonth={startMonth}
        endMonth={endMonth}
        className={cn('w-fit p-3', className)}
        components={{
          Chevron: ({ orientation, ...rest }) =>
            orientation === 'left' ? (
              <ChevronLeft size={16} aria-hidden {...rest} />
            ) : (
              <ChevronRight size={16} aria-hidden {...rest} />
            ),
          MonthCaption: CalendarCaption,
          ...components,
        }}
        classNames={{
          // `rdp-root` is kept deliberately. Passing a class for a slot REPLACES
          // the library's own, so overriding `root` silently removed the hook
          // that every `.rdp-*` selector — ours and a consumer's — depends on.
          root: 'rdp-root relative',
          // The nav renders BEFORE the months in the DOM, so left in the flow it
          // stacks its two arrows above the grid. Taking it out of the flow puts
          // them where they belong — one at each end of the caption.
          //
          // `h-9` is what makes them line up. The caption is a 36px row and the
          // nav was a 16px glyph pinned at the same top edge, so the arrows sat
          // ten pixels above the month they belong to — close enough to read as
          // a mistake and not close enough to read as a decision. Same height,
          // same centre line.
          //
          // It steps away while the picker is open: two ways to change the
          // month, one of them behind a panel, is one too many.
          //
          // `pointer-events-none` on the STRIP and back on for the two buttons:
          // at the caption's full height it lies across the caption, and a bar
          // with nothing in the middle of it was still eating the click on the
          // month label underneath.
          nav: cn(
            'pointer-events-none absolute inset-x-3 top-3 z-1 flex h-9 items-center justify-between transition-opacity duration-(--duration-fast)',
            open && 'opacity-0',
          ),
          // The arrows are pointer targets, not glyphs: a 16px chevron with no
          // box is a 16px hit area, which is under every guideline there is.
          button_previous: cn(STEP, open ? 'pointer-events-none' : 'pointer-events-auto'),
          button_next: cn(STEP, open ? 'pointer-events-none' : 'pointer-events-auto'),
          months: 'flex flex-col gap-4 sm:flex-row',
          // Positioned, because the month picker covers this month's grid and
          // nothing else — in a two-month range picker each pane opens its own.
          month: 'relative flex flex-col gap-3',
          month_caption: 'flex h-9 items-center justify-center',
          month_grid: 'w-full border-collapse',
          weekdays: 'flex',
          weekday: 'w-9 mono-meta font-normal text-(--ink-3-aa)',
          week: 'mt-1 flex w-full',
          // The band lives on the CELL and the mark lives on the BUTTON. Keeping
          // them apart is what lets a range be one continuous wash while both of
          // its ends stay round — the previous arrangement flattened the corners
          // of whichever day was an end, and a one-day range is BOTH ends, so it
          // came out as a square.
          day: 'relative p-0 text-center',
          day_button:
            'relative z-1 inline-flex size-9 items-center justify-center rounded-(--radius-pill) text-sm text-(--ink-2) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink)',
          selected: isRange ? '' : FILL,
          // Today is an outline, not a fill — it is a fact about the calendar,
          // not a choice the reader made, and the two must not look alike.
          today: '[&>button]:ring-1 [&>button]:ring-(--rule-hard) [&>button]:ring-inset',
          outside: '[&>button]:text-(--ink-3-aa)',
          disabled: '[&>button]:opacity-(--disabled-opacity) [&>button]:pointer-events-none',
          // The wash lives on the CELL and the mark on the BUTTON, which is what
          // lets a range read as one continuous band while both of its ends stay
          // round. A middle day gets the wash and no fill; the ends get both.
          range_middle: 'bg-(--accent-muted) [&>button]:text-(--ink) [&>button:hover]:bg-(--stone)',
          range_start: cn('bg-(--accent-muted) rounded-s-(--radius-pill)', FILL),
          range_end: cn('bg-(--accent-muted) rounded-e-(--radius-pill)', FILL),
          hidden: 'invisible',
          ...classNames,
        }}
        {...props}
        // After the spread, so a consumer's `labels` is merged rather than
        // dropped — and their own `labelDayButton`, if they pass one, wins.
        labels={{ labelDayButton: nameDayButton, labelGridcell: nameGridcell, ...props.labels }}
      />
    </PickerContext>
  )
}

export default Calendar
