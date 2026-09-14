'use client'

import { Article, Avatar, Badge, Button, Diagram, Separator, Steps, Tag } from '@misoto22/folio'
import { RiArrowLeftLine, RiLinkM } from '@remixicon/react'
import { post } from '@/lib/posts'

const POST = post('one-factor-moves-them-all')

/**
 * One post, rendered from real Markdown.
 *
 * This is the template that tests the READING surface, and it is the only one
 * whose content does not come from a literal in this file: the body is a
 * `.md` file under `src/content/posts`, put through the site's own build-time
 * pipeline. That is deliberate, and it is what makes the test worth anything —
 * a page of hand-written JSX proves the components look right and proves
 * nothing about what happens when a pipeline hands the system a `<table>` it
 * did not author.
 *
 * What the file exercises, and therefore what this proves the system styles:
 * headings and their anchors, a standfirst, body copy on the measure, links,
 * emphasis, inline and fenced code, a blockquote with an attribution, ordered,
 * unordered and task lists, a GFM table wide enough to need its own scroll,
 * a horizontal rule, footnotes with their back-references, keyboard keys,
 * LaTeX both inline and displayed — rendered to MathML, so there is no second
 * stylesheet and no font to load — and a flow diagram authored as a fenced
 * ```diagram block and a numbered pipeline as a ```steps one.
 *
 * The blocks are prose and diagrams in the order they appeared: a diagram is a
 * component and cannot arrive as an HTML string, so the pipeline lifts each one
 * out and this maps over what is left. Everything else is one `Article`.
 */
export function Post() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-(--rule) px-6 py-4 @3xl:px-10">
        <Button size="sm" variant="ghost" className="gap-2">
          <RiArrowLeftLine size={14} aria-hidden />
          Field Notes
        </Button>
        <Button size="sm" variant="ghost" iconOnly aria-label="Copy a link to this post">
          <RiLinkM size={14} aria-hidden />
        </Button>
      </header>

      <div className="grid gap-10 px-6 py-10 @3xl:grid-cols-[minmax(0,1fr)_13rem] @3xl:px-10 @3xl:py-14">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex max-w-(--w-reading) flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{POST.meta.category}</Badge>
              <span className="mono-meta text-(--ink-3-aa)">
                {POST.meta.date} · {POST.readingMinutes} min
              </span>
            </div>
            <h1 className="m-0 font-heading text-[length:var(--fs-lead)] font-normal leading-[1.12] tracking-[-0.02em] text-(--ink)">
              {POST.meta.title}
            </h1>
            <p className="m-0 text-[length:var(--fs-item)] leading-[1.55] text-(--ink-2)">
              {POST.meta.subtitle}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Avatar fallback="HC" alt="" size="sm" />
              <span className="text-[13px] text-(--ink)">{POST.meta.author}</span>
              <span className="mono-meta text-(--ink-3-aa)">{POST.meta.role}</span>
            </div>
          </div>

          <Separator />

          {/* One Article per prose run, and the diagram between them as a real
              component. The blocks are already in order — nothing here decides
              where anything goes. */}
          <div className="flex flex-col gap-6">
            {POST.blocks.map((block, index) => {
              if (block.kind === 'diagram') {
                return <Diagram key={index} spec={block.spec} className="max-w-(--w-reading)" />
              }
              if (block.kind === 'steps') {
                return <Steps key={index} {...block.spec} className="max-w-(--w-reading) py-2" />
              }
              return <Article key={index} as="div" html={block.html} />
            })}
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-1.5">
            {POST.meta.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* The contents rail, built from the headings the pipeline collected —
            not from a second list somebody keeps in step by hand. */}
        <nav aria-label="Contents" className="max-@3xl:hidden">
          <div className="sticky top-6 flex flex-col gap-2 border-s border-(--rule) ps-4">
            <span className="eyebrow text-(--ink-3-aa)">Contents</span>
            {POST.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-[13px] leading-snug text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:text-(--ink) ${
                  item.level === 3 ? 'ps-3' : ''
                }`}
              >
                {item.text}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
