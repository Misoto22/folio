import { FloatingIconButton } from '@misoto22/folio'
import { RiArrowUpLine, RiChat3Line } from '@remixicon/react'

/**
 * Both corners, and the reason there is no room for a third. start is raised to
 * 5rem while end sits at 1.5rem, which is exactly the clearance a pair needs —
 * and the corners are already competing with a cookie bar, a chat launcher and
 * whatever the browser puts in the corner where reading begins, which is why
 * start is the higher of the two. The control is --control-h-md square: 44px at
 * the default density, which is the pointer-target floor, and 36px under
 * data-density="compact". Flip the density switch above and the one control a
 * thumb reaches for without looking drops eight pixels under it.
 */
export function Example() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&>button]:absolute">
      <FloatingIconButton position="start" label="Open the chat">
        <RiChat3Line size={16} aria-hidden />
      </FloatingIconButton>
      <FloatingIconButton position="end" label="Back to top">
        <RiArrowUpLine size={16} aria-hidden />
      </FloatingIconButton>
    </div>
  )
}
