import { Button } from '@misoto22/folio'
import { RecoveryLinks, RecoveryState } from '@misoto22/folio/website'

/**
 * A missing record explains the state and offers concrete destinations.
 * Recovery links are supplied by the host so they can use any router.
 */
export function Example() {
  return (
    <RecoveryState code="404" heading="This record is unavailable" message="The entry may have moved or been removed." level={2}
      action={<Button asChild><a href="#library">Return to the library</a></Button>}
      elsewhere={<RecoveryLinks label="You can also explore" items={[
        { id: 'essays', link: <a href="#essays">Recent essays</a> },
        { id: 'projects', link: <a href="#projects">Selected projects</a> },
      ]} />}
    />
  )
}
