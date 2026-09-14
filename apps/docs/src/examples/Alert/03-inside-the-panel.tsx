import { Alert, Button, Card, CardBody, CardHeader, CardTitle } from '@misoto22/folio'

/**
 * One panel failed; the rest of the page still works. This is the case a
 * full-screen ErrorState gets wrong — replacing the whole view throws away the
 * navigation the reader needed to get out of it, where an Alert inside the
 * panel keeps both the error and the way past it. Reach for the page-sized
 * state only when the page itself could not be shown. The tone here is warning
 * rather than danger for the same reason: nothing the reader did has failed,
 * and danger is assertive enough to interrupt whatever they were reading
 * elsewhere on the page.
 */
export function Example() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Deploy history</CardTitle>
      </CardHeader>
      <CardBody>
        <Alert
          tone="warning"
          title="History is unavailable"
          action={<Button size="sm" variant="secondary">Reload</Button>}
        >
          The build log service did not answer. Everything else on this page is current.
        </Alert>
      </CardBody>
    </Card>
  )
}
