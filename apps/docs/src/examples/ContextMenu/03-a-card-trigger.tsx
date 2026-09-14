'use client'

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Badge,
} from '@misoto22/folio'
import { RiExternalLinkLine, RiPushpinLine, RiResetLeftLine } from '@remixicon/react'

/**
 * asChild hands Radix the Card itself. Without it Radix inserts a span between
 * the trigger and the child, and that span becomes the grid item while the card
 * is laid out inside it as inline content — a layout that looks broken for a
 * reason nothing on the page points at. The menu is modal, so the page behind
 * is scroll-locked and pointer-inert while it is open: right for a short list
 * of actions on one object, wrong for anything the reader has to scroll the
 * page to answer.
 */
export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle as="h3">api.misoto22.com</CardTitle>
            <Badge tone="success">live</Badge>
          </CardHeader>
          <CardBody>
            Deployed from main four minutes ago. Right-click the card for its actions.
          </CardBody>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={RiExternalLinkLine}>Open the deployment</ContextMenuItem>
        <ContextMenuItem icon={RiPushpinLine}>Pin to the dashboard</ContextMenuItem>
        <ContextMenuItem icon={RiResetLeftLine} destructive>Roll back to the previous build</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
