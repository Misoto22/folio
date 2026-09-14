import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Separator,
  StatusPill,
  Tag,
} from '@misoto22/folio'
import type { ReactNode } from 'react'

/**
 * A law, shown rather than asserted.
 *
 * Every demonstration is built from `ORIGINAL_SET` — the primitives the laws
 * were written against. Illustrating a rule with a component added later to
 * satisfy it would be circular; the claim is that these rules fell out of the
 * first twenty-odd components, so the first twenty-odd components have to be
 * enough to show them.
 *
 * `Separator` is the one exception and an intentional one: it is the rule
 * itself, extracted from the hairlines the original set drew inline.
 */
const DEMOS: Record<string, ReactNode> = {
  // 01 — the ground is paper.
  '01': (
    <div className="flex flex-wrap gap-3">
      <Card className="w-40">
        <CardBody className="py-3">
          <CardTitle as="h3">On the page</CardTitle>
        </CardBody>
      </Card>
      <Card className="w-40">
        <CardBody className="py-3">
          <CardTitle as="h3">And beside it</CardTitle>
        </CardBody>
      </Card>
    </div>
  ),
  // 02 — a shadow is never blurred.
  '02': (
    <div className="flex flex-wrap gap-3">
      <Card className="w-40">
        <CardBody className="py-3">
          <CardTitle as="h3">Hairline</CardTitle>
        </CardBody>
      </Card>
      <Card variant="plate" className="w-40">
        <CardBody className="py-3">
          <CardTitle as="h3">Reversal</CardTitle>
        </CardBody>
      </Card>
    </div>
  ),
  // 03 — the rule does the work colour would.
  '03': (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {(['hairline', 'edge'] as const).map((weight) => (
        <div key={weight} className="flex flex-col gap-1.5">
          <span className="mono-meta text-(--ink-3-aa)">{weight}</span>
          <Separator weight={weight} />
        </div>
      ))}
    </div>
  ),
  // 04 — two text steps and nothing lighter.
  '04': (
    <div className="flex flex-col gap-1">
      <p className="m-0 text-sm text-(--ink)">The mark, and anything it names.</p>
      <p className="m-0 text-sm text-(--ink-2)">Body copy that is not the mark.</p>
      <p className="m-0 text-sm text-(--ink-3-aa)">The floor, and there is nothing under it.</p>
    </div>
  ),
  // 05 — chroma is bound to state.
  '05': (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="success">passed</Badge>
      <Badge tone="warning">needs attention</Badge>
      <Badge tone="danger">failed</Badge>
      <StatusPill tone="success">available</StatusPill>
      <Tag>a topic, which is not a state</Tag>
    </div>
  ),
  // 06 — one ladder, and the page owns the top of it.
  '06': (
    <div className="flex flex-col gap-1">
      <p className="m-0 font-heading text-[length:var(--fs-lead)] leading-tight text-(--ink)">
        A band heading
      </p>
      <p className="m-0 font-heading text-[length:var(--fs-sub)] leading-tight text-(--ink)">
        A card sub-head
      </p>
      <p className="m-0 font-heading text-[length:var(--fs-item)] leading-tight text-(--ink)">
        A title inside a card
      </p>
    </div>
  ),
  // 07 — the accent is ink.
  '07': (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">The one thing to do</Button>
      <label className="flex items-center gap-2 text-sm text-(--ink-2)">
        <Checkbox defaultChecked aria-label="Chosen" />
        Chosen
      </label>
    </div>
  ),
  // 08 — dark mode is a value swap.
  '08': (
    <div className="flex flex-wrap gap-3">
      <Card className="w-44">
        <CardBody className="flex flex-col gap-2 py-3">
          <CardTitle as="h3">Light</CardTitle>
          <Badge tone="success">passed</Badge>
        </CardBody>
      </Card>
      {/* The same markup and the same tokens, with the mode flipped on the
          wrapper. Nothing here is a second palette. */}
      <div data-mode="dark" className="rounded-(--radius) bg-(--paper)">
        <Card className="w-44">
          <CardBody className="flex flex-col gap-2 py-3">
            <CardTitle as="h3">Dark</CardTitle>
            <Badge tone="success">passed</Badge>
          </CardBody>
        </Card>
      </div>
    </div>
  ),
}

export function LawDemo({ n }: { n: string }) {
  const demo = DEMOS[n]
  if (!demo) return null
  return (
    // On the page's own ground, not a tinted panel. A demonstration of "the
    // same white on every surface" cannot sit on a second white.
    <div className="rounded-(--radius) border border-(--rule) p-4">{demo}</div>
  )
}
