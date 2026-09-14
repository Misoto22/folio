'use client'

import { Facet, Sparkline } from '@misoto22/folio/charts'

/** Deterministic, so the server and the client draw the same thing. */
const WOBBLE = [0.62, 0.58, 0.71, 0.66, 0.8, 0.88, 0.95, 1]

const CHANNELS: [name: string, peak: number][] = [
  ['Organic search', 6400],
  ['Direct', 2150],
  ['Paid search', 2100],
  ['Referral', 1400],
  ['Email', 640],
  ['Social', 410],
  ['Affiliate', 320],
  ['Display', 260],
  ['Podcast', 180],
  ['Newsletter', 140],
  ['Partner', 110],
  ['Print QR', 70],
  ['Events', 55],
  ['SMS', 30],
]

const ROWS = CHANNELS.flatMap(([channel, peak]) =>
  WOBBLE.map((factor, index) => ({
    month: `M${index + 1}`,
    channel,
    visitors: Math.round(peak * factor),
  })),
)

const TOP_FOUR = ROWS.filter((row) =>
  ['Organic search', 'Direct', 'Referral', 'Social'].includes(row.channel),
)

/** A run of numbers, drawn against whatever domain the panel was handed. */
function Panel({
  name,
  values,
  domain,
}: {
  name: string
  values: number[]
  domain: [number, number]
}) {
  return (
    <Sparkline
      label={`${name}, eight months`}
      data={values}
      domain={domain}
      height={44}
      value={values.at(-1)?.toLocaleString()}
    />
  )
}

/**
 * Two grids one prop apart, and then the cap. On the right every panel fills
 * its own box, so Social — which never clears 410 — draws the same climb as
 * Organic's 6,400: not a harder comparison but a false one, and nothing on the
 * page admits it, which is why scales independent is never the safe answer.
 * Below, fourteen channels drawn as six panels and an Other — sort last orders
 * them by where each ended up, limit caps the grid before it becomes fourteen
 * postage stamps, and overflow fold sums the tail into that last panel so the
 * total stays true. Either way the grid prints a line under itself saying what
 * it left out, because a grid that quietly stops at six is a grid the reader
 * cannot audit.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="grid gap-8 md:grid-cols-2">
        <Facet
          title="Visitors by channel, shared scale"
          showTitle
          description="scales=&quot;shared&quot; — the default"
          data={TOP_FOUR}
          by="channel"
          value="visitors"
          xDataKey="month"
          columns={1}
          hideDataTable
        >
          {(panel) => (
            <Panel
              name={panel.name}
              values={panel.rows.map((row) => row.visitors)}
              domain={panel.domain}
            />
          )}
        </Facet>

        <Facet
          title="Visitors by channel, independent scales"
          showTitle
          description="scales=&quot;independent&quot; — every panel lies about its size"
          data={TOP_FOUR}
          by="channel"
          value="visitors"
          xDataKey="month"
          scales="independent"
          columns={1}
          hideDataTable
        >
          {(panel) => (
            <Panel
              name={panel.name}
              values={panel.rows.map((row) => row.visitors)}
              domain={panel.domain}
            />
          )}
        </Facet>
      </div>

      <Facet
        title="Visitors by channel, top six"
        showTitle
        description="Fourteen channels, sorted by where each ended up"
        data={ROWS}
        by="channel"
        value="visitors"
        xDataKey="month"
        sort="last"
        limit={6}
        overflow="fold"
        columns={3}
      >
        {(panel) => (
          <Panel
            name={panel.name}
            values={panel.rows.map((row) => row.visitors)}
            domain={panel.domain}
          />
        )}
      </Facet>
    </div>
  )
}
