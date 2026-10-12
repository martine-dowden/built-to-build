import { input } from '@inquirer/prompts'
import { log } from '../services/utilities.js'
import type { ProgramOptions } from '../types/program-options.type.js'

/**
 * example script asking user for their first and last name
 * and printing them to the console
 **/
export async function whoAreYou({
  programOptions,
  commandOptions,
}: WhoAreYouOptions) {
  const validate = (value: string) =>
    value.length <= 20
      ? true
      : 'Name is too long, should be less <= 20 characters'

  const inputConfig = { required: true, validate }

  //  Validate values provided via options
  const { firstName, lastName } = commandOptions
  for (const i of Object.keys(commandOptions)) {
    const option = commandOptions[<keyof WhoAreYouOptions['commandOptions']>i]
    if (option) {
      const validity = validate(option)
      if (validity !== true) {
        log('error', `invalid option ${i}: ${validity}`)
        process.exitCode = 9
        return
      }
    }
  }

  const isCI = !!programOptions.ci
  if (isCI && (!firstName || !lastName)) {
    log('error', 'Please provide a first and last name')
    process.exitCode = 9
    return
  }

  const _firstName =
    firstName ??
    (await input({ ...inputConfig, message: 'What is your first name?' }))
  const _lastName =
    lastName ??
    (await input({ ...inputConfig, message: 'What is your last name?' }))
  log('success', `Hello ${_firstName} ${_lastName}`)
  return
}

export type WhoAreYouOptions = {
  programOptions: ProgramOptions
  commandOptions: { firstName?: string; lastName?: string }
}
