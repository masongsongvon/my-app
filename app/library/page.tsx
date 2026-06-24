'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { BrandAsset, AssetCategory } from '@/lib/types'
import { ASSET_CATEGORIES } from '@/lib/types'

const CATEGORY_LABELS: Record<AssetCategory | 'all', string> = {
  all: 'All Assets',
  product_photos: 'Product Photos',
  lifestyle: 'Lifestyle Photos',
  packaging: 'Packaging',
  logos: 'Logos',
  sample_ads: 'Sample Ads',
  social_proof: 'Social Proof',
}

function assetUrl(asset: BrandAsset): string | null {
  if (asset.public_url) return asset.public_url
  if (asset.local_path) return `/api/assets/serve?path=${encodeURIComponent(asset.local_path)}`
  return null
}

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function LibraryPage() {
  const [assets, setAssets] = useState<BrandAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState<AssetCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<BrandAsset | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadCategory = useRef<AssetCategory>('product_photos')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function loadAssets() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search) params.set('search', search)
      const res = await fetch(`/api/assets?${params}`)
      const data = await res.json()
      setAssets(data.assets ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAssets() }, [category, search])

  async function handleImport() {
    setImporting(true)
    try {
      const res = await fetch('/api/assets/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json()
      if (data.error) { showToast(`Error: ${data.error}`); return }
      showToast(`Imported ${data.imported} assets (${data.skipped ?? 0} already existed)`)
      loadAssets()
    } finally {
      setImporting(false)
    }
  }

  async function uploadFile(file: File, cat: AssetCategory) {
    const form = new FormData()
    form.append('file', file)
    form.append('category', cat)
    form.append('name', file.name.replace(/\.[^.]+$/, ''))
    const res = await fetch('/api/assets/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.asset as BrandAsset
  }

  async function handleFileInput(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    let count = 0
    for (const file of Array.from(files)) {
      try {
        await uploadFile(file, uploadCategory.current)
        count++
      } catch (e) {
        showToast(`Upload failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
    }
    if (count) { showToast(`Uploaded ${count} file${count !== 1 ? 's' : ''}`); loadAssets() }
    setUploading(false)
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    await handleFileInput(e.dataTransfer.files)
  }, [uploadCategory.current])

  async function handleUpdateTags(asset: BrandAsset, field: 'product_tags' | 'verse_tags' | 'campaign_tags', value: string[]) {
    await fetch('/api/assets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: asset.id, [field]: value }),
    })
    setSelected(prev => prev ? { ...prev, [field]: value } : null)
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, [field]: value } : a))
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this asset?')) return
    await fetch(`/api/assets?id=${id}`, { method: 'DELETE' })
    setAssets(prev => prev.filter(a => a.id !== id))
    if (selected?.id === id) setSelected(null)
    showToast('Asset deleted')
  }

  const counts = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex h-full">
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 bg-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Brand Assets</p>
            <h1 className="text-xl font-bold text-stone-900">Asset Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
            >
              {importing ? '⏳ Importing…' : '📁 Import Existing Folder'}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {uploading ? '⏳ Uploading…' : '+ Upload'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileInput(e.target.files)} />
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-stone-200 bg-white flex items-center gap-3 overflow-x-auto shrink-0">
          <div className="flex gap-1.5">
            {(['all', ...ASSET_CATEGORIES.map(c => c.value)] as (AssetCategory | 'all')[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {CATEGORY_LABELS[cat]} {cat !== 'all' && counts[cat] ? `(${counts[cat]})` : ''}
              </button>
            ))}
          </div>
          <div className="ml-auto shrink-0">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400 w-48"
            />
          </div>
        </div>

        {/* Drop Zone + Grid */}
        <div
          className={`flex-1 overflow-y-auto p-6 transition-colors ${dragOver ? 'bg-amber-50' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {dragOver && (
            <div className="fixed inset-0 bg-amber-500/10 border-4 border-dashed border-amber-400 rounded-2xl z-10 flex items-center justify-center pointer-events-none">
              <p className="text-amber-600 font-bold text-lg">Drop images here</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-semibold text-stone-700 mb-1">No assets yet</p>
              <p className="text-sm text-stone-400 mb-4">Click "Import Existing Folder" to import from<br />~/Documents/Daily Devotion Co photos/</p>
              <button onClick={handleImport} className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600">
                Import Folder
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {assets.map(asset => {
                const url = assetUrl(asset)
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selected?.id === asset.id ? 'border-amber-400' : 'border-transparent hover:border-stone-300'
                    } bg-stone-100`}
                  >
                    {url ? (
                      <img src={url} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 text-2xl">🖼️</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-72 border-l border-stone-200 bg-white flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-800">Asset Details</p>
            <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
          </div>

          {assetUrl(selected) && (
            <div className="aspect-square bg-stone-100">
              <img src={assetUrl(selected)!} alt={selected.name} className="w-full h-full object-contain" />
            </div>
          )}

          <div className="p-4 space-y-4 flex-1">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Name</p>
              <p className="text-sm text-stone-800 break-words">{selected.name}</p>
              {selected.file_size ? <p className="text-xs text-stone-400 mt-0.5">{formatBytes(selected.file_size)}</p> : null}
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Category</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                {CATEGORY_LABELS[selected.category] ?? selected.category}
              </span>
            </div>

            {selected.folder && (
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Folder</p>
                <p className="text-xs text-stone-600">{selected.folder}</p>
              </div>
            )}

            <TagEditor
              label="Product Tags"
              tags={selected.product_tags ?? []}
              suggestions={['Original Bible Verse Bracelet', 'Silver Edition Bracelet', 'Bible Verse Necklace', 'Daily Verse Jar']}
              onChange={tags => handleUpdateTags(selected, 'product_tags', tags)}
            />
            <TagEditor
              label="Verse Tags"
              tags={selected.verse_tags ?? []}
              suggestions={['Isaiah 41:10', 'Philippians 4:13', 'Luke 1:37', 'Matthew 19:26', 'Isaiah 60:22']}
              onChange={tags => handleUpdateTags(selected, 'verse_tags', tags)}
            />
            <TagEditor
              label="Campaign Tags"
              tags={selected.campaign_tags ?? []}
              suggestions={['Faith & Reconnection', 'Protection & Peace', 'Gift of Faith', 'Father\'s Day', 'Christmas', 'New Year']}
              onChange={tags => handleUpdateTags(selected, 'campaign_tags', tags)}
            />

            <button
              onClick={() => handleDelete(selected.id)}
              className="w-full py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Delete Asset
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

function TagEditor({ label, tags, suggestions, onChange }: {
  label: string
  tags: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
}) {
  const [input, setInput] = useState('')

  function addTag(tag: string) {
    const t = tag.trim()
    if (!t || tags.includes(t)) return
    onChange([...tags, t])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag))
  }

  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 uppercase mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs">
            {tag}
            <button onClick={() => removeTag(tag)} className="text-stone-400 hover:text-red-500 leading-none">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(input) } }}
        placeholder="Add tag…"
        list={`${label}-list`}
        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
      />
      <datalist id={`${label}-list`}>
        {suggestions.map(s => <option key={s} value={s} />)}
      </datalist>
    </div>
  )
}
