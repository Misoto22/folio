'use client'

import { useId, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { DiagramCard, DiagramMeta, LegendMode } from '../spec'
import { viewBoxOf, type Box } from './geometry'
import { DiagramLegend } from '../DiagramLegend/DiagramLegend'
import { DiagramDefs } from './marks'

/**
 * What a figure hands the frame around it.
 *
 * Five renderers produce this one shape, which is what lets the title, the
 * accessible summary, the key and the conclusion cards be written once. A
 * renderer's only job is placing marks; everything a reader needs AROUND the
 * picture is the same question in all five cases.
 */
export interface FigureModel {
  /** The extent the artwork was drawn into. */
  extent: Box
  artwork: ReactNode
  /** Every drawn box, for the summary list. */
  nodes: FigureNode[]
  /** Every drawn line, for the summary list. */
  edges: { from: string; to: string; label?: string }[]
  /** The kinds actually used, and how each is drawn. */
  legend: { key: string; label: string; sample: ReactNode }[]
  /**
   * The figure's second axis, as a PARTITION of the nodes above.
   *
   * A workflow's lanes and a data flow's stages are not decoration around the
   * boxes — they are the other half of every box's position, and a summary that
   * lists the boxes alone has published one dimension of a two-dimensional
   * picture. Giving the list this structure says it once, in the place a screen
   * reader already walks, rather than repeating "in the CI lane" on every row.
   *
   * A node may appear in at most one band: the list is the keyboard's only
   * route to a selection, and a node in two bands is two controls that do the
   * same thing. Anything left out of every band is published after them.
   */
  bands?: FigureBand[]
  /**
   * What the picture says that is neither a box nor a line.
   *
   * Boundaries, phase captions, segment captions, activation bars: each is a
   * real statement drawn inside an `aria-hidden` `<svg>`, and each is a
   * sentence rather than a row, so each figure writes its own.
   */
  notes?: string[]
}

/** One drawn box, as the summary publishes it. */
export interface FigureNode {
  id: string
  label: string
  sublabel?: string
  kind?: string
  /** A short phrase the picture prints on the box: a step number. */
  detail?: string
}

/** One band of a figure's second axis: a lane, a stage. */
export interface FigureBand {
  /** What KIND of band this is — "Lane", "Stage" — since the label is a name. */
  kind: string
  label: string
  /** The nodes inside it, in the order the figure draws them. */
  ids: string[]
}

export interface FigureChrome {
  className?: string
  /** Prints the key under the figure. `auto` shows only the kinds in use. */
  legend?: LegendMode
  /** Prints the conclusion cards under the figure. Defaults to true. */
  cards?: boolean
  /** Prints the title and subtitle over the figure. Defaults to true. */
  heading?: boolean
  /** Node ids currently lit. Everything else is dimmed. */
  activeIds?: string[]
  /**
   * Called when a reader picks a node.
   *
   * Giving this turns the summary list from a description into a control: the
   * same list a screen reader reads becomes the keyboard's route to selection,
   * and the plates in the picture become the pointer's route to the same thing.
   */
  onSelectNode?: (id: string) => void
}

/**
 * The shell every figure sits in: a heading, the picture, a key, the cards, and
 * the part that makes the picture mean anything to a reader who cannot see it.
 *
 * ## The accessibility decision, stated rather than implied
 *
 * The `<svg>` carries `role="img"` and a label, which makes its whole subtree
 * presentational. That is the honest description of what it is — a picture —
 * and it is what stops a screen reader from walking two hundred `<text>`
 * elements in drawing order, which is neither reading order nor useful.
 *
 * The diagram's CONTENT is then published beside it as an ordinary list: every
 * node with what kind of thing it is, and every relationship as "A → B: over
 * HTTPS". That list is where the meaning lives for anyone not looking at the
 * picture, and it is why this component takes a model rather than markup — a
 * frame handed a finished `<svg>` could not have written it.
 *
 * The list carries the figure's SECOND AXIS as its own structure. A workflow's
 * lanes and a data flow's stages are half of where every box sits, and they are
 * drawn inside the presentational `<svg>` — so a flat list of boxes published
 * one dimension of a two-dimensional picture and called it the content. Nodes
 * are grouped by their band, and the statements that group nothing — a
 * boundary, a phase caption, an activation bar — follow as sentences.
 *
 * The list is visually hidden by default and NOT hidden from assistive
 * technology, which is the opposite of what `aria-hidden` would do and the
 * whole point.
 */
export function DiagramFrame({
  meta,
  model,
  cards,
  className,
  legend = 'auto',
  showCards = true,
  heading = true,
  activeIds,
  onSelectNode,
}: {
  meta: DiagramMeta
  model: FigureModel
  cards?: DiagramCard[]
  showCards?: boolean
} & Omit<FigureChrome, 'cards'>) {
  const uid = useId().replace(/:/g, '')
  const titleId = `${uid}-title`
  const descId = `${uid}-desc`

  const byId = new Map(model.nodes.map((node) => [node.id, node]))
  const description = `${model.nodes.length} elements and ${model.edges.length} relationships. ${
    meta.subtitle ?? ''
  }`.trim()

  const showLegend = legend !== 'hidden' && model.legend.length > 0

  // Bands partition the nodes; anything a figure left out of every band is
  // still published, after them. A node dropped from the list entirely would be
  // a node a keyboard cannot reach.
  const bands = model.bands ?? []
  const banded = new Set(bands.flatMap((band) => band.ids))
  const loose = bands.length > 0 ? model.nodes.filter((node) => !banded.has(node.id)) : []

  const row = (node: FigureNode) => (
    <li key={node.id}>
      {onSelectNode ? (
        <button type="button" onClick={() => onSelectNode(node.id)}>
          {summaryLine(node)}
        </button>
      ) : (
        summaryLine(node)
      )}
    </li>
  )

  return (
    <figure className={cn('m-0 flex flex-col gap-5', className)}>
      {/* The title is set in the editorial serif, which is the system's own
          answer to "this is a heading" — and it is what stops a figure from
          reading as a screenshot dropped into the page. The subtitle stays in
          the meta voice underneath it. */}
      {heading && (
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal leading-[1.15] tracking-[-0.015em] text-(--ink)">
            {meta.title}
          </h3>
          {meta.subtitle && <span className="mono-meta text-(--ink-3-aa)">{meta.subtitle}</span>}
        </div>
      )}

      <div className="overflow-x-auto rounded-(--radius-lg) border border-(--rule) bg-(--diagram-surface) p-(--space-frame) scroll-slim">
        <svg
          viewBox={viewBoxOf(model.extent)}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          className="block h-auto w-full max-w-full font-sans"
          data-diagram-artwork=""
        >
          <title id={titleId}>{meta.title}</title>
          <desc id={descId}>{description}</desc>
          <DiagramDefs uid={uid} />
          {model.artwork}
        </svg>
      </div>

      {/* The picture's content, for anyone not looking at the picture. */}
      <div className="sr-only">
        <p>{description}</p>
        {bands.length > 0 ? (
          <ul>
            {bands.map((band, index) => (
              <li key={`${band.label}-${index}`}>
                <span>{`${band.kind}: ${band.label}`}</span>
                <ul>
                  {band.ids.flatMap((id) => {
                    const node = byId.get(id)
                    return node ? [row(node)] : []
                  })}
                </ul>
              </li>
            ))}
            {loose.length > 0 && (
              <li>
                <ul>{loose.map(row)}</ul>
              </li>
            )}
          </ul>
        ) : (
          <ul>{model.nodes.map(row)}</ul>
        )}
        {model.edges.length > 0 && (
          <ul>
            {model.edges.map((edge, index) => (
              <li key={index}>
                {(byId.get(edge.from)?.label ?? edge.from)} → {(byId.get(edge.to)?.label ?? edge.to)}
                {edge.label ? `: ${edge.label}` : ''}
              </li>
            ))}
          </ul>
        )}
        {model.notes && model.notes.length > 0 && (
          <ul>
            {model.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        )}
      </div>

      {showLegend && <DiagramLegend entries={model.legend} />}

      {showCards && cards && cards.length > 0 && <CardGrid cards={cards} />}

      {activeIds && activeIds.length > 0 && <span className="sr-only" role="status">{`${activeIds.length} highlighted`}</span>}
    </figure>
  )
}

function summaryLine(node: FigureNode): string {
  const parts = [node.label]
  if (node.kind) parts.push(`(${node.kind})`)
  if (node.sublabel) parts.push(`— ${node.sublabel}`)
  if (node.detail) parts.push(`— ${node.detail}`)
  return parts.join(' ')
}

/**
 * The conclusion cards under a figure.
 *
 * Archify keys these by hue — cyan, emerald, rose. Here the key selects a MARK:
 * a filled square, a ring, a bar, a diagonal. Seven cards in a row stay seven
 * distinguishable cards on paper-white, and the same row survives being
 * printed.
 */
export function CardGrid({ cards, className }: { cards: DiagramCard[]; className?: string }) {
  return (
    <div
      className={cn(
        'grid gap-3 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {cards.map((card) => (
        <div key={card.title} className="flex flex-col gap-2.5 border-t border-(--ink) pt-3">
          <div className="flex items-center gap-2">
            <CardMark shape={card.dot} />
            <span className="font-sans text-[13.5px] leading-[1.35] text-(--ink)">{card.title}</span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {card.items.map((item, index) => (
              <li
                key={index}
                className="text-[12.5px] leading-[1.55] text-(--ink-2) ps-3 -indent-3 before:content-['—'] before:pe-1.5 before:text-(--ink-3-aa)"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Seven marks, one per archify dot name, and not one of them a hue. */
function CardMark({ shape }: { shape: DiagramCard['dot'] }) {
  const common = 'size-2.5 shrink-0'
  switch (shape) {
    case 'cyan':
      return <span aria-hidden className={cn(common, 'bg-(--ink)')} />
    case 'emerald':
      return <span aria-hidden className={cn(common, 'rounded-full bg-(--ink)')} />
    case 'violet':
      return <span aria-hidden className={cn(common, 'rounded-full border border-(--ink)')} />
    case 'amber':
      return <span aria-hidden className={cn(common, 'border border-(--ink)')} />
    case 'rose':
      return <span aria-hidden className={cn(common, 'rotate-45 bg-(--ink)')} />
    case 'orange':
      return <span aria-hidden className={cn(common, 'rotate-45 border border-(--ink)')} />
    case 'slate':
    default:
      return <span aria-hidden className={cn('h-1 w-2.5 shrink-0 bg-(--ink-3-aa)')} />
  }
}
