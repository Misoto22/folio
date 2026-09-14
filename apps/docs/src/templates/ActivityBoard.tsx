"use client";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Progress,
  StatusDot,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from "@misoto22/folio";
import {
  BarChart,
  BarList,
  BigNumber,
  type ChartConfig,
  LineChart,
} from "@misoto22/folio/charts";
import { useState } from "react";

/** Two named sets of repositories. Colour on this board means one thing: which. */
const LANES = [
  {
    name: "Platform",
    hue: "var(--series-1)",
    commits: 2462,
    opened: 2078,
    merged: 2003,
  },
  {
    name: "Side projects",
    hue: "var(--series-2)",
    commits: 2406,
    opened: 609,
    merged: 563,
  },
];

const TREND = [
  { bucket: "08-09", Platform: 373, "Side projects": 367 },
  { bucket: "08-14", Platform: 227, "Side projects": 276 },
  { bucket: "08-19", Platform: 193, "Side projects": 44 },
  { bucket: "08-24", Platform: 680, "Side projects": 195 },
  { bucket: "08-29", Platform: 414, "Side projects": 1045 },
  { bucket: "09-03", Platform: 575, "Side projects": 479 },
];

const TREND_SERIES = {
  Platform: { label: "Platform" },
  "Side projects": { label: "Side projects" },
} satisfies ChartConfig;

const SPEND = [
  { day: "09-01", agent: 312, batch: 96 },
  { day: "09-02", agent: 288, batch: 141 },
  { day: "09-03", agent: 96, batch: 38 },
  { day: "09-04", agent: 401, batch: 112 },
  { day: "09-05", agent: 355, batch: 88 },
  { day: "09-06", agent: 174, batch: 64 },
  { day: "09-07", agent: 442, batch: 173 },
];

const SPEND_SERIES = {
  agent: { label: "Agent (USD)" },
  batch: { label: "Batch (USD)" },
} satisfies ChartConfig;

const DAYS = [
  { day: "09-01", contributions: 214 },
  { day: "09-02", contributions: 122 },
  { day: "09-03", contributions: 38 },
  { day: "09-04", contributions: 641 },
  { day: "09-05", contributions: 330 },
  { day: "09-06", contributions: 238 },
  { day: "09-07", contributions: 401 },
];

const DAYS_SERIES = {
  contributions: { label: "Contributions" },
} satisfies ChartConfig;

const MEMBERS = [
  { lane: "Platform", login: "aoi", commits: 965, opened: 513, merged: 506 },
  { lane: "Platform", login: "kaede", commits: 782, opened: 830, merged: 782 },
  { lane: "Platform", login: "ren", commits: 690, opened: 703, merged: 689 },
  { lane: "Platform", login: "yuki", commits: 25, opened: 33, merged: 26 },
  {
    lane: "Side projects",
    login: "aoi",
    commits: 2406,
    opened: 609,
    merged: 563,
  },
];

const COLUMNS = [
  { key: "commits", label: "Commits" },
  { key: "opened", label: "Opened" },
] as const;

const AGES = [
  { name: "≤ 7d", value: 2 },
  { name: "8–14d", value: 16 },
  { name: "15–30d", value: 1 },
  { name: "31–90d", value: 3 },
  { name: "> 90d", value: 1 },
];

/** One scale per column across every lane, so the bars are comparable. */
const PEAK: Record<(typeof COLUMNS)[number]["key"], number> = {
  commits: Math.max(...MEMBERS.map((member) => member.commits)),
  opened: Math.max(...MEMBERS.map((member) => member.opened)),
};

/** A tile: a card that fills its grid cell and never grows the board. */
function Tile({
  className,
  title,
  note,
  children,
}: {
  className: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={`flex min-h-0 flex-col ${className}`}>
      <CardHeader className="shrink-0 gap-2 px-4 py-3">
        <CardTitle as="h3" className="text-sm whitespace-nowrap">
          {title}
        </CardTitle>
        {note ? (
          <Text size="xs" tone="muted" as="span" className="truncate">
            {note}
          </Text>
        ) : null}
      </CardHeader>
      <CardBody className="flex min-h-0 flex-1 flex-col p-0">
        {children}
      </CardBody>
    </Card>
  );
}

/**
 * A board, not a page.
 *
 * The console template is a column: components stacked under one another, each
 * as tall as it wants to be, and the page scrolls. This is the other shape a
 * console takes — one screen, fixed regions, nothing below the fold — and it is
 * a different test of the same set, because in a grid EVERY tile is handed a
 * height by the row rather than choosing one.
 *
 * That is where charts fail. A chart that sizes itself 16:9 looks correct in a
 * column and is wrong in a cell, and its empty state is wrong in a different
 * way again: the plot fills the cell and the "no data" box does not, so the
 * same tile reads at two heights depending on whether the query returned
 * anything. Everything here is measured by its cell.
 *
 * The second thing it tests is a board with more than one unit on it. Commits
 * split by lane because the reader asked two questions; spend does not, because
 * a cost that cannot be attributed must not be drawn as though it could. Saying
 * that in the tile's own note, rather than only in a caption somewhere, is the
 * honest version.
 *
 * Every element is from the package. Nothing was styled specially for the
 * template, which is the only way it stays honest as the system changes.
 */
export function ActivityBoard() {
  const [range, setRange] = useState("30d");
  const [sort, setSort] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "commits",
    direction: "descending",
  });

  const onSort = (key: string) =>
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "descending"
          ? "ascending"
          : "descending",
    }));
  const order = (rows: typeof MEMBERS) =>
    [...rows].sort((a, b) => {
      const flip = sort.direction === "ascending" ? -1 : 1;
      if (sort.key === "login") return -flip * a.login.localeCompare(b.login);
      return (
        flip *
        (Number(b[sort.key as "commits"]) - Number(a[sort.key as "commits"]))
      );
    });

  return (
    // The board is a board only where there is room for one. Below `@4xl` the
    // twelve columns collapse to one and the regions stack in reading order —
    // masthead, figures, attention, then the charts — because a grid that keeps
    // its columns on a phone is a page that scrolls sideways, and no amount of
    // it being the right layout on a laptop makes that acceptable.
    <div className="@container p-4">
      <div className="@4xl:grid-rows-[auto_auto_minmax(0,1.15fr)_minmax(0,1fr)] grid gap-3 @4xl:min-h-[42rem] @4xl:grid-cols-12">
        {/* The rule and the loading bar span the grid; the WORDS do not. Every
          tile under this row is a Card, so its title starts 13px in — a 1px
          border plus the header's own px-3 — and a masthead sitting flush
          against the grid edge hangs one line proud of the five titles beneath
          it. The inset is on the row rather than on the <header>, because
          `inset-x-0` resolves against the padding box: padding the header would
          have pulled the Progress in with the text and left its ends short of
          the rule it rides on. */}
        <header className="relative border-b-2 border-(--ink) pb-2 @4xl:col-span-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-[17px]">
            <h2 className="font-heading text-base font-semibold whitespace-nowrap">
              Activity
            </h2>
            <Text size="xs" tone="muted" as="span" className="whitespace-nowrap">
              Platform 4 members · Side projects 1 member
            </Text>
            <ToggleGroup
              type="single"
              value={range}
              aria-label="Time range"
              onValueChange={(next) => next && setRange(next)}
            >
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="30d">30d</ToggleGroupItem>
              <ToggleGroupItem value="90d">90d</ToggleGroupItem>
            </ToggleGroup>
            <div className="grow" />
            <span className="eyebrow inline-flex items-center gap-2 text-(--ink-3-aa)">
              <StatusDot tone="success" />
              Updated 45s ago
            </span>
            <Button variant="secondary" size="sm">
              Refresh
            </Button>
          </div>
          {/* Indeterminate on purpose: nothing here knows a percentage. It rides
            on the masthead's own rule, so the board does not move when it
            appears. */}
          <Progress
            label="Loading the window"
            className="absolute inset-x-0 -bottom-0.5 h-0.5"
          />
        </header>

        <div className="grid gap-3 @md:grid-cols-3 @4xl:col-span-8">
          {LANES.map((lane) => (
            <Card key={lane.name} className="px-4 py-3">
              <BigNumber
                label={
                  <span className="inline-flex items-center gap-1.5">
                    <i
                      aria-hidden
                      className="size-2 rounded-(--radius-sm)"
                      style={{ background: lane.hue }}
                    />
                    {lane.name} · commits
                  </span>
                }
                value={lane.commits.toLocaleString("en-US")}
              >
                <Text size="xs" tone="muted" className="truncate">
                  {lane.opened.toLocaleString("en-US")} opened ·{" "}
                  {lane.merged.toLocaleString("en-US")} merged
                </Text>
              </BigNumber>
            </Card>
          ))}
          <Card className="px-4 py-3">
            <BigNumber label="Token spend" value="$4.2k">
              <Text size="xs" tone="muted" className="truncate">
                65.0B tokens, all activity
              </Text>
            </BigNumber>
          </Card>
        </div>

        <Tile
          className="min-h-[26rem] @4xl:col-span-4 @4xl:row-span-3 @4xl:min-h-0"
          title="Needs attention"
          note="23 stalled · oldest 124d"
        >
          <div className="scroll-slim flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-1 pb-4">
            <Alert tone="danger" title="Weekly window at 100%">
              resets Sunday
            </Alert>
            <Alert tone="danger" title="4 stalled requests with checks failing">
              atlas#412, harbour#88, atlas#390
            </Alert>
            <Alert
              tone="warning"
              title="Idle 124 days: core primitives and scaffolding"
            >
              harbour#96
            </Alert>
            <Alert tone="info" title="1 request waiting on your review">
              atlas#22
            </Alert>
          </div>
          {/* Pinned rather than scrolled with the alerts: the shape of the backlog
            is the reading, and it is worthless below the fold. */}
          <div className="shrink-0 border-t border-(--rule) px-4 py-3">
            <BarList
              label="Stalled requests by age"
              showLabel
              sort={false}
              items={AGES}
            />
          </div>
        </Tile>

        <Tile
          className="min-h-[22rem] @4xl:col-span-5 @4xl:min-h-0"
          title="Commits over the window"
          note="6 buckets · 08-09 → 09-03"
        >
          <div className="flex min-h-0 flex-1 px-3 pb-3">
            <LineChart
              config={TREND_SERIES}
              data={TREND}
              xDataKey="bucket"
              title="Commits per lane across the window"
              className="min-h-0 flex-1"
            >
              <LineChart.Grid />
              <LineChart.XAxis dataKey="bucket" />
              <LineChart.YAxis />
              <LineChart.Tooltip />
              <LineChart.Legend isClickable />
              <LineChart.Line dataKey="Platform" isClickable />
              <LineChart.Line dataKey="Side projects" isClickable />
            </LineChart>
          </div>
        </Tile>

        <Tile
          className="min-h-[22rem] @4xl:col-span-3 @4xl:min-h-0"
          title="My days"
          note="1,984 contributions · peak 09-04"
        >
          <div className="flex min-h-0 flex-1 px-3 pb-3">
            <BarChart
              config={DAYS_SERIES}
              data={DAYS}
              xDataKey="day"
              title="Contributions per day"
              className="min-h-0 flex-1"
            >
              <BarChart.Grid />
              <BarChart.XAxis dataKey="day" minTickGap={28} />
              <BarChart.YAxis />
              <BarChart.Tooltip />
              <BarChart.Bar dataKey="contributions" />
            </BarChart>
          </div>
        </Tile>

        <Tile
          className="min-h-[20rem] @4xl:col-span-5 @4xl:min-h-0"
          title="By member"
          note="since 08-09"
        >
          {/* NO RESERVED SCROLLBAR GUTTER, on either scroller. `scroll-slim`
            sets `scrollbar-gutter: stable`, and this tile has two nested
            scrollers — this one and the Table's own region — so eleven pixels
            were held twice at the end edge while the start edge sat flush
            against the card. The rules and the lane bands stopped 22px short
            on one side and not at all on the other, which is the white strip.
            The list fits at every width the board gives it, so both gutters
            were holding room for a scrollbar that never arrives; where one
            does, it overlays. */}
          <div className="min-h-0 flex-1 overflow-y-auto pb-2 [&_.scroll-slim]:[scrollbar-gutter:auto]">
            <Table
              caption="Commits and requests per member, grouped by lane"
              density="compact"
              borders="rows"
              stickyHeader
              // Four pixels BETWEEN the columns and sixteen at the two outer
              // edges, rather than sixteen everywhere. A cell pays its padding
              // on both sides, so a uniform 16 was charged six times and put
              // the table's own minimum at 365 — wider than the 332 the mobile
              // frame gives it and the 344 it gets at the width the board
              // first takes its twelve columns. It scrolled sideways at both,
              // and the cut last column is the white strip that used to sit
              // against the card's edge. Charged only where it shows the
              // minimum is 317, the narrowest tile is 332, and the first cell
              // still starts on the line the tile's title starts on.
              className="[--table-pad-x:0.25rem] [&_td:first-child]:ps-4 [&_td:last-child]:pe-4 [&_th:first-child]:ps-4 [&_th:last-child]:pe-4"
            >
              <THead>
                <TR>
                  <TH
                    sortable
                    sortDirection={
                      sort.key === "login" ? sort.direction : "none"
                    }
                    onSort={() => onSort("login")}
                  >
                    Member
                  </TH>
                  {COLUMNS.map((column) => (
                    <TH
                      key={column.key}
                      align="end"
                      sortable
                      sortDirection={
                        sort.key === column.key ? sort.direction : "none"
                      }
                      onSort={() => onSort(column.key)}
                    >
                      {column.label}
                    </TH>
                  ))}
                </TR>
              </THead>
              {LANES.map((lane) => (
                <TBody key={lane.name}>
                  <TR>
                    <TD colSpan={COLUMNS.length + 1} className="bg-(--stone)">
                      <span className="eyebrow inline-flex items-center gap-1.5 text-(--ink-3-aa)">
                        <i
                          aria-hidden
                          className="size-2 rounded-(--radius-sm)"
                          style={{ background: lane.hue }}
                        />
                        {lane.name}
                      </span>
                    </TD>
                  </TR>
                  {order(
                    MEMBERS.filter((member) => member.lane === lane.name),
                  ).map((member) => (
                    <TR key={`${lane.name}/${member.login}`}>
                      <TD>
                        <span className="whitespace-nowrap">
                          {member.login}
                        </span>
                      </TD>
                      {COLUMNS.map((column) => (
                        <TD key={column.key} align="end">
                          {/* The bar and the number share a cell on one grid, so a
                            long number never pushes the bar into the column
                            beside it — the failure a bare percentage width has
                            the moment one row saturates the track. */}
                          <span
                            className="grid items-center gap-1.5"
                            style={{
                              gridTemplateColumns: "minmax(0,1fr) auto",
                            }}
                          >
                            <span
                              aria-hidden
                              className="h-1.5 rounded-(--radius-pill)"
                              style={{
                                background: lane.hue,
                                width: `${(member[column.key] / PEAK[column.key]) * 100}%`,
                                justifySelf: "end",
                              }}
                            />
                            <span className="tabular-nums">
                              {member[column.key].toLocaleString("en-US")}
                            </span>
                          </span>
                        </TD>
                      ))}
                    </TR>
                  ))}
                </TBody>
              ))}
            </Table>
          </div>
        </Tile>

        <Tile
          className="min-h-[22rem] @4xl:col-span-3 @4xl:min-h-0"
          title="Spend per day"
          note="all activity, not per lane"
        >
          <div className="flex min-h-0 flex-1 px-3 pb-3">
            <BarChart
              config={SPEND_SERIES}
              data={SPEND}
              xDataKey="day"
              stackType="stacked"
              title="Daily spend, agent stacked with batch"
              className="min-h-0 flex-1"
            >
              <BarChart.Grid />
              <BarChart.XAxis dataKey="day" minTickGap={28} />
              <BarChart.YAxis tickFormatter={(value) => `$${value}`} />
              <BarChart.Tooltip />
              <BarChart.Legend />
              <BarChart.Bar dataKey="agent" />
              <BarChart.Bar dataKey="batch" />
            </BarChart>
          </div>
        </Tile>
      </div>
    </div>
  );
}
