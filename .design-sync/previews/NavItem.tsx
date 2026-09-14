import { NavItem } from '@misoto22/folio'
import { RiDashboardLine, RiFileTextLine, RiImageLine, RiSettings3Line } from '@remixicon/react'

export function ActiveAndDefault() {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
      <NavItem href="#" icon={RiDashboardLine} active>
        Dashboard
      </NavItem>
      <NavItem href="#" icon={RiFileTextLine}>
        Posts
      </NavItem>
      <NavItem href="#" icon={RiImageLine}>
        Media
      </NavItem>
      <NavItem href="#" icon={RiSettings3Line}>
        Settings
      </NavItem>
    </nav>
  )
}
