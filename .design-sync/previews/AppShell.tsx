import { AppShell, NavItem, Button, Card, CardBody, Badge, Tag, StatusDot } from '@misoto22/folio'
import { RiBriefcaseLine, RiCameraLine, RiDashboardLine, RiGitRepositoryLine, RiMusic2Line, RiPencilLine } from '@remixicon/react'

// Real misoto22-site content: the projects table (title/category/technologies/
// is_private) is one of the 8 Postgres tables the site manages. These three are
// the seeded projects — the admin console edits exactly this shape.
const PROJECTS = [
  {
    title: 'Efision ERP',
    description: 'A Rust CLI ERP system built on clean architecture.',
    category: 'Backend',
    tech: ['Rust', 'SQL Server'],
    meta: 'Live',
  },
  {
    title: 'Dealer Portal',
    description: 'A Django + DRF portal over a legacy database.',
    category: 'Fullstack',
    tech: ['Python', 'Django'],
    meta: 'Live',
  },
  {
    title: 'Personal Website',
    description: 'This bilingual portfolio, self-hosted on Docker.',
    category: 'Frontend',
    tech: ['Next.js', 'TypeScript'],
    meta: 'misoto22.com',
  },
]

export function ProjectsAdmin() {
  return (
    <AppShell
      brand={<strong style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>misoto22</strong>}
      sidebar={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavItem href="#" icon={RiDashboardLine}>Dashboard</NavItem>
          <NavItem href="#" icon={RiGitRepositoryLine} active>Projects</NavItem>
          <NavItem href="#" icon={RiCameraLine}>Photography</NavItem>
          <NavItem href="#" icon={RiPencilLine}>Blog</NavItem>
          <NavItem href="#" icon={RiBriefcaseLine}>Experience</NavItem>
          <NavItem href="#" icon={RiMusic2Line}>Music</NavItem>
        </nav>
      }
      topbar={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span className="eyebrow" style={{ color: 'var(--secondary-text)' }}>Projects</span>
          <Button>New project</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, margin: '0 0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 1.1, margin: 0, color: 'var(--foreground)' }}>
          Projects
        </h1>
        <span className="mono-meta" style={{ color: 'var(--secondary-text)' }}>3 published · sorted by order</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROJECTS.map((p) => (
          <Card key={p.title}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--foreground)' }}>{p.title}</span>
                    <Badge>{p.category}</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--secondary-text)', marginBottom: 12 }}>{p.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {p.tech.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 8, fontSize: 12, color: 'var(--secondary-text)' }}>
                      <StatusDot size="sm" /> {p.meta}
                    </span>
                  </div>
                </div>
                <Button variant="secondary">Edit</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}
