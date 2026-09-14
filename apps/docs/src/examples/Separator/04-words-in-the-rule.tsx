import { Separator } from '@misoto22/folio'

/**
 * Words in the break. label changes the CONSTRUCTION rather than the styling:
 * the rule is drawn twice, one piece either side of the words, and the gap is a
 * gap — so it is right on any ground without being told which one it is on. The
 * usual one-element version lays the text over a single rule and punches a hole
 * in it with a background colour, which is --paper on a card that is --stone
 * and reads as a rendering bug. Horizontal only, and decorative stops applying,
 * because the words are content.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Separator label="or continue with" />
      <div className="rounded-(--radius-lg) bg-(--stone) p-5">
        <Separator weight="edge" label="Older" />
      </div>
    </div>
  )
}
