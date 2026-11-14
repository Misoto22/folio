import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Settings as SettingsIcon } from '../../icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './DropdownMenu'

function open(children: React.ReactNode) {
  return render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Account</DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>,
  )
}

/**
 * `icon` meant opposite things one import apart: `DropdownMenuItem.icon` and
 * `ContextMenuItem.icon` took the icon COMPONENT and rendered it themselves,
 * while `CommandItem.icon` took the rendered element. Same prop name, same
 * group of components, inverted contract — and the wrong one does not fail a
 * type check into anything a reader can act on, it fails at render.
 */
describe('DropdownMenuItem icon', () => {
  it('takes the component, which is what the type has always said', () => {
    const { baseElement } = open(<DropdownMenuItem icon={SettingsIcon}>Settings</DropdownMenuItem>)
    expect(baseElement.querySelector('svg')).not.toBeNull()
  })

  it('takes the element too, so the near-miss is no longer a crash', () => {
    const { baseElement } = open(
      <DropdownMenuItem icon={<SettingsIcon size={16} />}>Settings</DropdownMenuItem>,
    )
    expect(baseElement.querySelector('svg')).not.toBeNull()
  })
})

/**
 * The eyebrow over a group of rows was visual only.
 *
 * Radix's `MenuLabel` is a bare `<div>` — no role, no `aria-labelledby` wiring
 * — and `MenuGroup`, which does carry `role="group"`, was not re-exported by
 * this package at all. So a sighted reader saw three labelled sections and a
 * screen-reader user got one undifferentiated list of items.
 */
describe('DropdownMenuGroup', () => {
  it('segments the menu with a real group', () => {
    open(
      <DropdownMenuGroup label="Account">
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuGroup>,
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('names the group with the eyebrow the reader can see', () => {
    open(
      <DropdownMenuGroup label="Account">
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuGroup>,
    )
    expect(screen.getByRole('group')).toHaveAccessibleName('Account')
  })

  it('keeps the bare label available for a group that needs no heading', () => {
    open(<DropdownMenuLabel>Signed in as ada@example.com</DropdownMenuLabel>)
    expect(screen.getByText('Signed in as ada@example.com')).toBeInTheDocument()
  })
})
