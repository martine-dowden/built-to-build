#!/usr/bin/env node

import { Command, Option } from 'commander'
import packageJSON from '../package.json' with { type: 'json' }
import * as scripts from './scripts/index.js'
import { testColors } from './scripts/test-colors.js'
import { log } from './services/utilities.js'
import type { ProgramOptions } from './types/program-options.type.js'

const program = new Command()

program.name('Forge')
program.description('Demo CLI for Built to Build talk')
program.version(packageJSON.version, '-v, --version', 'Current Version')

program.addOption(
  new Option('--ci', 'Indicates the script is being used within automation')
    .env('CI')
    .default(false),
)
program.addOption(
  new Option('-c, --commit', 'Unless set, will perform as dry-run'),
)
program.addOption(
  new Option('-e, --env <env>', 'Environment')
    .choices(['local', 'prod'])
    .env('ENV')
    .default('local'),
)

program.hook('preAction', () => {
  const dryRun = !program.getOptionValue('commit')
  if (dryRun) {
    log('info', 'Dry Run: changes will NOT be saved to the database')
  }
  const env = program.getOptionValue('env')
  log('info', `Current ENV = ${env}`)

  //  Global error handler
  process.on('uncaughtException', (error) => {
    //  gracefully handle quitting if you are in an inquirer prompt
    if (error instanceof Error && error.name === 'ExitPromptError') {
      log('error', 'Script was terminated by user')
    } else {
      //  all other errors
      log('error', `[ ${error.name} ]`, error.message)
      if (error.cause) {
        log('debug', 'Cause: ', error.cause)
      }
      log('debug', error.stack)
    }
    process.exitCode = (error as any).exitCode ?? 1
  })
})

program
  .command('cat-fact')
  .description('returns a random cat fact')
  .action(async () => await scripts.getCatFact())

program
  .command('docs')
  .description('auto generate docs')
  .action(() => scripts.generateDocs(program))

program
  .command('hello')
  .description('My first script')
  .argument('[fact]', 'A random fact to display after the hello world')
  .action((fact) => scripts.helloWorld(fact))

program
  .command('save-cat-fact')
  .description('Save cat fact to firebase collection')
  .argument('[fact]', 'Cat fact')
  .action(async (fact) => await scripts.saveCatFact({ catFact: fact, program }))

program
  .command('test-colors')
  .description('Prints out every util log types')
  .action(() => testColors())

program
  .command('test-spinner')
  .description('Demo spinner on a 3 second timeout')
  .action(() => scripts.testSpinner())

program
  .command('who-are-you')
  .description('Hello ____')
  //  setting up optional parameters
  .option('--firstName [firstName]', 'Your first name')
  .option('--lastName [lastName]', 'Your last name')
  //  pass the program and command option values to the function
  .action((commandOptions) => {
    const programOptions: ProgramOptions = program.opts()
    scripts.whoAreYou({ commandOptions, programOptions })
  })

// Keep parse as last
program.parse()
