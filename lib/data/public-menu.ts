import { createSupabaseAdminClient } from '@/lib/supabase/admin'

type BatchRow = {
  id: string
  name: string
  status: 'open' | 'running' | 'closed'
  deadline_join: string | null
  remaining_quota: number | null
  next_batch_open: string | null
  next_batch_label: string | null
}

type SlotRow = {
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

export async function getPublicMenuPayload() {
  const supabase = createSupabaseAdminClient()

  const { data: batch, error: batchError } = await supabase
    .from('batches')
    .select('id,name,status,deadline_join,remaining_quota,next_batch_open,next_batch_label')
    .eq('is_active', true)
    .single<BatchRow>()

  if (batchError) {
    throw batchError
  }

  const { data: slots, error: slotsError } = await supabase
    .from('batch_slots')
    .select('date,day_name,main_course,side_dish,extra,image_url,is_available,label,sort_order')
    .eq('batch_id', batch.id)
    .order('date', { ascending: true })
    .order('sort_order', { ascending: true })
    .returns<SlotRow[]>()

  if (slotsError) {
    throw slotsError
  }

  return {
    success: true,
    meta: {
      batchStatus: batch.status,
      currentBatchLabel: batch.name,
      deadlineJoin: batch.deadline_join,
      remainingQuota: batch.remaining_quota,
      nextBatchOpen: batch.next_batch_open,
      nextBatchLabel: batch.next_batch_label,
    },
    data: (slots || []).map((slot) => ({
      date: slot.date,
      dayName: slot.day_name,
      mainCourse: slot.main_course || '',
      sideDish: slot.side_dish || '',
      extra: slot.extra || '',
      imageUrl: slot.image_url || '',
      isAvailable: slot.is_available,
      label: slot.label || '',
    })),
  }
}
