'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, RefreshCw } from 'lucide-react'
import { LicenseStatus } from '@prisma/client'
import Link from 'next/link'
import { useTransition } from 'react'

interface HistoryListItemProps {
  plateFormatted: string
  manufacturer: string
  modelName: string
  year: number | null
  licenseStatus: LicenseStatus
  createdAt: Date
  onRefresh: () => void
  onDelete: () => void
}

export function HistoryListItem({
  plateFormatted,
  manufacturer,
  modelName,
  year,
  licenseStatus,
  createdAt,
  onRefresh,
  onDelete,
}: HistoryListItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(() => {
      onDelete()
    })
  }

  const getStatusBadge = () => {
    switch (licenseStatus) {
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">
                {manufacturer} {modelName}
                {year && <span className="text-muted-foreground"> ({year})</span>}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>מספר רישוי: {plateFormatted}</p>
              <p>נבדק: {new Date(createdAt).toLocaleString('he-IL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/car/${plateFormatted.replace(/-/g, '')}`}>
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 ml-2" />
                בדוק שוב
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
