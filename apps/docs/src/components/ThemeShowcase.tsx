'use client'

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  Field,
  FigureBand,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectItem,
  Separator,
  StatusPill,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@misoto22/folio'
import { AreaChart, type ChartConfig } from '@misoto22/folio/charts'
import { RiSearchLine, RiShoppingBagLine } from '@remixicon/react'

/**
 * One screen, in whichever theme is on, and long enough to be worth reading.
 *
 * The page used to make its argument by repetition: eight small copies of the
 * same specimen, side by side, each one four hundred pixels wide. That proves
 * the themes DIFFER — which nobody doubted — and proves nothing about whether
 * any of them is a place you would want to work. A look is not a swatch; it is
 * what happens when a heading, a table, a form and a chart are all on screen
 * together and have to agree, and none of that is legible at thumbnail size.
 *
 * So there is one, at full width, with the furniture a real product actually
 * has: a storefront band, a checkout, an inventory table and a dashboard. The
 * rail on the left switches which theme it is drawn in. Everything here is from
 * the package — nothing was styled for this page, which is the only way it
 * stays honest when a token moves.
 */
const PRODUCTS = [
  { id: 'watch', name: 'Minimalist Watch', note: 'Clean design meets everyday durability.', price: '$248', tag: 'New' as const, tone: 'neutral' as const },
  { id: 'headphones', name: 'Wireless Headphones', note: 'Immersive sound, all-day comfort.', price: '$189', tag: 'Popular' as const, tone: 'success' as const },
  { id: 'backpack', name: 'Canvas Backpack', note: 'Water-resistant canvas, quiet profile.', price: '$96', tag: 'Limited' as const, tone: 'warning' as const },
]

const STOCK = [
  { name: 'Minimalist Watch', spec: 'Stainless steel, sapphire crystal', available: 42, aisle: 'Aisle 3', state: 'ok' as const },
  { name: 'Wireless Headphones', spec: 'ANC, 30hr battery', available: 128, aisle: 'Aisle 1', state: 'ok' as const },
  { name: 'Leather Wallet', spec: 'Full-grain, RFID blocking', available: 15, aisle: 'Aisle 4', state: 'low' as const },
  { name: 'Linen Throw', spec: 'Heavyweight, oat', available: 24, aisle: 'Aisle 6', state: 'low' as const },
]

const REVENUE = [
  { month: 'Apr', online: 12400, retail: 5200 },
  { month: 'May', online: 14100, retail: 5600 },
  { month: 'Jun', online: 13200, retail: 6400 },
  { month: 'Jul', online: 16800, retail: 6100 },
  { month: 'Aug', online: 15900, retail: 7300 },
  { month: 'Sep', online: 18200, retail: 7800 },
]

const CHART = { online: { label: 'Online' }, retail: { label: 'Retail' } } satisfies ChartConfig

export function ThemeShowcase() {
  return (
    // One frame, one ground, one corner. The bands inside are separated by the
    // theme's own rule rather than by gaps: a look is partly a claim about how
    // hard the lines between things are, and gaps do not carry that claim.
    <div className="@container overflow-hidden rounded-(--radius-frame) border border-(--rule-2) bg-(--paper)">
      <Storefront />
      <Separator />
      <Checkout />
      <Separator />
      <Inventory />
      <Separator />
      <Numbers />
    </div>
  )
}

/** The masthead and the shelf: headings, badges, prices, the buy button. */
function Storefront() {
  return (
    <section aria-label="Storefront" className="flex flex-col">
      <div className="flex items-center gap-3 border-b border-(--rule) px-5 py-3">
        <span className="font-heading text-[15px] text-(--ink)">Studio</span>
        <nav aria-label="Storefront sections" className="flex items-center gap-1 max-@lg:hidden">
          {['Shop', 'New In', 'Stories', 'Help'].map((label, index) => (
            <span
              key={label}
              aria-current={index === 0 ? 'true' : undefined}
              className="rounded-(--radius-pill) px-2.5 py-1 text-[13px] text-(--ink-3-aa) aria-[current]:bg-(--stone) aria-[current]:text-(--ink)"
            >
              {label}
            </span>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <Button iconOnly size="sm" variant="ghost" aria-label="Search the shop">
            <RiSearchLine size={15} aria-hidden />
          </Button>
          <Button iconOnly size="sm" variant="ghost" aria-label="Basket">
            <RiShoppingBagLine size={15} aria-hidden />
          </Button>
          <Button size="sm">Sign in</Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-5 pb-7 pt-9 text-center">
        <h3 className="m-0 max-w-[18ch] font-heading text-[length:var(--fs-display)] leading-tight font-normal text-(--ink)">
          Little joys, everywhere you go
        </h3>
        <p className="m-0 max-w-(--measure-record) text-sm leading-relaxed text-(--ink-3-aa)">
          The smallest details are the ones that matter most. Turn an ordinary day into something
          worth remembering.
        </p>
      </div>

      <div className="grid gap-4 px-5 pb-6 @xl:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {/* A ruled block rather than a photograph. The theme is the subject;
                a picture would carry its own colour into every specimen and be
                the loudest thing on the page in all eight of them. */}
            <div
              aria-hidden
              className="h-20 border-b border-(--rule) bg-[repeating-linear-gradient(135deg,var(--stone)_0,var(--stone)_10px,var(--paper)_10px,var(--paper)_20px)]"
            />
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-heading text-[15px] text-(--ink)">{product.name}</span>
                <Badge tone={product.tone}>{product.tag}</Badge>
              </div>
              <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">{product.note}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="mono-meta text-(--ink)">{product.price}</span>
                <Button size="sm" variant="secondary" className="ms-auto">
                  Add to cart
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}

/** The form half: fields, a radio column with prices, a tab strip, an alert. */
function Checkout() {
  return (
    <section aria-label="Checkout" className="grid gap-6 px-5 py-7 @xl:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h3 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
          Checkout
        </h3>
        <Field label="Email" required>
          <Input type="email" defaultValue="you@studio.com" readOnly />
        </Field>
        <Field label="Shipping method" hint="Delivery time varies with location.">
          <RadioGroup defaultValue="standard" aria-label="Shipping method">
            <RadioGroupItem value="economy">Economy — 5–7 business days · $12</RadioGroupItem>
            <RadioGroupItem value="standard">Standard — 3–5 business days · $16</RadioGroupItem>
            <RadioGroupItem value="express">Express — 1–2 business days · $24</RadioGroupItem>
          </RadioGroup>
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        {/* Each trigger owns a panel. A strip with no `TabsContent` under it
            points `aria-controls` at an id that does not exist, which axe
            fails as `aria-valid-attr-value` — and which is the honest reading:
            a tab that reveals nothing is a toggle wearing a tab's clothes. */}
        <Tabs defaultValue="card" aria-label="Payment method" className="flex flex-col gap-4">
          <TabsList>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="flex flex-col gap-4">
            <Field label="Card number">
              <Input defaultValue="4242 4242 4242 4242" readOnly />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry">
                <Input defaultValue="04 / 28" readOnly />
              </Field>
              <Field label="Country">
                <Select label="Country" defaultValue="au">
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                </Select>
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-(--ink-2)">
              <Checkbox defaultChecked />
              Save this card for one-click checkout
            </label>
          </TabsContent>

          <TabsContent value="wallet">
            <p className="m-0 text-[13px] leading-relaxed text-(--ink-3-aa)">
              You will be taken to your wallet to confirm. Nothing is charged here.
            </p>
          </TabsContent>

          <TabsContent value="invoice">
            <Field label="Purchase order" hint="Net 30, on approved accounts.">
              <Input defaultValue="PO-4417" readOnly />
            </Field>
          </TabsContent>
        </Tabs>
        <Button>Pay $248</Button>
        <Alert tone="info" title="Nothing is charged here">
          This is a specimen. Every control on it is the package&rsquo;s own, drawn by whichever
          theme is on.
        </Alert>
      </div>
    </section>
  )
}

/** The dense half: a toolbar, a table with a checkbox column, status marks. */
function Inventory() {
  return (
    <section aria-label="Inventory" className="flex flex-col gap-4 px-5 py-7">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
          Inventory
        </h3>
        <Badge tone="outline">4</Badge>
        <div className="ms-auto flex items-center gap-2">
          <Input aria-label="Search inventory" placeholder="Search…" className="w-44" />
          <Button size="sm" variant="secondary">
            Add item
          </Button>
        </div>
      </div>

      <Table caption="Stock on hand" borders="grid">
        <THead>
          <TR>
            <TH className="w-10">
              <Checkbox aria-label="Select every row" />
            </TH>
            <TH>Item</TH>
            <TH align="end">Available</TH>
            <TH>Location</TH>
            <TH>State</TH>
          </TR>
        </THead>
        <TBody>
          {STOCK.map((row) => (
            <TR key={row.name}>
              <TD className="align-middle">
                <Checkbox aria-label={`Select ${row.name}`} />
              </TD>
              <TD className="align-middle">
                <span className="flex flex-col">
                  <span className="text-(--ink)">{row.name}</span>
                  <span className="text-[12px] text-(--ink-3-aa)">{row.spec}</span>
                </span>
              </TD>
              <TD align="end" className="align-middle tabular-nums">
                {row.available}
              </TD>
              <TD className="align-middle mono-meta text-(--ink-3-aa)">{row.aisle}</TD>
              <TD className="align-middle">
                <StatusPill tone={row.state === 'low' ? 'warning' : 'success'}>
                  {row.state === 'low' ? 'Running low' : 'In stock'}
                </StatusPill>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </section>
  )
}

/** The reporting half: figures, a chart, an activity column. */
function Numbers() {
  return (
    <section aria-label="Reporting" className="flex flex-col gap-5 px-5 py-7">
      <FigureBand
        label="This month"
        scale="sub"
        figures={[
          { id: 'revenue', label: 'Revenue', value: '$26k', note: 'up 12% on August' },
          { id: 'orders', label: 'Orders', value: '318', note: '11 awaiting pick' },
          { id: 'returns', label: 'Returns', value: '2.4%', note: 'down from 3.1%' },
        ]}
      />

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <AreaChart title="Revenue by channel" config={CHART} data={REVENUE} xDataKey="month">
          <AreaChart.Grid />
          <AreaChart.XAxis dataKey="month" />
          <AreaChart.YAxis />
          <AreaChart.Legend />
          <AreaChart.Tooltip />
          <AreaChart.Area dataKey="online" />
          <AreaChart.Area dataKey="retail" variant="hatched" />
        </AreaChart>

        <div className="flex flex-col gap-3">
          <span className="eyebrow text-(--ink-3-aa)">Activity</span>
          <ul className="m-0 flex list-none flex-col gap-0 p-0">
            {[
              { id: '1043', what: 'Placed', when: '1:59 pm', amount: '+$248' },
              { id: '1041', what: 'Refunded', when: '12:40 pm', amount: '−$89' },
              { id: '1040', what: 'Placed', when: '10:30 am', amount: '+$156' },
              { id: '1038', what: 'Placed', when: '9:11 am', amount: '+$412' },
            ].map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-3 border-b border-(--rule) py-2.5 last:border-b-0"
              >
                <Avatar alt="" fallback={row.id.slice(-2)} size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] text-(--ink)">Order #{row.id}</span>
                  <span className="mono-meta text-(--ink-3-aa)">
                    {row.what} · {row.when}
                  </span>
                </span>
                <span className="ms-auto mono-meta text-(--ink-2)">{row.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
