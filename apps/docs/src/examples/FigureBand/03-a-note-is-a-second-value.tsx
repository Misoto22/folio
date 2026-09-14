import { FigureBand } from '@misoto22/folio'

/**
 * What belongs in note, and what does not. The value and the note are two dd
 * elements under one dt, so a screen reader reads them as two values of the
 * same term: "Posts: 48, plus 6 this year" works, and a clause explaining why
 * does not. Keep it to a trend, a qualifier or a second fact — the sentence
 * belongs in the prose around the band.
 */
export function Example() {
  return (
    <FigureBand
      label="The site, at a glance"
      figures={[
        { id: 'posts', label: 'Posts', value: '48', note: '+6 this year' },
        { id: 'frames', label: 'Frames', value: '1,204', note: '38 rolls' },
        { id: 'projects', label: 'Projects', value: '11', note: '3 shipped' },
        { id: 'words', label: 'Words', value: '86k', note: 'English and Chinese' },
      ]}
    />
  )
}
