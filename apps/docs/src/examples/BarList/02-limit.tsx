'use client'

import { BarList } from '@misoto22/folio/charts'

const referrers = [
  { name: 'google.com', value: 42_100, href: 'https://google.com' },
  { name: 'github.com', value: 18_800, href: 'https://github.com' },
  { name: 'news.ycombinator.com', value: 9_400, href: 'https://news.ycombinator.com' },
  { name: 'x.com', value: 6_120 },
  { name: 'reddit.com', value: 3_280 },
  { name: 'lobste.rs', value: 1_940 },
  { name: 'bsky.app', value: 1_100 },
  { name: 'linkedin.com', value: 640 },
]

/**
 * limit keeps the top three and sums the remaining five into one Other row rather
 * than dropping them. A top three that silently discards the tail misstates the
 * whole and gives the reader no way to tell it happened; the Other row is what
 * keeps the column of numbers adding up to something. The three leading rows also
 * carry an href, which turns the name itself into the link — the bar is a
 * background on the same cell, so linking a row adds nothing extra for a screen
 * reader to walk past.
 */
export function Example() {
  return <BarList label="Top referrers" showLabel items={referrers} limit={3} />
}
