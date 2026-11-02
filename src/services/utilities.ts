import { styleText } from 'node:util'
import type { LogLevel, LogType, LogTypeDetails } from '../types/log.type.js'
import type { ProgramOptions } from '../types/program-options.type.js'

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
    color: 'dim',
    console: console.debug,
    label: 'Debug',
  },
  info: {
    icon: 'ℹ️ ',
    level: 6,
    color: 'cyan',
    console: console.info,
    label: 'Info',
  },
  log: {
    icon: '🪵 ',
    level: 6,
    color: 'gray',
    console: console.log,
    label: 'Log',
  },
  success: {
    icon: '✅',
    level: 5,
    color: 'green',
    console: console.log,
    label: 'Success',
  },
  warn: {
    icon: '⚠️ ',
    level: 4,
    color: 'yellow',
    console: console.warn,
    label: 'Warning',
  },
  error: {
    icon: '🐞',
    level: 3,
    color: 'red',
    console: console.error,
    label: 'Error',
  },
  exit: {
    icon: '👋',
    level: 5,
    color: 'bold',
    console: console.log,
    label: 'Exit',
  },
}

/** Styles logs by log type */
export function log(logType: LogType, ...args: any[]): void {
  const includeColor = !process.env.NO_COLOR || process.env.NO_COLOR === 'false'
  const details: LogTypeDetails = logTypeDetails[logType]
  const logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'debug'
  const logLevelValue: number = logLevelMap[logLevel] ?? 6
  if (details.level > logLevelValue) {
    return
  }

  const messages = args.map((arg) =>
    includeColor && typeof arg === 'string'
      ? styleText(['reset', details.color], arg)
      : arg,
  )
  const label = includeColor
    ? styleText(['reset', details.color], details.label)
    : details.label
  const icon = process.env.NO_EMOTE === 'true' ? `${label}: ` : details.icon

  details.console(icon, ...messages)
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
export function startSpinner({
  message = 'Loading ',
  programOptions,
}: {
  message?: string
  programOptions: ProgramOptions
}): () => void {
  if (programOptions.ci) {
    process.stderr.write(`${message}\n`)
    return () => {}
  }

  //  restore cursor if terminated by user (Ctr + C)
  const showCursor = () => {
    process.stderr.write('\x1B[?25h')
  }
  const onSigint = () => {
    showCursor()
    process.exit(130) // 128 + 2 (SIGINT)
  }
  process.once('SIGINT', onSigint)
  process.once('exit', showCursor)

  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let step = 0

  // Hide the terminal cursor so it doesn't blink over the spinner
  process.stderr.write('\x1B[?25l')

  const timer = setInterval(() => {
    process.stderr.write(`\r${message}${frames[step++ % frames.length]}`)
  }, 80)

  // Return a stop function to easily clean up after loader
  return () => {
    clearInterval(timer)
    process.removeListener('SIGINT', onSigint)
    process.removeListener('exit', showCursor)
    process.stderr.write('\r')
    process.stderr.clearLine?.(0) // Clear the spinner text
    process.stderr.write('\x1B[?25h') // Restore the cursor
  }
}
