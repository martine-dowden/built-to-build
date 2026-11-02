import fs from 'node:fs'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { getCatFact } from './cat-fact.js'

const mockStopSpinner = vi.fn()
const mockStartSpinner = vi.fn(() => mockStopSpinner)
const mockLog = vi.fn()
const mockHandleError = vi.fn()
let writeFileSyncSpy: Mock<
  (
    file: fs.PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: fs.WriteFileOptions,
  ) => void
>

vi.mock('../services/utilities', () => ({
  startSpinner: () => mockStartSpinner(),
  log: (...args: any[]) => mockLog(...args),
  handleError: (error: Error) => mockHandleError(error),
}))

vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
process.stdout.clearLine = vi.fn().mockReturnValue(true)
process.stdout.cursorTo = vi.fn().mockReturnValue(true)

describe('getCatFact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    writeFileSyncSpy = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})
  })

  it('should successfully fetch a cat fact, write to a file, and log it', async () => {
    // Arrange
    const mockFact = 'Cats sleep 70% of their lives.'
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ fact: mockFact }),
    }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    // Act
    await getCatFact({})

    // Assert
    expect(mockStartSpinner).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://catfact.ninja/fact')
    expect(mockStopSpinner).toHaveBeenCalledTimes(1)
    expect(mockLog).toHaveBeenCalledWith('info', mockFact)
    expect(mockHandleError).not.toHaveBeenCalled()
  })

  it('should handle non-OK HTTP responses gracefully', async () => {
    // Arrange
    const mockResponse = { ok: false, statusText: 'Internal Server Error' }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    // Act
    await getCatFact({})

    // Assert
    expect(mockStartSpinner).toHaveBeenCalledTimes(1)
    expect(mockStopSpinner).toHaveBeenCalledTimes(1)
    expect(mockLog).toHaveBeenCalledWith('debug', mockResponse)
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error))
    expect(writeFileSyncSpy).not.toHaveBeenCalled()
  })

  it('should catch network-level crashes or unexpected errors', async () => {
    // Arrange
    const networkError = new Error('Network failure')
    vi.mocked(fetch).mockRejectedValue(networkError)

    // Act
    await getCatFact({})

    // Assert
    expect(mockStartSpinner).toHaveBeenCalledTimes(1)
    expect(mockStopSpinner).toHaveBeenCalledTimes(1)
    expect(mockHandleError).toHaveBeenCalledWith(networkError)
    expect(writeFileSyncSpy).not.toHaveBeenCalled()
  })
})
