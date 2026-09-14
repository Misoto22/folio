import { Card, CardHeader, CardTitle, CardBody, CardFooter, Button, Badge } from '@misoto22/folio'

export function Basic() {
  return (
    <Card style={{ maxWidth: 420 }}>
      <CardBody>
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14 }}>
          A quiet surface for grouped content — the building block for panels and list rows.
        </p>
      </CardBody>
    </Card>
  )
}

export function WithHeaderAndFooter() {
  return (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>Building a private blog</CardTitle>
        <Badge>Draft</Badge>
      </CardHeader>
      <CardBody>
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14, lineHeight: 1.6 }}>
          Notes on gating private posts behind a global password while keeping the
          rest of the blog public and statically rendered.
        </p>
      </CardBody>
      <CardFooter>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--secondary-text)' }}>Edited 2 minutes ago</span>
          <Button variant="secondary">Edit</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
