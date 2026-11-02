import { handleError, log, startSpinner } from '../services/utilities.js'
import type { CatFactResponse } from '../types/cat-fact.type.js'
import type { ProgramOptions } from '../types/program-options.type.js'

/** get a random cat fact from api */
export async function getCatFact(programOptions: ProgramOptions) {
  const stopSpinner = startSpinner({ programOptions })
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
    stopSpinner()
    if (programOptions.ci) {
      process.stdout.write(fact)
    } else {
      log('info', fact)
    }
  } catch (error: unknown) {
    stopSpinner()
    handleError(error as Error)
  }
}
