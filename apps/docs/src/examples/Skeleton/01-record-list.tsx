import { SkeletonBlock, SkeletonLine, SkeletonPage, SkeletonText } from '@misoto22/folio'

/**
 * The skeleton for the list that replaces it, built on the same grid — a 9rem
 * plate beside a kicker, a title and two lines of prose. That match is the
 * whole job: a skeleton whose shape differs from what lands is a layout shift
 * the reader was warned about and then subjected to anyway. One SkeletonPage
 * wraps the lot, so there is one live region, one sentence read aloud and one
 * pulse rather than eight bars breathing out of phase. Nothing here flips
 * aria-busy to false — the frame is unmounted, not updated — so whatever
 * replaces it has to announce itself or take focus.
 */
export function Example() {
  return (
    <SkeletonPage label="Loading projects">
      <div className="border-t border-(--rule-hard)">
        {[0, 1].map((row) => (
          <div key={row} className="grid gap-x-8 gap-y-4 border-b border-(--rule) py-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
            <SkeletonBlock className="h-24" />
            <div>
              <SkeletonLine className="h-2.5 w-24" />
              <SkeletonBlock className="mt-4 h-5 w-[min(100%,16rem)]" />
              <SkeletonText className="mt-5" lines={2} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  )
}
