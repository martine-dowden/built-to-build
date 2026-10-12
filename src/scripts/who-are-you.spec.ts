import { input } from '@inquirer/prompts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { log } from '../services/utilities.js'
import { type WhoAreYouOptions, whoAreYou } from './who-are-you.js'

// 1. Mock external dependencies
vi.mock('@inquirer/prompts', () => ({ input: vi.fn() }))

vi.mock('../services/utilities.js', () => ({ log: vi.fn() }))

describe('whoAreYou()', () => {
  beforeEach(() => {
    // Reset process.exitCode and all mock histories before each test
    process.exitCode = undefined
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // --- Group 1: Command Line Option Validation ---
  describe('Options Validation', () => {
    it('should fail validation and set exit code 9 if a command option exceeds 20 characters', async () => {
      const options = {
        programOptions: { ci: false },
        commandOptions: {
          firstName: 'ThisNameIsWayTooLongForThisValidationRule',
        },
      }

      await whoAreYou(options)

      expect(log).toHaveBeenCalledWith(
        'error',
        'invalid option firstName: Name is too long, should be less <= 20 characters',
      )
      expect(process.exitCode).toBe(9)
      expect(input).not.toHaveBeenCalled()
    })
  })

  // --- Group 2: CI Mode Restrictions ---
  describe('CI Mode Behavior', () => {
    it('should exit with code 9 if running in CI mode without options', async () => {
      const options: WhoAreYouOptions = {
        programOptions: { ci: true },
        commandOptions: {},
      }

      await whoAreYou(options)

      expect(log).toHaveBeenCalledWith(
        'error',
        'Please provide a first and last name',
      )
      expect(process.exitCode).toBe(9)
    })
  })

  // --- Group 3: Prompting / Fallbacks (Non-CI) ---
  describe('Interactive Prompts & Fallbacks', () => {
    it('should prompt for both values if no command options are given, then log success', async () => {
      const options = { programOptions: { ci: false }, commandOptions: {} }

      // Mock sequential CLI user entries
      vi.mocked(input)
        .mockResolvedValueOnce('Alex') // First name prompt return value
        .mockResolvedValueOnce('Smith') // Last name prompt return value

      await whoAreYou(options)

      expect(input).toHaveBeenCalledTimes(2)
      expect(log).toHaveBeenCalledWith('success', 'Hello Alex Smith')
      expect(process.exitCode).toBeUndefined()
    })

    it('should skip prompt for first name if it is provided as a valid command option', async () => {
      const options = {
        programOptions: { ci: false },
        commandOptions: { firstName: 'Jane' },
      }

      vi.mocked(input).mockResolvedValueOnce('Doe') // Resolves the last name prompt

      await whoAreYou(options)

      // It should only prompt once (for the missing last name)
      expect(input).toHaveBeenCalledTimes(1)
      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'What is your last name?' }),
      )
      expect(log).toHaveBeenCalledWith('success', 'Hello Jane Doe')
    })
  })

  // --- Group 4: Inline Internal Validator Verification ---
  describe('Internal Input Config Validation', () => {
    it('should evaluate the input validator configuration correctly', async () => {
      const options = { programOptions: { ci: false }, commandOptions: {} }

      await whoAreYou(options)

      // Snatch the config payload passed directly into the first prompt
      const inputConfigPassed = vi.mocked(input).mock.calls?.[0]?.[0]

      expect(inputConfigPassed?.required).toBe(true)
      expect(inputConfigPassed?.validate?.('ShortName')).toBe(true)
      expect(
        inputConfigPassed?.validate?.(
          'ThisNameIsWayTooLongForThisValidationRule',
        ),
      ).toBe('Name is too long, should be less <= 20 characters')
    })
  })
})
