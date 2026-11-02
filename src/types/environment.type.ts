import type { Credential } from 'firebase-admin'
import z from 'zod'

export const Environments = z.literal(['local', 'prod'])
export type Env = z.infer<typeof Environments>

export type EnvConfig = {
  /** Needed for running in emulators */
  projectId?: string
  databaseURL?: string
  storageBucket?: string
  /** needed for accessing the DB */
  credential?: Credential
}
