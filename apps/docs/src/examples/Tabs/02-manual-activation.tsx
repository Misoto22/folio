import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@misoto22/folio'

/**
 * activationMode manual, and a strip with a name. The default is automatic, so
 * the arrow keys select as they move and arrowing across four tabs starts four
 * loads before the reader has stopped — manual waits for Enter or Space, which
 * is what a panel that fetches or renders something expensive needs. TabsList
 * is named after nothing by default, so a page carrying more than one set gives
 * each an aria-label: two unnamed tab lists are two tab lists a reader cannot
 * choose between.
 */
export function Example() {
  return (
    <Tabs defaultValue="traffic" activationMode="manual" className="w-full">
      <TabsList aria-label="Site metrics">
        <TabsTrigger value="traffic">Traffic</TabsTrigger>
        <TabsTrigger value="referrers">Referrers</TabsTrigger>
        <TabsTrigger value="errors">Errors</TabsTrigger>
      </TabsList>
      <TabsContent value="traffic">
        <Text size="sm">18,402 visits over the last 30 days, up 6% on the month before.</Text>
      </TabsContent>
      <TabsContent value="referrers">
        <Text size="sm">news.ycombinator.com sent 4,110 of them; nothing else broke 500.</Text>
      </TabsContent>
      <TabsContent value="errors">
        <Text size="sm">Eleven 500s, all from the same deploy, all before 09:14.</Text>
      </TabsContent>
    </Tabs>
  )
}
