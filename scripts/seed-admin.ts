import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { loadSupabaseScriptEnv } from './lib/env'
import { createSupabaseAdminClient } from './lib/supabase-admin'

async function main() {
  const env = loadSupabaseScriptEnv()
  const supabase = createSupabaseAdminClient(env)
  const passwordHash = await bcrypt.hash(env.adminPassword, 12)

  const { error } = await supabase.from('admin_credentials').upsert(
    {
      username: env.adminUsername,
      password_hash: passwordHash,
    },
    { onConflict: 'username' }
  )

  if (error) {
    throw error
  }

  console.log(`Admin credential seeded for username: ${env.adminUsername}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
