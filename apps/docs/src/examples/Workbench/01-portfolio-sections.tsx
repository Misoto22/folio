import { Button } from '@misoto22/folio'
import {
  Chronology,
  WORKBENCH_THEME,
  WorkbenchCard,
  WorkbenchCardGrid,
  WorkbenchHero,
  WorkbenchSection,
  WorkbenchTile,
} from '@misoto22/folio/website'

/**
 * A two-tone opening and two sections on the shared 12-column grid, inside the
 * Workbench preset. Headings take the first four columns and content the
 * remaining eight in every section, so their edges line up down the page.
 */
export function Example() {
  return (
    <div {...WORKBENCH_THEME}>
      <WorkbenchHero
        statement="Avery Reed — designer and writer."
        lead="I make tools that help people think, and write about them."
        actions={<><Button>View work</Button><Button variant="secondary">Get in touch</Button></>}
        stats={[{ id: 'projects', value: 6, label: 'Projects' }, { id: 'essays', value: 12, label: 'Essays' }]}
      />
      <WorkbenchSection title="Work" lead="Two recent projects." action={<a href="#work">All projects →</a>}>
        <WorkbenchCardGrid>
          <WorkbenchCard cover={<WorkbenchTile label="Atlas" />} title={<a href="#atlas">Atlas</a>} description="A field notebook for walking routes." meta="Product · 2026" />
          <WorkbenchCard cover={<WorkbenchTile label="Ledger" />} title={<a href="#ledger">Ledger</a>} description="Plain-text accounts for a small studio." meta="Tool · 2025" />
        </WorkbenchCardGrid>
      </WorkbenchSection>
      <WorkbenchSection title="Experience" lead="Two roles since 2020.">
        <Chronology
          label="Roles on a timeline"
          from={2020}
          to={2026}
          currentLabel="Now"
          items={[
            { id: 'studio', title: 'Designer', organisation: 'Studio', start: 2020, end: 2023.5, kind: 'role' },
            { id: 'press', title: 'Editor', organisation: 'Press', start: 2023.5, kind: 'role' },
          ]}
        />
      </WorkbenchSection>
    </div>
  )
}
