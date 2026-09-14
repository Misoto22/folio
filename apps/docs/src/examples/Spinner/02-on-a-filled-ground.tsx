import { Button, Spinner } from '@misoto22/folio'

/**
 * Two spinners standing on a ground that is not paper. The default tone draws
 * the leading quarter in --ink over a --rule-2 track, and inside a filled
 * control both of those are the ground it is sitting on — so pass tone current
 * and let the ring inherit the text colour. label null belongs to exactly this
 * case: the control already names the operation, and passing it hides the whole
 * element from assistive tech rather than merely dropping the text, so a
 * silenced spinner standing on its own is a wait nobody is told about.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Saving…</Button>
      <span className="inline-flex items-center gap-2.5 rounded-(--radius) bg-(--feature-surface) px-4 py-3 text-sm text-(--on-feature)">
        <Spinner size="sm" tone="current" label={null} />
        Indexing 1,204 frames
      </span>
    </div>
  )
}
