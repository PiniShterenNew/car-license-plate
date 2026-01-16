# Technical Snapshot: CheckCarIL
**Generated:** 2024-12-19  
**Purpose:** High-fidelity technical snapshot for external senior architect review

---

## 1) Project Overview

**Project Name:** CheckCarIL  
**Type:** Next.js App Router application  
**Primary Function:** Israeli vehicle information lookup by license plate number

**Repository Structure:**
```
checkcaril/
├── app/
│   ├── (public)/          # Public route group
│   │   ├── about/
│   │   ├── accessibility/
│   │   ├── car/[plate]/    # Dynamic route: vehicle details
│   │   ├── components/
│   │   ├── contact/
│   │   ├── history/
│   │   ├── privacy/
│   │   ├── sitemap/
│   │   ├── terms/
│   │   ├── layout.tsx
│   │   └── page.tsx        # Home page
│   ├── admin/              # Admin route group
│   │   ├── ads/
│   │   ├── components/
│   │   ├── contact/
│   │   ├── login/
│   │   ├── search-logs/
│   │   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                # API routes
│   │   ├── admin/
│   │   ├── ads/
│   │   ├── contact/
│   │   ├── history/
│   │   └── vehicle/
│   ├── components/
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx
├── components/             # Shared UI components
│   ├── admin/
│   ├── ads/
│   ├── history/
│   ├── layout/
│   ├── nav/
│   ├── ui/                 # shadcn/ui components
│   └── vehicle/
├── lib/                    # Business logic
│   ├── adminAuth.ts
│   ├── csv.ts
│   ├── db.ts
│   ├── govApi.ts
│   ├── metrics.ts
│   ├── plates.ts
│   ├── utils.ts
│   └── visitor.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── scripts/
│   └── cleanup-not-found-searches.ts
├── middleware.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

**Evidence:**
- File listing: `Get-ChildItem -Path app -Recurse -File`
- Root structure: `list_dir` output

---

## 2) Architecture & Runtime Model

### Runtime Environment

**Node.js Version:** v20.19.0  
**npm Version:** 10.8.2  
**Next.js Version:** 14.2.0 (from `package.json`)  
**Prisma Version:** 5.19.0  
**TypeScript Version:** 5.5.4

**Evidence:**
```bash
node -v
# v20.19.0

npm -v
# 10.8.2
```

**Package.json:**
```json:package.json
{
  "name": "checkcaril",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "^14.2.0",
    "@prisma/client": "^5.19.0",
    "zod": "^3.23.8",
    ...
  }
}
```

### Deployment Model

**Deployment Target:** Unknown (no `vercel.json`, `railway.json`, or deployment configs found)

**Inferred from code:**
- Next.js 14.2.0 supports both serverless functions and Node.js server mode
- `docker-compose.yml` exists for local PostgreSQL development
- `next.config.js` has minimal config (no explicit serverless/server mode)

**Docker Compose (Local Dev):**
```yaml:docker-compose.yml
services:
  postgres:
    image: postgres:17
    container_name: vehicle_app_postgres
    ports:
      - "5444:5432"
```

**Next.js Config:**
```javascript:next.config.js
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
```

**Evidence:**
- `next.config.js` - no explicit runtime configuration
- `docker-compose.yml` - local development only
- No deployment platform configs found

### Route Groups & Dynamic Routes

**Route Groups:**
- `(public)` - Public-facing routes
- `admin` - Admin routes (protected)

**Dynamic Routes:**
- `/car/[plate]` - Vehicle details page
  - Location: `app/(public)/car/[plate]/page.tsx`
  - Server Component (no `'use client'` directive)

**Evidence:**
- File structure from `Get-ChildItem` output
- `app/(public)/car/[plate]/page.tsx` - Server Component

---

## 3) Security & Abuse-Prevention

### Admin Authentication Mechanism

**Location:** `lib/adminAuth.ts`

**Cookie Details:**
- **Name:** `admin_session`
- **Value:** Directly stores `process.env.ADMIN_KEY` (plain text, not hashed/JWT)
- **HttpOnly:** `true` (line 23)
- **Secure:** `process.env.NODE_ENV === 'production'` (line 24)
- **SameSite:** `'lax'` (line 25)
- **MaxAge:** 24 hours (86400 seconds) (line 26)
- **Path:** `'/'` (line 27)

**Validation Logic:**
```typescript:lib/adminAuth.ts
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  
  if (!session?.value) {
    return false
  }

  // Simple validation - in production, use JWT or session store
  const expectedValue = process.env.ADMIN_KEY
  return session.value === expectedValue
}
```

**Admin Key Source:**
- Read from `process.env.ADMIN_KEY` (line 16, 22, 37)
- No validation of env var existence at startup
- No minimum length or complexity requirements

**Evidence:**
- `lib/adminAuth.ts:7-38` - Full auth implementation

### Admin Route Protection

**Middleware Protection:**
```typescript:middleware.ts
if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
  const adminSession = request.cookies.get('admin_session')
  if (!adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

**Server-Side Protection:**
All admin API routes call `verifyAdminSession()`:
- `/api/admin/settings` - POST (line 13)
- `/api/admin/contact/update-status` - POST (line 15)
- `/api/admin/cleanup-not-found` - POST (line 7)
- `/api/admin/check-auth` - GET (line 5)

**Admin Routes:**
- `/admin` - Protected by middleware + server check
- `/admin/login` - Public (excluded from middleware check)
- `/admin/ads` - Protected by middleware
- `/admin/contact` - Protected by middleware
- `/admin/search-logs` - Protected by middleware
- `/admin/settings` - Protected by middleware

**Evidence:**
- `middleware.ts:17-22` - Middleware protection
- `app/api/admin/*/route.ts` - Server-side checks

### Mutation Endpoints Auth

**Endpoints using cookie-based auth:**
- ✅ `/api/admin/settings` - POST (uses `verifyAdminSession()`)
- ✅ `/api/admin/contact/update-status` - POST (uses `verifyAdminSession()`)
- ✅ `/api/admin/cleanup-not-found` - POST (uses `verifyAdminSession()`)

**Evidence:**
- All admin mutation endpoints verified in code

### Rate Limiting

**Contact Form:**
- **Location:** `app/api/contact/route.ts:104-120`
- **Method:** Database query count by email
- **Window:** 1 hour (60 * 60 * 1000 ms)
- **Limit:** 5 messages per email per hour
- **Storage:** PostgreSQL (ContactMessage table)
- **Key:** Email address

```typescript:app/api/contact/route.ts
const recentMessages = await db.contactMessage.count({
  where: {
    email: validatedData.email,
    createdAt: {
      gte: new Date(Date.now() - 60 * 60 * 1000), // שעה אחרונה
    },
  },
})

if (recentMessages >= 5) {
  return NextResponse.json(
    { ok: false, error: 'יותר מדי הודעות נשלחו מהאימייל הזה. אנא נסה שוב מאוחר יותר.' },
    { status: 429 }
  )
}
```

**Ad Events:**
- **Location:** `app/api/ads/event/route.ts:12-36`
- **Method:** In-memory Map (resets on server restart)
- **Window:** 1 minute (60 * 1000 ms)
- **Limit:** 100 events per visitor+slot+eventType per minute
- **Storage:** In-memory `Map<string, { count: number; resetAt: number }>`
- **Key:** `${visitorId}:${slotKey}:${eventType}`

**Vehicle Lookup:**
- **Rate Limiting:** None found
- **Evidence:** `app/api/vehicle/lookup/route.ts` - No rate limiting code

**Evidence:**
- `app/api/contact/route.ts:104-120`
- `app/api/ads/event/route.ts:12-36`
- `app/api/vehicle/lookup/route.ts` - No rate limiting

### Input Validation & XSS Protection

**Contact Form:**
- **Validation:** Zod schema (`ContactFormSchema`) - `app/api/contact/route.ts:6-36`
- **XSS Protection:** Custom regex patterns - `app/api/contact/route.ts:39-59`
- **SQL Injection:** Prisma ORM (parameterized queries)

**Patterns Checked:**
```typescript:app/api/contact/route.ts
const dangerousPatterns = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /expression\s*\(/i,
  /vbscript:/i,
  /data:text\/html/i,
  /SELECT\s+.*\s+FROM/i,
  /INSERT\s+INTO/i,
  /UPDATE\s+.*\s+SET/i,
  /DELETE\s+FROM/i,
  /DROP\s+TABLE/i,
  /UNION\s+SELECT/i,
]
```

**Evidence:**
- `app/api/contact/route.ts:6-102` - Full validation logic

---

## 4) Data Model & DB Performance

### Prisma Schema

**Models:**

**Visitor:**
```prisma:prisma/schema.prisma
model Visitor {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  lastSeenAt DateTime @default(now())

  searchEvents SearchEvent[]
  adEvents     AdEvent[]

  @@index([lastSeenAt])
}
```

**Vehicle (Cache Table):**
```prisma:prisma/schema.prisma
model Vehicle {
  id              String   @id @default(cuid())
  plateNormalized String   @unique
  plateFormatted  String
  manufacturer    String
  modelName       String
  year            Int?
  trimLevel       String?
  ownership       String?
  licenseValidUntil DateTime?
  lastTestDate    DateTime?
  color           String?
  safetyLevel     String?
  pollutionGroup  String?
  engineModel     String?
  vehicleType     String?
  frontTire       String?
  rearTire        String?
  fuelType        String?
  roadDate        DateTime?
  commercialName  String?
  lastFetchedAt   DateTime @default(now())
  sourceName      String   @default("data.gov.il")

  searchEvents SearchEvent[]

  @@index([lastFetchedAt])
  @@index([plateNormalized])
}
```

**SearchEvent:**
```prisma:prisma/schema.prisma
model SearchEvent {
  id             String        @id @default(cuid())
  visitorId      String
  vehicleId      String?
  plateNormalized String
  plateFormatted String
  resultStatus   ResultStatus
  licenseStatus  LicenseStatus
  responseMs     Int
  createdAt      DateTime      @default(now())
  userAgent      String?
  ipHash         String?

  visitor Visitor @relation(fields: [visitorId], references: [id], onDelete: Cascade)
  vehicle Vehicle? @relation(fields: [vehicleId], references: [id], onDelete: SetNull)

  @@index([visitorId])
  @@index([createdAt])
  @@index([plateNormalized])
}
```

**ContactMessage:**
```prisma:prisma/schema.prisma
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String
  status    ContactStatus @default(PENDING)
  createdAt DateTime @default(now())
  readAt    DateTime?
  repliedAt DateTime?

  @@index([status])
  @@index([createdAt])
  @@index([email])
}
```

**AdEvent:**
```prisma:prisma/schema.prisma
model AdEvent {
  id         String      @id @default(cuid())
  visitorId  String?
  slotKey    String
  pagePath   String
  eventType  AdEventType
  createdAt  DateTime    @default(now())

  visitor Visitor? @relation(fields: [visitorId], references: [id], onDelete: SetNull)

  @@index([visitorId])
  @@index([createdAt])
  @@index([slotKey])
  @@index([pagePath])
}
```

**Evidence:**
- `prisma/schema.prisma` - Full schema

### Indexes Summary

**Visitor:**
- `[lastSeenAt]`

**Vehicle:**
- `[lastFetchedAt]`
- `[plateNormalized]` (unique)

**SearchEvent:**
- `[visitorId]`
- `[createdAt]`
- `[plateNormalized]`

**ContactMessage:**
- `[status]`
- `[createdAt]`
- `[email]`

**AdEvent:**
- `[visitorId]`
- `[createdAt]`
- `[slotKey]`
- `[pagePath]`

**Missing Indexes:**
- `SearchEvent.resultStatus` - No index
- `SearchEvent.licenseStatus` - No index
- Composite index on `[visitorId, createdAt]` for history queries - No index

**Evidence:**
- `prisma/schema.prisma` - All indexes listed

### Prisma Client Initialization

**Location:** `lib/db.ts`

**Singleton Strategy:**
```typescript:lib/db.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**Pooling Strategy:**
- **Explicit Configuration:** None found
- **Connection String:** Uses `process.env.DATABASE_URL`
- **Neon Pooling:** Unknown (would be in DATABASE_URL if used)
- **pgbouncer:** Unknown (would be in DATABASE_URL if used)

**Evidence:**
- `lib/db.ts` - Full implementation
- No explicit PrismaClient configuration options

### Hottest Queries

**1. Vehicle Lookup:**
- **Location:** `app/api/vehicle/lookup/route.ts:40-42`
- **Query Type:** `findUnique` by `plateNormalized`
- **Aggregation:** None (single record)
- **Index Used:** `[plateNormalized]` (unique)

```typescript:app/api/vehicle/lookup/route.ts
let vehicle = await db.vehicle.findUnique({
  where: { plateNormalized: normalized },
})
```

**2. History Page Query:**
- **Location:** `app/(public)/history/page.tsx:68-80`
- **Query Type:** `findMany` with filters
- **Aggregation:** None (client-side filtering for status)
- **Indexes Used:** `[visitorId]`, `[createdAt]`, `[resultStatus]` (no index)

```typescript:app/(public)/history/page.tsx
const searchEvents = await db.searchEvent.findMany({
  where: {
    ...where,
    resultStatus: 'FOUND',
  },
  include: {
    vehicle: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 50,
})
```

**3. Weekly Search Volume (Metrics):**
- **Location:** `lib/metrics.ts:77-100`
- **Query Type:** `findMany` with date range
- **Aggregation:** JavaScript (not SQL) - loads all records into memory
- **Index Used:** `[createdAt]`

```typescript:lib/metrics.ts
export async function getWeeklySearchVolume(range: TimeRange): Promise<WeeklySearchData[]> {
  const searches = await db.searchEvent.findMany({
    where: {
      createdAt: {
        gte: range.start,
        lte: range.end,
      },
    },
    select: {
      createdAt: true,
    },
  })

  const grouped = new Map<string, number>()
  
  searches.forEach((search) => {
    const dateKey = startOfDay(search.createdAt).toISOString().split('T')[0]
    grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1)
  })

  return Array.from(grouped.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
```

**Performance Issue:** This query loads all matching records into memory and aggregates in JavaScript. For large date ranges, this could be inefficient.

**Evidence:**
- `app/api/vehicle/lookup/route.ts:40-42`
- `app/(public)/history/page.tsx:68-80`
- `lib/metrics.ts:77-100`

---

## 5) External API Integration & Caching

### Government API Integration

**Module:** `lib/govApi.ts`

**Request URL Construction:**
```typescript:lib/govApi.ts
const GOV_API_BASE = 'https://data.gov.il/api/3/action/datastore_search'
const RESOURCE_ID = '053cea08-09bc-40ec-8f7a-156f0677aff3'

export async function fetchVehicleData(plateNormalized: string): Promise<VehicleData | null> {
  const url = new URL(GOV_API_BASE)
  url.searchParams.set('resource_id', RESOURCE_ID)
  url.searchParams.set('limit', '1')
  url.searchParams.set('filters', JSON.stringify({ mispar_rechev: plateNormalized }))
  
  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 86400 }
  })
}
```

**Timeout Handling:**
- **AbortController:** No
- **Explicit timeout:** No
- **Evidence:** `lib/govApi.ts:128-135` - No timeout configuration

**Retry/Backoff:**
- **Retry Logic:** No
- **Backoff Strategy:** No
- **Evidence:** `lib/govApi.ts:122-155` - Single attempt only

**Error Mapping:**
```typescript:lib/govApi.ts
if (!response.ok) {
  throw new Error(`API returned ${response.status}`)
}

const validated = GovApiResponseSchema.parse(data)

if (!validated.success || validated.result.records.length === 0) {
  return null
}
```

**Status Codes Returned to Client:**
- `400` - Zod validation error (from `app/api/vehicle/lookup/route.ts:134-137`)
- `500` - Generic error (from `app/api/vehicle/lookup/route.ts:153-156`)
- `404` - Vehicle not found (from `app/api/vehicle/lookup/route.ts:60-63`)

**Evidence:**
- `lib/govApi.ts:122-155` - Full implementation
- `app/api/vehicle/lookup/route.ts:112-157` - Error handling

### Caching Strategy

**1. Next.js Fetch Cache:**
- **Location:** `lib/govApi.ts:134`
- **TTL:** 86400 seconds (24 hours)
- **Key:** URL with query params
- **Storage:** Next.js internal cache

```typescript:lib/govApi.ts
const response = await fetch(url.toString(), {
  headers: {
    'Accept': 'application/json',
  },
  next: { revalidate: 86400 }
})
```

**2. Database Cache (Vehicle Table):**
- **Location:** `app/api/vehicle/lookup/route.ts:39-49`
- **TTL:** 6 hours (CACHE_DURATION_MS = 6 * 60 * 60 * 1000)
- **Key:** `plateNormalized` (unique index)
- **Storage:** PostgreSQL Vehicle table
- **Invalidation:** Based on `lastFetchedAt` timestamp

```typescript:app/api/vehicle/lookup/route.ts
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000 // 6 hours

let vehicle = await db.vehicle.findUnique({
  where: { plateNormalized: normalized },
})
let shouldFetch = true
if (vehicle) {
  const cacheAge = Date.now() - vehicle.lastFetchedAt.getTime()
  if (cacheAge < CACHE_DURATION_MS) {
    shouldFetch = false
  }
}
```

**3. In-Memory Cache:**
- **Ad Events Rate Limiting:** `Map<string, { count: number; resetAt: number }>` - `app/api/ads/event/route.ts:13`
- **TTL:** 1 minute (resets on server restart)
- **Storage:** In-memory Map

**Negative Caching:**
- **NOT_FOUND Searches:** Not saved to database (line 59 comment: "Don't save NOT_FOUND searches to history")
- **Evidence:** `app/api/vehicle/lookup/route.ts:58-63`

**Evidence:**
- `lib/govApi.ts:134` - Next.js fetch cache
- `app/api/vehicle/lookup/route.ts:13,39-49` - DB cache
- `app/api/ads/event/route.ts:13` - In-memory cache

### API Authentication

**Government API:**
- **API Key:** None found in code
- **Authentication:** Public API (no auth headers)
- **Evidence:** `lib/govApi.ts:129-132` - Only `Accept` header, no auth

---

## 6) Observability & Ops

### Error Logging

**Method:** `console.error()` throughout codebase

**Locations:**
- `app/api/vehicle/lookup/route.ts:113,116,213`
- `app/api/contact/route.ts:148`
- `app/api/ads/event/route.ts:69`
- `app/api/admin/login/route.ts:33`
- `app/api/admin/settings/route.ts:52`
- `app/api/admin/cleanup-not-found/route.ts:27`
- `app/api/admin/contact/update-status/route.ts:72`
- `app/api/admin/logout/route.ts:9`
- `app/api/history/export.csv/route.ts:64`
- `lib/govApi.ts:152`
- `components/ads/AdSlot.tsx:36`
- `app/admin/components/LogoutButton.tsx:23`

**Structured Logging:**
- **Format:** Plain `console.error()` calls
- **Structured Data:** Some include error objects, but not consistent
- **Example:**
```typescript:app/api/vehicle/lookup/route.ts
console.error('Zod validation error in fetchVehicleData:', {
  errors: error.errors,
  normalizedPlate: normalized,
})
```

**Evidence:**
- `grep -r "console.error"` output - 17 occurrences

### Monitoring & APM

**Sentry:** Not found  
**LogRocket:** Not found  
**OpenTelemetry:** Found in `package-lock.json` (dependency of another package, not directly used)  
**Vercel Analytics:** Not found

**Evidence:**
- `grep -i "sentry|logrocket|opentelemetry|vercel.*analytics"` - Only OpenTelemetry as transitive dependency

### Health Checks

**Health Check Endpoint:** None found

**Evidence:**
- No `/api/health` or similar endpoint

---

## 7) Frontend Rendering & UX

### Server vs Client Components

**Home Page (`/`):**
- **Location:** `app/(public)/page.tsx`
- **Type:** Server Component (no `'use client'` directive)
- **Evidence:** File content

**Vehicle Page (`/car/[plate]`):**
- **Location:** `app/(public)/car/[plate]/page.tsx`
- **Type:** Server Component
- **Evidence:** File content (no `'use client'`)

**History Page (`/history`):**
- **Location:** `app/(public)/history/page.tsx`
- **Type:** Server Component
- **Evidence:** File content (no `'use client'`)

**Admin Dashboard:**
- **Location:** `app/admin/page.tsx`
- **Type:** Unknown (file not read, but likely Server Component based on pattern)

**Client Components Found:**
- `app/(public)/contact/page.tsx` - `'use client'`
- `app/(public)/history/components/HistoryFiltersClient.tsx` - `'use client'`
- `app/admin/login/page.tsx` - `'use client'`
- `app/admin/components/*.tsx` - Multiple `'use client'`
- `components/ui/hero-search-box.tsx` - `'use client'`

**Evidence:**
- `grep "use client|use server"` output - 14 client components found

### Loading & Error Boundaries

**Loading States:**
- **`loading.tsx` files:** None found
- **Evidence:** `glob_file_search` for `loading.tsx` - 0 results

**Error Boundaries:**
- **`error.tsx` files:** None found
- **Evidence:** `glob_file_search` for `error.tsx` - 0 results

**Not Found:**
- **`not-found.tsx`:** Found at `app/not-found.tsx` and `app/(public)/car/[plate]/not-found.tsx`
- **Evidence:** File structure

### SEO & Metadata

**Root Metadata:**
```typescript:app/layout.tsx
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'CheckCarIL',
  description: 'בדיקת מידע על רכב ישראלי לפי מספר רישוי',
}
```

**Dynamic Metadata:**
- **Vehicle Pages:** Unknown (file not fully read for metadata exports)
- **Evidence:** `app/layout.tsx:7-10` - Static metadata only

**JSON-LD Structured Data:**
- **Usage:** Not found
- **Evidence:** No JSON-LD found in codebase search

**Revalidation:**
- **ISR:** None found (no `export const revalidate`)
- **Path Revalidation:** Found in `app/(public)/history/actions.ts:11` - `revalidatePath('/history')`
- **Evidence:** `grep "revalidate"` output

---

## 8) Concrete Risks + Prioritized Fix Plan

### High Priority Risks

**1. No Rate Limiting on Vehicle Lookup API**
- **Risk:** DoS vulnerability, abuse potential
- **Evidence:** `app/api/vehicle/lookup/route.ts` - No rate limiting code
- **Impact:** Could exhaust database connections or external API quota

**2. Admin Auth Uses Plain Text Cookie**
- **Risk:** Session hijacking if cookie is intercepted
- **Evidence:** `lib/adminAuth.ts:22` - Stores `ADMIN_KEY` directly in cookie
- **Impact:** Admin account compromise

**3. No Timeout on External API Calls**
- **Risk:** Hanging requests, resource exhaustion
- **Evidence:** `lib/govApi.ts:128-135` - No timeout configuration
- **Impact:** Server resource exhaustion, poor UX

**4. Inefficient Metrics Query**
- **Risk:** Memory exhaustion, slow admin dashboard
- **Evidence:** `lib/metrics.ts:77-100` - Loads all records into memory
- **Impact:** Performance degradation with large datasets

**5. Missing Database Indexes**
- **Risk:** Slow queries on SearchEvent filters
- **Evidence:** `prisma/schema.prisma` - No indexes on `resultStatus`, `licenseStatus`
- **Impact:** Slow history page queries

### Medium Priority Risks

**6. No Error Boundaries**
- **Risk:** Poor error UX, full page crashes
- **Evidence:** No `error.tsx` files found
- **Impact:** Bad user experience on errors

**7. No Loading States**
- **Risk:** Poor perceived performance
- **Evidence:** No `loading.tsx` files found
- **Impact:** User confusion during data fetching

**8. In-Memory Rate Limiting Resets on Restart**
- **Risk:** Rate limit bypass after deployment
- **Evidence:** `app/api/ads/event/route.ts:13` - In-memory Map
- **Impact:** Temporary rate limit bypass

**9. No Health Check Endpoint**
- **Risk:** Difficult to monitor service health
- **Evidence:** No `/api/health` endpoint
- **Impact:** Ops visibility issues

**10. No Structured Error Logging**
- **Risk:** Difficult to debug production issues
- **Evidence:** `console.error()` throughout codebase
- **Impact:** Poor observability

### Low Priority Risks

**11. No Retry Logic on External API**
- **Risk:** Temporary failures cause permanent errors
- **Evidence:** `lib/govApi.ts` - Single attempt only
- **Impact:** Reduced reliability

**12. No Request Size Limits**
- **Risk:** Memory exhaustion from large payloads
- **Evidence:** No explicit size limits in middleware or API routes
- **Impact:** Potential DoS

**13. Missing SEO Optimization**
- **Risk:** Poor search engine visibility
- **Evidence:** No JSON-LD, static metadata only
- **Impact:** Lower organic traffic

---

## 9) Appendix: Evidence

### Command Outputs

**Node/npm Versions:**
```
node -v
v20.19.0

npm -v
10.8.2
```

**File Structure:**
- See `Get-ChildItem` outputs in sections above

### Key File Paths

**Core Files:**
- `middleware.ts` - Request middleware
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies and scripts
- `prisma/schema.prisma` - Database schema
- `lib/db.ts` - Prisma client initialization
- `lib/adminAuth.ts` - Admin authentication
- `lib/govApi.ts` - External API integration
- `lib/metrics.ts` - Metrics queries
- `lib/visitor.ts` - Visitor tracking

**API Routes:**
- `app/api/vehicle/lookup/route.ts` - Vehicle lookup (POST)
- `app/api/contact/route.ts` - Contact form (POST)
- `app/api/ads/event/route.ts` - Ad events (POST)
- `app/api/admin/login/route.ts` - Admin login (POST)
- `app/api/admin/settings/route.ts` - Admin settings (POST)
- `app/api/admin/check-auth/route.ts` - Auth check (GET)
- `app/api/admin/cleanup-not-found/route.ts` - Cleanup (POST)
- `app/api/admin/contact/update-status/route.ts` - Contact status (POST)
- `app/api/admin/logout/route.ts` - Admin logout (POST)
- `app/api/history/export.csv/route.ts` - CSV export (GET)

**Pages:**
- `app/(public)/page.tsx` - Home page
- `app/(public)/car/[plate]/page.tsx` - Vehicle details
- `app/(public)/history/page.tsx` - Search history
- `app/admin/page.tsx` - Admin dashboard

### Code Snippets

All code snippets are referenced with file paths and line numbers in sections above.

---

**End of Technical Snapshot**
