'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface SettingsFormProps {
  initialCpm: string
  initialCpc: string
}

export function SettingsForm({ initialCpm, initialCpc }: SettingsFormProps) {
  const [cpm, setCpm] = useState(initialCpm)
  const [cpc, setCpc] = useState(initialCpc)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('cpm', cpm)
      formData.append('cpc', cpc)

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        const data = await response.json()
        setError(data.error || 'שגיאה בעדכון הגדרות')
      }
    } catch (err) {
      setError('שגיאה בעדכון הגדרות. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>הגדרות מודעות</CardTitle>
        <CardDescription>הגדר תעריפי מודעות להערכת הכנסות</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpm">CPM (תעריף ל-1000 חשיפות)</Label>
            <Input
              id="cpm"
              name="cpm"
              type="number"
              step="0.01"
              value={cpm}
              onChange={(e) => setCpm(e.target.value)}
              placeholder="10"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpc">CPC (תעריף לקליק)</Label>
            <Input
              id="cpc"
              name="cpc"
              type="number"
              step="0.01"
              value={cpc}
              onChange={(e) => setCpc(e.target.value)}
              placeholder="0.5"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
              <p className="text-sm text-green-700 dark:text-green-300">ההגדרות נשמרו בהצלחה!</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>שומר...</span>
              </span>
            ) : (
              <span>שמור</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
