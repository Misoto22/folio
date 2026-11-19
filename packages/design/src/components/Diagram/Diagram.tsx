import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { DEV, warn } from '../../lib/warn'

export interface DiagramNode {
  /** Only needed when an edge names this node. */
  id?: string
  /** The node's name, set in the interface face. */
  label: string
  /** What it is — one short line, a step back. */
  note?: string
  /** The one node the diagram is about. At most one or two per diagram. */
  accent?: boolean
  /** How this node's children are laid out. Defaults to a row. */
  direction?: 'row' | 'column'
  children?: DiagramNode[]
  /** A line printed under the frame, outside it — what the box means. */
  footnote?: string
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
}

export interface DiagramSpec {
  /** How the top-level nodes are laid out. Defaults to a row. */
  direction?: 'row' | 'column'
  nodes: DiagramNode[]
  /**
   * Arrows between adjacent siblings, by id and in the order the rank runs.
   * Each edge is spent the first time a pair matches it, at whatever depth
   * that pair sits — and an edge that matches nothing says so in development
   * rather than drawing nothing and reporting nothing.
   */
  edges?: DiagramEdge[]
  /** The figure's caption. */
  caption?: string
  /** Names the figure for assistive tech when the caption does not. */
  label?: string
}

export interface DiagramProps {
  spec: DiagramSpec
  className?: string
}

/**
 * A flow or architecture diagram, drawn out of the system's own parts.
 *
 * The alternative it replaces is a fenced block of box-drawing characters —
 * `┌──────┬──────┐` — which is a picture rendered in a font chosen for code. It
 * inherits the code block's frame and scrollbar, so a diagram reads as terminal
 * output; it cannot wrap, so on a phone it either overflows or is scaled to
 * nothing; the box edges are text, so a screen reader reads the rules out loud;
 * and none of it responds to the theme.
 *
 * The other alternative is a diagramming library, which is several hundred
 * kilobytes of layout engine, renders after hydration, and draws in its own
 * palette. This is neither: hairline frames on the radius scale, mono labels,
 * the muted step for anything supporting — so a diagram belongs to the page it
 * sits on. It server-renders, because it is markup.
 *
 * NESTING IS CONTAINMENT, which is what most architecture diagrams actually
 * describe: this is inside that, and these two sit beside each other. Edges are
 * for the sequence between siblings, not for arbitrary wiring — a diagram that
 * needs arbitrary wiring is a diagram that wants a drawing, and this will not
 * pretend otherwise.
 *
 * It takes a spec rather than markup, so a fenced ```diagram block in an
 * article and a hand-written figure on a page are one renderer and one look —
 * and a wrong diagram is corrected by editing data.
 *
 * @example
 * <Diagram
 *   spec={{
 *     caption: 'One request, end to end.',
 *     edges: [{ from: 'edge', to: 'app', label: 'HTTPS' }],
 *     nodes: [
 *       { id: 'edge', label: 'Edge', note: 'CDN' },
 *       { id: 'app', label: 'Application', children: [
 *         { label: 'Router', accent: true },
 *         { label: 'Handlers' },
 *       ] },
 *     ],
 *   }}
 * />
 */
export function Diagram({ spec, className }: DiagramProps) {
  const { nodes, edges = [], direction = 'row', caption, label } = spec
  const { leads, drawn } = resolveLeads(nodes, edges)

  if (DEV) warnSpec(nodes, edges, drawn)

  return (
    <figure className={cn('m-0', className)} role="group" aria-label={label ?? caption ?? undefined}>
      <div className="overflow-x-auto rounded-(--radius-lg) border border-(--rule) bg-(--paper-2) p-(--space-figure) scroll-slim">
        <NodeList nodes={nodes} leads={leads} direction={direction} depth={0} />
      </div>
      {caption && (
        // A <div>, not a <figcaption>. A long-form stylesheet dropped around
        // this will style `figcaption` and `p` unlayered, and an unlayered rule
        // beats a utility whatever the specificity — inside an article a real
        // figcaption came out uppercased and every label in the diagram
        // inherited a paragraph margin. Nothing here uses a tag prose reaches
        // for.
        <div className="mt-3 mono-meta leading-[1.6] text-(--ink-3-aa)">{caption}</div>
      )}
    </figure>
  )
}

/** The arrow that leads INTO a node, for every node that earned one. */
type Leads = Map<DiagramNode, DiagramEdge>

/**
 * Every arrow the spec earns, resolved once for the whole figure.
 *
 * Keyed by the node the arrow leads into, by OBJECT rather than by id: two
 * nodes sharing an id are a defect in the spec, not a licence to draw the same
 * arrow in two places. The same `edges` array used to be handed to every rank,
 * so a pair of ids reused two levels down drew the arrow again down there — an
 * arrow the author asked for once and the figure asserted twice.
 *
 * Ranks are walked breadth-first from the top and an edge is spent at the first
 * pair that matches it, which makes "one edge, one arrow" a property of the
 * renderer rather than a rule the author has to keep.
 */
function resolveLeads(nodes: DiagramNode[], edges: DiagramEdge[]): { leads: Leads; drawn: Set<DiagramEdge> } {
  const leads: Leads = new Map()
  const drawn = new Set<DiagramEdge>()
  const ranks: DiagramNode[][] = [nodes]

  while (ranks.length > 0) {
    const rank = ranks.shift()!
    for (let index = 1; index < rank.length; index += 1) {
      const from = rank[index - 1]!
      const to = rank[index]!
      if (!from.id || !to.id) continue
      const edge = edges.find(
        (candidate) =>
          !drawn.has(candidate) && candidate.from === from.id && candidate.to === to.id,
      )
      if (!edge) continue
      drawn.add(edge)
      leads.set(to, edge)
    }
    for (const node of rank) if (node.children?.length) ranks.push(node.children)
  }

  return { leads, drawn }
}

/** One rank of the diagram: the nodes, and any arrows between them. */
function NodeList({
  nodes,
  leads,
  direction,
  depth,
}: {
  nodes: DiagramNode[]
  leads: Leads
  direction: 'row' | 'column'
  depth: number
}) {
  const row = direction === 'row'

  return (
    <div className={cn('flex min-w-0 gap-3', row ? 'flex-col sm:flex-row' : 'flex-col')}>
      {nodes.map((node, index) => (
        <NodeFrame
          key={node.id ?? `${node.label}-${index}`}
          node={node}
          leads={leads}
          depth={depth}
          lead={leads.get(node)}
          row={row}
        />
      ))}
    </div>
  )
}

/**
 * A node is one of two things, and they are drawn differently on purpose.
 *
 * A LEAF is a plate: a bordered card on paper, or ink-filled when it is what
 * the diagram is about. A CONTAINER is a band: a labelled hairline with its
 * children underneath, and NO frame of its own.
 *
 * That distinction is the whole design. Drawing a container as another box puts
 * three borders around anything two levels deep — the figure's frame, the
 * group's, and the plate's — and the result reads as packaging rather than as
 * structure. A rule with a name on it says "these belong together" using the
 * device every section head already uses, and leaves the borders to the things
 * that are actually objects.
 */
function NodeFrame({
  node,
  leads,
  depth,
  lead,
  row,
}: {
  node: DiagramNode
  leads: Leads
  depth: number
  lead?: DiagramEdge
  row: boolean
}) {
  const children = node.children ?? []
  const isGroup = children.length > 0

  return (
    <>
      {lead && <EdgeMark label={lead.label} row={row} />}
      <div className="flex min-w-0 flex-1 flex-col">
        {isGroup ? (
          <div
            className={cn(
              'min-w-0 flex-1 border-t pt-3',
              depth === 0 ? 'border-(--ink)' : 'border-(--rule-2)',
            )}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="font-sans text-[13.5px] leading-[1.35] text-(--ink)">
                {node.label}
              </span>
              {node.note && <span className="mono-meta text-(--ink-3-aa)">{node.note}</span>}
            </div>
            <div className="mt-3">
              <NodeList
                nodes={children}
                leads={leads}
                direction={node.direction ?? 'row'}
                depth={depth + 1}
              />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'flex min-w-0 flex-1 flex-col justify-center rounded-(--radius) px-3.5 py-3',
              node.accent ? 'bg-(--accent)' : 'border border-(--rule-2) bg-(--paper)',
            )}
          >
            {/* An identifier can be one long word — `TenantMainMiddleware` —
                with no break opportunity, so it runs into the plate's edge
                unless it is allowed to break inside itself. */}
            <span
              className={cn(
                'block break-words font-sans text-[13.5px] leading-[1.35]',
                node.accent ? 'text-(--accent-foreground)' : 'text-(--ink)',
              )}
            >
              {node.label}
            </span>
            {node.note && (
              <span
                className={cn(
                  'mt-1 block mono-meta',
                  node.accent ? 'text-(--accent-foreground) opacity-70' : 'text-(--ink-3-aa)',
                )}
              >
                {node.note}
              </span>
            )}
          </div>
        )}

        {node.footnote && (
          <span className="mt-2 block mono-meta text-(--ink-3-aa)">{node.footnote}</span>
        )}
      </div>
    </>
  )
}

/**
 * The connector. An arrow and, when the edge is named, the name under it —
 * hidden from assistive tech, which reads the nodes in document order anyway
 * and has no use for a glyph pointing at the next one.
 */
function EdgeMark({ label, row }: { label?: string; row: boolean }): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-none items-center justify-center gap-1.5 text-(--ink-3-aa)',
        row ? 'sm:flex-col' : 'flex-col',
      )}
    >
      {/* One glyph, turned. A row stacks into a column below `sm`, so the arrow
          has to point the way the layout actually runs at that width. In RTL the
          inline axis reverses, so the flat arrow is mirrored with it. */}
      <span
        className={cn(
          'font-mono text-[13px] leading-none',
          row ? 'rotate-90 sm:rotate-0 sm:rtl:-scale-x-100' : 'rotate-90',
        )}
      >
        →
      </span>
      {label && <span className="mono-meta whitespace-nowrap">{label}</span>}
    </div>
  )
}

/**
 * Everything the spec asked for that the renderer will not do, said out loud.
 *
 * All three failures here are silent by construction: the figure renders, it
 * renders beautifully, and it describes something other than what was written.
 * An author reading the picture has no way to tell an edge that was ignored
 * from an edge they forgot, so the console is the only place left to say it.
 *
 * Dev only, and guarded at the call site so a production bundle drops the walk
 * along with the messages.
 */
function warnSpec(nodes: DiagramNode[], edges: DiagramEdge[], drawn: Set<DiagramEdge>): void {
  const ids = new Set<string>()
  warnNodes(nodes, ids)

  for (const edge of edges) {
    if (drawn.has(edge)) continue
    const pair = `${edge.from} → ${edge.to}`
    const unknown = !ids.has(edge.from) || !ids.has(edge.to)

    warn({
      code: unknown ? 'DIAGRAM_EDGE_UNKNOWN_NODE' : 'DIAGRAM_EDGE_NOT_ADJACENT',
      problem: unknown
        ? `The edge ${pair} names an id no node in this spec carries, so no arrow is drawn and nothing else changes.`
        : `The edge ${pair} names two nodes that are never consecutive siblings, so no arrow is drawn anywhere.`,
      field: `spec.edges: ${pair}`,
      fix: unknown
        ? 'Give the node the id the edge names, or correct the edge to an id the spec already has.'
        : 'Write the edge from a node to the node immediately after it in the same rank, in that order. Nesting is containment here; an edge is a step between siblings.',
      component: 'Diagram',
    })
  }
}

/** The node half of {@link warnSpec}: duplicate ids, and props read by nobody. */
function warnNodes(nodes: DiagramNode[], ids: Set<string>): void {
  for (const node of nodes) {
    if (node.id) {
      if (ids.has(node.id)) {
        warn({
          code: 'DIAGRAM_DUPLICATE_ID',
          problem: `Two nodes carry the id "${node.id}", so an edge naming it lands on whichever comes first and silently means the other.`,
          field: `spec.nodes: id "${node.id}"`,
          fix: 'Make every id unique across the whole spec, or drop it from the node no edge names.',
          component: 'Diagram',
        })
      }
      ids.add(node.id)
    }

    const isGroup = (node.children?.length ?? 0) > 0

    if (isGroup && node.accent) {
      warn({
        code: 'DIAGRAM_ACCENT_ON_CONTAINER',
        problem: `"${node.label}" has children, so it is drawn as a band — and a band has no fill for accent to take. It type-checks and paints nothing.`,
        field: `spec.nodes: accent on "${node.label}"`,
        fix: 'Move accent to the leaf the diagram is actually about, or drop the children so this node becomes that leaf.',
        component: 'Diagram',
      })
    }

    if (!isGroup && node.direction) {
      warn({
        code: 'DIAGRAM_DIRECTION_ON_LEAF',
        problem: `"${node.label}" has no children, so there is nothing here to lay out — direction is read only from a node that has some.`,
        field: `spec.nodes: direction on "${node.label}"`,
        fix: 'Set direction on the parent whose axis you meant, or on spec.direction for the top rank.',
        component: 'Diagram',
      })
    }

    if (node.children) warnNodes(node.children, ids)
  }
}

export default Diagram
