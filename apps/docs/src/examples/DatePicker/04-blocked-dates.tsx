import { DatePicker, Field } from '@misoto22/folio'

/** Midnight today, so the day itself stays choosable and yesterday does not. */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0))

/**
 * disabledDates goes straight through to the calendar: past days and weekends
 * are refused here, and the grid will not commit one. Note there is no preset
 * rail beside it — the shortcuts call their value straight into the same setter
 * the grid uses and are never tested against disabledDates, so a rail next to
 * these rules would happily commit a Sunday the grid itself refuses. If you
 * want both, check each preset by hand. Reach for disabledDates rather than
 * disabled, too: disabled takes the trigger out of the tab order and blocks its
 * pointer events, and the trigger is the only place the chosen date is printed.
 */
export function Example() {
  return (
    <Field
      label="Site visit"
      hint="Weekdays only, and not in the past."
      className="w-full max-w-xs"
    >
      <DatePicker label="Site visit" disabledDates={[{ before: TODAY }, { dayOfWeek: [0, 6] }]} />
    </Field>
  )
}
