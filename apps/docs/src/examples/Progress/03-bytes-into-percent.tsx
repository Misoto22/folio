import { Progress, Text } from '@misoto22/folio'

/**
 * The quantity belongs to the caller; the percentage belongs to the bar. Divide
 * at the call site, round it — the printed figure is rounded but aria-valuenow
 * is whatever number you passed, so an unrounded division announces fifteen
 * decimal places — and keep the real figures in the line underneath where the
 * reader can read them. There is no way to hand this component a total: value
 * is clamped to 100 whatever else is passed alongside it, so a bar told the
 * total is 500 paints itself full and announces a hundred of five hundred,
 * which is twenty per cent according to the only thing a screen reader can
 * read. Switch value back to null the moment the estimate stops being real: the
 * fill transitions its width, so a number that revises downward animates
 * backwards and the reader watches progress undo itself.
 */
export function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Progress
        value={Math.round((18.2 / 29.4) * 100)}
        label="Uploading footage.mov"
        showValue
      />
      <Text size="xs" tone="muted">
        18.2 MB of 29.4 MB
      </Text>
    </div>
  )
}
