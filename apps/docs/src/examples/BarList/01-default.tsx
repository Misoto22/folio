'use client'

import { BarList } from '@misoto22/folio/charts'

const referrers = [
  { name: 'google.com', value: 42_100 },
  { name: 'github.com', value: 18_800 },
  { name: 'news.ycombinator.com', value: 9_400 },
  { name: 'x.com', value: 6_120 },
  { name: 'reddit.com', value: 3_280 },
  { name: 'lobste.rs', value: 1_940 },
  { name: 'bsky.app', value: 1_100 },
  { name: 'linkedin.com', value: 640 },
]

/**
 * The ranked list at its plainest: eight rows, with the bar drawn behind the name
 * rather than beside it. That is the thing a horizontal bar chart cannot do — it
 * spends a third of its width on a category axis, and matching a name on that axis
 * to its bar is two steps where reading the name off the bar is none. Rows are
 * sorted descending unless sort says otherwise, and the scale's ceiling comes from
 * the largest of them, so this list is readable on its own but not against a
 * second one.
 */
export function Example() {
  return <BarList label="Top referrers" showLabel items={referrers} />
}
