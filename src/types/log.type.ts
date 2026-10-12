import type { Color } from 'colors'

export type LogType =
  | 'debug'
  | 'info'
  | 'log'
  | 'exit'
  | 'success'
  | 'warn'
  | 'error'
export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

/** Log styling configuration */
export type LogTypeDetails = {
  icon: string
  label: string
  level: number
  color: Color
  console:
    | typeof console.debug
    | typeof console.log
    | typeof console.error
    | typeof console.error
    | typeof console.info
}
