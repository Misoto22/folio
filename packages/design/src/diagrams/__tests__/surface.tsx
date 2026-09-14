import { createRef, type ReactElement } from 'react'
import {
  ArchitectureFigure,
  DataflowFigure,
  DiagramCanvas,
  DiagramExportMenu,
  DiagramInspector,
  DiagramLegend,
  DiagramMinimap,
  DiagramToolbar,
  DiagramToolbarGroup,
  kindLegend,
  LifecycleFigure,
  SequenceFigure,
  WorkflowFigure,
} from '../index'
import { ARCHITECTURE, DATAFLOW, LIFECYCLE, SEQUENCE, WORKFLOW } from './fixtures'

/**
 * One representative render per component in `@misoto22/folio/diagrams`.
 *
 * The same fixture three suites share — the axe pass, the server-render pass
 * and the theming pass — for the same reason the main entry does it: eleven
 * near-identical test files would each drift into testing something slightly
 * different, and one fixture makes "every diagram component is checked" a
 * property the repository enforces rather than a claim a reviewer audits.
 *
 * `coverage.test.ts` fails when a directory here has no entry, so a new figure
 * cannot land untested.
 */
export interface DiagramSurfaceEntry {
  /** The directory under src/diagrams. Keyed to the coverage check. */
  dir: string
  render: () => ReactElement
  /** Text that opens the component's real surface, for the axe pass. */
  opensWith?: string
}

export const SURFACE: DiagramSurfaceEntry[] = [
  { dir: 'ArchitectureFigure', render: () => <ArchitectureFigure spec={ARCHITECTURE} /> },
  { dir: 'WorkflowFigure', render: () => <WorkflowFigure spec={WORKFLOW} /> },
  { dir: 'SequenceFigure', render: () => <SequenceFigure spec={SEQUENCE} /> },
  { dir: 'DataflowFigure', render: () => <DataflowFigure spec={DATAFLOW} /> },
  { dir: 'LifecycleFigure', render: () => <LifecycleFigure spec={LIFECYCLE} /> },
  {
    dir: 'DiagramCanvas',
    render: () => (
      <DiagramCanvas label="Request path" height="12rem">
        <ArchitectureFigure spec={ARCHITECTURE} heading={false} legend="hidden" cards={false} />
      </DiagramCanvas>
    ),
  },
  {
    dir: 'DiagramToolbar',
    render: () => (
      <DiagramToolbar label="Diagram actions">
        <DiagramToolbarGroup>
          <button type="button">Theme</button>
        </DiagramToolbarGroup>
        <DiagramToolbarGroup>
          <button type="button">Present</button>
        </DiagramToolbarGroup>
      </DiagramToolbar>
    ),
  },
  {
    dir: 'DiagramExportMenu',
    opensWith: 'Export',
    render: () => <DiagramExportMenu targetRef={createRef<SVGSVGElement>()} title="Request path" />,
  },
  {
    dir: 'DiagramInspector',
    render: () => (
      <DiagramInspector
        eyebrow="Service"
        title="API"
        description="FastAPI, behind the load balancer."
        facts={[
          { label: 'Port', value: '8000', mono: true },
          { label: 'Id', value: 'api', mono: true },
        ]}
        links={[{ direction: 'out', label: 'SQL', peer: 'Postgres', onSelect: () => {} }]}
        onClose={() => {}}
      />
    ),
  },
  {
    dir: 'DiagramMinimap',
    render: () => (
      <DiagramMinimap
        content={{ width: 800, height: 300 }}
        frame={{ width: 400, height: 200 }}
        view={{ scale: 1, x: 0, y: 0 }}
        onSeek={() => {}}
      />
    ),
  },
  {
    dir: 'DiagramLegend',
    render: () => <DiagramLegend entries={kindLegend(['backend', 'database', 'messagebus'])} />,
  },
]

export const SURFACE_BY_DIR = new Map(SURFACE.map((entry) => [entry.dir, entry]))
