'use client'

import { Calendar as CalendarIcon } from '../../icons'
import { useId, useRef, useState, type ComponentProps } from 'react'
import { dateMatchModifiers, type DateRange } from 'react-day-picker'
import { cn } from '../../lib/cn'
import { Calendar } from '../Calendar/Calendar'
import { useFieldControl } from '../Field/field-control'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover'

export type { DateRange }

/** A named shortcut in the rail beside the calendar. */
export interface DatePreset<T> {
  label: string
  /** Computed when clicked, not when rendered — "today" must mean today. */
  value: () => T
}

/** `n` days back from today, inclusive of today. */
const daysAgo = (n: number): DateRange => {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (n - 1))
  return { from, to }
}

/**
 * The shortcuts a range picker is asked for on nearly every screen it appears
 * on, so they ship rather than being rebuilt per dashboard.
 *
 * Computed on click: a preset list built at render time freezes "today" at
 * whenever the page loaded, which is wrong for anything left open overnight.
 */
export const RANGE_PRESETS: DatePreset<DateRange>[] = [
  { label: 'Last 7 days', value: () => daysAgo(7) },
  { label: 'Last 30 days', value: () => daysAgo(30) },
  { label: 'Last 90 days', value: () => daysAgo(90) },
  { label: 'Last 12 months', value: () => daysAgo(365) },
  {
    label: 'Month to date',
    value: () => {
      const to = new Date()
      return { from: new Date(to.getFullYear(), to.getMonth(), 1), to }
    },
  },
  {
    label: 'Year to date',
    value: () => {
      const to = new Date()
      return { from: new Date(to.getFullYear(), 0, 1), to }
    },
  },
]

/** The single-date equivalent. */
export const DATE_PRESETS: DatePreset<Date>[] = [
  { label: 'Today', value: () => new Date() },
  {
    label: 'Tomorrow',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date
    },
  },
  {
    label: 'In a week',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date
    },
  },
  {
    label: 'In a month',
    value: () => {
      const date = new Date()
      date.setMonth(date.getMonth() + 1)
      return date
    },
  },
]

/**
 * The rail of shortcuts.
 *
 * A `<nav>`-less list of plain buttons rather than a menu: they set the same
 * value the grid beside them sets, so they are part of one control and should
 * Tab in the same pass rather than opening something.
 *
 * Setting the same value means being refused for the same reasons: a shortcut
 * that commits a date the grid beside it will not accept hands the caller back
 * a value the control itself calls invalid. `blocked` is asked at render, so the
 * button is visibly unavailable rather than silently inert, and again on click,
 * because the value is computed then — "today" has to mean today.
 */
function PresetRail<T>({
  presets,
  onPick,
  label,
  blocked,
}: {
  presets: DatePreset<T>[]
  onPick: (value: T) => void
  label: string
  blocked?: (value: T) => boolean
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 flex-col gap-0.5 border-b border-(--rule) p-2 sm:border-b-0 sm:border-e max-sm:flex-row max-sm:flex-wrap"
    >
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          disabled={blocked?.(preset.value()) ?? false}
          onClick={() => {
            const next = preset.value()
            if (blocked?.(next)) return
            onPick(next)
          }}
          className="rounded-(--radius-sm) px-2.5 py-1.5 text-start text-[13px] text-(--ink-2) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none"
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

const TRIGGER =
  'flex w-full items-center justify-between gap-2 rounded-(--radius) border border-(--rule-2) bg-(--paper) px-(--field-px) py-(--field-py) text-start text-sm transition-colors duration-(--duration-fast) hover:border-(--rule-hard) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none'

/**
 * The visitor's own locale, not a fixed `dd/mm/yyyy`.
 *
 * `03/04` is March the fourth in one country and the third of April in the
 * next, and there is no format that is unambiguous to everyone. `Intl` already
 * knows which one this reader expects.
 */
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined) => void
  /**
   * Names the control. Required — the trigger's text is a value, not a label.
   *
   * Announced together with the printed date rather than instead of it, so
   * `format` reaches a screen reader as well as the screen. Inside a `Field`
   * with a label, that label names the trigger and this one is not repeated.
   */
  label: string
  placeholder?: string
  disabled?: boolean
  /**
   * Days the reader may not choose.
   *
   * Reaches the calendar AND the shortcut rail: a preset landing on a blocked
   * day is drawn unavailable and refuses the click, rather than committing a
   * value the grid beside it would not accept.
   */
  disabledDates?: ComponentProps<typeof Calendar>['disabled']
  /** How the chosen date is printed on the trigger. */
  format?: (date: Date) => string
  /**
   * Shortcuts shown beside the grid. Pass `true` for the built-in set, an array
   * for your own, or leave it off for none.
   */
  presets?: boolean | DatePreset<Date>[]
  className?: string
  /** The TRIGGER's id — the element a label points at. A `Field` sets it. */
  id?: string
  /** Ids of the copy describing the control. A `Field` sets it from hint, error and description. */
  'aria-describedby'?: string
  /** Announced on the trigger. A `Field` sets it from `error`. */
  'aria-invalid'?: boolean | 'true' | 'false'
}

/**
 * A date, chosen from a calendar.
 *
 * A trigger and a `Calendar` in a `Popover` — not a new component so much as
 * the composition people otherwise assemble slightly differently on every
 * screen.
 *
 * It is deliberately NOT a text input with a calendar attached. A typed date
 * needs parsing, and parsing needs a format, and a format is a locale argument
 * nobody wins. When typing genuinely matters — a birth date, a long way back —
 * the calendar's month and year are dropdowns, which is the same journey
 * without the ambiguity.
 *
 * @example
 * <Field label="Publish on"><DatePicker label="Publish on" /></Field>
 */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = 'Pick a date',
  disabled = false,
  disabledDates,
  format = formatDate,
  presets,
  className,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  const rail = presets === true ? DATE_PRESETS : presets || undefined
  const [open, setOpen] = useState(false)
  const [uncontrolled, setUncontrolled] = useState<Date | undefined>(defaultValue)
  const current = value ?? uncontrolled

  const field = useFieldControl()
  const generated = useId()
  const triggerId = id ?? generated
  const valueId = `${triggerId}-value`
  const nameId = field?.labelId ?? `${triggerId}-name`

  const choose = (next: Date | undefined) => {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
    if (next) setOpen(false)
  }

  const refuses = (date: Date) =>
    disabledDates !== undefined && dateMatchModifiers(date, disabledDates)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={triggerId}
        // The label and the printed date, in that order. `aria-label` outranked
        // the trigger's own text, so `format` reached the screen and nothing
        // else — the chosen date was invisible to a screen reader.
        aria-labelledby={`${nameId} ${valueId}`}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid || undefined}
        disabled={disabled}
        className={cn(TRIGGER, current ? 'text-(--ink)' : 'text-(--ink-3-aa)', className)}
      >
        {field?.labelId == null && (
          <span id={nameId} className="sr-only">
            {label}
          </span>
        )}
        <span id={valueId} className="truncate">
          {current ? format(current) : placeholder}
        </span>
        <CalendarIcon size={14} aria-hidden className="shrink-0 text-(--ink-3-aa)" />
      </PopoverTrigger>
      <PopoverContent label={label} align="start" className="w-auto overflow-hidden p-0">
        <div className="flex flex-col sm:flex-row">
          {rail && (
            <PresetRail
              presets={rail}
              onPick={choose}
              label={`${label} shortcuts`}
              blocked={refuses}
            />
          )}
          <Calendar
            mode="single"
            selected={current}
            onSelect={choose}
            disabled={disabledDates}
            autoFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (value: DateRange | undefined) => void
  /** Names the control. Announced together with the printed range, not instead of it. */
  label: string
  placeholder?: string
  disabled?: boolean
  /**
   * Days the reader may not choose.
   *
   * Reaches the shortcut rail as well as the grid, at the ENDS of each preset
   * range — a shortcut whose interior straddles a blocked day is still offered,
   * the way the grid still lets a reader drag a range across one.
   */
  disabledDates?: ComponentProps<typeof Calendar>['disabled']
  /** How many months are shown side by side. Falls back to one under `sm`. */
  months?: number
  format?: (date: Date) => string
  /**
   * Shortcuts shown beside the grid — Last 30 days and its neighbours. `true`
   * for the built-in set, an array for your own.
   *
   * On by default here and off on the single picker, because "last 30 days" is
   * most of what a range picker is ever asked for, while a single date is
   * usually a specific one.
   */
  presets?: boolean | DatePreset<DateRange>[]
  className?: string
  /** The TRIGGER's id — the element a label points at. A `Field` sets it. */
  id?: string
  /** Ids of the copy describing the control. A `Field` sets it from hint, error and description. */
  'aria-describedby'?: string
  /** Announced on the trigger. A `Field` sets it from `error`. */
  'aria-invalid'?: boolean | 'true' | 'false'
}

/**
 * A span of dates — a stay, a reporting period, a filter.
 *
 * Two months side by side, because a range that crosses a month boundary is the
 * common case, and paging back and forth to see both ends is what makes a range
 * picker tiring. They stack under `sm`, where two would not fit — the calendar's
 * own `months` class already carries that, so there is nothing to override.
 *
 * The panel stays open until both ends are chosen: a range is not a value until
 * it has a second date, and closing on the first one would mean re-opening to
 * finish.
 *
 * @example
 * <DateRangePicker label="Reporting period" />
 */
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = 'Pick a range',
  disabled = false,
  disabledDates,
  months = 2,
  format = formatDate,
  presets = true,
  className,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
}: DateRangePickerProps) {
  const rail = presets === true ? RANGE_PRESETS : presets || undefined
  const [open, setOpen] = useState(false)
  const [uncontrolled, setUncontrolled] = useState<DateRange | undefined>(defaultValue)
  const current = value ?? uncontrolled

  const field = useFieldControl()
  const generated = useId()
  const triggerId = id ?? generated
  const valueId = `${triggerId}-value`
  const nameId = field?.labelId ?? `${triggerId}-name`

  const refuses = (range: DateRange) =>
    disabledDates !== undefined &&
    [range.from, range.to].some((date) => date != null && dateMatchModifiers(date, disabledDates))

  /**
   * How many days have been clicked since the panel opened.
   *
   * Counted, rather than inferred from the range being "complete", because the
   * first click returns `{ from: day, to: day }` — a complete range by any
   * reading of the value. Closing on that meant every attempt at a range
   * produced a one-day one and shut the panel, which is the opposite of what a
   * range picker is for.
   */
  const clicks = useRef(0)

  const choose = (next: DateRange | undefined) => {
    clicks.current += 1
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
    if (clicks.current >= 2 && next?.from && next.to) setOpen(false)
  }

  const setPanel = (next: boolean) => {
    if (next) clicks.current = 0
    setOpen(next)
  }

  const complete = current?.from && current.to && current.from.getTime() !== current.to.getTime()
  const printed = current?.from
    ? complete
      ? `${format(current.from)} – ${format(current.to!)}`
      : `${format(current.from)} – …`
    : placeholder

  return (
    <Popover open={open} onOpenChange={setPanel}>
      <PopoverTrigger
        id={triggerId}
        // The label and the printed range together — see DatePicker above.
        aria-labelledby={`${nameId} ${valueId}`}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid || undefined}
        disabled={disabled}
        className={cn(TRIGGER, current?.from ? 'text-(--ink)' : 'text-(--ink-3-aa)', className)}
      >
        {field?.labelId == null && (
          <span id={nameId} className="sr-only">
            {label}
          </span>
        )}
        <span id={valueId} className="truncate">
          {printed}
        </span>
        <CalendarIcon size={14} aria-hidden className="shrink-0 text-(--ink-3-aa)" />
      </PopoverTrigger>
      <PopoverContent label={label} align="start" className="w-auto overflow-hidden p-0">
        <div className="flex flex-col sm:flex-row">
          {rail && (
            <PresetRail
              presets={rail}
              onPick={(next) => {
                // A preset is a complete range in one gesture, so the panel
                // closes — unlike a first click on the grid, which is half an
                // answer.
                if (value === undefined) setUncontrolled(next)
                onValueChange?.(next)
                setOpen(false)
              }}
              label={`${label} shortcuts`}
              blocked={refuses}
            />
          )}
          <Calendar
            mode="range"
            selected={current}
            onSelect={choose}
            disabled={disabledDates}
            numberOfMonths={months}
            autoFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
