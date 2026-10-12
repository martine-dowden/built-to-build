import colors from 'colors'
import type { LogLevel, LogType, LogTypeDetails } from '../types/log.type.js'

/** Log Levels for log types */
const logLevelMap: Record<LogLevel, number> = {
  debug: 7,
  info: 5,
  warning: 4,
  error: 3,
}

/** Log styling configurations */
const logTypeDetails: Record<LogType, LogTypeDetails> = {
  debug: {
    icon: '🐛',
    level: 7,
    color: colors.dim,
    console: console.debug,
    label: 'Debug',
  },
  info: {
    icon: 'ℹ️ ',
    level: 6,
    color: colors.cyan,
    console: console.info,
    label: 'Info',
  },
  log: {
    icon: '🪵 ',
    level: 6,
    color: colors.dim,
    console: console.log,
    label: 'Log',
  },
  success: {
    icon: '✅',
    level: 5,
    color: colors.green,
    console: console.log,
    label: 'Success',
  },
  warn: {
    icon: '⚠️ ',
    level: 4,
    color: colors.yellow,
    console: console.warn,
    label: 'Warning',
  },
  error: {
    icon: '🐞',
    level: 3,
    color: colors.red,
    console: console.error,
    label: 'Error',
  },
  exit: {
    icon: '👋',
    level: 5,
    color: colors.bold,
    console: console.log,
    label: 'Exit',
  },
}

/** Styles logs by log type */
export function log(logType: LogType, ...args: any[]): void {
  process.env.NO_COLOR === 'true' ? colors.disable() : colors.enable()
  const details: LogTypeDetails = logTypeDetails[logType]
  const logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'
  const logLevelValue: number = logLevelMap[logLevel] ?? 6
  if (details.level > logLevelValue) {
    return
  }

  const messages = args.map((arg) => details.color(arg))
  const label = details.color(details.label)
  const icon = process.env.NO_EMOTE === 'true' ? `${label}: ` : details.icon

  details.console('\n', icon, ...messages)
}

/** Logs errors and sets exitCode */
export function handleError(error: Error): void {
  log('error', error.message)
  log('debug', error)
  process.exitCode = 1
}

/**
 * Display loader
 * @returns Stop function to clean up interval and remove loader text
 **/
export function startSpinner(message = 'Loading '): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let step = 0

  // Hide the terminal cursor so it doesn't blink over the spinner
  process.stdout.write('\x1B[?25l')

  const timer = setInterval(() => {
    process.stdout.write(`\r${message}${frames[step++ % frames.length]}`)
  }, 80)

  // Return a stop function to easily clean up after loader
  return () => {
    clearInterval(timer)
    process.stdout.write('\x1B[?25h') // Restore the cursor
    process.stdout.clearLine(0) // Clear the spinner text
  }
}
