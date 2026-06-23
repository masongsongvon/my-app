'use client'

import { useState } from 'react'
import CreativeCard from '@/components/CreativeCard'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'
import { CREATIVE_FORMATS } from '@/lib/types'
import type { GeneratedCreative } from '@/lib/types'

type FormState = {
  product_id: string
  verse_id: string
  angle_id: string
  format: string
  notes: string
}

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>({
    product_id: '',
    verse_id: '',
    angle_id: '',
    format: 'full_creative_set',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [creative, setCreative] = useState<GeneratedCreative | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [persisted, setPersisted] = useState(true)

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleGenerate() {
    if (!form.product_id || !form.verse_id || !form.angle_id || !form.format) {
      setError('Please select a product, verse, angle, and format.')
      return
    }
    setError(null)
    setLoading(true)
    setCreative(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setCreative(data.creative)
      setPersisted(data.persisted !== false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const isComplete = form.product_id && form.verse_id && form.angle_id && form.format

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Creative Generator</p>
        <h1 className="text-2xl font-bold text-stone-900">Generate Ad Creative</h1>
        <p className="text-stone-500 mt-1 text-sm">Select a verse, product, angle, and format to generate a full creative set.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
          {/* Product */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Product</label>
            <div className="space-y-2">
              {SEED_PRODUCTS.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.product_id === p.id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="product"
                    value={p.id}
                    checked={form.product_id === p.id}
                    onChange={() => set('product_id', p.id)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <span className="text-sm font-medium text-stone-800">{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verse */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Bible Verse</label>
            <div className="space-y-2">
              {SEED_VERSES.map((v) => (
                <label
                  key={v.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.verse_id === v.id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="verse"
                    value={v.id}
                    checked={form.verse_id === v.id}
                    onChange={() => set('verse_id', v.id)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-amber-600">{v.reference}</p>
                    <p className="text-sm text-stone-700 mt-0.5">"{v.text}"</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Angle */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Customer Angle</label>
            <select
              value={form.angle_id}
              onChange={(e) => set('angle_id', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Select an angle…</option>
              {SEED_ANGLES.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Creative Format</label>
            <select
              value={form.format}
              onChange={(e) => set('format', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {CREATIVE_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="e.g. Mother's Day campaign, tone should feel warm and personal…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!isComplete || loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold transition-colors"
          >
            {loading ? 'Generating…' : 'Generate Creative'}
          </button>
        </div>

        {/* Output */}
        <div>
          {creative ? (
            <div className="space-y-3">
              {!persisted && (
                <div className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-3 py-2">
                  Supabase not configured — creative was not saved. Connect Supabase in Settings to persist creatives.
                </div>
              )}
              <CreativeCard creative={creative} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
              <p className="text-4xl mb-4">✨</p>
              <h3 className="font-semibold text-stone-700 mb-2">Your creative will appear here</h3>
              <p className="text-sm text-stone-400 max-w-xs">
                Fill out the form on the left and click Generate Creative to produce a full set of ad copy, scripts, hooks, and CTAs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
