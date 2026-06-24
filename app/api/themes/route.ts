import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ themes: [] })
  const { data, error } = await supabase.from('campaign_themes').select('*').order('name')
  if (error) return NextResponse.json({ themes: [] })
  return NextResponse.json({ themes: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })
  const { data, error } = await supabase.from('campaign_themes').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ theme: data })
}
