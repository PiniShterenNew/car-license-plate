import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SettingsForm } from './components/SettingsForm'

async function getSettings() {
  const settings = await db.appSetting.findMany()
  const settingsMap = new Map(settings.map((s) => [s.key, s.value]))
  return {
    cpm: settingsMap.get('ad_cpm') || '10',
    cpc: settingsMap.get('ad_cpc') || '0.5',
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#121417] dark:text-white">הגדרות</h1>

      <SettingsForm initialCpm={settings.cpm} initialCpc={settings.cpc} />

      <Card id="security">
        <CardHeader>
          <CardTitle>אבטחת מידע</CardTitle>
          <CardDescription>הגדרות אבטחה למערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                מפתח המנהל מוגדר באמצעות משתנה סביבה ADMIN_KEY.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                כל הנתונים מוצפנים ונשמרים בבסיס הנתונים PostgreSQL.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
