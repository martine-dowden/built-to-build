import { log, startSpinner } from '../services/utilities.js'

/** Displays spinner for 3 seconds */
export function testSpinner() {
  // Start the spinner
  const stopSpinner = startSpinner('Fetching data... ')

  // Simulate a 3-second network request
  setTimeout(() => {
    stopSpinner() // Stop the spinner cleanly
    log('success', 'Done! 🎉')
  }, 3000)
}
