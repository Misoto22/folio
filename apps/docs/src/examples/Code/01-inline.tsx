import { Code, Text } from '@misoto22/folio'

/**
 * A real <code> element, sized in em so the same token is proportionate in body
 * copy and in a caption. The element is the point rather than the mono face: a
 * styled span reads identically and tells a screen reader nothing, so "pass
 * dash dash force" is what gets announced.
 */
export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Text>
        Pass <Code>--force</Code> to overwrite <Code>dist/</Code>, and read the
        merge helper in <Code>src/lib/cn.ts</Code>.
      </Text>
      <Text size="sm" tone="muted">
        At the small step it tracks down with the sentence: <Code>--force</Code>.
      </Text>
    </div>
  )
}
