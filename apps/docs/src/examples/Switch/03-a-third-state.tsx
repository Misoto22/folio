import { RadioGroup, RadioGroupItem, Switch, Text } from '@misoto22/folio'

/**
 * A switch has two states and no third. “Inherit from the workspace” has no
 * drawing on a track: the only thing it could be is unchecked, which announces
 * itself as off — a different answer to a different question. On the left, a
 * setting that really is on or off; on the right, the same setting once a third
 * value exists, which is a RadioGroup and not a switch someone has been clever
 * with.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          Two states
        </Text>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-(--ink-2)">
          <Switch defaultChecked /> Require review before merge
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          Three
        </Text>
        <RadioGroup defaultValue="inherit" aria-label="Require review before merge">
          <RadioGroupItem value="on">Always require review</RadioGroupItem>
          <RadioGroupItem value="off">Never require review</RadioGroupItem>
          <RadioGroupItem value="inherit">Inherit from the workspace</RadioGroupItem>
        </RadioGroup>
      </div>
    </div>
  )
}
