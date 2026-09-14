import { Avatar, Button } from '@misoto22/folio'

/**
 * An account control with the avatar inside it, rather than an onClick hung on
 * the circle. The root is a span nothing has made focusable and sm is 28px,
 * under the 44px pointer floor — so an avatar wired up as a menu trigger is
 * unreachable by keyboard and undersized at once. The button brings the target,
 * the focus ring and the accessible name; the circle stays a picture.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary">
        <Avatar size="sm" alt="" fallback="HC" />
        Henry Chen
      </Button>
      <Button variant="ghost">
        <Avatar size="sm" alt="" fallback="RW" />
        Switch account
      </Button>
    </div>
  )
}
