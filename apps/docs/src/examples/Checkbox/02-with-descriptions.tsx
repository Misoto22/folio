import { Checkbox, Text } from '@misoto22/folio'

const OPTIONS = [
  {
    id: 'invoices',
    label: 'Email me invoices',
    detail: 'One PDF a month, to the billing address.',
    on: true,
  },
  {
    id: 'renewals',
    label: 'Remind me before a renewal',
    detail: 'Seven days ahead, once.',
    on: true,
  },
  {
    id: 'research',
    label: 'Occasional research invitations',
    detail: 'A handful a year. Never a newsletter.',
    on: false,
  },
]

/**
 * Box, name, and the line that says what saying yes actually costs — all three
 * inside the label, so the whole row is the click target rather than an 18px
 * square, and the sentence is part of the accessible name. That is the argument
 * for putting the detail inside rather than beside it, and also the reason to
 * keep it to one clause: it is read out every time the row is. The rows align
 * on their first line, because a box centred against two lines of text floats
 * away from the word it belongs to. These commit when the form is saved; a
 * setting that applies on the spot is a Switch.
 */
export function Example() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      {OPTIONS.map((option) => (
        <label key={option.id} className="flex cursor-pointer items-start gap-3">
          <Checkbox defaultChecked={option.on} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <Text as="span" size="sm" tone="strong">
              {option.label}
            </Text>
            <Text as="span" size="xs" tone="muted">
              {option.detail}
            </Text>
          </span>
        </label>
      ))}
    </div>
  )
}
