import { Button, Text, Toolbar } from '@misoto22/folio'

/**
 * The bar of actions at the foot of a working surface. The ground is opaque
 * --paper rather than a blur, because content scrolls under it — anything
 * translucent puts the last row of the form behind the submit button. It is a
 * named group and not role="toolbar": that role promises arrow keys between the
 * controls, and nothing here implements them.
 */
export function Example() {
  return (
    <div className="flex h-56 flex-col overflow-y-auto rounded-(--radius) border border-(--rule-2)">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Text>Scroll this panel — the bar below stays where it is.</Text>
        <Text size="sm" tone="muted">
          A sticky element sticks within its scroll container, so the container
          needs a height of its own for the bar to have anything to stick to.
        </Text>
        <Text size="sm" tone="muted">
          Keep the bar to the actions. One that has grown a title and a
          breadcrumb is a page header following the reader down the screen.
        </Text>
      </div>
      <Toolbar label="Form actions">
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Save changes</Button>
      </Toolbar>
    </div>
  )
}
