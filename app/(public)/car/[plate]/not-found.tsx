import { NotFoundScreenClient } from './components/NotFoundScreenClient'
import { normalizePlate, formatPlate } from '@/lib/plates'

interface NotFoundProps {
  params?: Promise<{ plate: string }> | { plate: string }
}

export default async function VehicleNotFound({ params }: NotFoundProps) {
  if (!params) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NotFoundScreenClient plate="" />
      </div>
    )
  }

  const resolvedParams = params && typeof params === 'object' && 'then' in params ? await params : params
  const { plate } = resolvedParams || { plate: '' }
  const normalized = normalizePlate(plate)
  const formatted = formatPlate(normalized)

  return (
    <div className="container mx-auto px-4 py-8">
      <NotFoundScreenClient plate={formatted} />
    </div>
  )
}
