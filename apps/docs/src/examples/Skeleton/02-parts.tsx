import { SkeletonBlock, SkeletonCircle, SkeletonLine, SkeletonPage, SkeletonText } from '@misoto22/folio'

/**
 * The four presets over the one fill. Skeleton itself sets a --stone ground and
 * nothing else — no height, no width, no radius — so a bare one renders a
 * zero-height div and shows nothing at all; every dimension comes from
 * className. SkeletonCircle is a fixed 36px and SkeletonLine a fixed 12px tall
 * whatever they stand in for, which is why a skeleton copied between screens
 * has to be re-measured against what it now replaces. Do not add animate-pulse
 * to a part: the frame already animates opacity, and a second ramp on a child
 * multiplies with it.
 */
export function Example() {
  return (
    <SkeletonPage label="Loading the example" className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <SkeletonCircle />
        <SkeletonLine className="w-32" />
      </div>
      <SkeletonBlock className="h-20" />
      <SkeletonText lines={3} />
    </SkeletonPage>
  )
}
