import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '@misoto22/folio'

/**
 * One small screen, rendered once per theme.
 *
 * Deliberately not a colour swatch: a theme that only changed hues would look
 * fine as five squares, and the point of this page is that the corners, the
 * rules, the face and the row height move too. Those only show on real
 * furniture, so this carries the pieces that read them — a bordered card, a
 * ruled table, a control with a radius, and a heading in whichever face the
 * theme picked.
 */
export function ThemeSpecimen() {
  return (
    <div className="relative flex flex-col gap-4 bg-(--paper) p-4">
      {/* A panel resting OVER the card, drawn from the floating-surface tokens.
          It is here because one theme is about what happens behind a surface
          that floats, and a specimen made only of things sitting IN the page
          would show that theme as identical to the one beside it. Static, not a
          real menu: the specimen is inert, and a popover nobody can open is a
          picture of one. */}
      <div
        aria-hidden
        className="pointer-events-none absolute end-3 bottom-12 z-1 flex w-32 flex-col gap-1 rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) p-1.5 panel-blur"
      >
        <span className="rounded-(--radius-row) bg-(--stone) px-2.5 py-1.5 text-[12px] text-(--ink)">
          Re-run
        </span>
        <span className="px-2.5 py-1.5 text-[12px] text-(--ink-2)">Roll back</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Deploys</CardTitle>
          <Badge tone="success">passing</Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <Table caption="Recent deploys" borders="grid" density="compact">
            <THead>
              <TR>
                <TH>Branch</TH>
                <TH align="end">Build</TH>
              </TR>
            </THead>
            <TBody>
              <TR>
                <TD>main</TD>
                <TD align="end" className="tabular-nums">2m 14s</TD>
              </TR>
              <TR>
                <TD>codex/themes</TD>
                <TD align="end" className="tabular-nums">1m 02s</TD>
              </TR>
            </TBody>
          </Table>
          <Input aria-label="Filter" placeholder="branch…" />
          <label className="flex items-center gap-2.5 text-[13px] text-(--ink-2)">
            <Switch defaultChecked aria-label="Notify on failure" />
            Notify on failure
          </label>
        </CardBody>
      </Card>
      <div className="flex gap-2">
        <Button size="sm">Deploy</Button>
        <Button size="sm" variant="secondary">
          History
        </Button>
      </div>
    </div>
  )
}
