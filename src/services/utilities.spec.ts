import colors from 'colors'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest'

type ConsoleMethods = 'log' | 'error' | 'warn' | 'info' | 'debug'
const consoleSpies = vi.hoisted(() => {
  const methods = ['log', 'error', 'warn', 'info', 'debug'] as const
  const entries = methods.map((method) => {
    const spy = vi.spyOn(console, method).mockImplementation(() => {})
    return [method, spy] as const
  })
  return Object.fromEntries(entries) as { [K in ConsoleMethods]: Mock }
})

const { handleError, log, startSpinner } = await import('./utilities.js')

describe('Utilities', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.clearAllMocks()

    // Spy on stdout and process configurations
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any)
    process.stdout.clearLine = vi.fn(() => true) as any
    vi.spyOn(process.stdout, 'clearLine')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('log()', () => {
    it('should respect NO_COLOR environment variable settings', () => {
      const disableSpy = vi.spyOn(colors, 'disable')
      const enableSpy = vi.spyOn(colors, 'enable')

      process.env.NO_COLOR = 'true'
      log('info', 'Test message')
      expect(disableSpy).toHaveBeenCalled()

      process.env.NO_COLOR = 'false'
      log('info', 'Test message')
      expect(enableSpy).toHaveBeenCalled()
    })

    it('should suppress logs if the item level is higher than the current LOG_LEVEL value', () => {
      // debug level is 7, warning LOG_LEVEL maps to 4. 7 > 4, so it should be skipped.
      process.env.LOG_LEVEL = 'warning'
      log('debug', 'Hidden debug message')
      expect(consoleSpies.debug).not.toHaveBeenCalled()
    })

    it('should execution-pass and output logs if item level is within the LOG_LEVEL configuration', () => {
      // maps to 7, debug level is 7. 7 <= 7, should print.
      process.env.LOG_LEVEL = 'debug'
      log('error', 'Visible debug message')
      expect(consoleSpies.error).toHaveBeenCalled()
    })

    it('should drop emojis and append the text label when NO_EMOTE is set to true', () => {
      process.env.NO_EMOTE = 'true'
      process.env.LOG_LEVEL = 'debug'
      process.env.NO_COLOR = 'true'
      log('info', 'Emoteless text')

      // Verifies that the designated label string replaces the default emoji argument
      expect(consoleSpies.info).toHaveBeenCalledWith(
        '\n',
        'Info: ',
        'Emoteless text',
      )
    })
  })

  describe('handleError()', () => {
    it('should trigger error and debug logs and update the application process exit code', () => {
      const errorMock = new Error('Database connection failed')

      handleError(errorMock)

      // Asserts that log runs internal 'error' level logic
      expect(consoleSpies.error).toHaveBeenCalledWith(
        '\n',
        expect.any(String),
        expect.any(String),
      )
      // Asserts that the process exit status flag updates to 1
      expect(process.exitCode).toBe(1)
    })
  })

  describe('startSpinner()', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should manage ANSI terminal cursor visibility state and trigger intervals', () => {
      const stopSpinner = startSpinner('Processing ')

      // 1. Confirms the terminal cursor escape code is written to hide it (\x1B[?25l)
      expect(process.stdout.write).toHaveBeenCalledWith('\x1B[?25l')

      // 2. Clear call history so we only capture what happens during the timer tick
      vi.mocked(process.stdout.write).mockClear()

      // Move time forward to execute the internal setInterval loop step
      vi.advanceTimersByTime(80)

      // Postfix step++ means step 0 evaluates first, yielding frame '⠋'
      expect(process.stdout.write).toHaveBeenCalledWith('\rProcessing ⠋')

      // 3. Clear call history again to verify cleanup isolation cleanly
      vi.mocked(process.stdout.write).mockClear()

      // Execute the callback function to terminate the sequence
      stopSpinner()

      // Confirms the interface elements are restored (\x1B[?25h to show cursor, clearLine to wipe text)
      expect(process.stdout.write).toHaveBeenCalledWith('\x1B[?25h')
      expect(process.stdout.clearLine).toHaveBeenCalledWith(0)
    })
  })
})
