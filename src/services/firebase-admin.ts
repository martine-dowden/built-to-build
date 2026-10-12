import type { Command } from 'commander'
import admin, { type ServiceAccount } from 'firebase-admin'
import { type Firestore, getFirestore } from 'firebase-admin/firestore'
import serviceAccount from '../../service-account.json' with { type: 'json' }
import type { Env, EnvConfig } from '../types/environment.type.js'

var _admin: typeof admin

/** initialize firebase */
function getAdmin(program: Command): typeof admin {
  if (_admin) return _admin
  const config: Record<Env, EnvConfig> = {
    local: {
      // TODO: update to match your project. Information can be found in your firebase console
      projectId: 'starter-cf115',
    },
    prod: {
      // TODO: update to match your project. Information can be found in your firebase console
      projectId: 'starter-cf115',
      credential: admin.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://starter-cf115.firebaseio.com',
      storageBucket: 'starter-cf115.appspot.com',
    },
  }
  const env = program.getOptionValue('env') as Env
  if (!env) throw new Error(`Environment not found: env = ${env}`)
  admin.initializeApp(config[env])
  _admin = admin
  return _admin
}

/** get the firestore instance */
export function getDB(program: Command): Firestore {
  if (!_admin) getAdmin(program)
  return getFirestore()
}
