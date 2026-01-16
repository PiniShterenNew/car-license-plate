import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'valid' | 'expired' | 'lien' | 'total-loss' | 'unknown'
  className?: string
}

const statusConfig = {
  valid: {
    label: 'תקין',
    className: 'bg-success/10 text-success border-success/20',
  },
  expired: {
    label: 'לא בתוקף',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  lien: {
    label: 'שעבוד',
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  },
  'total-loss': {
    label: 'אובדן להלכה',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  unknown: {
    label: 'לא ידוע',
    className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
