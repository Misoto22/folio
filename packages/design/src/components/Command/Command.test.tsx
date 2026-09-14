import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { RiSettings3Line } from '@remixicon/react'
import { Command, CommandGroup, CommandItem, CommandList } from './Command'

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
