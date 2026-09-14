'use client'

import {
  Avatar,
  Badge,
  Button,
  Input,
  LinkArrow,
  Pagination,
  Separator,
  StatusPill,
  Tag,
  ToggleGroup,
  ToggleGroupItem,
} from '@misoto22/folio'
import { RiRssLine, RiSearchLine } from '@remixicon/react'
import { useMemo, useState } from 'react'

interface Post {
  slug: string
  title: string
  standfirst: string
  category: 'Foundations' | 'Craft' | 'Field notes'
  author: string
  initials: string
  date: string
  minutes: number
  tags: string[]
}

const POSTS: Post[] = [
  {
    slug: 'one-factor-moves-them-all',
    title: 'One factor moves them all',
    standfirst:
      'A corner nested inside another corner is only ever right while the two stay in proportion. Four hand-typed numbers cannot promise that, and here is what it cost.',
    category: 'Foundations',
    author: 'Henry Chen',
    initials: 'HC',
    date: '6 Sep 2026',
    minutes: 4,
    tags: ['Radius', 'Tokens', 'Theming'],
  },
  {
    slug: 'the-hairline-is-the-elevation-ramp',
    title: 'The hairline is the elevation ramp',
    standfirst:
      'A system with no light source has nothing to cast a shadow. What separates two surfaces instead is a rule, a change of ground, and — once — a hard offset.',
    category: 'Foundations',
    author: 'Henry Chen',
    initials: 'HC',
    date: '29 Aug 2026',
    minutes: 6,
    tags: ['Depth', 'Surfaces'],
  },
  {
    slug: 'a-select-that-stops-being-yours',
    title: 'A select that stops being yours the moment it opens',
    standfirst:
      'The one honest argument for the native control was its keyboard contract. That argument has an answer now, so the default changed.',
    category: 'Craft',
    author: 'Henry Chen',
    initials: 'HC',
    date: '21 Aug 2026',
    minutes: 8,
    tags: ['Forms', 'Keyboard'],
  },
  {
    slug: 'forty-rows-of-bare-text',
    title: 'Forty rows of bare text cannot be scanned',
    standfirst:
      'The eye sorts by shape before it reads. A command palette that gives it nothing to sort is a list you read linearly, which is the thing a palette exists to avoid.',
    category: 'Craft',
    author: 'Henry Chen',
    initials: 'HC',
    date: '14 Aug 2026',
    minutes: 5,
    tags: ['Palette', 'Scanning'],
  },
  {
    slug: 'what-a-390px-preview-is-for',
    title: 'What a 390px preview is actually for',
    standfirst:
      'A frame that reads the viewport is a frame that lies. Container queries and one re-based fluid unit are what make a device preview tell the truth.',
    category: 'Field notes',
    author: 'Henry Chen',
    initials: 'HC',
    date: '2 Aug 2026',
    minutes: 7,
    tags: ['Layout', 'Container queries'],
  },
]

const CATEGORIES = ['All', 'Foundations', 'Craft', 'Field notes'] as const

/**
 * A publication index, assembled from the set.
 *
 * The third density a template has to cover, and the one the other two miss. A
 * console is many components close together; a landing page is very few with a
 * great deal of air. A blog index is neither: it is a LIST OF RECORDS that
 * differ in length, where the only things holding the page together are the
 * type ladder, one rule weight, and the discipline of putting the same three
 * facts in the same place on every row.
 *
 * That is the failure mode it tests for. A card grid hides uneven records
 * behind equal boxes; a ruled list does not, so a summary that runs three lines
 * on one row and one on the next shows up immediately — which is why this is
 * drawn as rules rather than as cards.
 *
 * Every element is from the package.
 */
export function Blog() {
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')

  const posts = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return POSTS.filter(
      (post) =>
        (category === 'All' || post.category === category) &&
        (needle === '' ||
          post.title.toLowerCase().includes(needle) ||
          post.tags.some((tag) => tag.toLowerCase().includes(needle))),
    )
  }, [category, query])

  const [lead, ...rest] = posts

  return (
    <div className="flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-(--rule) px-6 py-4 @3xl:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-[17px] text-(--ink)">Field Notes</span>
          <span className="mono-meta text-(--ink-3-aa)">misoto22</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="gap-2">
            <RiRssLine size={14} aria-hidden />
            <span className="max-@2xl:sr-only">Subscribe</span>
          </Button>
          <StatusPill>{POSTS.length} posts</StatusPill>
        </div>
      </header>

      <section className="flex flex-col gap-6 px-6 py-10 @3xl:px-10 @3xl:py-14">
        <div className="flex max-w-(--w-reading) flex-col gap-3">
          <p className="m-0 eyebrow text-(--ink-3-aa)">The journal</p>
          <h1 className="m-0 font-heading text-[length:var(--fs-lead)] font-normal leading-[1.15] text-(--ink)">
            Notes on building the system, written while it was being built
          </h1>
          <p className="m-0 text-sm leading-relaxed text-(--ink-2)">
            Each post is one decision and what it cost — the argument at the moment it was made,
            rather than reconstructed from the commit a month later.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            type="single"
            value={category}
            onValueChange={(next) => setCategory(next || 'All')}
            aria-label="Category"
          >
            {CATEGORIES.map((name) => (
              <ToggleGroupItem key={name} value={name} className="text-[13px]">
                {name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="relative ms-auto w-full @xl:w-64">
            <RiSearchLine
              size={14}
              aria-hidden
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-(--ink-3-aa)"
            />
            <Input
              aria-label="Search posts"
              placeholder="Search…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="ps-9"
            />
          </div>
        </div>
      </section>

      {lead && (
        <a
          href={`#${lead.slug}`}
          className="group flex flex-col gap-5 border-y border-(--rule) px-6 py-10 transition-colors duration-(--duration-fast) hover:bg-(--paper-2) @3xl:flex-row @3xl:items-end @3xl:px-10"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{lead.category}</Badge>
              <span className="mono-meta text-(--ink-3-aa)">
                {lead.date} · {lead.minutes} min
              </span>
            </div>
            <h2 className="m-0 font-heading text-[length:var(--fs-heading)] font-normal leading-[1.2] text-(--ink)">
              {lead.title}
            </h2>
            <p className="m-0 max-w-(--measure-record) text-sm leading-relaxed text-(--ink-2)">
              {lead.standfirst}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Avatar fallback={lead.initials} alt="" size="sm" />
              <span className="text-[13px] text-(--ink-3-aa)">{lead.author}</span>
            </div>
          </div>
          <span className="shrink-0 text-sm text-(--ink)">
            Read the piece
            <LinkArrow />
          </span>
        </a>
      )}

      <div className="flex flex-col divide-y divide-(--rule) px-6 @3xl:px-10">
        {rest.map((post) => (
          <a
            key={post.slug}
            href={`#${post.slug}`}
            className="group grid gap-3 py-7 @2xl:grid-cols-[9rem_minmax(0,1fr)] @2xl:gap-8"
          >
            <div className="flex flex-col gap-1.5">
              <span className="mono-meta text-(--ink-3-aa)">{post.date}</span>
              <span className="mono-meta text-(--ink-3-aa)">{post.minutes} min</span>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <h3 className="m-0 font-heading text-[length:var(--fs-item)] font-normal text-(--ink) underline decoration-transparent underline-offset-4 transition-colors duration-(--duration-fast) group-hover:decoration-(--rule-2)">
                {post.title}
              </h3>
              <p className="m-0 max-w-(--measure-record) text-[13px] leading-relaxed text-(--ink-3-aa)">
                {post.standfirst}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Badge tone="outline">{post.category}</Badge>
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </a>
        ))}

        {posts.length === 0 && (
          <p className="m-0 py-14 text-center text-sm text-(--ink-3-aa)">
            Nothing matches “{query}”.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-center px-6 py-8">
        <Pagination page={1} pageCount={4} onPageChange={() => {}} label="Posts" />
      </div>
    </div>
  )
}
