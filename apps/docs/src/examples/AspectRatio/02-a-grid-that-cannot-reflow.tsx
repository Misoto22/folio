import { AspectRatio, Skeleton, Text } from '@misoto22/folio'

const POSTS = [
  { slug: 'monochrome', title: 'Why the system spends no colour' },
  { slug: 'density', title: 'Three densities, one component' },
  { slug: 'diagrams', title: 'Five diagram shapes software needs' },
]

/**
 * The case this exists for: a media grid whose covers have not arrived. Each
 * box is already the right height, so when the images land nothing under them
 * moves — and that movement is exactly what a Cumulative Layout Shift score is
 * measuring. The skeleton has no size of its own; it fills the box because
 * every direct child is stretched to it, which means the loading state and the
 * loaded state occupy the same rectangle by construction rather than by two
 * numbers someone kept in step.
 */
export function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {POSTS.map((post) => (
        <article key={post.slug} className="flex flex-col gap-2">
          <AspectRatio ratio="3 / 2" className="rounded-(--radius) border border-(--rule-2)">
            <Skeleton />
          </AspectRatio>
          <Text as="span" size="sm">
            {post.title}
          </Text>
        </article>
      ))}
    </div>
  )
}
