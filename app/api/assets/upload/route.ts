import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const category = (formData.get('category') as string) || 'product_photos'
  const name = (formData.get('name') as string) || file?.name || 'Untitled'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Try to ensure bucket exists
  await supabase.storage.createBucket('brand-assets', { public: true }).catch(() => {})

  const { error: uploadError } = await supabase.storage
    .from('brand-assets')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}. Ensure the 'brand-assets' bucket exists in Supabase Storage with public access.` }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('brand-assets').getPublicUrl(storagePath)

  const { data, error } = await supabase.from('brand_assets').insert({
    name,
    original_name: file.name,
    storage_path: storagePath,
    public_url: publicUrl,
    category,
    file_size: file.size,
    mime_type: file.type,
    product_tags: [],
    verse_tags: [],
    campaign_tags: [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ asset: data })
}
