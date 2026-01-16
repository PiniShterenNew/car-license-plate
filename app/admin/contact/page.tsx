import { db } from '@/lib/db'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactStatus } from '@prisma/client'
import { Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react'
import { ContactMessageActions } from './components/ContactMessageActions'

interface SearchParams {
  page?: string
  status?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

function getStatusBadge(status: ContactStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-yellow-500 dark:bg-yellow-600">ממתין</Badge>
    case 'READ':
      return <Badge className="bg-blue-500 dark:bg-blue-600">נקרא</Badge>
    case 'REPLIED':
      return <Badge className="bg-green-500 dark:bg-green-600">נענה</Badge>
    case 'ARCHIVED':
      return <Badge className="bg-gray-500 dark:bg-gray-600">בארכיון</Badge>
    default:
      return <Badge className="bg-gray-500 dark:bg-gray-600">לא ידוע</Badge>
  }
}

export default async function AdminContactPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const status = params.status as ContactStatus | undefined
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where = status ? { status } : {}

  const [messages, total, pendingCount, readCount, repliedCount] = await Promise.all([
    db.contactMessage.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    db.contactMessage.count({ where }),
    db.contactMessage.count({ where: { status: 'PENDING' } }),
    db.contactMessage.count({ where: { status: 'READ' } }),
    db.contactMessage.count({ where: { status: 'REPLIED' } }),
  ])

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#121417] dark:text-white">הודעות קשר</h1>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs md:text-sm font-medium text-[#657586] dark:text-slate-400">סה&quot;כ הודעות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-[#121417] dark:text-white">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs md:text-sm font-medium text-[#657586] dark:text-slate-400">ממתין</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-500">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs md:text-sm font-medium text-[#657586] dark:text-slate-400">נקרא</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-500">{readCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs md:text-sm font-medium text-[#657586] dark:text-slate-400">נענה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-500">{repliedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* טבלת הודעות - Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-[#121417] dark:text-white">רשימת הודעות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-[#e5e7eb] dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>נושא</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-[#657586] dark:text-slate-400">
                      אין הודעות להצגה
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#657586] dark:text-slate-400" />
                          <span className="font-medium dark:text-white">{message.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#657586] dark:text-slate-400" />
                          <a
                            href={`mailto:${message.email}`}
                            className="text-primary hover:underline dark:text-primary"
                          >
                            {message.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#657586] dark:text-slate-400" />
                            <a
                              href={`tel:${message.phone}`}
                              className="text-primary hover:underline dark:text-primary"
                            >
                              {message.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[#657586] dark:text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate dark:text-white" title={message.subject}>
                          {message.subject}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-[#657586] dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.createdAt).toLocaleString('he-IL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ContactMessageActions message={message} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3 px-2">
        {messages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-[#e5e7eb] dark:border-slate-800 rounded-lg p-8 text-center text-[#657586] dark:text-slate-400">
            אין הודעות להצגה
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-white dark:bg-slate-900 border border-[#e5e7eb] dark:border-slate-800 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#657586] dark:text-slate-400 shrink-0" />
                    <span className="font-bold text-base text-[#121417] dark:text-white">{message.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-[#657586] dark:text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-primary hover:underline dark:text-primary truncate"
                    >
                      {message.email}
                    </a>
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-[#657586] dark:text-slate-400 shrink-0" />
                      <a
                        href={`tel:${message.phone}`}
                        className="text-sm text-primary hover:underline dark:text-primary"
                      >
                        {message.phone}
                      </a>
                    </div>
                  )}
                  <div className="text-sm font-medium text-[#121417] dark:text-white mb-2">
                    {message.subject}
                  </div>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(message.status)}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb] dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-[#657586] dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(message.createdAt).toLocaleString('he-IL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <ContactMessageActions message={message} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination info */}
      {total > 0 && (
        <div className="text-sm text-[#657586] dark:text-slate-400 px-2 md:px-0">
          מציג {skip + 1}-{Math.min(skip + pageSize, total)} מתוך {total} הודעות
        </div>
      )}
    </div>
  )
}
