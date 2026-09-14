import { Progress } from '@misoto22/folio'

/**
 * A bar with a real fraction, and its name on screen. showValue is the only
 * thing that prints label: without it the name exists solely as aria-label, and
 * a sighted reader is left with an unlabelled 4px rule and no number. value is
 * a percentage and nothing else — the component clamps to 0 and 100 in silence,
 * so a total that was underestimated parks the bar at 100% for the rest of the
 * operation rather than admitting the estimate was wrong. className styles the
 * column, not the track, so a height utility passed there stretches the wrapper
 * and leaves the 4px bar exactly where it was.
 */
export function Example() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={62} label="Uploading photos" showValue />
    </div>
  )
}
