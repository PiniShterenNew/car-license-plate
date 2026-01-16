import { db } from '@/lib/db'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LicenseStatus, ResultStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { formatPlateWithDashes, normalizePlate } from '@/lib/plates'

interface SearchParams {
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

function getStatusBadge(status: LicenseStatus) {
  switch (status) {
    case 'VALID':
      return <Badge className="bg-green-500 dark:bg-green-600">תקין</Badge>
    case 'EXPIRED':
      return <Badge className="bg-red-500 dark:bg-red-600">לא בתוקף</Badge>
    case 'UNKNOWN':
      return <Badge className="bg-gray-500 dark:bg-gray-600">לא ידוע</Badge>
    default:
      return <Badge className="bg-gray-500 dark:bg-gray-600">לא ידוע</Badge>
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
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#121417] dark:text-white px-2 md:px-0">יומני חיפוש</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-[#e5e7eb] dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 transition-colors overflow-hidden">
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
                <TableCell className="dark:text-white font-mono">
                  {formatPlateWithDashes(normalizePlate(search.plateFormatted))}
                </TableCell>
                <TableCell className="dark:text-slate-300">
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
                <TableCell className="font-mono text-sm dark:text-slate-300">
                  {search.visitor.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="dark:text-slate-300">{search.responseMs}ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {searches.map((search) => (
          <div
            key={search.id}
            className="bg-white dark:bg-slate-900 border border-[#e5e7eb] dark:border-slate-800 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="font-mono font-bold text-lg text-[#121417] dark:text-white mb-2">
                  {formatPlateWithDashes(normalizePlate(search.plateFormatted))}
                </div>
                <div className="text-xs text-[#657586] dark:text-slate-400 mb-2">
                  {new Date(search.createdAt).toLocaleString('he-IL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-2 items-end">
                {search.resultStatus === 'FOUND' ? (
                  <Badge className="bg-green-500">נמצא</Badge>
                ) : search.resultStatus === 'NOT_FOUND' ? (
                  <Badge className="bg-yellow-500">לא נמצא</Badge>
                ) : (
                  <Badge className="bg-red-500">שגיאה</Badge>
                )}
                {getStatusBadge(search.licenseStatus)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#657586] dark:text-slate-400 pt-2 border-t border-[#e5e7eb] dark:border-slate-800">
              <span className="font-mono">{search.visitor.id.slice(0, 8)}...</span>
              <span>{search.responseMs}ms</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-[#657586] dark:text-slate-400 px-2 md:px-0">
        מציג {skip + 1}-{Math.min(skip + pageSize, total)} מתוך {total} תוצאות
      </div>
    </div>
  )
}
