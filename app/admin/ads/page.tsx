import { getTimeRange, getAdStats } from '@/lib/metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchParams {
  range?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminAdsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const range = (params.range as '7d' | '30d' | 'quarter') || '7d'
  const timeRange = getTimeRange(range)

  const stats = await getAdStats(timeRange)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#121417] dark:text-white">דוחות והכנסות</h1>
        <Tabs defaultValue={range}>
          <TabsList>
            <TabsTrigger value="7d" asChild>
              <a href="?range=7d">7 ימים</a>
            </TabsTrigger>
            <TabsTrigger value="30d" asChild>
              <a href="?range=30d">30 יום</a>
            </TabsTrigger>
            <TabsTrigger value="quarter" asChild>
              <a href="?range=quarter">רבעון</a>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">חשיפות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.impressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">קליקים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ctr.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>לפי חריץ מודעה</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>חריץ</TableHead>
                  <TableHead>כמות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.bySlot.map((slot) => (
                  <TableRow key={slot.slotKey}>
                    <TableCell>{slot.slotKey}</TableCell>
                    <TableCell>{slot.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>לפי עמוד</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>עמוד</TableHead>
                  <TableHead>כמות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.byPage.map((page) => (
                  <TableRow key={page.pagePath}>
                    <TableCell>{page.pagePath}</TableCell>
                    <TableCell>{page.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
