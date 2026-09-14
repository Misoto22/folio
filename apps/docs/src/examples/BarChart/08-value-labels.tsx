'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/folio'
import { BarChart, type ChartConfig, type ValueLabelMode } from '@misoto22/folio/charts'
import { useState } from 'react'
import { ExampleControls } from '@/components/ExampleControls'

const data = [
  { month: 'Jan', desktop: 1860 },
  { month: 'Feb', desktop: 30500 },
  { month: 'Mar', desktop: 23700 },
  { month: 'Apr', desktop: 27300 },
  { month: 'May', desktop: 9200 },
  { month: 'Jun', desktop: 31400 },
]

const config = { desktop: { label: 'Desktop' } } satisfies ChartConfig

const MODES: ValueLabelMode[] = ['last', 'first-last', 'extremes', 'all']

/**
 * Printing the numbers on the marks, and how few of them to print. A number on
 * every point is the most common way a chart is spoiled — the labels compete with
 * the shape they annotate and the reader loses both — so the default is last, the
 * one value a reader would otherwise trace back to the axis for. extremes is what
 * "which month was worst" actually asks; all earns its place only where five or
 * six bars and their exact figures are the whole point, past which it is a table
 * wearing a chart.
 */
export function Example() {
  const [show, setShow] = useState<ValueLabelMode>('last')

  return (
    <div className="flex w-full flex-col gap-4">
      <ExampleControls>
        <ToggleGroup
          type="single"
          value={show}
          onValueChange={(next) => next && setShow(next as ValueLabelMode)}
          aria-label="Which points are labelled"
        >
          {MODES.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ExampleControls>

      <BarChart title="Visitors by month" config={config} data={data}>
        <BarChart.Grid />
        <BarChart.XAxis dataKey="month" />
        {/* The value axis compacts itself above four digits: 30.5K rather than
            30,500, which is the same fact in half the width. */}
        <BarChart.YAxis label="Visitors" />
        <BarChart.Bar dataKey="desktop" variant="stripped">
          <BarChart.Values show={show} />
        </BarChart.Bar>
      </BarChart>
    </div>
  )
}
