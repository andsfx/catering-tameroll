insert into public.admin_credentials (username, password_hash)
values ('admin', '$2b$12$Y03dP0ux0R46cT8Tcf/8vuV5BFPYhNbyS4nAUD7.Vi4qx5tSs3jlW')
on conflict (username) do update
set password_hash = excluded.password_hash;

insert into public.batches (
  name,
  status,
  deadline_join,
  remaining_quota,
  next_batch_open,
  next_batch_label,
  start_date,
  end_date,
  source_month,
  is_active,
  notes
) values (
  'Batch April 2026',
  'open',
  '2026-04-05',
  12,
  '2026-04-30',
  'Batch Mei dibuka 30 April pukul 10.00 WIB',
  '2026-04-01',
  '2026-04-29',
  'April',
  true,
  'Seed awal untuk landing page batch catering Tameroll.'
)
on conflict (source_month) do update
set
  name = excluded.name,
  status = excluded.status,
  deadline_join = excluded.deadline_join,
  remaining_quota = excluded.remaining_quota,
  next_batch_open = excluded.next_batch_open,
  next_batch_label = excluded.next_batch_label,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  is_active = excluded.is_active,
  notes = excluded.notes,
  updated_at = now();

update public.batches
set is_active = case when source_month = 'April' then true else false end;

with active_batch as (
  select id from public.batches where source_month = 'April' limit 1
)
delete from public.batch_slots
where batch_id in (select id from active_batch);

with active_batch as (
  select id from public.batches where source_month = 'April' limit 1
)
insert into public.batch_slots (
  batch_id,
  date,
  day_name,
  main_course,
  side_dish,
  extra,
  image_url,
  is_available,
  label,
  sort_order
)
select
  active_batch.id,
  slot.date::date,
  slot.day_name,
  slot.main_course,
  slot.side_dish,
  slot.extra,
  slot.image_url,
  slot.is_available,
  slot.label,
  slot.sort_order
from active_batch,
(
  values
    ('2026-04-01', 'Rabu', 'Ayam Bakar Madu', 'Tumis buncis, sambal matah', 'Kerupuk udang', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200&q=80', true, 'Best Seller', 0),
    ('2026-04-02', 'Kamis', 'Nasi Liwet Komplit', 'Ayam suwir, tahu bacem', 'Buah potong', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80', true, 'New', 1),
    ('2026-04-06', 'Senin', 'Dori Sambal Rica', 'Cah kangkung, tempe krispi', 'Es teh manis', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80', true, 'Favorit', 2),
    ('2026-04-07', 'Selasa', 'Nasi Kebuli Ayam', 'Acar timun, sambal hijau', 'Kurma', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', true, null, 3),
    ('2026-04-08', 'Rabu', 'Chicken Katsu Curry', 'Salad segar, saus kari', 'Jelly leci', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80', true, 'Best Seller', 4),
    ('2026-04-09', 'Kamis', 'Sapi Lada Hitam', 'Capcay, nasi mentega', 'Air mineral', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&q=80', true, null, 5),
    ('2026-04-10', 'Jumat', 'Ayam Woku', 'Tumis jagung muda', 'Pisang goreng mini', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=80', true, null, 6),
    ('2026-04-13', 'Senin', 'Nasi Bakar Ayam Kemangi', 'Tahu crispy, lalapan', 'Sambal terasi', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=1200&q=80', true, 'New', 7),
    ('2026-04-14', 'Selasa', 'Ikan Fillet Asam Manis', 'Brokoli cah bawang', 'Puding mangga', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80', true, null, 8),
    ('2026-04-15', 'Rabu', 'Ayam Teriyaki', 'Salad kol, nasi wijen', 'Buah segar', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=1200&q=80', false, 'Best Seller', 9),
    ('2026-04-16', 'Kamis', 'Beef Blackpepper', 'Mixed vegetables, mashed potato', 'Pudding cokelat', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80', true, null, 10),
    ('2026-04-17', 'Jumat', 'Ayam Bakar Taliwang', 'Plecing kangkung', 'Kerupuk kulit', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=80', true, null, 11),
    ('2026-04-20', 'Senin', 'Salmon Teriyaki', 'Edamame, nasi garlic', 'Fruit cup', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80', true, 'Premium', 12),
    ('2026-04-21', 'Selasa', 'Ayam Popcorn Salted Egg', 'Jagung manis, salad', 'Puding susu', 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=1200&q=80', true, null, 13),
    ('2026-04-22', 'Rabu', 'Soto Betawi Box', 'Emping, sambal', 'Jeruk', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80', true, null, 14),
    ('2026-04-23', 'Kamis', 'Nasi Uduk Betawi', 'Ayam semur, bihun goreng', 'Pisang bakar mini', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', true, 'Favorit', 15),
    ('2026-04-24', 'Jumat', 'Korean Spicy Chicken', 'Kimchi slaw, nasi wijen', 'Jelly kelapa', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80', true, null, 16),
    ('2026-04-27', 'Senin', 'Ayam Goreng Serundeng', 'Urap sayur, sambal ijo', 'Kerupuk', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=80', true, 'Best Seller', 17),
    ('2026-04-28', 'Selasa', 'Empal Gentong Rice Bowl', 'Telur pindang, acar', 'Puding gula aren', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80', true, null, 18),
    ('2026-04-29', 'Rabu', 'Fish and Chips Sambal Matah', 'Salad segar', 'Lemon tea', 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?w=1200&q=80', true, 'New', 19)
) as slot(date, day_name, main_course, side_dish, extra, image_url, is_available, label, sort_order);

insert into public.holidays (date, name, type)
values
  ('2026-04-03', 'Wafat Yesus Kristus', 'Libur Nasional'),
  ('2026-05-01', 'Hari Buruh Internasional', 'Libur Nasional')
on conflict (date) do update
set name = excluded.name,
    type = excluded.type;
