import {
  Alert,
  Badge,
  Button,
  ERROR_ACTION_CLASS,
  EmptyState,
  ErrorState,
  Separator,
  SkeletonBlock,
  SkeletonLine,
  SkeletonPage,
  SkeletonText,
} from '@misoto22/folio'
import { RiInboxLine } from '@remixicon/react'

/**
 * The three states of one screen, side by side.
 *
 * Not a screen itself — the only entry here that is a pattern rather than a
 * page — and it exists because of how these three get built. The loaded state
 * gets designed. The other three get added later, one at a time, by whoever
 * hit them, and are never again seen next to each other. That is how a codebase
 * ends up with a skeleton that is a different shape from the list it stands in
 * for, an empty state that is a dead end with no action on it, and an error
 * page that reads like an empty folder.
 *
 * Put beside each other, the three failures are obvious in a second:
 *
 *   the skeleton   must be the SHAPE of what replaces it. The one here is the
 *                  record list from the middle panel, at the same row height,
 *                  so the page does not jump out from under the reader when the
 *                  data lands. One pulse on the wrapper, not one per bar.
 *   the empty      is not an error. Nothing went wrong, so the copy says what
 *                  to do next and carries the control that does it. An empty
 *                  state with no action is a dead end.
 *   the error      is not an empty state. Something failed, the reader did not
 *                  cause it, and the way back is the one thing on the panel
 *                  that is not prose.
 *
 * `EmptyState` and `ErrorState` are two components rather than one with a
 * `variant`, and this is the template that shows why: they say different kinds
 * of thing, and a shared component makes the two copies converge.
 *
 * No state, so no `'use client'`. Every element is from the package.
 */
export function States() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-3 border-b border-(--rule) px-6 py-6">
        <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
          One screen, three states
        </h1>
        <p className="m-0 max-w-(--w-reading) text-sm leading-relaxed text-(--ink-2)">
          The same list of client projects while it is loading, when there is nothing in it, and
          when the request behind it failed. Built once each and then never compared — which is
          exactly why they are drawn together here.
        </p>
      </header>

      <div className="grid gap-5 p-6 @4xl:grid-cols-3">
        <section
          aria-labelledby="state-loading"
          className="flex flex-col rounded-(--radius) border border-(--rule)"
        >
          <div className="flex items-center justify-between gap-3 border-b border-(--rule) bg-(--paper-2) px-4 py-2.5">
            <h2 id="state-loading" className="m-0 eyebrow text-(--ink-2)">
              Loading
            </h2>
            <Badge tone="outline">Skeleton</Badge>
          </div>
          <div className="p-4">
            {/* The shape of the middle panel's list, not a generic stack of
                bars: two rows, a thumbnail, a title and two lines of summary,
                at the row height the real thing has. */}
            <SkeletonPage label="Loading client projects" className="flex flex-col gap-4">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex gap-3">
                  <SkeletonBlock className="size-12 shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <SkeletonLine className="h-2 w-16" />
                    <SkeletonBlock className="h-4 w-[min(100%,11rem)]" />
                    <SkeletonText lines={2} />
                  </div>
                </div>
              ))}
            </SkeletonPage>
          </div>
        </section>

        <section
          aria-labelledby="state-empty"
          className="flex flex-col rounded-(--radius) border border-(--rule)"
        >
          <div className="flex items-center justify-between gap-3 border-b border-(--rule) bg-(--paper-2) px-4 py-2.5">
            <h2 id="state-empty" className="m-0 eyebrow text-(--ink-2)">
              Empty
            </h2>
            <Badge tone="outline">EmptyState</Badge>
          </div>
          <EmptyState
            className="px-4 py-10"
            icon={RiInboxLine}
            title="No client projects yet"
            description="Everything you take on shows up here, with its brief, its files and whatever it was invoiced against. Start with the one already on your desk."
            action={<Button>New project</Button>}
          />
        </section>

        <section
          aria-labelledby="state-error"
          className="flex flex-col rounded-(--radius) border border-(--rule)"
        >
          <div className="flex items-center justify-between gap-3 border-b border-(--rule) bg-(--paper-2) px-4 py-2.5">
            <h2 id="state-error" className="m-0 eyebrow text-(--ink-2)">
              Failed
            </h2>
            <Badge tone="outline">ErrorState</Badge>
          </div>
          {/* `min-h-0 pt-0` because the component is built to fill a page and
              this is a panel. The copy says what failed and who it was — not
              "something went wrong", which tells the reader only that the
              product does not know either. */}
          <ErrorState
            className="min-h-0 pb-10 pt-0"
            code="503"
            heading="Projects could not be loaded"
            message="The project service did not answer in time. Nothing was lost and nothing was changed — this view is read-only until it comes back."
            action={
              <a href="#retry" className={ERROR_ACTION_CLASS}>
                Try again
              </a>
            }
          />
        </section>
      </div>

      <Separator />

      <div className="px-6 py-6">
        <Alert title="All three are announced, not just drawn">
          The skeleton is a <code className="font-mono text-xs">role=&quot;status&quot;</code> with
          one sentence saying what is loading, and its bars are hidden. The empty state and the
          error state are headings with real text under them. A reader who cannot see the panel
          still gets three different answers, which is the entire point of their being three
          components.
        </Alert>
      </div>
    </div>
  )
}
