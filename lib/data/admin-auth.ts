import bcrypt from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminCredentialRow = {
  id: string
  username: string
  password_hash: string
}

export async function getAdminCredential(username: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('admin_credentials')
    .select('id,username,password_hash')
    .eq('username', username)
    .single<AdminCredentialRow>()

  if (error) return null
  return data
}

export async function verifyAdminLogin(input: { username: string; password: string }) {
  const credential = await getAdminCredential(input.username)
  if (!credential) return false

  return bcrypt.compare(input.password, credential.password_hash)
}

export async function updateAdminPassword(input: {
  username: string
  currentPassword: string
  newPassword: string
}) {
  const credential = await getAdminCredential(input.username)
  if (!credential) {
    throw new Error('Admin credential not found')
  }

  const isMatch = await bcrypt.compare(input.currentPassword, credential.password_hash)
  if (!isMatch) {
    throw new Error('Password saat ini tidak sesuai')
  }

  if (input.newPassword.length < 8) {
    throw new Error('Password baru minimal 8 karakter')
  }

  const nextHash = await bcrypt.hash(input.newPassword, 12)
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('admin_credentials')
    .update({ password_hash: nextHash })
    .eq('id', credential.id)

  if (error) throw error
}
