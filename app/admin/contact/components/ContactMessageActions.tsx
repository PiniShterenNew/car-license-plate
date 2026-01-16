'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ContactStatus } from '@prisma/client'
import { Eye, Reply, Archive, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: ContactStatus
  createdAt: Date
  readAt: Date | null
  repliedAt: Date | null
}

interface ContactMessageActionsProps {
  message: ContactMessage
}

export function ContactMessageActions({ message }: ContactMessageActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: ContactStatus) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/contact/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: message.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'שגיאה בעדכון הסטטוס')
      }
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס. אנא נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="h-8 px-2"
          title="צפה בהודעה"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
        {message.status === 'PENDING' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStatus('READ')}
            disabled={isLoading}
            className="h-8 px-2"
            title="סמן כנקרא"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
        {message.status !== 'REPLIED' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStatus('REPLIED')}
            disabled={isLoading}
            className="h-8 px-2"
            title="סמן כנענה"
          >
            <Reply className="w-4 h-4" />
          </Button>
        )}
        {message.status !== 'ARCHIVED' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStatus('ARCHIVED')}
            disabled={isLoading}
            className="h-8 px-2"
            title="העבר לארכיון"
          >
            <Archive className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{message.subject}</DialogTitle>
            <DialogDescription>
              הודעה מ-{message.name} ({message.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">פרטי השולח:</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>שם:</strong> {message.name}
                </p>
                <p>
                  <strong>אימייל:</strong>{' '}
                  <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                    {message.email}
                  </a>
                </p>
                {message.phone && (
                  <p>
                    <strong>טלפון:</strong>{' '}
                    <a href={`tel:${message.phone}`} className="text-primary hover:underline">
                      {message.phone}
                    </a>
                  </p>
                )}
                <p>
                  <strong>תאריך:</strong>{' '}
                  {new Date(message.createdAt).toLocaleString('he-IL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">הודעה:</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                {message.message}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => {
                  window.location.href = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}&body=${encodeURIComponent(`שלום ${message.name},\n\n`)}`
                }}
                className="flex-1"
              >
                <Reply className="w-4 h-4 ml-2" />
                שלח תשובה
              </Button>
              {message.status === 'PENDING' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    updateStatus('READ')
                    setIsOpen(false)
                  }}
                  disabled={isLoading}
                >
                  <Eye className="w-4 h-4 ml-2" />
                  סמן כנקרא
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
