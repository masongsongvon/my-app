import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { generateCreative } from '@/lib/generator'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'
import type { Product, Verse, CreativeAngle } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { product_id, verse_id, angle_id, format, notes } = body

  if (!product_id || !verse_id || !angle_id || !format) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let product: Product | undefined
  let verse: Verse | undefined
  let angle: CreativeAngle | undefined

  if (isSupabaseConfigured) {
    const [{ data: p }, { data: v }, { data: a }] = await Promise.all([
      supabase.from('products').select('*').eq('id', product_id).single(),
      supabase.from('verses').select('*').eq('id', verse_id).single(),
      supabase.from('creative_angles').select('*').eq('id', angle_id).single(),
    ])
    product = p ?? undefined
    verse = v ?? undefined
    angle = a ?? undefined
  } else {
    // Fall back to seed data when Supabase is not configured
    product = SEED_PRODUCTS.find((p) => p.id === product_id) as Product
    verse = SEED_VERSES.find((v) => v.id === verse_id) as Verse
    angle = SEED_ANGLES.find((a) => a.id === angle_id) as CreativeAngle
  }

  if (!product || !verse || !angle) {
    return NextResponse.json({ error: 'Product, verse, or angle not found' }, { status: 404 })
  }

  const output = await generateCreative({ product, verse, angle, notes })

  const record = {
    product_id,
    verse_id,
    angle_id,
    format,
    notes: notes ?? null,
    primary_text: output.primary_text,
    headline: output.headline,
    ugc_script: output.ugc_script,
    voiceover_script: output.voiceover_script,
    product_description: output.product_description,
    hooks: output.hooks,
    ctas: output.ctas,
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('generated_creatives')
      .insert(record)
      .select(`
        *,
        products(*),
        verses(*),
        creative_angles(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ creative: data })
  }

  // Return without persisting if Supabase is not configured
  const creative = {
    id: `local-${Date.now()}`,
    ...record,
    created_at: new Date().toISOString(),
    products: product,
    verses: verse,
    creative_angles: angle,
  }

  return NextResponse.json({ creative, persisted: false })
}
