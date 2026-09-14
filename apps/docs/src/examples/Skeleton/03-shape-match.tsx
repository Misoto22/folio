import { Avatar, SkeletonBlock, SkeletonCircle, SkeletonLine, SkeletonPage, Text } from '@misoto22/folio'

/**
 * The same comment twice: the shape that holds its place, and the thing that
 * lands in it. SkeletonCircle is 36px and Avatar at the default size is 36px,
 * the name line stands at the height of the caption that replaces it, and the
 * two prose bars end where the real sentence ends — so nothing on the page
 * moves at the moment of the swap. A skeleton measured against nothing is a
 * layout shift with extra steps: it promises a layout, and then the page jumps
 * out from under the reader who was already reading it.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          While it loads
        </Text>
        <SkeletonPage label="Loading the comment" className="flex gap-3">
          <SkeletonCircle />
          <div className="min-w-0 flex-1">
            <SkeletonLine className="h-2.5 w-24" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-[62%]" />
          </div>
        </SkeletonPage>
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          What lands
        </Text>
        <div className="flex gap-3">
          <Avatar alt="" fallback="HC" />
          <div className="min-w-0 flex-1">
            <Text size="xs" tone="muted">
              Henry Chen
            </Text>
            <Text size="sm" className="mt-2">
              Rebased onto main and the typecheck is green again. Merging once CI finishes.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
