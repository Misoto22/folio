import { Separator } from '@misoto22/folio'

/**
 * The three weights, in the order they are meant to be spent. They are ordered
 * rather than interchangeable, so a hard rule between two table rows tells the
 * reader the table ended there — and the hard one is not a darker grey, it is
 * --ink itself. Three named weights are the whole set; a fourth grey tuned by
 * eye through className is how a monochrome page drifts.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <p className="m-0 mb-2 mono-meta text-(--ink-3-aa)">hairline — between rows</p>
        <Separator />
      </div>
      <div>
        <p className="m-0 mb-2 mono-meta text-(--ink-3-aa)">edge — between blocks</p>
        <Separator weight="edge" />
      </div>
      <div>
        <p className="m-0 mb-2 mono-meta text-(--ink-3-aa)">hard — under a masthead</p>
        <Separator weight="hard" />
      </div>
    </div>
  )
}
