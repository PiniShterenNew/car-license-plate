import { db } from '@/lib/db'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LicenseStatus, ResultStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'

interface SearchParams {
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

function getStatusBadge(status: LicenseStatus) {
  switch (status) {
    case 'VALID':
      return <Badge className="bg-green-500">תקין</Badge>
    case 'EXPIRED':
      return <Badge className="bg-red-500">לא בתוקף</Badge>
    case 'UNKNOWN':
      return <Badge className="bg-gray-500">לא ידוע</Badge>
    default:
      return <Badge className="bg-gray-500">לא ידוע</Badge>
  }
}

export default async function AdminSearchLogsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const pageSize = 50
  const skip = (page - 1) * pageSize

  const [searches, total] = await Promise.all([
    db.searchEvent.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        vehicle: {
          select: {
            plateFormatted: true,
            manufacturer: true,
            modelName: true,
          },
        },
        visitor: {
          select: {
            id: true,
          },
        },
      },
    }),
    db.searchEvent.count(),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">יומני חיפוש</h1>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>מספר רכב</TableHead>
              <TableHead>זמן</TableHead>
              <TableHead>תוצאה</TableHead>
              <TableHead>סטטוס רישיון</TableHead>
              <TableHead>משתמש</TableHead>
              <TableHead>זמן תגובה (ms)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searches.map((search) => (
              <TableRow key={search.id}>
                <TableCell>{search.plateFormatted}</TableCell>
                <TableCell>
                  {new Date(search.createdAt).toLocaleString('he-IL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  {search.resultStatus === 'FOUND' ? (
                    <Badge className="bg-green-500">נמצא</Badge>
                  ) : search.resultStatus === 'NOT_FOUND' ? (
                    <Badge className="bg-yellow-500">לא נמצא</Badge>
                  ) : (
                    <Badge className="bg-red-500">שגיאה</Badge>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(search.licenseStatus)}</TableCell>
                <TableCell className="font-mono text-sm">
                  {search.visitor.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{search.responseMs}ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        מציג {skip + 1}-{Math.min(skip + pageSize, total)} מתוך {total} תוצאות
      </div>
    </div>
  )
}
