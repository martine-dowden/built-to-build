import fs from 'node:fs'
import { handleError, log, startSpinner } from '../services/utilities.js'
import type { CatFactResponse } from '../types/cat-fact.type.js'

/** get a random cat fact from api */
export async function getCatFact() {
  const stopSpinner = startSpinner()
  const url = 'https://catfact.ninja/fact'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      stopSpinner()
      log('debug', response)
      handleError(new Error(response.statusText))
      return
    }
    const data = (await response.json()) as CatFactResponse
    const fact = data.fact
    fs.writeFileSync('temp.txt', fact)
    stopSpinner()
    log('info', fact)
  } catch (error: unknown) {
    stopSpinner()
    handleError(error as Error)
  }
}
