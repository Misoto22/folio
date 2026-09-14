'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { WaterfallChart, formatNumber, type WaterfallStep } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

// `total` plants a bar on the baseline and sets the running figure. Here it is
// used twice in the middle, as subtotals: gross profit, then operating profit.
const steps: WaterfallStep[] = [
  { name: 'Revenue', value: 8400, type: 'total' },
  { name: 'COGS', value: -3100 },
  { name: 'Gross profit', type: 'total' },
  { name: 'Sales', value: -1450 },
  { name: 'R&D', value: -1900 },
  { name: 'G&A', value: -720 },
  { name: 'Operating profit', type: 'total' },
]

/**
 * type total plants a bar on the baseline and sets the running figure, and it is
 * used twice in the middle here — gross profit, then operating profit — so the
 * cascade restates itself where a reader would otherwise be adding five floating
 * lengths in their head. Neither subtotal carries a value, so neither can disagree
 * with the steps above it. Turn the connectors off and the same bars become a row
 * of lengths at unrelated heights, which is the argument for keeping them on and
 * also the argument for taking them off deliberately: where the order of the steps
 * is arbitrary, the connectors claim a sequence the data does not have.
 */
export function Example() {
  const [connectors, setConnectors] = useState(true)

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={connectors ? 'joined' : 'loose'}
          onValueChange={(next) => next && setConnectors(next === 'joined')}
          aria-label="Connectors"
        >
          <ToggleGroupItem value="joined">connectors</ToggleGroupItem>
          <ToggleGroupItem value="loose">bars only</ToggleGroupItem>
        </ToggleGroup>
      </ExampleControls>

      <WaterfallChart
        title="Operating profit bridge"
        data={steps}
        formatValue={formatNumber({ style: 'compact' })}
      >
        <WaterfallChart.Grid />
        <WaterfallChart.XAxis />
        <WaterfallChart.YAxis />
        <WaterfallChart.Tooltip />
        <WaterfallChart.Bars connectors={connectors} showValues />
      </WaterfallChart>
    </div>
  )
}
