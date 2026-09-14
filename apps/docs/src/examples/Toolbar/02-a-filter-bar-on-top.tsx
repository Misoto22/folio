import { Button, NativeSelect, Text, Toolbar } from '@misoto22/folio'

const ROWS = ['a1b2c3d', '9f8e7d6', '4c5b6a7', '77aa2b1', 'e3d4c5b', '0099aab', '12ff34e']

/**
 * The same component at the other edge. position top sticks the bar to the head
 * of its scroll container and moves the hairline to the bottom, so a reader
 * scrolling a long list keeps the controls that shaped it. align between is
 * what the shape needs here: the filters read from the start edge and the
 * action sits at the end, which is one bar rather than a filter row and a
 * button row. A sticky element sticks inside its scroll container, so the
 * container is the thing that needs a height — not the bar.
 */
export function Example() {
  return (
    <div className="flex h-56 w-full flex-col overflow-y-auto rounded-(--radius) border border-(--rule-2)">
      <Toolbar label="List filters" position="top" align="between">
        <NativeSelect defaultValue="all" aria-label="Branch">
          <option value="all">All branches</option>
          <option value="main">main</option>
        </NativeSelect>
        <Button size="sm" variant="secondary">
          Export CSV
        </Button>
      </Toolbar>
      <ul className="m-0 flex list-none flex-col gap-3 p-4">
        {ROWS.map((sha) => (
          <li key={sha}>
            <Text as="span" size="sm" className="font-mono">
              {sha}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  )
}
