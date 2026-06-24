'use client'

import { useState, useEffect } from 'react'
import CreativeCard from '@/components/CreativeCard'
import { SEED_PRODUCTS, SEED_VERSES } from '@/lib/data'
import { CREATIVE_FORMATS, OBJECTIVES } from '@/lib/types'
import type { GeneratedCreative, DynamicAngle, CampaignTheme, ContentPillar, Persona } from '@/lib/types'

const DEFAULT_THEMES: CampaignTheme[] = [
  { id: 't1', name: 'Faith & Reconnection', description: 'For people drifting from God', color: '#f59e0b', created_at: '' },
  { id: 't2', name: 'Protection & Peace', description: 'For anxious parents and fearful hearts', color: '#3b82f6', created_at: '' },
  { id: 't3', name: 'Gift of Faith', description: 'Meaningful faith-based gifting', color: '#10b981', created_at: '' },
  { id: 't4', name: 'Strength & Career', description: 'Faith meets professional life', color: '#8b5cf6', created_at: '' },
  { id: 't5', name: 'Love & Relationships', description: 'Faith as foundation for relationships', color: '#ec4899', created_at: '' },
  { id: 't6', name: 'New Beginnings', description: 'Fresh start, new year, new goals', color: '#06b6d4', created_at: '' },
]

const DEFAULT_PILLARS: Record<string, ContentPillar[]> = {
  t1: [
    { id: 'p1a', theme_id: 't1', name: 'Overcoming Spiritual Guilt', description: 'The Sunday guilt, prayer inadequacy, feeling far from God', created_at: '' },
    { id: 'p1b', theme_id: 't1', name: 'Small Acts of Faith', description: 'Zero-friction devotion, micro-faith moments, no-pressure approach', created_at: '' },
    { id: 'p1c', theme_id: 't1', name: 'The Journey Back', description: 'Returning to faith, fresh start energy, reconnection', created_at: '' },
  ],
  t2: [
    { id: 'p2a', theme_id: 't2', name: 'Parent Anxiety & Trust', description: '3AM worry, separation anxiety, spiritual protection for family', created_at: '' },
    { id: 'p2b', theme_id: 't2', name: 'Fear & Courage', description: 'Overcoming fear, stepping forward, divine courage', created_at: '' },
    { id: 'p2c', theme_id: 't2', name: 'Waiting & Trusting', description: 'Waiting season, trusting God\'s timing, patience', created_at: '' },
  ],
  t3: [
    { id: 'p3a', theme_id: 't3', name: 'Meaningful Gifting', description: 'Gift amnesia, thoughtful impact, lasting memory', created_at: '' },
    { id: 'p3b', theme_id: 't3', name: 'Gift Occasions', description: 'Birthdays, anniversaries, Christmas, graduation, baptism', created_at: '' },
    { id: 'p3c', theme_id: 't3', name: 'Gift Reactions', description: 'Emotional impact, tears, gratitude, lasting impression', created_at: '' },
  ],
  t4: [
    { id: 'p4a', theme_id: 't4', name: 'Career Confidence', description: 'Promotions, presentations, performance, daily grind', created_at: '' },
    { id: 'p4b', theme_id: 't4', name: 'Burnout & Purpose', description: 'Burnout, losing meaning, spiritual grounding in work', created_at: '' },
    { id: 'p4c', theme_id: 't4', name: 'Invisible at Work', description: 'Feeling unseen, struggling silently, faith in workplace', created_at: '' },
  ],
  t5: [
    { id: 'p5a', theme_id: 't5', name: 'Toxic Patterns', description: 'Relationship cycles, codependency, faith as foundation', created_at: '' },
    { id: 'p5b', theme_id: 't5', name: 'Partners in Faith', description: 'Matching bracelets, shared devotion, couple content', created_at: '' },
    { id: 'p5c', theme_id: 't5', name: 'Healing & Wholeness', description: 'Heartbreak, moving forward, finding identity in God', created_at: '' },
  ],
  t6: [
    { id: 'p6a', theme_id: 't6', name: 'Year-End Reflection', description: 'Looking back, growth, gratitude for the journey', created_at: '' },
    { id: 'p6b', theme_id: 't6', name: 'New Year Intentions', description: 'Resolution energy, fresh start, 2026 goals', created_at: '' },
    { id: 'p6c', theme_id: 't6', name: 'Daily Consistency', description: 'Building habits, daily reminders, staying grounded', created_at: '' },
  ],
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'per1',
    name: 'Spiritually Drifting Young Pro',
    archetype: 'The Reconnector',
    age_range: '22–32',
    description: 'Corporate/BPO professional. Used to be active in church but hasn\'t attended in months. Feels guilty about spiritual distance. Wants to reconnect but overwhelmed.',
    pain_points: ['Sunday guilt', 'Prayer inadequacy', 'The gap feels too big to go back', 'No time for devotionals'],
    hook_phrases: ['Nakakahiya pero... ilang months na akong di nag-sisimba', 'Real talk: Kailan ka huling nag-feel na malapit ka sa Diyos?'],
    created_at: '',
  },
  {
    id: 'per2',
    name: 'Anxious Parent',
    archetype: 'The Protector',
    age_range: '28–45',
    description: 'Working or stay-at-home parent. Wakes at 3AM worrying about kids. Tracks them on phone but still can\'t relax. Wants spiritual coverage when they can\'t be there.',
    pain_points: ['3AM worry spirals', 'Can\'t be everywhere', 'Kulang yung ingat ka', 'Spiritual legacy for children'],
    hook_phrases: ['POV: 3AM ka gising, nag-iisip kung protected ba mga anak mo', 'My kids leave the house with something on their wrist. I breathe easier now.'],
    created_at: '',
  },
  {
    id: 'per3',
    name: 'Thoughtful Gift-Seeker',
    archetype: 'The Connector',
    age_range: '25–40',
    description: 'Active social life, frequent gift-giver. Tired of wallet/perfume/Starbucks cycle. Wants to give something meaningful that recipients use daily and remember long-term.',
    pain_points: ['Gift amnesia', 'Generic gift fatigue', 'Pressure to be the thoughtful one', 'Multiple occasions to cover'],
    hook_phrases: ['POV: You gave a gift na nag-make them cry (good tears)', 'Nakakasawa na yung wallet at perfume—ito different'],
    created_at: '',
  },
]

export default function GeneratePage() {
  const [themes, setThemes] = useState<CampaignTheme[]>(DEFAULT_THEMES)
  const [pillars, setPillars] = useState<ContentPillar[]>([])

  // Step 1: Strategy
  const [themeId, setThemeId] = useState('')
  const [pillarId, setPillarId] = useState('')
  const [personaId, setPersonaId] = useState('')
  const [objective, setObjective] = useState('')

  // Step 2: Dynamic angles
  const [suggestedAngles, setSuggestedAngles] = useState<DynamicAngle[]>([])
  const [selectedAngle, setSelectedAngle] = useState<DynamicAngle | null>(null)
  const [anglesLoading, setAnglesLoading] = useState(false)

  // Step 3: Product & Verse
  const [productId, setProductId] = useState('')
  const [verseId, setVerseId] = useState('')
  const [format, setFormat] = useState('full_creative_set')
  const [notes, setNotes] = useState('')

  // Output
  const [loading, setLoading] = useState(false)
  const [creative, setCreative] = useState<GeneratedCreative | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [persisted, setPersisted] = useState(true)

  // Load DB themes/pillars if Supabase configured
  useEffect(() => {
    fetch('/api/themes').then(r => r.json()).then(d => {
      if (d.themes?.length) setThemes(d.themes)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!themeId) { setPillars([]); setPillarId(''); return }
    const local = DEFAULT_PILLARS[themeId]
    if (local) { setPillars(local); setPillarId(''); return }
    fetch(`/api/pillars?theme_id=${themeId}`).then(r => r.json()).then(d => {
      setPillars(d.pillars ?? [])
      setPillarId('')
    }).catch(() => {})
  }, [themeId])

  const selectedTheme = themes.find(t => t.id === themeId)
  const selectedPillar = pillars.find(p => p.id === pillarId)
  const selectedPersona = DEFAULT_PERSONAS.find(p => p.id === personaId)
  const canSuggest = themeId && pillarId && personaId && objective

  async function handleSuggestAngles() {
    if (!canSuggest) return
    setAnglesLoading(true)
    setSelectedAngle(null)
    setSuggestedAngles([])
    try {
      const res = await fetch('/api/angles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme?.name ?? themeId,
          pillar: selectedPillar?.name ?? pillarId,
          persona: selectedPersona?.name ?? personaId,
          persona_description: selectedPersona?.description ?? '',
          objective,
        }),
      })
      const data = await res.json()
      setSuggestedAngles(data.angles ?? [])
    } catch {
      setError('Failed to suggest angles. Try again.')
    } finally {
      setAnglesLoading(false)
    }
  }

  async function handleGenerate() {
    if (!productId || !verseId || !selectedAngle) {
      setError('Please select a product, verse, and angle.')
      return
    }
    setError(null)
    setLoading(true)
    setCreative(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          verse_id: verseId,
          angle_id: 'dynamic',
          angle_custom: selectedAngle,
          format,
          notes: [
            notes,
            selectedTheme ? `Campaign Theme: ${selectedTheme.name}` : '',
            selectedPillar ? `Content Pillar: ${selectedPillar.name}` : '',
            selectedPersona ? `Persona: ${selectedPersona.name}` : '',
            objective ? `Objective: ${objective}` : '',
          ].filter(Boolean).join('\n'),
        }),
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Creative Generator</p>
        <h1 className="text-2xl font-bold text-stone-900">Generate Ad Creative</h1>
        <p className="text-stone-500 text-sm mt-1">Choose your strategy, get AI-generated angle suggestions, then generate a full creative set.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-5">

          {/* ── Step 1: Strategy ── */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Step 1 — Strategy</p>

            {/* Campaign Theme */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Campaign Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      themeId === t.id
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-semibold block">{t.name}</span>
                    {t.description && <span className="text-stone-400 font-normal">{t.description}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Pillar */}
            {themeId && pillars.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Content Pillar</label>
                <div className="space-y-1.5">
                  {pillars.map(p => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                        pillarId === p.id ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input type="radio" name="pillar" value={p.id} checked={pillarId === p.id} onChange={() => setPillarId(p.id)} className="mt-0.5 accent-amber-500" />
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                        {p.description && <p className="text-xs text-stone-500">{p.description}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Persona */}
            {pillarId && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Customer Persona</label>
                <div className="space-y-1.5">
                  {DEFAULT_PERSONAS.map(p => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                        personaId === p.id ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input type="radio" name="persona" value={p.id} checked={personaId === p.id} onChange={() => setPersonaId(p.id)} className="mt-0.5 accent-amber-500" />
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{p.name} <span className="font-normal text-stone-400">{p.age_range}</span></p>
                        <p className="text-xs text-stone-500 mt-0.5">{p.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Objective */}
            {personaId && (
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Campaign Objective</label>
                <div className="grid grid-cols-2 gap-2">
                  {OBJECTIVES.map(o => (
                    <button
                      key={o.value}
                      onClick={() => setObjective(o.value)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        objective === o.value
                          ? 'border-amber-400 bg-amber-50 text-amber-800'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="font-semibold block">{o.label}</span>
                      <span className="text-stone-400 font-normal">{o.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Step 2: Angle Suggestions ── */}
          {canSuggest && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Step 2 — Angle</p>
                <button
                  onClick={handleSuggestAngles}
                  disabled={anglesLoading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold transition-colors"
                >
                  {anglesLoading ? 'Generating…' : suggestedAngles.length ? 'Refresh Angles' : 'Suggest Angles ✨'}
                </button>
              </div>

              {suggestedAngles.length === 0 && !anglesLoading && (
                <p className="text-sm text-stone-400 py-4 text-center">Click "Suggest Angles" to generate 5 creative angles based on your strategy.</p>
              )}

              {anglesLoading && (
                <div className="py-6 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs text-stone-400">Generating angle suggestions…</p>
                </div>
              )}

              {suggestedAngles.length > 0 && (
                <div className="space-y-2">
                  {suggestedAngles.map((angle, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAngle(angle)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                        selectedAngle?.name === angle.name
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <p className="text-sm font-semibold text-stone-800">{angle.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5 italic">"{angle.hook}"</p>
                      <p className="text-xs text-stone-400 mt-1">{angle.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Product & Verse ── */}
          {selectedAngle && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Step 3 — Product & Verse</p>

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

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Format</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {CREATIVE_FORMATS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Notes <span className="font-normal text-stone-400">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Mother's Day campaign, make it extra emotional…"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={!productId || !verseId || loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold transition-colors"
              >
                {loading ? 'Generating…' : 'Generate Creative ✨'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div>
          {creative ? (
            <div className="space-y-3 sticky top-6">
              {!persisted && (
                <div className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-3 py-2">
                  Supabase not configured — creative was not saved.
                </div>
              )}
              <CreativeCard creative={creative} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 flex flex-col items-center justify-center text-center min-h-[500px] sticky top-6">
              <p className="text-5xl mb-4">✨</p>
              <h3 className="font-semibold text-stone-700 mb-2">Your creative will appear here</h3>
              <p className="text-sm text-stone-400 max-w-xs">
                Complete the strategy, select an angle, choose a product and verse, then click Generate.
              </p>
              <div className="mt-6 text-left w-full max-w-xs space-y-2">
                {[
                  { done: !!themeId, label: 'Campaign theme selected' },
                  { done: !!pillarId, label: 'Content pillar selected' },
                  { done: !!personaId, label: 'Persona selected' },
                  { done: !!objective, label: 'Objective selected' },
                  { done: suggestedAngles.length > 0, label: 'Angles generated' },
                  { done: !!selectedAngle, label: 'Angle selected' },
                  { done: !!productId, label: 'Product selected' },
                  { done: !!verseId, label: 'Verse selected' },
                ].map(step => (
                  <div key={step.label} className="flex items-center gap-2 text-xs">
                    <span className={step.done ? 'text-amber-500' : 'text-stone-300'}>{step.done ? '✓' : '○'}</span>
                    <span className={step.done ? 'text-stone-600' : 'text-stone-400'}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
