'use client'

import { useMemo, useRef, useState } from 'react'
import { Badge, Button, StatusPill, Tag, toast } from '@misoto22/folio'
import {
  ArchitectureFigure,
  DiagramCanvas,
  DiagramExportMenu,
  DiagramInspector,
  DiagramLegend,
  DiagramMinimap,
  DiagramToolbar,
  DiagramToolbarGroup,
  kindLegend,
  type ArchitectureSpec,
  type CanvasView,
  type DiagramCanvasHandle,
  type NodeKind,
} from '@misoto22/folio/diagrams'
import { RiFullscreenLine, RiResetLeftLine } from '@remixicon/react'

/**
 * The specification the screen is about.
 *
 * Written in archify's own vocabulary — `components`, `boundaries`,
 * `connections` — because that is the point of the compatibility: this is a
 * document an agent could have produced, rendered in the system's terms.
 */
const SPEC: ArchitectureSpec = {
  meta: {
    title: 'Checkout platform',
    subtitle: 'One order, from the browser to the ledger it settles against.',
  },
  components: [
    { id: 'shop', type: 'frontend', label: 'Storefront', sublabel: 'Next.js', row: 0, col: 0 },
    { id: 'edge', type: 'cloud', label: 'Edge', sublabel: 'Cloudflare', row: 0, col: 1, tag: 'WAF' },
    { id: 'auth', type: 'security', label: 'Identity', sublabel: 'OAuth 2.0', row: 1, col: 1 },
    { id: 'api', type: 'backend', label: 'Checkout API', sublabel: 'Django', row: 0, col: 2, tag: ':8000' },
    { id: 'cache', type: 'database', label: 'Redis', sublabel: 'idempotency keys', row: 1, col: 2 },
    { id: 'queue', type: 'messagebus', label: 'Orders topic', sublabel: 'Kafka', row: 2, col: 2 },
    { id: 'ledger', type: 'database', label: 'Ledger', sublabel: 'Postgres', row: 0, col: 3 },
    { id: 'psp', type: 'external', label: 'Payments', sublabel: 'Stripe', row: 2, col: 3 },
  ],
  boundaries: [
    { kind: 'region', label: 'ap-southeast-2', wraps: ['api', 'cache', 'queue', 'ledger'] },
    { kind: 'security-group', label: 'sg-checkout', wraps: ['api', 'ledger'] },
  ],
  connections: [
    { id: 'a', from: 'shop', to: 'edge', label: 'HTTPS', variant: 'emphasis' },
    { id: 'b', from: 'edge', to: 'api', variant: 'emphasis' },
    { id: 'c', from: 'auth', to: 'api', label: 'verify JWT', variant: 'security' },
    { id: 'd', from: 'api', to: 'cache', label: 'idempotency' },
    { id: 'e', from: 'api', to: 'ledger', label: 'write order', variant: 'emphasis' },
    { id: 'f', from: 'api', to: 'queue', label: 'publish', variant: 'dashed' },
    { id: 'g', from: 'queue', to: 'psp', label: 'capture', variant: 'dashed' },
  ],
  cards: [
    { dot: 'cyan', title: 'Edge', items: ['Every request is fronted by the WAF.', 'TLS terminates before the API sees it.'] },
    { dot: 'emerald', title: 'Order path', items: ['One write to the ledger, guarded by an idempotency key.', 'Capture is asynchronous and can be replayed.'] },
    { dot: 'rose', title: 'Trust', items: ['The API and the ledger share one security group.', 'Identity is outside it and reaches in.'] },
  ],
}

const NODES = new Map(SPEC.components.map((component) => [component.id, component]))

const KIND_WORDS: Record<NodeKind, string> = {
  frontend: 'Client',
  backend: 'Service',
  database: 'Datastore',
  cloud: 'Cloud',
  security: 'Policy',
  messagebus: 'Queue',
  external: 'External',
}

/**
 * A diagram explorer: one figure, given the screen.
 *
 * This is the density the other four templates do not test. A dashboard packs
 * twelve components into a bounded column; a landing page spends everything on
 * air; a blog index is a ruled list; an article is a reading measure. None of
 * them answers the question this one does — WHAT HAPPENS WHEN ONE OBJECT OWNS
 * THE VIEWPORT and the rest of the interface is chrome arranged around it.
 *
 * That arrangement is the thing being checked. A floating toolbar over a
 * canvas, an inspector that appears where the reader's attention already is, a
 * minimap in the opposite corner, a key and conclusion cards below the fold —
 * every one of those sits on top of, beside, or under a surface rather than in
 * a column with it, and spacing decisions that were only ever checked in a
 * stack do not survive that.
 *
 * The second thing it proves is the seam: the figure publishes its own
 * accessible summary and its own selection events, and the inspector is an
 * ordinary consumer of both. Nothing here reaches into the SVG.
 */
export function Architecture() {
  const canvas = useRef<DiagramCanvasHandle>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<CanvasView>({ scale: 1, x: 0, y: 0 })
  const [selected, setSelected] = useState<string | null>(null)

  const node = selected ? NODES.get(selected) : undefined

  // Both directions, because "what reaches me" is as much a question as "what I
  // reach" — and a panel that only listed outgoing edges would answer half of
  // every question a reader has about a boundary.
  const links = useMemo(() => {
    if (!selected) return []
    return (SPEC.connections ?? [])
      .filter((connection) => connection.from === selected || connection.to === selected)
      .map((connection) => {
        const outgoing = connection.from === selected
        const peer = NODES.get(outgoing ? connection.to : connection.from)
        return {
          id: connection.id,
          direction: outgoing ? ('out' as const) : ('in' as const),
          label: connection.label ?? '',
          peer: peer?.label ?? '',
          onSelect: peer ? () => setSelected(peer.id) : undefined,
        }
      })
  }, [selected])

  return (
    <div className="flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-(--rule) px-6 py-4 @3xl:px-10">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="eyebrow text-(--ink-3-aa)">Architecture</span>
          <h1 className="m-0 font-heading text-[length:var(--fs-heading)] font-normal leading-[1.1] tracking-[-0.02em] text-(--ink)">
            {SPEC.meta.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone="success">Verified</StatusPill>
          <Badge tone="outline">rev 14</Badge>
        </div>
      </header>

      <div className="flex flex-col gap-6 px-6 py-8 @3xl:px-10 @3xl:py-10">
        <p className="m-0 max-w-(--w-reading) text-[length:var(--fs-item)] leading-[1.55] text-(--ink-2)">
          {SPEC.meta.subtitle}
        </p>

        <div className="relative" ref={stage}>
          <DiagramCanvas
            ref={canvas}
            height="clamp(22rem, 52vh, 34rem)"
            label={SPEC.meta.title}
            onViewChange={setView}
          >
            <ArchitectureFigure
              spec={SPEC}
              heading={false}
              legend="hidden"
              cards={false}
              activeIds={selected ? [selected] : undefined}
              onSelectNode={setSelected}
              className="p-6"
            />
          </DiagramCanvas>

          <DiagramToolbar label="Diagram actions" placement="floating">
            <DiagramToolbarGroup>
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                aria-label="Reset the view"
                onClick={() => canvas.current?.reset()}
              >
                <RiResetLeftLine size={14} aria-hidden />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                aria-label="Fit the diagram to the frame"
                onClick={() => canvas.current?.centerOn(560, 240)}
              >
                <RiFullscreenLine size={14} aria-hidden />
              </Button>
            </DiagramToolbarGroup>
            <DiagramToolbarGroup>
              <DiagramExportMenu
                targetRef={stage}
                title={SPEC.meta.title}
                onResult={(result) =>
                  result.ok
                    ? toast.success(`Exported as ${result.format.toUpperCase()}`)
                    : toast.error(result.error?.message ?? 'The export failed')
                }
              />
            </DiagramToolbarGroup>
          </DiagramToolbar>

          {node && (
            <DiagramInspector
              floating
              eyebrow={KIND_WORDS[node.type]}
              title={node.label}
              description={node.sublabel}
              facts={[
                { label: 'Id', value: node.id, mono: true },
                ...(node.tag ? [{ label: 'Tag', value: node.tag, mono: true }] : []),
                { label: 'Links', value: String(links.length) },
              ]}
              links={links}
              onClose={() => setSelected(null)}
              actions={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`#${node.id}`)
                    toast.success('Link copied')
                  }}
                >
                  Copy link
                </Button>
              }
            />
          )}

          <div className="absolute bottom-3 end-3 max-md:hidden">
            <DiagramMinimap
              content={{ width: 1120, height: 480 }}
              frame={{ width: 900, height: 400 }}
              view={view}
              width={168}
              onSeek={(x, y) => canvas.current?.centerOn(x, y)}
            >
              <ArchitectureFigure spec={SPEC} heading={false} legend="hidden" cards={false} />
            </DiagramMinimap>
          </div>
        </div>

        <DiagramLegend
          entries={kindLegend([...new Set(SPEC.components.map((component) => component.type))])}
        />

        <div className="grid gap-5 @2xl:grid-cols-3">
          {(SPEC.cards ?? []).map((card) => (
            <div key={card.title} className="flex flex-col gap-2.5 border-t border-(--ink) pt-3">
              <span className="font-sans text-[13.5px] leading-[1.35] text-(--ink)">
                {card.title}
              </span>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {card.items.map((item) => (
                  <li key={item} className="text-[12.5px] leading-[1.55] text-(--ink-2)">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-(--rule) pt-5">
          {['architecture', 'checkout', 'payments', 'ap-southeast-2'].map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
