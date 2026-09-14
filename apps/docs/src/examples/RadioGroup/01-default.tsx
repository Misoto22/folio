import { RadioGroup, RadioGroupItem } from '@misoto22/folio'

/**
 * Three options and one tab stop: the arrows move between them, which is the
 * ARIA radiogroup pattern and the half a stack of hand-rolled radios usually
 * loses. aria-label is not optional — the root is a div, so htmlFor, including
 * the one a Field draws, binds to nothing and the group would be announced with
 * no name at all. defaultValue matters as much: selection follows focus here,
 * so a group that starts empty commits an answer on behalf of anyone who
 * arrows past it on the way to the next field.
 */
export function Example() {
  return (
    <RadioGroup defaultValue="system" aria-label="Appearance">
      <RadioGroupItem value="light">Light</RadioGroupItem>
      <RadioGroupItem value="dark">Dark</RadioGroupItem>
      <RadioGroupItem value="system">Match the system</RadioGroupItem>
    </RadioGroup>
  )
}
