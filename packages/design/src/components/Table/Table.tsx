import { RiArrowDownLine, RiArrowUpLine, RiExpandUpDownLine } from '@remixicon/react'
import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { warnBlankName } from '../../lib/warn'

export type TableAlign = 'start' | 'center' | 'end'

/**
 * Which rules the table draws.
 *
 * `rows` is the default and the right answer for reading down a column: one
 * hairline between records and nothing else, so the eye tracks a line across
 * without a grid competing for it. `grid` adds the vertical rules a dense
 * numeric table needs to keep columns apart. `bordered` puts an edge around the
 * whole thing, for a table that sits loose on a page rather than inside a card
 * that already has one. `none` is for a table inside something that draws its
 * own structure.
 */
export type TableBorders = 'rows' | 'grid' | 'bordered' | 'bordered-grid' | 'none'

const ALIGN: Record<TableAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
}

/**
 * Every rule the table draws, expressed from ONE element.
 *
 * Not React context, which was the first attempt: `createContext` makes the
 * module client-only, which turned every table on every page into a hydration
 * boundary and took the static build down with it. Descendant selectors from
 * the wrapper reach the same cells, cost nothing at runtime, and keep the whole
 * component server-renderable.
 *
 * `--table-pad-x` rather than a padding class per mode, because the ruled
 * variants need symmetric padding inside their boxes while the plain one wants
 * a trailing gap and no leading one.
 */
const ROWS =
  '[&_thead]:border-b [&_thead]:border-(--rule-divider) [&_tbody_tr]:border-b [&_tbody_tr]:border-(--rule) [&_tbody_tr:last-child]:border-b-0'
const SOFT_HEAD = '[&_thead]:border-(--rule-2)'
const COLUMNS =
  '[&_th]:border-e [&_td]:border-e [&_th]:border-(--rule) [&_td]:border-(--rule) [&_th:last-child]:border-e-0 [&_td:last-child]:border-e-0'
const BOXED = 'rounded-(--radius) border border-(--rule-2) [--table-pad-x:0.75rem]'

const BORDERS: Record<TableBorders, string> = {
  rows: ROWS,
  grid: cn(ROWS, COLUMNS, '[--table-pad-x:0.75rem]'),
  bordered: cn(ROWS, SOFT_HEAD, BOXED),
  'bordered-grid': cn(ROWS, SOFT_HEAD, COLUMNS, BOXED),
  none: '',
}

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /**
   * Describes the table for a screen reader, which cannot see the heading above
   * it. Rendered as a visually-hidden `<caption>` — required, because an
   * unnamed table in a page with three tables is unnavigable.
   */
  caption: string
  /** Prints the caption instead of hiding it. */
  showCaption?: boolean
  /**
   * Pins the header row while the body scrolls. Needs a bounded height on the
   * container — otherwise the page scrolls, not the table, and nothing sticks.
   */
  stickyHeader?: boolean
  /** Which rules to draw. See {@link TableBorders}. */
  borders?: TableBorders
  /** Tightens the row padding, for a table that is mostly numbers. */
  density?: 'comfortable' | 'compact'
}

/**
 * A ruled data table.
 *
 * Wrapped in its own horizontally scrolling container, because a table is the
 * one block that legitimately exceeds the measure — and a page that scrolls
 * sideways as a whole is a layout bug, while a table that does is a table.
 *
 * That container is focusable, and it has to be. A scrollable region whose
 * contents are not themselves focusable is unreachable by keyboard: there is no
 * element to Tab to and therefore no way to press an arrow key at it, so the
 * columns past the fold simply do not exist for anyone not using a mouse.
 *
 * It is also POSITIONED, which is not decoration. `sr-only` is
 * `position: absolute`, so a visually-hidden label in a cell resolves against
 * the nearest positioned ancestor — and with none between it and the document,
 * it escapes the scroll container and every `overflow-hidden` around it, and
 * widens the page by however far the table happens to be scrolled.
 *
 * No zebra striping at any border setting. In a monochrome system a striped row
 * is a second surface competing with the page ground, and the hairline between
 * rows is already enough to track a line across.
 *
 * @example
 * <Table caption="Deploy history">
 *   <THead><TR><TH>Commit</TH><TH align="end" sortable sortDirection={dir} onSort={sort}>Duration</TH></TR></THead>
 *   <TBody><TR><TD>a1b2c3d</TD><TD align="end">2m 14s</TD></TR></TBody>
 * </Table>
 * @example
 * <Table caption="Inventory" borders="bordered-grid" density="compact">…</Table>
 */
export function Table({
  caption,
  showCaption = false,
  stickyHeader = false,
  borders = 'rows',
  density = 'comfortable',
  className,
  children,
  ...rest
}: TableProps) {
  warnBlankName('Table', 'caption', caption, 'the table is announced with no name and a reader arrives in it with no idea what it lists')
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption}
      data-table-density={density}
      className={cn('relative w-full overflow-x-auto scroll-slim', BORDERS[borders])}
    >
      <table
        className={cn(
          'w-full border-collapse text-start text-sm',
          stickyHeader &&
            '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-(--z-rule) [&_thead]:bg-(--paper)',
          className,
        )}
        {...rest}
      >
        <caption className={cn(showCaption ? 'pb-3 text-start eyebrow text-(--ink-3-aa)' : 'sr-only')}>
          {caption}
        </caption>
        {children}
      </table>
    </div>
  )
}

/** Header group. The rule under it is drawn by the table's border setting. */
export function THead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...rest} />
}

export function TBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...rest} />
}

export function TR({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...rest} />
}

export type SortDirection = 'ascending' | 'descending' | 'none'

export interface THProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Which edge the column's contents sit against. Numbers belong at `end`. */
  align?: TableAlign
  /** Makes the label a button and shows the sort marker. */
  sortable?: boolean
  /**
   * Which way this column is sorted. Also set as `aria-sort`, which is the
   * only way a screen reader learns a table is ordered at all — a caret drawn
   * in the header tells it nothing.
   */
  sortDirection?: SortDirection
  onSort?: () => void
}

/**
 * Cell padding, in one string both cells share.
 *
 * `--table-pad-x` is 0 by default and set by the ruled variants, so the plain
 * table keeps its trailing gap and no leading one while a boxed table gets
 * symmetric padding inside its border.
 */
const CELL =
  'px-[var(--table-pad-x,0)] [&:not(:last-child)]:pe-[calc(var(--table-pad-x,0px)+1.5rem)]'

const SORT_ICON = {
  ascending: RiArrowUpLine,
  descending: RiArrowDownLine,
  none: RiExpandUpDownLine,
} as const

/**
 * A column label. Mono and uppercase, so it never reads as data.
 *
 * When sortable, the label becomes a `<button>` INSIDE the `<th>` rather than
 * the `<th>` becoming clickable: a cell with a click handler is not focusable
 * and not announced as a control, so the sort exists only for a mouse.
 *
 * Sorting is per column and opt-in. A table where every header is a button
 * invites the reader to try sorting a column the data cannot be ordered by.
 */
export function TH({
  align = 'start',
  sortable = false,
  sortDirection = 'none',
  onSort,
  className,
  children,
  ...rest
}: THProps) {
  const Icon = SORT_ICON[sortDirection]

  return (
    <th
      scope="col"
      aria-sort={sortable ? sortDirection : undefined}
      className={cn(CELL, 'py-3 align-bottom eyebrow text-(--ink-3-aa)', ALIGN[align], className)}
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'group inline-flex items-center gap-1.5 eyebrow transition-colors duration-(--duration-fast) hover:text-(--ink)',
            sortDirection === 'none' ? 'text-(--ink-3-aa)' : 'text-(--ink)',
          )}
        >
          {children}
          <Icon
            size={12}
            aria-hidden
            className={cn(
              'shrink-0 transition-opacity',
              sortDirection === 'none' && 'opacity-40 group-hover:opacity-100',
            )}
          />
        </button>
      ) : (
        children
      )}
    </th>
  )
}

export interface TDProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Which edge the cell's contents sit against. Match the column's header. */
  align?: TableAlign
}

/**
 * A body cell.
 *
 * TOP-aligned, and that is a choice about which kind of table is the common
 * one here: a cell holding a paragraph. Top is what lines the first lines of a
 * row up with each other, and centring a two-word term against a four-line
 * description puts the term in the middle of nothing.
 *
 * It is the wrong default for the other kind — a row of one-line values with a
 * control in it. A 36px button next to 16px of text makes a 52px row, and every
 * other cell then hangs at the top of it with twenty pixels of nothing
 * underneath, which reads as a column that has slipped. Pass
 * `className="align-middle"` on those rows; the data-table template does.
 */
export function TD({ align = 'start', className, ...rest }: TDProps) {
  return (
    <td
      className={cn(CELL, 'py-[var(--table-pad-y)] align-top text-(--ink-2)', ALIGN[align], className)}
      {...rest}
    />
  )
}

export default Table
