import { Slot } from '@radix-ui/react-slot'
import type { IconComponent } from '../../icons'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface NavItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  href: string
  /** Optional leading icon component, such as a glyph from `@misoto22/folio/icons`, rendered at 18px. */
  icon?: IconComponent
  /** Marks the current route. Also sets `aria-current="page"`. */
  active?: boolean
  /**
   * Hand the styling to a router's own `Link` instead of a native `<a>`.
   *
   * The slotted child receives the classes and `aria-current`, and becomes the
   * row — so `icon` is not rendered in this mode; put it inside the child.
   */
  asChild?: boolean
  children: ReactNode
  className?: string
}

/**
 * A row in a sidebar.
 *
 * `aria-current="page"` and not only a colour: the active row has to be
 * identifiable to a reader who cannot see that it is darker. In this system it
 * is also carried by weight and by a filled ground, so it survives monochrome
 * printing and low contrast.
 *
 * Framework-agnostic. `asChild` is how a Next or React Router app gets
 * client-side navigation without this package importing either.
 *
 * @example
 * <NavItem href="/components/button" icon={Square} active>Button</NavItem>
 * @example
 * <NavItem asChild href="/work"><Link href="/work">Work</Link></NavItem>
 */
export function NavItem({
  href,
  icon: Icon,
  active = false,
  asChild = false,
  children,
  className,
  ...rest
}: NavItemProps) {
  const cls = cn(
    'flex min-h-(--control-h-sm) items-center gap-2.5 rounded-(--radius-sm) px-2.5 py-1.5 text-sm transition-colors duration-(--duration-fast)',
    active
      ? 'bg-(--stone) font-medium text-(--ink)'
      : 'text-(--ink-3-aa) hover:bg-(--stone) hover:text-(--ink)',
    className,
  )

  if (asChild) {
    // Slot demands exactly ONE child, and `{Icon && …}` is a second one the
    // moment `icon` is omitted — which is how a whole sidebar of slotted rows
    // failed to render at all. So a slotted row takes its icon inside the child
    // it was handed, and this branch passes `children` through untouched.
    return (
      <Slot aria-current={active ? 'page' : undefined} className={cls} {...rest}>
        {children}
      </Slot>
    )
  }

  return (
    <a href={href} aria-current={active ? 'page' : undefined} className={cls} {...rest}>
      {Icon && <Icon size={18} aria-hidden className="shrink-0" />}
      {children}
    </a>
  )
}

export default NavItem
