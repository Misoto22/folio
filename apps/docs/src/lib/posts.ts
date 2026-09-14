import type { DiagramSpec, StepsProps } from '@misoto22/folio'
import postsJson from '@/generated/posts.json'

/**
 * A post, as `scripts/render-markdown.mjs` emitted it.
 *
 * The boundary is here for the same reason `lib/docs.ts` is the boundary for
 * everything else generated: the generator has no types to share, so exactly
 * one file asserts a shape and everything downstream is checked against it.
 */
export interface PostMeta {
  title: string
  subtitle: string
  date: string
  author: string
  role: string
  category: string
  tags: string[]
  summary: string
}

/**
 * Prose and diagrams, in the order they appeared.
 *
 * Three kinds rather than one string, because a figure is a React component and
 * cannot arrive as HTML. The pipeline lifts each one out of the stream and
 * leaves the prose either side of it intact.
 */
export type PostBlock =
  | { kind: 'html'; html: string }
  | { kind: 'diagram'; spec: DiagramSpec }
  | { kind: 'steps'; spec: Pick<StepsProps, 'steps' | 'label' | 'marker'> }

export interface PostData {
  slug: string
  meta: PostMeta
  blocks: PostBlock[]
  toc: { id: string; text: string; level: number }[]
  readingMinutes: number
}

const POSTS = postsJson as unknown as Record<string, PostData>

export function post(slug: string): PostData {
  const found = POSTS[slug]
  if (!found) throw new Error(`no post "${slug}" under content/posts`)
  return found
}

export const POST_SLUGS = Object.keys(POSTS)
