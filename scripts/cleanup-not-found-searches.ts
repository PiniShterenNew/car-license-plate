/**
 * Script to delete all NOT_FOUND search events from the database
 * Run with: npx tsx scripts/cleanup-not-found-searches.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupNotFoundSearches() {
  try {
    console.log('Starting cleanup of NOT_FOUND search events...')
    
    const result = await prisma.searchEvent.deleteMany({
      where: {
        resultStatus: 'NOT_FOUND',
      },
    })

    console.log(`✅ Successfully deleted ${result.count} NOT_FOUND search events`)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupNotFoundSearches()
