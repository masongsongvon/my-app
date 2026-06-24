import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
// Note: creative_angles join removed — angle_id is now plain text (no FK)
// Use dynamic_angle_name column for display instead

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ creatives: [] })
  }

  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')
  const verse_id = searchParams.get('verse_id')
  const angle_id = searchParams.get('angle_id')
  const format = searchParams.get('format')

  let query = supabase
    .from('generated_creatives')
    .select(`
      *,
      products(*),
      verses(*)
    `)
    .order('created_at', { ascending: false })

  if (product_id) query = query.eq('product_id', product_id)
  if (verse_id) query = query.eq('verse_id', verse_id)
  if (angle_id) query = query.eq('angle_id', angle_id)
  if (format) query = query.eq('format', format)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Synthesise creative_angles display object from dynamic_angle_name so CreativeCard renders correctly
  const creatives = (data ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    creative_angles: c.dynamic_angle_name
      ? { id: c.angle_id as string, name: c.dynamic_angle_name as string }
      : null,
  }))

  return NextResponse.json({ creatives })
}
