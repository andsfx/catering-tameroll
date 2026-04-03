import { config } from 'dotenv'
import type { MigrationEnv, SupabaseScriptEnv } from './types'

config({ path: '.env.local' })
config()

function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }

  return value
}

function requireAnyEnv(names: string[]): string {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }

  throw new Error(`Missing required env: ${names.join(' or ')}`)
}

export function loadMigrationEnv(): MigrationEnv {
  return {
    supabaseUrl: requireAnyEnv(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']),
    supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    googleSpreadsheetId: requireEnv('GOOGLE_SPREADSHEET_ID'),
    googleServiceAccountEmail: requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    googlePrivateKey: requireEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  }
}

export function loadSupabaseScriptEnv(): SupabaseScriptEnv {
  return {
    supabaseUrl: requireAnyEnv(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']),
    supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  }
}
