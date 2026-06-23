'use client'

import type { Product, Verse, CreativeAngle } from '@/lib/types'

type Filters = {
  product_id: string
  verse_id: string
  angle_id: string
  format: string
}

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
  products: Product[]
  verses: Verse[]
  angles: CreativeAngle[]
}

export default function FilterBar({ filters, onChange, products, verses, angles }: Props) {
  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.product_id}
        onChange={(e) => set('product_id', e.target.value)}
        className="text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">All Products</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select
        value={filters.verse_id}
        onChange={(e) => set('verse_id', e.target.value)}
        className="text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">All Verses</option>
        {verses.map((v) => (
          <option key={v.id} value={v.id}>{v.reference}</option>
        ))}
      </select>

      <select
        value={filters.angle_id}
        onChange={(e) => set('angle_id', e.target.value)}
        className="text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">All Angles</option>
        {angles.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={filters.format}
        onChange={(e) => set('format', e.target.value)}
        className="text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">All Formats</option>
        <option value="meta_ads_primary_text">Meta Ads Primary Text</option>
        <option value="meta_ads_headline">Meta Ads Headline</option>
        <option value="ugc_script">UGC Script</option>
        <option value="voiceover_script">Voiceover Script</option>
        <option value="product_description">Product Description</option>
        <option value="hook_variations">Hook Variations</option>
        <option value="cta_variations">CTA Variations</option>
        <option value="full_creative_set">Full Creative Set</option>
      </select>

      {(filters.product_id || filters.verse_id || filters.angle_id || filters.format) && (
        <button
          onClick={() => onChange({ product_id: '', verse_id: '', angle_id: '', format: '' })}
          className="text-sm px-3 py-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
