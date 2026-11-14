import type { IconComponent } from '../../icons'
import type { HTMLAttributes, ReactNode } from 'react'
import { Heading, type HeadingLevel } from '../Heading/Heading'
import { cn } from '../../lib/cn'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional icon component, such as a glyph from `@misoto22/folio/icons`, shown muted inside a quiet circle. */
  icon?: IconComponent
  title: ReactNode
  description?: ReactNode
  /** The one thing to do next. An empty state without an action is a dead end. */
  action?: ReactNode
  /**
   * The heading level `title` opens, in the document the empty state lands in.
   *
   * Defaults to `2`, which is the placement this component is sized for: it
   * stands in for a whole view inside a page that already has an `h1`, so the
   * level below that one is the level that does not leave a hole in heading
   * navigation. Under a section that already has its own `h2`, pass `3`.
   *
   * The default was `3` and fixed, which was wrong in the ordinary case and
   * impossible to correct — the documentation could name the rule but a caller
   * had no prop to follow it with. `2` is the common case rather than a
   * compromise, and it is optional rather than required because the correct
   * placement has one answer often enough that making every existing call site
   * restate it would buy nothing.
   *
   * The size does not follow the level. `title` renders at `--fs-sub` at every
   * level, because moving a state down the outline is a fact about the document
   * and not a request for smaller type.
   */
  level?: HeadingLevel
}

/**
 * A collection with nothing in it — yet.
 *
 * Distinct from `ErrorState`: nothing went wrong here, so the copy says what to
 * do rather than what failed. The two are different components because the
 * shared temptation — one component with a `variant` — produces error pages
 * that read like empty folders.
 *
 * @example
 * <EmptyState
 *   icon={Inbox}
 *   title="No projects yet"
 *   description="Create your first project to get started."
 *   action={<Button>New project</Button>}
 * />
 * @example
 * // Inside a section that already has its own heading.
 * <EmptyState level={3} title="No invoices yet" />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  level = 2,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center px-(--page-pad) py-20 text-center', className)}
      {...rest}
    >
      {Icon && (
        <span className="mb-6 flex size-14 items-center justify-center rounded-(--radius-pill) bg-(--stone) text-(--ink-3-aa)">
          <Icon size={24} aria-hidden />
        </span>
      )}
      <Heading level={level} size="sub">
        {title}
      </Heading>
      {description && (
        <p className="m-0 mt-2 max-w-sm text-sm leading-relaxed text-(--ink-3-aa)">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}

export default EmptyState
