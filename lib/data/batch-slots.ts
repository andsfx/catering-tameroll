import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type BatchSlotRecord = {
  id: string
  batch_id: string
  date: string
  day_name: string
  main_course: string | null
  side_dish: string | null
  extra: string | null
  image_url: string | null
  is_available: boolean
  label: string | null
  sort_order: number
}

type BatchSlotQuery = {
  status?: 'all' | 'available' | 'disabled'
  search?: string
}

export async function getBatchSlots(batchId: string, options: BatchSlotQuery = {}) {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from('batch_slots')
    .select('id,batch_id,date,day_name,main_course,side_dish,extra,image_url,is_available,label,sort_order')
    .eq('batch_id', batchId)

  if (options.status === 'available') {
    query = query.eq('is_available', true)
  }

  if (options.status === 'disabled') {
    query = query.eq('is_available', false)
  }

  if (options.search?.trim()) {
    const search = options.search.trim()
    query = query.or(`main_course.ilike.%${search}%,day_name.ilike.%${search}%,date.ilike.%${search}%`)
  }

  const { data, error } = await query.order('date', { ascending: true }).order('sort_order', { ascending: true }).returns<BatchSlotRecord[]>()

  if (error) throw error
  return data || []
}

export async function upsertBatchSlot(input: {
  id?: string
  batch_id: string
  date: string
  day_name: string
  main_course?: string | null
  side_dish?: string | null
  extra?: string | null
  image_url?: string | null
  is_available: boolean
  label?: string | null
  sort_order: number
}) {
  const supabase = createSupabaseAdminClient()
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    batch_id: input.batch_id,
    date: input.date,
    day_name: input.day_name,
    main_course: input.main_course ?? null,
    side_dish: input.side_dish ?? null,
    extra: input.extra ?? null,
    image_url: input.image_url ?? null,
    is_available: input.is_available,
    label: input.label ?? null,
    sort_order: input.sort_order,
  }

  const { data, error } = await supabase
    .from('batch_slots')
    .upsert(payload)
    .select('id,batch_id,date,day_name,main_course,side_dish,extra,image_url,is_available,label,sort_order')
    .single<BatchSlotRecord>()

  if (error) throw error
  return data
}

export async function deleteBatchSlot(slotId: string) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('batch_slots').delete().eq('id', slotId)
  if (error) throw error
}
