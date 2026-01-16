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
      return <Badge className="bg-yellow-500">ממתין</Badge>
    case 'READ':
      return <Badge className="bg-blue-500">נקרא</Badge>
    case 'REPLIED':
      return <Badge className="bg-green-500">נענה</Badge>
    case 'ARCHIVED':
      return <Badge className="bg-gray-500">בארכיון</Badge>
    default:
      return <Badge className="bg-gray-500">לא ידוע</Badge>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#121417]">הודעות קשר</h1>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#657586]">סה"כ הודעות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#121417]">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#657586]">ממתין</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#657586]">נקרא</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{readCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#657586]">נענה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{repliedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* טבלת הודעות */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת הודעות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
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
                    <TableCell colSpan={7} className="text-center py-8 text-[#657586]">
                      אין הודעות להצגה
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#657586]" />
                          <span className="font-medium">{message.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#657586]" />
                          <a
                            href={`mailto:${message.email}`}
                            className="text-primary hover:underline"
                          >
                            {message.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#657586]" />
                            <a
                              href={`tel:${message.phone}`}
                              className="text-primary hover:underline"
                            >
                              {message.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[#657586]">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={message.subject}>
                          {message.subject}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-[#657586]">
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

      {/* Pagination info */}
      {total > 0 && (
        <div className="text-sm text-[#657586]">
          מציג {skip + 1}-{Math.min(skip + pageSize, total)} מתוך {total} הודעות
        </div>
      )}
    </div>
  )
}
