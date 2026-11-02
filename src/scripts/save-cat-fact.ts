import z from 'zod'
import { getDB } from '../services/firebase-admin.js'
import { handleError, log } from '../services/utilities.js'
import { Environments } from '../types/environment.type.js'

const SaveCatFactSchema = z.object({
  ci: z.boolean().default(false),
  commit: z.boolean().default(false),
  fact: z.string().min(1).max(5000),
  env: Environments,
})
export type SaveCatFactOptions = z.infer<typeof SaveCatFactSchema>

/** Saves a provided cat fact to firebase/firestore */
export async function saveCatFact(rawOptions: SaveCatFactOptions) {
  const result = SaveCatFactSchema.safeParse(rawOptions)
  if (!result.success) {
    const e = result.error.issues[0]
    log('error', `${e?.path}: ${e?.message}`)
    process.exitCode = 9
    return
  }
  const { fact, commit, env } = result.data

  /** Save my fact to the DB */
  try {
    const db = getDB(env)
    if (commit) {
      const ref = await db.collection('/catFacts').add({ fact })
      log('success', ref.id)
    } else {
      log('log', `[DRY RUN] Would save fact: ${fact}`)
    }
  } catch (err: any) {
    handleError(err)
  }
}
