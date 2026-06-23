'use client'

import { useState, useEffect, useCallback } from 'react'
import CreativeCard from '@/components/CreativeCard'
import FilterBar from '@/components/FilterBar'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'
import type { GeneratedCreative, Product, Verse, CreativeAngle } from '@/lib/types'

type Filters = { product_id: string; verse_id: string; angle_id: string; format: string }

export default function SavedCreativesPage() {
  const [creatives, setCreatives] = useState<GeneratedCreative[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ product_id: '', verse_id: '', angle_id: '', format: '' })

  const fetchCreatives = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.product_id) params.set('product_id', filters.product_id)
    if (filters.verse_id) params.set('verse_id', filters.verse_id)
    if (filters.angle_id) params.set('angle_id', filters.angle_id)
    if (filters.format) params.set('format', filters.format)

    const res = await fetch(`/api/creatives?${params}`)
    const data = await res.json()
    setCreatives(data.creatives ?? [])
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchCreatives()
  }, [fetchCreatives])

  async function handleDelete(id: string) {
    await fetch(`/api/creatives/${id}`, { method: 'DELETE' })
    setCreatives((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Creative Library</p>
        <h1 className="text-2xl font-bold text-stone-900">Saved Creatives</h1>
        <p className="text-stone-500 mt-1 text-sm">Browse, filter, and copy all your generated creatives.</p>
      </div>

      <div className="mb-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          products={SEED_PRODUCTS as Product[]}
          verses={SEED_VERSES as Verse[]}
          angles={SEED_ANGLES as CreativeAngle[]}
        />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 h-64 animate-pulse" />
          ))}
        </div>
      ) : creatives.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
          <p className="text-4xl mb-4">📂</p>
          <h3 className="font-semibold text-stone-700 mb-2">No saved creatives yet</h3>
          <p className="text-sm text-stone-400 mb-6">
            {Object.values(filters).some(Boolean)
              ? 'No creatives match your current filters. Try clearing them.'
              : 'Head to the Generator to create your first creative set.'}
          </p>
          <a
            href="/generate"
            className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Generate your first creative →
          </a>
        </div>
      ) : (
        <>
          <p className="text-sm text-stone-400 mb-4">{creatives.length} creative{creatives.length !== 1 ? 's' : ''} found</p>
          <div className="grid md:grid-cols-2 gap-4">
            {creatives.map((c) => (
              <CreativeCard key={c.id} creative={c} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
