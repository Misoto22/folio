# Forms

`Field` is the form row. It does the ARIA wiring that a hand-rolled label +
input + error div silently skips, and skipping it is invisible in a browser and
total for a screen reader.

## A labelled control is a `Field`

```tsx
// Incorrect — the hint is drawn and never announced, and required is decorative
<div className="space-y-2">
  <label htmlFor="email">Email *</label>
  <Input id="email" />
  <p className="text-xs text-red-500">Enter a valid email.</p>
</div>

// Correct
<Field label="Email" required error="Enter a valid email.">
  <Input type="email" />
</Field>
```

`Field` generates the id, points the label at it, and sets `aria-describedby`,
`aria-required` and `aria-invalid` on the control.

## Do not repeat what `Field` already sets

Passing `error` sets `aria-invalid` on the control for you. Writing `invalid`
as well is redundant, and writing a red border class is wrong.

```tsx
// Redundant
<Field label="Email" error={message}><Input invalid /></Field>

// Wrong
<Field label="Email" error={message}><Input className="border-red-500" /></Field>

// Correct
<Field label="Email" error={message}><Input /></Field>
```

Reach for `invalid` on the control only when there is no `Field` around it.

## `hint` and `error` are one slot

They are not two stacked messages. `error` replaces `hint` when present: when a
field is wrong, the thing to read is what is wrong with it.

```tsx
// Correct — one of the two shows, decided by whether there is an error
<Field label="Password" hint="At least 12 characters." error={errors.password}>
  <Input type="password" />
</Field>
```

## One control per `Field`

`Field` warns in development when it cannot wire a control, so you do not have
to spot this by reading. `FIELD_CONTROL_NOT_LABELLABLE` means the child is a
wrapper and the label went onto the box; `FIELD_CONTROL_NOT_WIRED` means there
was no single element to wire at all. Both print the fix.

The wiring clones a **single** element child. Two children, or a wrapper div,
and nothing is wired — the label points at an id that is on nothing.

```tsx
// Incorrect — the div is the child, so the input gets no id, no describedby
<Field label="Amount">
  <div className="flex gap-2"><Input /><Button>Max</Button></div>
</Field>

// Correct — one Field per control; the row is laid out outside it
<div className="flex items-end gap-2">
  <Field label="Amount" className="flex-1"><Input /></Field>
  <Button>Max</Button>
</div>
```

## The controls

| Need | Component | Note |
| --- | --- | --- |
| Text, email, number | `Input` | |
| Multi-line | `Textarea` | |
| A short list, styled | `Select` | `label` is **required** |
| A short list, native | `NativeSelect` | Use on mobile-first forms |
| A long, searchable list | `Combobox` | `options` array, `label` **required** |
| Boolean, in a form | `Checkbox` | |
| Boolean, applied immediately | `Switch` | |
| One of 2–7 visible options | `RadioGroup` + `RadioGroupItem` | |
| One of 2–7, as a toolbar | `ToggleGroup` + `ToggleGroupItem` | |
| A number in a range | `Slider` | `editable` adds a box to type the exact figure into |
| A number that is tuned | `NumberField` | Drag the grip to sweep; `min`/`max`/`step` are honoured on the way out |
| A colour | `ColorPicker` | OKLCH panel; `label` is **required** |
| A date | `DatePicker` / `DateRangePicker` | |

`Select` and `Combobox` take `label` even inside a `Field` — it is the
accessible name of the trigger, which is a button, not a labellable control.

## Custom controls read the shared base

Do not re-derive the text-control look. Three exports carry it, and they respond
to `data-density` and `data-mode` for free.

```tsx
import { CONTROL_BASE, CONTROL_BORDER, cn, isInvalid } from '@misoto22/folio'

function MoneyInput({ invalid, 'aria-invalid': ariaInvalid, className, ...rest }) {
  const bad = isInvalid(invalid, ariaInvalid)
  return (
    <input
      aria-invalid={bad || undefined}
      className={cn(CONTROL_BASE, bad ? CONTROL_BORDER.invalid : CONTROL_BORDER.resting, className)}
      {...rest}
    />
  )
}
```

`isInvalid()` reads both spellings — `invalid` is the ergonomic prop, and
`aria-invalid` is what a form library sets. A control that honours only one of
them loses the error styling for half the ecosystem.

## Layout

`Field` already stacks its own parts. For the gap between fields, use flex with
`gap`, not margin utilities on the children.

```tsx
// Correct
<form className="flex flex-col gap-4">
  <Field label="Name"><Input /></Field>
  <Field label="Email"><Input type="email" /></Field>
</form>
```
