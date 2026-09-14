import { Field, RadioGroup, RadioGroupItem } from '@misoto22/folio'

/**
 * A Field around a RadioGroup draws the words and binds them to nothing: the
 * group's root is a div, and htmlFor only reaches a labelable element, so
 * clicking the label does nothing and the group would be announced with no name
 * at all. The same words go on the group as aria-label, and that is what a
 * screen reader actually reads. ToggleGroup needs the same treatment, and
 * Select, Combobox, DatePicker and Slider each take a required label of their
 * own for the same reason.
 */
export function Example() {
  return (
    <Field
      label="Delivery speed"
      hint="Weekend delivery is metro only."
      className="w-full max-w-sm"
    >
      <RadioGroup defaultValue="standard" aria-label="Delivery speed">
        <RadioGroupItem value="standard">Standard — 3 to 5 business days</RadioGroupItem>
        <RadioGroupItem value="express">Express — next business day</RadioGroupItem>
        <RadioGroupItem value="pickup">Collect from the Newtown store</RadioGroupItem>
      </RadioGroup>
    </Field>
  )
}
