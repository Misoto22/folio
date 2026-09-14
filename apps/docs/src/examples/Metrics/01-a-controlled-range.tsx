'use client'

import { useState } from 'react'
import { MetricsList, MetricsPanel, MetricsPanelGrid, MetricsRange, MetricsSection } from '@misoto22/folio/website'

/**
 * The selected range and already-formatted readings remain in application state.
 * Named panels can contain lists, tables or charts from a separately chosen renderer.
 */
export function Example() {
  const [range, setRange] = useState('week')
  return (
    <MetricsSection title="Library activity" caption="Sample data"
      action={<MetricsRange label="Period" value={range} onChange={setRange} options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />}>
      <MetricsPanelGrid>
        <MetricsPanel title="Reading"><MetricsList label="Reading totals" empty="No readings" items={[
          { id: 'articles', label: 'Articles opened', value: range === 'week' ? '24' : '96' },
          { id: 'minutes', label: 'Minutes reading', value: range === 'week' ? '180' : '720' },
        ]} /></MetricsPanel>
        <MetricsPanel title="Collection"><MetricsList label="Collection totals" empty="No records" items={[
          { id: 'saved', label: 'Saved records', value: range === 'week' ? '7' : '28' },
          { id: 'notes', label: 'Notes written', value: range === 'week' ? '3' : '12' },
        ]} /></MetricsPanel>
      </MetricsPanelGrid>
    </MetricsSection>
  )
}
