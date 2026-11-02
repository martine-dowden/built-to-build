import type { InspectColor } from 'node:util'

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
  color: InspectColor
  console:
    | typeof console.debug
    | typeof console.log
    | typeof console.error
    | typeof console.error
    | typeof console.info
}
