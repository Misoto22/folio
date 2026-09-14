import { Heading, Separator, Text } from '@misoto22/folio'

/**
 * The rule that is doing real work. decorative={false} swaps role="none" for
 * role="separator" and sets aria-orientation with it, so a screen reader hears
 * the two sections as distinct. Reach for it only where the rule is the ONLY
 * thing dividing them — a page that announces every hairline between its rows
 * is read out as a list of separators.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-5">
      <section className="flex flex-col gap-2">
        <Heading level={3}>Installation</Heading>
        <Text size="sm">One package, and one stylesheet next to it.</Text>
      </section>
      <Separator weight="edge" decorative={false} />
      <section className="flex flex-col gap-2">
        <Heading level={3}>Upgrading</Heading>
        <Text size="sm">Minor versions add exports; they never move one.</Text>
      </section>
    </div>
  )
}
