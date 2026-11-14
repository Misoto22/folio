import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Copy as CopyIcon } from '../../icons'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ContextMenu'

/** Radix opens a context menu on a real contextmenu event, not on a click. */
function open(children: React.ReactNode) {
  const result = render(
    <ContextMenu>
      <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
      <ContextMenuContent>{children}</ContextMenuContent>
    </ContextMenu>,
  )
  fireEvent.contextMenu(screen.getByText('Right-click me'), { clientX: 10, clientY: 10 })
  return result
}

/** The same inverted `icon` contract as `DropdownMenuItem`, one file over. */
describe('ContextMenuItem icon', () => {
  it('takes the component', () => {
    const { baseElement } = open(<ContextMenuItem icon={CopyIcon}>Copy</ContextMenuItem>)
    expect(baseElement.querySelector('svg')).not.toBeNull()
  })

  it('takes the element too', () => {
    const { baseElement } = open(<ContextMenuItem icon={<CopyIcon size={16} />}>Copy</ContextMenuItem>)
    expect(baseElement.querySelector('svg')).not.toBeNull()
  })
})

describe('ContextMenuGroup', () => {
  it('segments the menu with a real group, named by its eyebrow', () => {
    open(
      <ContextMenuGroup label="Edit">
        <ContextMenuItem>Copy</ContextMenuItem>
      </ContextMenuGroup>,
    )
    expect(screen.getByRole('group')).toHaveAccessibleName('Edit')
  })
})
