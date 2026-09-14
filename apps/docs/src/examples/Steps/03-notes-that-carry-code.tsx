import { Code, Steps } from '@misoto22/folio'

/**
 * note takes a node, not only a string, so a step can carry the exact command
 * rather than a description of it. Keep it to one short line either way: the
 * rail is a sequence, and a paragraph under a marker turns it back into the
 * numbered list it exists to replace. Nothing here is clickable — the props
 * spread onto the ol, so an onClick meant for a step lands on the whole list.
 */
export function Example() {
  return (
    <Steps
      label="Adding the package to an app"
      steps={[
        { title: 'Install', note: <Code>pnpm add @misoto22/folio</Code> },
        { title: 'Import the stylesheet', note: <Code>@misoto22/folio/styles.css</Code> },
        { title: 'Render', note: <Code>{'<Button>Save</Button>'}</Code>, current: true },
      ]}
    />
  )
}
