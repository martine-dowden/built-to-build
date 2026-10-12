import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest'
import { helloWorld } from './hello-world.js'

describe('helloWorld()', () => {
  let logSpy: Mock<(log: Console['log']) => void>

  beforeEach(() => {
    // Spy on console.log and clear the actual terminal output during tests
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore the original console.log behavior after each test
    vi.restoreAllMocks()
  })

  it('should print only the ASCII logo when no cat fact is provided', async () => {
    await helloWorld()

    // Verify console.log was called exactly once
    expect(logSpy).toHaveBeenCalledTimes(1)

    // Verify the first argument contains a piece of the ASCII banner
    expect(logSpy.mock.calls?.[0]?.[0]).toContain('▗▖ ▗▖▗▄▄▄▖▗▖')
  })

  it('should print the ASCII logo and the formatted cat fact when provided', async () => {
    const testFact = 'Cats have 32 muscles in each ear.'

    await helloWorld(testFact)

    // Verify console.log was called twice (once for the art, once for the fact)
    expect(logSpy).toHaveBeenCalledTimes(2)

    // Assert on the exact shape of the second console.log call
    const [emojiArg, separatorArg, factArg] = logSpy.mock.calls[1] ?? [
      '',
      '',
      '',
    ]

    expect(emojiArg).toBe('\n😺 did you know?')
    expect(separatorArg).toBe('\n')
    expect(factArg).toBe(testFact)
  })
})
