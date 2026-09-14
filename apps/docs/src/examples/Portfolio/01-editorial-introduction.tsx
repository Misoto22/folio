import { Text } from '@misoto22/folio'
import { Portfolio, PortfolioCategories } from '@misoto22/folio/website'

/**
 * A short biography and a supporting index share one introductory composition.
 * Text, facts and category totals are supplied by the application.
 */
export function Example() {
  return (
    <Portfolio
      name="Avery Reed"
      monogram="AR"
      biography={<Text size="lead">Designer and writer exploring the everyday tools that help people think.</Text>}
      facts={['Independent practice', 'Working across places']}
      quotation="Start by paying attention."
      feature={<PortfolioCategories label="Selected work" items={[
        { id: 'essays', label: 'Essays', count: 12 },
        { id: 'projects', label: 'Projects', count: 4 },
      ]} />}
    />
  )
}
