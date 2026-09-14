import { RadioGroup, RadioGroupItem } from '@misoto22/folio'

/**
 * “Any time” is the option that keeps the rest optional. There is no way back
 * to nothing once a radio is chosen — not by clicking it again, not from the
 * keyboard — so a filter without an explicit escape is one a reader can enter
 * and never leave. The same reasoning rules out disabling an option to mean
 * “not available here”: the roving focus skips a disabled option entirely, so a
 * keyboard reader never learns it exists. Leave it out and say why in the
 * Field's hint.
 */
export function Example() {
  return (
    <RadioGroup defaultValue="any" aria-label="Delivery window">
      <RadioGroupItem value="any">Any time</RadioGroupItem>
      <RadioGroupItem value="morning">Morning — 8am to 12pm</RadioGroupItem>
      <RadioGroupItem value="afternoon">Afternoon — 12pm to 5pm</RadioGroupItem>
      <RadioGroupItem value="evening">Evening — 5pm to 8pm</RadioGroupItem>
    </RadioGroup>
  )
}
