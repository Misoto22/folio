import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RiSettings3Line } from '@remixicon/react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  type CommandDialogProps,
} from './Command'

/** A dialog palette behind a plain button — no `DialogTrigger`, as a shortcut-opened one has. */
function DialogPalette(props: Omit<CommandDialogProps, 'open' | 'onOpenChange' | 'label' | 'children'>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <CommandDialog open={open} onOpenChange={setOpen} label="Command palette" {...props}>
        <CommandInput />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandItem value="components">Components</CommandItem>
        </CommandList>
      </CommandDialog>
    </>
  )
}

describe('CommandDialog', () => {
  it('filters rows against the input by default', async () => {
    const user = userEvent.setup()
    render(<DialogPalette />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
    await user.type(screen.getByRole('combobox', { name: 'Command palette' }), 'zzz')
    expect(screen.queryByRole('option', { name: 'Components' })).not.toBeInTheDocument()
    expect(screen.getByText('Nothing matches.')).toBeVisible()
  })

  it('names the field apart from the dialog with inputLabel', async () => {
    const user = userEvent.setup()
    render(<DialogPalette inputLabel="Search commands" />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Search commands' })).toHaveFocus()
  })

  it('leaves rows a host already filtered alone with shouldFilter={false}', async () => {
    const user = userEvent.setup()
    render(<DialogPalette shouldFilter={false} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.type(screen.getByRole('combobox', { name: 'Command palette' }), 'zzz')
    expect(screen.getByRole('option', { name: 'Components' })).toBeVisible()
  })

  it('stays open when onEscapeKeyDown prevents the default', async () => {
    const user = userEvent.setup()
    const escaped = vi.fn((event: KeyboardEvent) => event.preventDefault())
    render(<DialogPalette onEscapeKeyDown={escaped} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.keyboard('{Escape}')
    expect(escaped).toHaveBeenCalledOnce()
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
  })

  it('hands focus in and back through the focus handlers', async () => {
    const user = userEvent.setup()
    const opened = vi.fn()
    let trigger: HTMLElement | null = null
    const closed = vi.fn((event: Event) => {
      event.preventDefault()
      trigger?.focus()
    })
    render(<DialogPalette onOpenAutoFocus={opened} onCloseAutoFocus={closed} />)
    trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)
    expect(opened).toHaveBeenCalledOnce()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(closed).toHaveBeenCalledOnce()
    expect(trigger).toHaveFocus()
  })
})

function palette(children: React.ReactNode) {
  return render(
    <Command label="Command palette">
      <CommandList>
        <CommandGroup heading="Navigate">{children}</CommandGroup>
      </CommandList>
    </Command>,
  )
}

/**
 * The other end of the `icon` mismatch. `CommandItem.icon` is a `ReactNode` and
 * documents "pass the icon element"; the two menu items one import away take
 * the component. Both spellings now work in all three, so the near-miss that
 * used to render nothing — or throw — costs nothing to correct.
 */
describe('CommandItem icon', () => {
  it('takes the element, which is what the type has always said', () => {
    const { container } = palette(<CommandItem icon={<RiSettings3Line size={16} />}>Settings</CommandItem>)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('takes the component too', () => {
    const { container } = palette(<CommandItem icon={RiSettings3Line}>Settings</CommandItem>)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})

/**
 * The active row's leading accent bar is an absolutely-positioned `::before`,
 * which a rounded parent does not clip on its own — only `overflow-hidden` on
 * the row makes the bar follow `--radius-row` instead of sticking out past it
 * at a large radius. Asserting the class rather than a rendered geometry is
 * what the rest of this file already does for the icon prop, and it is the
 * one guarantee that survives a Tailwind class reorder.
 */
describe('CommandItem accent bar', () => {
  it('clips the row to its own radius, so the bar cannot outgrow a rounded corner', () => {
    const { container } = palette(<CommandItem>Settings</CommandItem>)
    const item = container.querySelector('[cmdk-item]')
    expect(item?.className).toContain('overflow-hidden')
  })
})
