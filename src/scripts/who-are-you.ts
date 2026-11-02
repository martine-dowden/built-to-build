import { input } from '@inquirer/prompts'
import z from 'zod'
import { log } from '../services/utilities.js'
import type { ProgramOptions } from '../types/program-options.type.js'

// const WhoAreYouSchema = z.object({
//   firstName: z.string().max(20).optional(),
//   lastName: z.string().max(20).optional(),
// })

const WhoAreYouSchema = z.discriminatedUnion('ci', [
  z.object({
    ci: z.literal(false).default(false),
    firstName: z.string().max(20).optional(),
    lastName: z.string().max(20).optional(),
  }),
  z.object({
    ci: z.literal(true),
    firstName: z.string().min(1).max(20),
    lastName: z.string().min(1).max(20),
  }),
])
export type WhoAreYouOptions = z.infer<typeof WhoAreYouSchema>

/**
 * example script asking user for their first and last name
 * and printing them to the console
 **/
export async function whoAreYou(rawOptions: ProgramOptions & WhoAreYouOptions) {
  const result = WhoAreYouSchema.safeParse(rawOptions)

  if (!result.success) {
    result.error.issues.forEach((e) => {
      log('error', `${e.path}: ${e.message}`)
    })
    process.exitCode = 9
    return
  }

  const { firstName, lastName } = result.data || {}
  const inputConfig = {
    required: true,
    validate: (val: string) =>
      val.length <= 20 || 'Max length is 20 characters',
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
