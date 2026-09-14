import { Button, Text, Toolbar } from '@misoto22/folio'

/**
 * A bulk-action bar, and the reason the role is group rather than toolbar. The
 * ARIA toolbar contract is a single tab stop with the arrow keys moving between
 * the controls inside it; this implements no roving tabindex, so declaring that
 * role would tell a screen-reader user to press keys that do nothing. As a
 * named group every control keeps its own place in the tab order — Tab reaches
 * Archive, then Delete, then Clear — and the bar is still announced by name,
 * which is why label is required rather than optional.
 */
export function Example() {
  return (
    <Toolbar label="Bulk actions for the selected rows" position="static" align="between">
      <Text as="span" size="sm" tone="muted">
        3 rows selected
      </Text>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary">
          Archive
        </Button>
        <Button size="sm" variant="danger">
          Delete
        </Button>
        <Button size="sm" variant="ghost">
          Clear
        </Button>
      </div>
    </Toolbar>
  )
}
