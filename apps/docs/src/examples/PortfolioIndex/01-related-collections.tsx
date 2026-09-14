import { Text } from '@misoto22/folio'
import { PortfolioIndex, PortfolioRecord } from '@misoto22/folio/website'

/**
 * Each tab carries its records and supporting context together.
 * Arrow keys move through the shared tab strip without changing application routes.
 */
export function Example() {
  return (
    <PortfolioIndex label="Selected work" items={[
      { value: 'writing', label: 'Writing', count: 1,
        content: <PortfolioRecord title="The value of a small tool" description="An essay about useful constraints." context="Essay" />,
        aside: <Text size="sm">Notes on design, systems and everyday practice.</Text> },
      { value: 'projects', label: 'Projects', count: 1,
        content: <PortfolioRecord title="Reading room" description="A searchable index for a shared library." context="Product" />,
        aside: <Text size="sm">Selected work from an independent studio.</Text> },
    ]} />
  )
}
