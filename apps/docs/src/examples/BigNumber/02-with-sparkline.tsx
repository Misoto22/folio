'use client'

import { Card, CardBody } from '@misoto22/folio'
import { BigNumber, Sparkline } from '@misoto22/folio/charts'

const trend = [31, 28, 34, 30, 39, 44, 41, 48]

/**
 * The pairing every dashboard reaches for: the number answers how much, and the
 * run beneath it answers how it got there, without spending a whole panel on an
 * axis nobody reads off. children is where that run goes, under the label, the
 * number and the delta; the sparkline takes a label of its own because the heading
 * above it names a different fact. Reach for a LineChart the moment the shape has
 * to be read precisely — a sparkline has no axis to read it against, by design.
 */
export function Example() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <Card>
        <CardBody>
          <BigNumber
            label="Monthly revenue"
            value="$48,210"
            delta={{ value: 0.124, label: 'vs last month', intent: 'up-is-good' }}
          >
            <Sparkline label="Revenue, last eight months" data={trend} variant="area" />
          </BigNumber>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <BigNumber
            label="p95 latency"
            value="1.34s"
            delta={{ value: -0.29, label: 'vs last week', intent: 'down-is-good' }}
          >
            <Sparkline
              label="p95 latency, last eight weeks"
              data={[2.1, 2.0, 1.9, 2.2, 1.8, 1.6, 1.5, 1.34]}
              variant="bars"
            />
          </BigNumber>
        </CardBody>
      </Card>
    </div>
  )
}
