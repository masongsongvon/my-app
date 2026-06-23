import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'

export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }, { status: 503 })
  }

  const results: Record<string, unknown> = {}

  // Upsert products
  const { error: productsError } = await supabase
    .from('products')
    .upsert(SEED_PRODUCTS, { onConflict: 'id' })
  results.products = productsError ? { error: productsError.message } : { ok: true, count: SEED_PRODUCTS.length }

  // Upsert verses
  const { error: versesError } = await supabase
    .from('verses')
    .upsert(SEED_VERSES, { onConflict: 'id' })
  results.verses = versesError ? { error: versesError.message } : { ok: true, count: SEED_VERSES.length }

  // Upsert angles
  const { error: anglesError } = await supabase
    .from('creative_angles')
    .upsert(SEED_ANGLES, { onConflict: 'id' })
  results.angles = anglesError ? { error: anglesError.message } : { ok: true, count: SEED_ANGLES.length }

  return NextResponse.json({ results })
}
