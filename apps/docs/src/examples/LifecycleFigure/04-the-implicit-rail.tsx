import { LifecycleFigure } from '@misoto22/folio/diagrams'

/**
 * Three facts about placement that only bite once. Declaring one of the spine's
 * own pairs is not a duplicate — it replaces the implied edge and takes your
 * label — so the way to name a step is to write that transition, not to hope
 * the rail carries it. A secondary lane's column N sits under the main lane's
 * column N + 2, which is why Withdrawn at column 0 lands beneath Accept rather
 * than beneath In review. And yOffset is accepted on a state and deliberately
 * ignored: the nudge is measured in archify's lane depth, not this one, so
 * honouring it would drop a plate onto the lane below.
 */
export function Example() {
  return (
    <LifecycleFigure
      spec={{
        meta: { title: 'An article, from draft to live', subtitle: 'The spine is drawn; only the departures are written.' },
        lanes: [
          { id: 'main', label: 'Review' },
          { id: 'aside', label: 'Off the rail' },
        ],
        states: [
          { id: 'draft', type: 'start', label: 'Draft', sublabel: 'author only', lane: 'main', col: 0, step: '01' },
          { id: 'review', type: 'active', label: 'In review', sublabel: 'two readers', lane: 'main', col: 1, step: '02' },
          { id: 'decide', type: 'decision', label: 'Accept?', sublabel: 'editor', lane: 'main', col: 2, step: '03' },
          { id: 'live', type: 'success', label: 'Published', sublabel: 'on the site', lane: 'main', col: 3, step: '04' },
          { id: 'pulled', type: 'neutral', label: 'Withdrawn', sublabel: 'by the author', lane: 'aside', col: 0 },
          { id: 'held', type: 'waiting', label: 'Held', sublabel: 'awaiting legal', lane: 'aside', col: 1 },
        ],
        transitions: [
          { id: 'a', from: 'review', to: 'pulled', label: 'author pulled it', variant: 'dashed' },
          { id: 'b', from: 'decide', to: 'held', label: 'legal question', note: 'blocks publication' },
          { id: 'c', from: 'held', to: 'decide', label: 'cleared', variant: 'emphasis' },
        ],
      }}
    />
  )
}
