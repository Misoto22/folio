import { Alert, Button } from '@misoto22/folio'

/**
 * The four tones, in the order they escalate. The tone is the message's
 * severity and not its decoration: danger carries role alert and interrupts
 * whatever the screen reader was saying, because what the reader is doing is
 * already failing, and the other three carry role status and wait for a pause.
 * Colour is doubled by the icon and by the words, so the meaning survives
 * monochrome printing and colour-blindness — which is what hideIcon takes away,
 * leaving the severity on a wash at 13 to 16 per cent alpha. Do not stack them
 * as a running log: five on a page are five live regions competing for one
 * speech queue, and the danger among them cuts off the four that explain it.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert title="Read-only mode">A migration is running; edits are paused until it finishes.</Alert>
      <Alert tone="success" title="Deployed">misoto22-site is live at commit a1b2c3d.</Alert>
      <Alert tone="warning" title="Token expires in 6 days">Rotate it before the next release.</Alert>
      <Alert
        tone="danger"
        title="Upload failed"
        action={<Button size="sm" variant="secondary">Try again</Button>}
      >
        The file exceeds the 25 MB limit.
      </Alert>
    </div>
  )
}
