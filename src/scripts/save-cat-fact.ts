import type { Command } from 'commander'
import { getDB } from '../services/firebase-admin.js'
import { handleError, log } from '../services/utilities.js'

/** Saves a provided cat fact to firebase/firestore */
export async function saveCatFact({
  catFact,
  program,
}: {
  catFact: string
  program: Command
}) {
  /** validate my catFact */
  if (!catFact) {
    log('error', 'Please provide a cat fact')
    process.exitCode = 7
    return
  }
  if (typeof catFact !== 'string') {
    log('error', 'Cat fact must be a string')
    process.exitCode = 7
    return
  }
  if (catFact.length > 5000) {
    log('error', 'Cat fact must shorter than 5000 characters')
    process.exitCode = 7
    return
  }

  /** Save my fact to the DB */
  try {
    const db = getDB(program)
    if (program.getOptionValue('commit')) {
      const ref = await db.collection('/catFacts').add({ fact: catFact })
      log('success', `cat fact added with id ${ref.id}`)
    } else {
      log('info', `the following fact would have been saved: ${catFact}`)
    }
  } catch (err: any) {
    handleError(err)
  }
}
