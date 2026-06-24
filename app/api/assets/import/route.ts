import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'
import { FOLDER_TO_CATEGORY } from '@/lib/types'
import type { AssetCategory } from '@/lib/types'

const DEFAULT_FOLDER = join(homedir(), 'Documents', 'Daily Devotion Co photos')
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

async function scanFolder(dir: string, folderName: string): Promise<{ path: string; folder: string; name: string; size: number; mime: string }[]> {
  const results: { path: string; folder: string; name: string; size: number; mime: string }[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = await scanFolder(fullPath, entry.name)
        results.push(...nested)
      } else if (entry.isFile()) {
        const ext = entry.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ''
        if (!IMAGE_EXTS.has(ext)) continue
        const info = await stat(fullPath)
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
        results.push({ path: fullPath, folder: folderName, name: entry.name, size: info.size, mime })
      }
    }
  } catch {}
  return results
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 })

  let folderPath = DEFAULT_FOLDER
  try {
    const body = await req.json()
    if (body.folder_path) folderPath = body.folder_path
  } catch {}

  // Scan all subfolders
  const topEntries = await readdir(folderPath, { withFileTypes: true }).catch(() => null)
  if (!topEntries) return NextResponse.json({ error: `Cannot read folder: ${folderPath}` }, { status: 400 })

  const allFiles: { path: string; folder: string; name: string; size: number; mime: string }[] = []
  for (const entry of topEntries) {
    if (entry.isDirectory()) {
      const files = await scanFolder(join(folderPath, entry.name), entry.name)
      allFiles.push(...files)
    } else if (entry.isFile()) {
      const ext = entry.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ''
      if (IMAGE_EXTS.has(ext)) {
        const info = await stat(join(folderPath, entry.name))
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
        allFiles.push({ path: join(folderPath, entry.name), folder: 'Root', name: entry.name, size: info.size, mime })
      }
    }
  }

  // Check which paths already exist
  const { data: existing } = await supabase.from('brand_assets').select('local_path').not('local_path', 'is', null)
  const existingPaths = new Set((existing ?? []).map((r: { local_path: string | null }) => r.local_path).filter(Boolean))

  const toInsert = allFiles
    .filter(f => !existingPaths.has(f.path))
    .map(f => ({
      name: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').slice(0, 80),
      original_name: f.name,
      local_path: f.path,
      category: (FOLDER_TO_CATEGORY[f.folder] ?? 'product_photos') as AssetCategory,
      folder: f.folder,
      file_size: f.size,
      mime_type: f.mime,
      product_tags: [],
      verse_tags: [],
      campaign_tags: [],
    }))

  if (toInsert.length === 0) {
    return NextResponse.json({ imported: 0, skipped: allFiles.length, message: 'All files already imported.' })
  }

  // Insert in batches of 50
  let imported = 0
  for (let i = 0; i < toInsert.length; i += 50) {
    const batch = toInsert.slice(i, i + 50)
    const { error } = await supabase.from('brand_assets').insert(batch)
    if (!error) imported += batch.length
  }

  return NextResponse.json({ imported, skipped: allFiles.length - imported, total: allFiles.length })
}
