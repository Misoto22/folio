import { RadioGroup, RadioGroupItem, Text } from '@misoto22/folio'

const PLANS = [
  { value: 'solo', name: 'Solo', detail: 'One seat, 5 GB of originals.' },
  { value: 'studio', name: 'Studio', detail: 'Ten seats, shared collections, 1 TB.' },
  { value: 'agency', name: 'Agency', detail: 'Unlimited seats, client review links, 10 TB.' },
]

/**
 * A second line inside the option, where the price or the limit is what decides
 * the choice. RadioGroupItem's own label wraps whatever it is given, so the
 * detail is inside the click target and inside the accessible name — keep it to
 * the one fact that settles it, because it is read out with the option every
 * time. The rows are aligned to their first line, since a circle centred
 * against two lines drifts away from the name it belongs to.
 */
export function Example() {
  return (
    <RadioGroup defaultValue="studio" aria-label="Plan" className="max-w-sm">
      {PLANS.map((plan) => (
        <RadioGroupItem key={plan.value} value={plan.value} className="items-start">
          <span className="flex flex-col gap-0.5">
            <Text as="span" size="sm" tone="strong">
              {plan.name}
            </Text>
            <Text as="span" size="xs" tone="muted">
              {plan.detail}
            </Text>
          </span>
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}
