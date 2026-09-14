import {
  Progress,
  SkeletonBlock,
  SkeletonLine,
  SkeletonPage,
  Spinner,
  Text,
} from '@misoto22/folio'

/**
 * Three waits, three shapes, and the question each one answers. A Spinner is
 * for a wait whose length nobody knows and whose result has no shape worth
 * promising. A Skeleton is for a wait where the shape is known — it holds the
 * layout so the page does not jump when the records land. A Progress is for a
 * wait with a real fraction, and only a real one: a bar filled from an invented
 * estimate is a spinner that lies. Reaching for the spinner in all three cases
 * is the usual failure, and it is the one of the three that says least.
 */
export function Example() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-3">
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Unknown duration
        </Text>
        <Spinner label="Checking the deploy" />
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Known shape
        </Text>
        <SkeletonPage label="Loading the changelog" className="flex flex-col gap-3">
          <SkeletonLine className="h-2.5 w-20" />
          <SkeletonBlock className="h-10" />
        </SkeletonPage>
      </div>
      <div className="flex flex-col gap-3">
        <Text size="xs" tone="muted">
          Known fraction
        </Text>
        <Progress value={41} label="Uploading footage.mov" showValue />
      </div>
    </div>
  )
}
