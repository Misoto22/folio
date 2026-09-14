import { Textarea } from '@misoto22/folio'

/**
 * A resting box at four rows. rows is the only thing that lifts it off the
 * six-rem floor, and the height of the box is the clearest thing on a page
 * about how long an answer is expected to be — so set it to the answer you
 * expect. There is no auto-grow: the height never follows the content, and a
 * long answer left at the default is reviewed through a six-rem window. It
 * resizes vertically only, because a horizontal grip lets a reader drag the
 * control past the measure and out of the page's gutter.
 */
export function Example() {
  return (
    <Textarea className="max-w-md" rows={4} aria-label="Notes" placeholder="Tell us more…" />
  )
}
