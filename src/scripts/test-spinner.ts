import { log, startSpinner } from '../services/utilities.js'
import type { ProgramOptions } from '../types/program-options.type.js'

/** Displays spinner for 3 seconds */
export function testSpinner(programOptions: ProgramOptions) {
  // Start the spinner
  const stopSpinner = startSpinner({
    message: 'Fetching data... ',
    programOptions,
  })

  // Simulate a 3-second network request
  setTimeout(() => {
    stopSpinner() // Stop the spinner cleanly
    log('success', 'Done! 🎉')
  }, 3000)
}
