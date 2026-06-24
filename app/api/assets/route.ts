import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ assets: [] })
  const category = req.nextUrl.searchParams.get('category')
  const search = req.nextUrl.searchParams.get('search')

  let query = supabase.from('brand_assets').select('*').order('created_at', { ascending: false })
  if (category && category !== 'all') query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assets: data })
}

export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('brand_assets').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ asset: data })
}

export async function DELETE(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabase.from('brand_assets').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
