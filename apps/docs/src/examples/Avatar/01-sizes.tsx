import { Avatar } from '@misoto22/folio'

/**
 * The three fixed squares — 28px, 36px and 48px — with no image behind any of
 * them, which is what most rows of a real list render as. fallback is required
 * for that reason: it is the half that is always there, and the image is the
 * optional one. None of these sizes is a control, and two of them are under the
 * 44px pointer target a control would need.
 */
export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm" alt="" fallback="HC" />
      <Avatar size="md" alt="" fallback="MI" />
      <Avatar size="lg" alt="" fallback="22" />
    </div>
  )
}
