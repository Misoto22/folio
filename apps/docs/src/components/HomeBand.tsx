import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Kbd,
  NavItem,
  Separator,
  Skeleton,
  Spinner,
  StatusDot,
  StatusPill,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  ToggleGroup,
  ToggleGroupItem,
} from '@misoto22/folio'
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiArrowRightUpLine,
  RiCompassLine,
  RiFileCopyLine,
  RiRulerLine,
  RiShapesLine,
} from '@remixicon/react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * The system, moving past, above the fold.
 *
 * A landing page for a component library has one job prose cannot do: show that
 * the components exist and that they agree with each other. A screenshot would
 * do it and would be a lie within a release — these are the real primitives,
 * imported from the package, rendering in the reader's own theme and density.
 * Switch the site to Console, or to compact, and the band switches with it,
 * which is most of the argument the page is making.
 *
 * INERT AND ARIA-HIDDEN, as a whole. It duplicates itself in order to loop, so
 * a screen reader would hear every tile twice and a keyboard reader would cross
 * two dozen tab stops before the first heading. Nothing in it is information:
 * every component here is named and linked further down the page, and the index
 * is one button away.
 *
 * Composed here rather than pulled from `src/examples`. An example is written
 * to teach one prop and laid out for a column 700px wide; a tile is 288px and
 * has to read in the second it takes to cross the window. The components are
 * the same components either way.
 */

interface Tile {
  /** The export a reader would go looking for, printed on the tile. */
  name: string
  render: ReactNode
}

const ROW_ONE: Tile[] = [
  {
    name: 'Button',
    render: (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          Deploy
          <RiArrowRightUpLine size={14} aria-hidden />
        </Button>
        <Button size="sm" variant="secondary">
          Preview
        </Button>
        <Button size="sm" variant="ghost" iconOnly aria-label="Copy">
          <RiFileCopyLine size={14} aria-hidden />
        </Button>
      </div>
    ),
  },
  {
    name: 'StatusPill',
    render: (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="success">Healthy</StatusPill>
        <StatusPill tone="warning">Degraded</StatusPill>
        <StatusPill tone="danger">Down</StatusPill>
      </div>
    ),
  },
  {
    name: 'Badge · Tag',
    render: (
      <div className="flex flex-wrap items-center gap-2">
        <Badge>24</Badge>
        <Badge tone="outline">draft</Badge>
        <Badge tone="success">passing</Badge>
        <Tag>typography</Tag>
        <Tag>tokens</Tag>
      </div>
    ),
  },
  {
    name: 'Table',
    render: (
      <Table caption="Runs" borders="rows" className="w-full">
        <THead>
          <TR>
            <TH>Run</TH>
            <TH align="end">Ms</TH>
          </TR>
        </THead>
        <TBody>
          {/* Two rows, not three: the tile is 176px and the third was cut off by
              the bottom edge, which reads as a rendering fault rather than as a
              table that carries on. */}
          {[
            { id: 'build', ms: '1,204' },
            { id: 'test', ms: '862' },
          ].map((row) => (
            <TR key={row.id}>
              <TD className="mono-meta text-(--ink-2)">{row.id}</TD>
              <TD align="end" className="tabular-nums">
                {row.ms}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    ),
  },
  {
    name: 'Alert',
    render: (
      <Alert tone="warning" title="One token fewer">
        --ico-stroke went with the stroked set.
      </Alert>
    ),
  },
  {
    name: 'NavItem',
    render: (
      <nav className="flex w-full flex-col gap-0.5">
        <NavItem href="#" icon={RiShapesLine} active>
          Components
        </NavItem>
        <NavItem href="#" icon={RiRulerLine}>
          Foundations
        </NavItem>
        <NavItem href="#" icon={RiCompassLine}>
          Templates
        </NavItem>
      </nav>
    ),
  },
]

const ROW_TWO: Tile[] = [
  {
    name: 'Checkbox',
    // Uncontrolled, including the dash: this file has no client boundary, so a
    // handler written here could not cross it. The tick and the dash are Remix
    // Icon glyphs at twelve pixels on a filled accent ground — the one place in
    // the system the old set needed its stroke pushed to 3 to stay legible.
    render: (
      <div className="flex flex-col gap-3 text-sm text-(--ink-2)">
        <span className="flex items-center gap-2.5">
          <Checkbox defaultChecked aria-label="Ship on merge" />
          Ship on merge
        </span>
        <span className="flex items-center gap-2.5">
          <Checkbox defaultChecked="indeterminate" aria-label="Notify the channel" />
          Notify the channel
        </span>
        <span className="flex items-center gap-2.5">
          <Checkbox aria-label="Run the smoke tests" />
          Run the smoke tests
        </span>
      </div>
    ),
  },
  {
    name: 'Kbd',
    render: (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-(--ink-3-aa)">
        <span className="flex items-center gap-1.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          open
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          run
        </span>
      </div>
    ),
  },
  {
    name: 'Avatar',
    render: (
      <div className="flex items-center gap-3">
        {/* The name is printed beside it, so the circle names nothing: an empty
            alt is what takes it out of the tree instead of saying it twice. */}
        <Avatar alt="" fallback="AL" size="md" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm text-(--ink)">Ada Lovelace</span>
          <span className="flex items-center gap-1.5 mono-meta text-(--ink-3-aa)">
            <StatusDot tone="success" />
            online
          </span>
        </div>
      </div>
    ),
  },
  {
    name: 'Skeleton · Spinner',
    render: (
      <div className="flex w-full items-center gap-4">
        <Spinner label={null} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="w-full" />
          <Skeleton className="w-2/3" />
        </div>
      </div>
    ),
  },
  {
    name: 'ToggleGroup',
    render: (
      <ToggleGroup type="single" defaultValue="start" aria-label="Text alignment">
        {[
          { value: 'start', label: 'Align left', Icon: RiAlignLeft },
          { value: 'center', label: 'Align centre', Icon: RiAlignCenter },
          { value: 'end', label: 'Align right', Icon: RiAlignRight },
        ].map(({ value, label, Icon }) => (
          <ToggleGroupItem key={value} value={value} aria-label={label} className="px-2.5">
            <Icon size={16} aria-hidden />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    ),
  },
  {
    name: 'Separator',
    render: (
      <div className="flex w-full flex-col gap-3 text-[13px] text-(--ink-2)">
        <span>Radix under the behaviour</span>
        <Separator />
        <span>Tokens over the paint</span>
      </div>
    ),
  },
]

/**
 * One tile: the component, named, in a box the band's height.
 *
 * The height is fixed and the width is not quite — a `Kbd` row and a three-row
 * `Table` want different widths, and pretending otherwise pads one and squeezes
 * the other. What has to agree tile to tile is the line the row sits on.
 */
function Specimen({ tile }: { tile: Tile }) {
  return (
    <div className="me-3 flex h-44 w-72 shrink-0 flex-col gap-3 rounded-(--radius-lg) border border-(--rule) bg-(--paper) p-5">
      <span className="eyebrow shrink-0 text-(--ink-3-aa)">{tile.name}</span>
      <div className="flex min-h-0 flex-1 items-center overflow-hidden">{tile.render}</div>
    </div>
  )
}

/**
 * One looping row.
 *
 * The tiles are rendered TWICE inside one track, and the track travels half its
 * own width — so the second copy arrives exactly where the first one started.
 * `w-max` is what keeps the track at its content's width rather than the band's,
 * which is what makes "half" a number worth translating by.
 */
function Row({ tiles, seconds, reverse }: { tiles: Tile[]; seconds: number; reverse?: boolean }) {
  return (
    <div
      className="folio-marquee flex w-max motion-safe:animate-[folio-docs-marquee_var(--folio-marquee-duration)_linear_infinite]"
      data-folio-animated
      style={
        {
          '--folio-marquee-duration': `${seconds}s`,
          animationDirection: reverse ? 'reverse' : undefined,
        } as CSSProperties
      }
    >
      {[0, 1].map((copy) => (
        <div key={copy} className="flex">
          {tiles.map((tile) => (
            <Specimen key={tile.name} tile={tile} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function HomeBand() {
  return (
    <div
      inert
      aria-hidden
      // Out to the edges of the content column: a band that stops at the
      // reading measure reads as a widget sitting on the page, and this is
      // meant to read as the page carrying on past both sides. The mask is what
      // says the row is longer than the window rather than cut off by it.
      className="relative -mx-5 flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:-mx-8 lg:-mx-12"
    >
      <Row tiles={ROW_ONE} seconds={64} />
      <Row tiles={ROW_TWO} seconds={78} reverse />
    </div>
  )
}
