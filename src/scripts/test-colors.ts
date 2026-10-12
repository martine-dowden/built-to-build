import { log } from '../services/utilities.js'

/** Prints out one of each of the log versions */
export async function testColors() {
  log('debug', 'this is a debug message')
  log('info', 'this is a info message')
  log('log', 'this is a log message')
  log('exit', 'this is a exit message')
  log('success', 'this is a success message')
  log('warn', 'this is a warn message')
  log('error', 'this is a error message')
}
