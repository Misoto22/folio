import { DevicePreview, DeviceRow, PreviewPair } from '@misoto22/folio/website'

/** A stand-in capture: page chrome and a few lines, in the page's own colours. */
function Screen({ width, height, label }: { width: number; height: number; label: string }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMin slice">
      <rect width={width} height={height} fill="var(--paper-2)" />
      <rect x={width * 0.08} y={height * 0.08} width={width * 0.5} height={height * 0.04} fill="var(--rule-2)" />
      <rect x={width * 0.08} y={height * 0.16} width={width * 0.84} height={height * 0.3} fill="var(--rule)" />
      <rect x={width * 0.08} y={height * 0.52} width={width * 0.7} height={height * 0.025} fill="var(--rule-2)" />
      <rect x={width * 0.08} y={height * 0.57} width={width * 0.6} height={height * 0.025} fill="var(--rule-2)" />
    </svg>
  )
}

/**
 * A desktop capture sits flat in a hairline frame with the phone capture over its lower corner, under one caption line.
 * The phone draws its own status bar; a row of phones keeps the bezel. The illustrations stand in for host screenshots.
 */
export function Example() {
  return (
    <div className="grid w-full gap-12">
      <PreviewPair
        desktop={<DevicePreview kind="browser" label="example.com/ask" caption="Desktop · an answer with its sources" media={<Screen width={1440} height={900} label="Desktop capture of the answer page" />} />}
        mobile={<DevicePreview kind="phone" caption="Phone · the same page" media={<Screen width={393} height={798} label="Phone capture of the answer page" />} />}
      />
      <DeviceRow label="The app on iPhone">
        <DevicePreview kind="phone" caption="Map" media={<Screen width={393} height={798} label="Map screen" />} />
        <DevicePreview kind="phone" caption="Trip" media={<Screen width={393} height={798} label="Trip screen" />} />
        <DevicePreview kind="phone" caption="Settings" statusBar={false} media={<Screen width={393} height={852} label="Settings screen, captured with its own status bar" />} />
      </DeviceRow>
    </div>
  )
}
