import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ pillars: [] })
  const themeId = req.nextUrl.searchParams.get('theme_id')
  let query = supabase.from('content_pillars').select('*').order('name')
  if (themeId) query = query.eq('theme_id', themeId)
  const { data, error } = await query
  if (error) return NextResponse.json({ pillars: [] })
  return NextResponse.json({ pillars: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })
  const { data, error } = await supabase.from('content_pillars').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ pillar: data })
}
