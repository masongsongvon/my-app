'use client'

import { useState } from 'react'
import { SEED_PRODUCTS, SEED_VERSES } from '@/lib/data'
import type { ImageAdOutput } from '@/app/api/image-ads/route'

const THEMES = ['Faith & Reconnection', 'Protection & Peace', 'Gift of Faith', 'Strength & Career', 'Love & Relationships', 'New Beginnings']
const PERSONAS = ['Spiritually Drifting Young Pro (22-32)', 'Anxious Parent (28-45)', 'Thoughtful Gift-Seeker (25-40)']
const OBJECTIVES = ['Awareness', 'Consideration', 'Conversion', 'Retention']

export default function ImageAdsPage() {
  const [theme, setTheme] = useState('')
  const [productId, setProductId] = useState('')
  const [verseId, setVerseId] = useState('')
  const [persona, setPersona] = useState('')
  const [objective, setObjective] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImageAdOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const selectedProduct = SEED_PRODUCTS.find(p => p.id === productId)
  const selectedVerse = SEED_VERSES.find(v => v.id === verseId)
  const canGenerate = theme && productId && verseId && persona && objective

  async function handleGenerate() {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/image-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          product: selectedProduct?.name,
          verse: `"${selectedVerse?.text}" — ${selectedVerse?.reference}`,
          persona,
          objective,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed')
      setResult(data.ad)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function copy(text: string, field: string) {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Creative Tools</p>
        <h1 className="text-2xl font-bold text-stone-900">Image Ad Generator</h1>
        <p className="text-stone-500 text-sm mt-1">Generate a complete image ad concept — overlay text, caption, CTA, and UGC shot direction.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5 h-fit">
          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Campaign Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    theme === t ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Product</label>
            <div className="space-y-1.5">
              {SEED_PRODUCTS.map(p => (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    productId === p.id ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input type="radio" name="product" value={p.id} checked={productId === p.id} onChange={() => setProductId(p.id)} className="accent-amber-500" />
                  <span className="text-sm font-medium text-stone-800">{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verse */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Bible Verse</label>
            <div className="space-y-1.5">
              {SEED_VERSES.map(v => (
                <label
                  key={v.id}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    verseId === v.id ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input type="radio" name="verse" value={v.id} checked={verseId === v.id} onChange={() => setVerseId(v.id)} className="mt-0.5 accent-amber-500" />
                  <div>
                    <p className="text-xs font-semibold text-amber-600">{v.reference}</p>
                    <p className="text-sm text-stone-700">"{v.text}"</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Persona */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Target Persona</label>
            <div className="space-y-1.5">
              {PERSONAS.map(p => (
                <label
                  key={p}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    persona === p ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input type="radio" name="persona" value={p} checked={persona === p} onChange={() => setPersona(p)} className="accent-amber-500" />
                  <span className="text-sm font-medium text-stone-800">{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Objective</label>
            <div className="grid grid-cols-2 gap-2">
              {OBJECTIVES.map(o => (
                <button
                  key={o}
                  onClick={() => setObjective(o)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    objective === o ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Notes <span className="font-normal text-stone-400">(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Father's Day, use outdoor lifestyle shot, warm tones…"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold transition-colors"
          >
            {loading ? 'Generating…' : '🖼️ Generate Image Ad Concept'}
          </button>
        </div>

        {/* Output */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Concept */}
              <OutputCard label="Ad Concept" value={result.concept} onCopy={() => copy(result.concept, 'concept')} copied={copiedField === 'concept'} />

              {/* Visual */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Visual Direction</p>
                <div className="space-y-3 text-sm text-stone-700">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Recommended Asset</p>
                    <p className="font-medium capitalize">{result.recommended_asset_category.replace('_', ' ')}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{result.recommended_asset_description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Color Palette</p>
                    <p>{result.color_palette}</p>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Ad Copy</p>
                <div className="space-y-3">
                  <CopyRow label="Overlay Text" value={result.overlay_text} onCopy={() => copy(result.overlay_text, 'overlay')} copied={copiedField === 'overlay'} />
                  <CopyRow label="Headline" value={result.headline} onCopy={() => copy(result.headline, 'headline')} copied={copiedField === 'headline'} />
                  <CopyRow label="CTA Button" value={result.cta} onCopy={() => copy(result.cta, 'cta')} copied={copiedField === 'cta'} />
                  <CopyRow label="Hook Variant" value={result.hook_variation} onCopy={() => copy(result.hook_variation, 'hook')} copied={copiedField === 'hook'} />
                </div>
              </div>

              <OutputCard label="Caption / Primary Text" value={result.caption} onCopy={() => copy(result.caption, 'caption')} copied={copiedField === 'caption'} tall />
              <OutputCard label="UGC Shot Direction" value={result.ugc_shot_direction} onCopy={() => copy(result.ugc_shot_direction, 'ugc')} copied={copiedField === 'ugc'} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
              <p className="text-5xl mb-4">🖼️</p>
              <h3 className="font-semibold text-stone-700 mb-2">Image ad concept will appear here</h3>
              <p className="text-sm text-stone-400 max-w-xs">Fill out the form and click Generate to get overlay text, headline, caption, CTA, and UGC shot direction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OutputCard({ label, value, onCopy, copied, tall }: { label: string; value: string; onCopy: () => void; copied: boolean; tall?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">{label}</p>
        <button onClick={onCopy} className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className={`text-sm text-stone-700 whitespace-pre-line leading-relaxed ${tall ? '' : ''}`}>{value}</p>
    </div>
  )
}

function CopyRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 mb-0.5">{label}</p>
        <p className="text-sm text-stone-800 font-medium">{value}</p>
      </div>
      <button onClick={onCopy} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium transition-colors shrink-0">
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  )
}
