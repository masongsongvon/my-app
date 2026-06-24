import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { generateCreative } from '@/lib/generator'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'
import type { Product, Verse, CreativeAngle, DynamicAngle } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { product_id, verse_id, angle_id, angle_custom, format, notes } = body

  if (!product_id || !verse_id || !angle_id || !format) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let product: Product | undefined
  let verse: Verse | undefined
  let angle: CreativeAngle | undefined

  // Resolve product and verse
  if (isSupabaseConfigured) {
    const [{ data: p }, { data: v }] = await Promise.all([
      supabase.from('products').select('*').eq('id', product_id).single(),
      supabase.from('verses').select('*').eq('id', verse_id).single(),
    ])
    product = p ?? undefined
    verse = v ?? undefined
  } else {
    product = SEED_PRODUCTS.find((p) => p.id === product_id) as Product
    verse = SEED_VERSES.find((v) => v.id === verse_id) as Verse
  }

  // Resolve angle — dynamic angles bypass DB lookup entirely
  const isDynamic = angle_id === 'dynamic'
  if (isDynamic && angle_custom) {
    const dynamic = angle_custom as DynamicAngle
    angle = { id: 'dynamic', name: dynamic.name, description: `${dynamic.hook}\n\n${dynamic.description}` }
  } else if (isSupabaseConfigured) {
    const { data: a } = await supabase.from('creative_angles').select('*').eq('id', angle_id).single()
    angle = a ?? undefined
  } else {
    angle = SEED_ANGLES.find((a) => a.id === angle_id) as CreativeAngle
  }

  if (!product || !verse || !angle) {
    return NextResponse.json({ error: 'Product, verse, or angle not found' }, { status: 404 })
  }

  const output = await generateCreative({ product, verse, angle, notes })

  const record = {
    product_id,
    verse_id,
    // angle_id is stored as text (no FK) — 'dynamic' is valid
    angle_id: isDynamic ? 'dynamic' : angle_id,
    // human-readable angle name stored separately for display
    dynamic_angle_name: angle.name,
    format,
    notes: notes ?? null,
    primary_text: output.primary_text,
    headline: output.headline,
    ugc_script: output.ugc_script,
    voiceover_script: output.voiceover_script,
    product_description: output.product_description,
    hooks: output.hooks,
    ctas: output.ctas,
    landing_page: output.landing_page,
    ecommerce_page: output.ecommerce_page,
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('generated_creatives')
      .insert(record)
      .select(`
        *,
        products(*),
        verses(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Attach angle display object — no longer from a DB join
    const responseCreative = {
      ...data,
      creative_angles: { id: angle.id, name: angle.name, description: angle.description },
    }

    return NextResponse.json({ creative: responseCreative })
  }

  // Non-Supabase path: return without persisting
  const creative = {
    id: `local-${Date.now()}`,
    ...record,
    created_at: new Date().toISOString(),
    products: product,
    verses: verse,
    creative_angles: { id: angle.id, name: angle.name, description: angle.description },
  }

  return NextResponse.json({ creative, persisted: false })
}
