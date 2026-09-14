import { Tabs, TabsList, TabsTrigger, TabsContent, Field, Input, Textarea } from '@misoto22/folio'

export function PostEditor() {
  return (
    <Tabs defaultValue="content" style={{ width: 'min(100%, 480px)' }}>
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Title" htmlFor="editor-title" required>
            <Input id="editor-title" defaultValue="Building a private blog" />
          </Field>
          <Field label="Body" htmlFor="editor-body" hint="Markdown supported.">
            <Textarea
              id="editor-body"
              rows={4}
              defaultValue="A password gate keeps private posts hidden while the rest of the blog stays static."
            />
          </Field>
        </div>
      </TabsContent>
      <TabsContent value="seo">
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14 }}>
          SEO settings — meta title, description, and social preview.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14 }}>
          Visibility, author, and publish schedule.
        </p>
      </TabsContent>
    </Tabs>
  )
}

export function ModerationQueue() {
  return (
    <Tabs defaultValue="pending" style={{ width: 'min(100%, 480px)' }}>
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="spam">Spam</TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14, lineHeight: 1.6 }}>
          3 comments awaiting review on “Building a private blog”.
        </p>
      </TabsContent>
      <TabsContent value="approved">
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14 }}>
          128 comments published this month.
        </p>
      </TabsContent>
      <TabsContent value="spam">
        <p style={{ margin: 0, color: 'var(--secondary-text)', fontSize: 14 }}>
          12 comments caught by the spam filter.
        </p>
      </TabsContent>
    </Tabs>
  )
}
