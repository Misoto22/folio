import { RiDeleteBinLine, RiFileCopyLine, RiInboxLine, RiSettings3Line } from '@remixicon/react'
import type { ReactElement } from 'react'
import {
  Accordion,
  AccordionItem,
  Alert,
  AppShell,
  Article,
  AspectRatio,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CollapsibleSection,
  Code,
  CodeBlock,
  ColorPicker,
  Combobox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DatePicker,
  DescriptionList,
  Diagram,
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  ERROR_ACTION_CLASS,
  ErrorState,
  Field,
  FigureBand,
  Heading,
  FloatingIconButton,
  Input,
  Kbd,
  LinkArrow,
  Markdown,
  Metric,
  NavItem,
  NumberField,
  PageHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  NativeSelect,
  ScrollArea,
  SearchableMenu,
  Select,
  SelectItem,
  Separator,
  Sidebar,
  SidebarBranch,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
  Slider,
  SkeletonBlock,
  SkeletonLine,
  SkeletonPage,
  Spinner,
  StatusDot,
  StatusPill,
  Steps,
  Switch,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Text,
  Textarea,
  Timestamp,
  Toolbar,
  ToggleGroup,
  ToggleGroupItem,
  Toaster,
  Tooltip,
  TooltipProvider,
} from '../index'

/**
 * One representative render per component, in a shape a real call site would
 * use — a labelled control, a table with a caption, a dialog that is open.
 *
 * This is the fixture three suites share: the axe pass, the server-render pass,
 * and the keyboard pass. That is the point. Thirty-six near-identical test
 * files would each have drifted into testing something slightly different;
 * one fixture means "every component is checked" is a property the repository
 * can enforce rather than a claim a reviewer has to audit.
 *
 * `coverage.test.ts` fails when a component directory has no entry here, so a
 * new component cannot land untested.
 */
export interface SurfaceEntry {
  /** The directory under src/components. Keyed to the coverage check. */
  dir: string
  render: () => ReactElement
  /**
   * Components whose visible surface only exists once opened. The axe pass
   * opens them first; the server-render pass skips their trigger-only markup.
   */
  opensWith?: string
  /**
   * Axe rules this fixture cannot satisfy in isolation, with the reason. An
   * empty list is the default and the goal; every entry here is a promise that
   * the rule is satisfied by the CALL SITE, and the docs page for the component
   * says so.
   */
  axeExceptions?: { rule: string; because: string }[]
}

export const SURFACE: SurfaceEntry[] = [
  { dir: 'Accordion', render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="a" title="How do I install it?">Add the package.</AccordionItem>
      <AccordionItem value="b" title="Do I need Tailwind?">No.</AccordionItem>
    </Accordion>
  ) },
  { dir: 'Alert', render: () => (
    <Alert tone="danger" title="Upload failed">The file exceeds 25 MB.</Alert>
  ) },
  { dir: 'AppShell', render: () => (
    <AppShell brand={<span>Console</span>} sidebar={<NavItem href="#home">Overview</NavItem>}>
      <p>Content</p>
    </AppShell>
  ) },
  { dir: 'Avatar', render: () => <Avatar alt="Henry Chen" fallback="HC" /> },
  { dir: 'Badge', render: () => <Badge tone="success">Deployed</Badge> },
  { dir: 'Breadcrumb', render: () => (
    <Breadcrumb items={[{ label: 'Home', href: '#/' }, { label: 'Button' }]} />
  ) },
  { dir: 'Button', render: () => <Button keycap="P">View projects</Button> },
  { dir: 'Card', render: () => (
    <>
      <Card>
        <CardHeader><CardTitle>Recent deploys</CardTitle><Badge>12</Badge></CardHeader>
        <CardBody>Twelve releases, none rolled back.</CardBody>
        <CardFooter>Updated just now</CardFooter>
      </Card>
      {/* The reversed plate WITH a title. Without one here the variant whose
          whole job is to invert the ground was only ever checked without the
          element that had hardcoded the un-inverted colour. */}
      <Card variant="plate">
        <CardHeader><CardTitle>The reversed plate</CardTitle></CardHeader>
        <CardBody>One per screen.</CardBody>
      </Card>
    </>
  ) },
  { dir: 'Checkbox', render: () => (
    <label><Checkbox defaultChecked /> Ship on merge</label>
  ) },
  { dir: 'Dialog', opensWith: 'Delete frame', render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Delete frame</Button></DialogTrigger>
      <DialogContent title="Delete this frame?" description="This cannot be undone.">
        <Button variant="secondary">Cancel</Button>
      </DialogContent>
    </Dialog>
  ) },
  { dir: 'DropdownMenu', opensWith: 'Account', render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="secondary">Account</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Signed in</DropdownMenuLabel>
        <DropdownMenuItem icon={RiSettings3Line}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={RiDeleteBinLine} destructive>Delete account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) },
  { dir: 'EmptyState', render: () => (
    <EmptyState icon={RiInboxLine} title="No projects yet" description="Create one to get started." />
  ) },
  { dir: 'ErrorState', render: () => (
    <ErrorState
      code="404"
      heading="Page not found"
      message="It may have moved."
      action={<a href="#/" className={ERROR_ACTION_CLASS}>Back home</a>}
    />
  ) },
  { dir: 'Text', render: () => (
    <>
      <Text size="lead" tone="strong">A monochrome system for software and writing.</Text>
      <Text>Twelve releases this quarter, none rolled back.</Text>
      <Text as="span" size="sm" tone="muted">Updated just now</Text>
    </>
  ) },
  { dir: 'Heading', render: () => (
    <>
      <Heading level={1}>The White Reset</Heading>
      {/* The outline says second level; the design says page title. Both, which
          is the pair of props this component exists to keep apart. */}
      <Heading level={2} size="title">Colour</Heading>
    </>
  ) },
  { dir: 'Code', render: () => (
    <p>Pass <Code>--force</Code> to overwrite <Code>dist/</Code>.</p>
  ) },
  { dir: 'CodeBlock', render: () => (
    <CodeBlock
      title="cn.ts"
      lang="ts"
      lineNumbers
      highlightLines={[2]}
      maxHeight="20rem"
      code={'export function cn(...inputs) {\n  return twMerge(clsx(inputs))\n}'}
    />
  ) },
  { dir: 'Markdown', render: () => (
    <Markdown headingLevelStart={1}>
      {'# Release notes\n\nA paragraph with `code`, **strong** and [a link](/changelog).\n\n- One\n- Two\n\n```bash\npnpm add @misoto22/folio\n```\n'}
    </Markdown>
  ) },
  { dir: 'Article', render: () => (
    <Article>
      <h1>The White Reset</h1>
      <p className="lead">A monochrome system for software and writing.</p>
      <p>A paragraph with <a href="#x">a link</a> and <code>some code</code>.</p>
    </Article>
  ) },
  { dir: 'Diagram', render: () => (
    <Diagram
      spec={{
        caption: 'One request, end to end.',
        edges: [{ from: 'edge', to: 'app', label: 'HTTPS' }],
        nodes: [
          { id: 'edge', label: 'Edge', note: 'CDN' },
          { id: 'app', label: 'Application', children: [{ label: 'Router', accent: true }] },
        ],
      }}
    />
  ) },
  { dir: 'Field', render: () => (
    <>
      <Field label="Email" required hint="We never share it."><Input type="email" /></Field>
      {/* The settings row. Its whole point is that the label sits on the other
          side of the row from the control, so the association is the thing
          most likely to be lost — and the axe pass is what catches it. */}
      <Field layout="row" label="Email notifications" description="A digest every Monday.">
        <Switch defaultChecked />
      </Field>
    </>
  ) },
  { dir: 'FigureBand', render: () => (
    <FigureBand
      label="At a glance"
      figures={[
        { id: 'a', label: 'Releases', value: '12' },
        { id: 'b', label: 'Rollbacks', value: '0', note: 'this quarter' },
      ]}
    />
  ) },
  { dir: 'FloatingIconButton', render: () => (
    <FloatingIconButton position="end" label="Back to top"><span aria-hidden>↑</span></FloatingIconButton>
  ) },
  { dir: 'Input', render: () => <Field label="Search"><Input type="search" /></Field> },
  { dir: 'NumberField', render: () => (
    <Field label="Line height" hint="Between 1 and 3.">
      <NumberField defaultValue={1.5} min={1} max={3} step={0.1} />
    </Field>
  ) },
  { dir: 'Kbd', render: () => <p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd></p> },
  { dir: 'LinkArrow', render: () => <a href="#x">Read the paper<LinkArrow /></a> },
  { dir: 'Metric', render: () => (
    <Metric label="Rows" value="63,851" detail="newest yesterday" tone="success" />
  ) },
  { dir: 'NavItem', render: () => (
    <nav aria-label="Primary"><NavItem href="#work" active>Work</NavItem></nav>
  ) },
  { dir: 'PageHeader', render: () => (
    <PageHeader
      eyebrow="04"
      title="Money"
      description="Balances and flows, as at the last sync."
      breadcrumb={<Breadcrumb items={[{ label: 'Living', href: '#/living' }, { label: 'Money' }]} />}
      actions={<Button size="sm">Last 7 days</Button>}
    />
  ) },
  { dir: 'Pagination', render: () => (
    <Pagination page={7} pageCount={20} onPageChange={() => {}} />
  ) },
  { dir: 'Progress', render: () => <Progress value={62} label="Uploading photos" showValue /> },
  { dir: 'RadioGroup', render: () => (
    <RadioGroup defaultValue="light" aria-label="Appearance">
      <RadioGroupItem value="light">Light</RadioGroupItem>
      <RadioGroupItem value="dark">Dark</RadioGroupItem>
    </RadioGroup>
  ) },
  { dir: 'Select', render: () => (
    <Field label="Region">
      <Select label="Region" defaultValue="au">
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="nz">New Zealand</SelectItem>
      </Select>
    </Field>
  ) },
  { dir: 'NativeSelect', render: () => (
    <Field label="Region">
      <NativeSelect defaultValue="au">
        <option value="au">Australia</option>
        <option value="nz">New Zealand</option>
      </NativeSelect>
    </Field>
  ) },
  { dir: 'Sidebar', render: () => (
    <SidebarProvider>
      <Sidebar label="Documentation">
        <SidebarHeader>
          <span className="text-sm">Acme</span>
          <SidebarTrigger className="ms-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Guide" count={2} badge={<Badge tone="outline">Beta</Badge>}>
            <SidebarItem href="#start" icon={RiInboxLine} active>Getting started</SidebarItem>
            <SidebarItem href="#settings" icon={RiSettings3Line} trailing="3">Settings</SidebarItem>
            <SidebarBranch label="Acme HQ" icon={RiFileCopyLine} defaultOpen>
              <SidebarItem href="#hq" icon={RiInboxLine}>Overview</SidebarItem>
            </SidebarBranch>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ) },
  { dir: 'Separator', render: () => (
    <>
      <Separator />
      <Separator label="or continue with" />
    </>
  ) },
  { dir: 'Skeleton', render: () => (
    <SkeletonPage label="Loading projects">
      <SkeletonLine className="w-40" />
      <SkeletonBlock className="h-20" />
    </SkeletonPage>
  ) },
  { dir: 'Spinner', render: () => <Spinner label="Loading projects" /> },
  { dir: 'StatusDot', render: () => <span><StatusDot /> Available</span> },
  { dir: 'StatusPill', render: () => <StatusPill>Available for work</StatusPill> },
  { dir: 'Steps', render: () => (
    <Steps
      label="How an answer is built"
      steps={[
        { title: 'Corpus', note: 'Blog MDX' },
        { title: 'Retrieval', note: 'Top 5 by cosine' },
        { title: 'Answer', note: 'Live citations', current: true },
      ]}
    />
  ) },
  { dir: 'Switch', render: () => (
    <label><Switch defaultChecked /> Email notifications</label>
  ) },
  { dir: 'Table', render: () => (
    <Table caption="Recent deploys" borders="bordered-grid" density="compact">
      <THead>
        <TR>
          <TH>Commit</TH>
          <TH align="end" sortable sortDirection="ascending" onSort={() => {}}>
            Duration
          </TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>a1b2c3d</TD>
          <TD align="end">2m 14s</TD>
        </TR>
      </TBody>
    </Table>
  ) },
  { dir: 'Tabs', render: () => (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">The rendered component.</TabsContent>
      <TabsContent value="code">The source.</TabsContent>
    </Tabs>
  ) },
  { dir: 'Tag', render: () => (
    <>
      <Tag>TypeScript</Tag>
      <Tag onRemove={() => {}} removeLabel="Remove Rust filter">Rust</Tag>
    </>
  ) },
  { dir: 'Textarea', render: () => <Field label="Notes"><Textarea rows={3} /></Field> },
  { dir: 'Toast', render: () => <Toaster /> },
  { dir: 'Calendar', render: () => <Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} /> },
  { dir: 'Collapsible', render: () => (
    <CollapsibleSection title="Advanced settings">
      <p>Nothing here needs changing.</p>
    </CollapsibleSection>
  ) },
  { dir: 'ColorPicker', opensWith: 'Brand colour', render: () => (
    <Field label="Brand colour">
      <ColorPicker label="Brand colour" defaultValue="#a78bfa" />
    </Field>
  ) },
  { dir: 'Combobox', render: () => (
    <Combobox
      label="Framework"
      options={[
        { value: 'next', label: 'Next.js' },
        { value: 'remix', label: 'Remix' },
      ]}
    />
  ) },
  { dir: 'Command', render: () => (
    <Command label="Command palette">
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem value="components" shortcut="C">Components</CommandItem>
          <CommandItem value="principles">Principles</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ) },
  { dir: 'ContextMenu', render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={RiFileCopyLine}>Copy</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ) },
  { dir: 'DatePicker', render: () => <DatePicker label="Publish on" /> },
  { dir: 'Popover', opensWith: 'Filters', render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="secondary">Filters</Button></PopoverTrigger>
      <PopoverContent label="Filters">
        <Field label="Status"><Input /></Field>
      </PopoverContent>
    </Popover>
  ) },
  { dir: 'ScrollArea', render: () => (
    <ScrollArea label="Deploy log" className="h-24 w-64">
      <p>a1b2c3d deployed</p>
      <p>9f8e7d6 deployed</p>
    </ScrollArea>
  ) },
  { dir: 'SearchableMenu', opensWith: 'Actions', render: () => (
    <SearchableMenu
      label="Actions"
      actions={[
        { id: 'copy', label: 'Copy link', onSelect: () => {} },
        { id: 'delete', label: 'Delete', destructive: true, onSelect: () => {} },
      ]}
    >
      Actions
    </SearchableMenu>
  ) },
  { dir: 'Sheet', opensWith: 'Open filters', render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="secondary">Open filters</Button></SheetTrigger>
      <SheetContent title="Filters" description="Narrow the list.">
        <Field label="Status"><Input /></Field>
      </SheetContent>
    </Sheet>
  ) },
  { dir: 'Slider', render: () => (
    <Slider label="Quality" defaultValue={[80]} max={100} step={5} showValue />
  ) },
  { dir: 'ToggleGroup', render: () => (
    <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>
  ) },
  { dir: 'Tooltip', opensWith: 'Copy', render: () => (
    <TooltipProvider>
      <Tooltip content="Copy to clipboard">
        <Button iconOnly aria-label="Copy"><span aria-hidden>⧉</span></Button>
      </Tooltip>
    </TooltipProvider>
  ) },
  { dir: 'DescriptionList', render: () => (
    <DescriptionList
      items={[
        { term: 'Owner', description: 'Henry Chen' },
        { term: 'Region', description: 'ap-southeast-2' },
        { term: 'Status', description: <Badge tone="success">Deployed</Badge> },
      ]}
    />
  ) },
  { dir: 'Toolbar', render: () => (
    <Toolbar label="Form actions">
      <Button variant="secondary">Cancel</Button>
      <Button type="submit">Save changes</Button>
    </Toolbar>
  ) },
  { dir: 'Timestamp', render: () => (
    <p>Deployed <Timestamp value="2026-01-14T09:30:00.000Z" /></p>
  ) },
  { dir: 'AspectRatio', render: () => (
    <AspectRatio ratio="16 / 9" className="w-64 bg-(--stone)">
      <div />
    </AspectRatio>
  ) },
]

export const SURFACE_BY_DIR = new Map(SURFACE.map((entry) => [entry.dir, entry]))
