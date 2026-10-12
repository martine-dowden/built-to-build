import type { Credential } from 'firebase-admin'

export type Env = 'local' | 'prod'

export type EnvConfig = {
  /** Needed for running in emulators */
  projectId?: string
  databaseURL?: string
  storageBucket?: string
  /** needed for accessing the DB */
  credential?: Credential
}
