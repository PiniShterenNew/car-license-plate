'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlateImage } from './PlateImage'
import { Share2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPlate } from '@/lib/plates'
import { LicenseStatus } from '@prisma/client'

interface VehicleSummaryCardProps {
  plate: string
  manufacturer: string
  modelName: string
  year: number | null
  licenseStatus: LicenseStatus
}

export function VehicleSummaryCard({
  plate,
  manufacturer,
  modelName,
  year,
  licenseStatus,
}: VehicleSummaryCardProps) {
  const formattedPlate = formatPlate(plate)

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `מידע על רכב ${formattedPlate}`,
        text: `${manufacturer} ${modelName}${year ? ` ${year}` : ''}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            {manufacturer} {modelName}
            {year && <span className="text-muted-foreground"> ({year})</span>}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <PlateImage plate={formattedPlate} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 ml-2" />
              שתף
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 ml-2" />
              הדפס
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
