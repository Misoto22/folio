'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@misoto22/folio'

/**
 * One strip, three panels, paired by string equality — a typo in a value is not
 * an error but a tab that opens onto nothing. Give the root a defaultValue or a
 * value: with neither, nothing matches, every panel stays unmounted, and the
 * page renders a strip above an empty space with nothing to say what is
 * missing. The whole strip is one tab stop; left and right move between tabs,
 * Home and End jump to the ends. The selected tab lives in React state and not
 * in the URL, so anything worth linking to needs value lifted into a query
 * parameter.
 */
export function Example() {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="text-sm text-(--ink-2)">The rendered component.</TabsContent>
      <TabsContent value="code" className="text-sm text-(--ink-2)">The source that produced it.</TabsContent>
      <TabsContent value="props" className="text-sm text-(--ink-2)">Its parsed prop table.</TabsContent>
    </Tabs>
  )
}
