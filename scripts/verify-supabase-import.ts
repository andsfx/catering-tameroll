import 'dotenv/config'
import { loadSupabaseScriptEnv } from './lib/env'
import { createSupabaseAdminClient, verifyImport } from './lib/supabase-admin'

async function main() {
  const env = loadSupabaseScriptEnv()
  const supabase = createSupabaseAdminClient(env)
  const summary = await verifyImport(supabase)

  console.table(summary)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
