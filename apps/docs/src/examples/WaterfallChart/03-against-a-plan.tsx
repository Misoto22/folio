'use client'

import { WaterfallChart, formatNumber, type WaterfallStep } from '@misoto22/folio/charts'

const steps: WaterfallStep[] = [
  { name: 'H1 actual', value: 5200, type: 'total' },
  { name: 'New business', value: 1420 },
  { name: 'Expansion', value: 780 },
  { name: 'Discounts', value: -260 },
  { name: 'Churn', value: -940 },
  { name: 'H2 actual', type: 'total' },
]

/** What the plan said H2 would close at. The bridge closed under it. */
const PLAN = 6800

/**
 * The closing bar says where the total landed; it does not say whether that was
 * where the plan said it would. A reference line draws that one number across
 * the cascade, above the bars rather than behind them — a target a bar covers is
 * a target nobody can check — and it extends the axis to fit rather than being
 * discarded, which is what makes it visible here, since the plan sits above
 * every bar in the chart. weight firm is solid ink, for the one threshold a
 * chart is actually about; the quiet default is a dashed hairline, for context
 * that has to be present and clearly not data.
 */
export function Example() {
  return (
    <WaterfallChart
      title="ARR bridge against plan, H1 to H2"
      showTitle
      description="Thousands of AUD. The steps are simultaneous; the order is editorial."
      data={steps}
      formatValue={formatNumber({ style: 'compact' })}
    >
      <WaterfallChart.Grid />
      <WaterfallChart.XAxis />
      <WaterfallChart.YAxis label="ARR" />
      <WaterfallChart.ReferenceLine y={PLAN} label="Plan" weight="firm" />
      <WaterfallChart.Tooltip />
      <WaterfallChart.Bars showValues />
    </WaterfallChart>
  )
}
