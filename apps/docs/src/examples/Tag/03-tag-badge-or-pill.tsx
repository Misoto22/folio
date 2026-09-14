import { Badge, StatusPill, Tag } from '@misoto22/folio'

/**
 * The three chips that look nearly identical, on the one record where each is
 * the right answer. A Tag names what the record is ABOUT, so several sit
 * together and get scanned; a Badge is one fact about one record, which is why
 * it carries the status tones and a tag carries none; a StatusPill is the live
 * state of the view itself, at most one, in the loudest small type the system
 * has. Reach for the tag when you would want a second one beside it.
 */
export function Example() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-heading text-[length:var(--fs-item)] text-(--ink)">
          Retrieval rewrite
        </span>
        <Badge tone="success">Merged</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Tag>TypeScript</Tag>
        <Tag>pgvector</Tag>
        <Tag>Search</Tag>
      </div>
      <StatusPill pulse={false}>Deployed to production</StatusPill>
    </div>
  )
}
