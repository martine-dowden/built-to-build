import fs from 'node:fs'
import { Command } from 'commander'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { generateDocs } from './generate-docs.js'

let readFileSyncSpy: Mock<typeof fs.readFileSync>
let writeFileSyncSpy: Mock<typeof fs.writeFileSync>

describe('generateDocs', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Spy on fs operations to prevent touching the real file system
    readFileSyncSpy = vi
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('# Main Title\nInitial content.')
    writeFileSyncSpy = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})
  })

  it('should generate documentation with global options, subcommands, and arguments', () => {
    // 1. Arrange: Build a realistic Command hierarchy using the actual Commander API
    const program = new Command('my-cli')
    program
      .description('A fantastic CLI tool')
      .version('1.0.0')
      .option('-d, --debug', 'output extra debugging', false)

    program
      .command('deploy')
      .description('Deploy project to environment')
      .argument('<env>', 'Target environment')
      .option('-f, --force', 'Force overwriting deployment')

    // 2. Act
    generateDocs(program)

    // 3. Assert: Verify the input read operation
    expect(readFileSyncSpy).toHaveBeenCalledWith('readme-partial.md', 'utf8')

    // 4. Assert: Verify the written documentation structure matches expectations
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      'readme.md',
      expect.stringContaining('# Main Title'),
    )

    // Grab the exact markdown payload passed to writeFileSync
    const writtenMarkdown = writeFileSyncSpy.mock.calls?.[0]?.[1] as string

    // Assert layout structural segments
    expect(writtenMarkdown).toContain('## my-cli')
    expect(writtenMarkdown).toContain('A fantastic CLI tool')
    expect(writtenMarkdown).toContain('### Global Options')
    expect(writtenMarkdown).toContain('-h, --help')
    expect(writtenMarkdown).toContain('-d, --debug')

    // Assert Command structural segments
    expect(writtenMarkdown).toContain('### Commands')
    expect(writtenMarkdown).toContain('#### ▶️ deploy')
    expect(writtenMarkdown).toContain('Deploy project to environment')

    // Assert Arguments and Sub-Options structural segments
    expect(writtenMarkdown).toContain('##### Arguments')
    expect(writtenMarkdown).toContain('| env | Target environment |')
    expect(writtenMarkdown).toContain('##### Options')
    expect(writtenMarkdown).toContain(
      '| -f, --force | Force overwriting deployment |',
    )
  })

  it('should handle a program with no subcommands or descriptions cleanly', () => {
    // Arrange
    const minimalProgram = new Command('mini-cli')

    // Act
    generateDocs(minimalProgram)

    // Assert
    const writtenMarkdown = writeFileSyncSpy.mock.calls?.[0]?.[1] as string
    expect(writtenMarkdown).toContain('## mini-cli')
    expect(writtenMarkdown).not.toContain('### Commands')
    expect(writtenMarkdown).toContain('### Global Options')
  })
})
