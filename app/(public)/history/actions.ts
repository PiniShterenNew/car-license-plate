'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteSearchEvent(id: string) {
  await db.searchEvent.delete({
    where: { id },
  })
  revalidatePath('/history')
}

export async function refreshSearch(plateNormalized: string) {
  redirect(`/car/${plateNormalized}?from=history`)
}
