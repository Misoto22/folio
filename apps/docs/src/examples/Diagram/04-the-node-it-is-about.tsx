import { Diagram } from '@misoto22/folio'

/**
 * One accented plate, which is the whole budget: accent is the system's only
 * fill, so a figure with three of them is a figure about nothing. footnote
 * prints under the box and outside it, for the sentence a note is too short to
 * hold. This spec has no caption, so label is what names the figure's group —
 * with neither, a screen reader announces a group and never says what of.
 */
export function Example() {
  return (
    <Diagram
      spec={{
        label: 'Where an answer is assembled',
        edges: [
          { from: 'retrieval', to: 'model', label: 'context' },
          { from: 'model', to: 'answer', label: 'tokens' },
        ],
        nodes: [
          { id: 'retrieval', label: 'Retrieval', note: 'five chunks' },
          {
            id: 'model',
            label: 'Model',
            note: 'streamed',
            accent: true,
            footnote: 'The only step that leaves the machine',
          },
          { id: 'answer', label: 'Answer', note: 'with citations' },
        ],
      }}
    />
  )
}
