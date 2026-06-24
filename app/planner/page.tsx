'use client'

import { useState, useEffect } from 'react'
import type { CampaignTheme, ContentPillar, Persona } from '@/lib/types'

const DEFAULT_THEMES: CampaignTheme[] = [
  { id: 't1', name: 'Faith & Reconnection', description: 'For people drifting from God', color: '#f59e0b', created_at: '' },
  { id: 't2', name: 'Protection & Peace', description: 'For anxious parents and fearful hearts', color: '#3b82f6', created_at: '' },
  { id: 't3', name: 'Gift of Faith', description: 'Meaningful faith-based gifting', color: '#10b981', created_at: '' },
  { id: 't4', name: 'Strength & Career', description: 'Faith meets professional life', color: '#8b5cf6', created_at: '' },
  { id: 't5', name: 'Love & Relationships', description: 'Faith as foundation', color: '#ec4899', created_at: '' },
  { id: 't6', name: 'New Beginnings', description: 'Fresh start and new goals', color: '#06b6d4', created_at: '' },
]

const DEFAULT_PERSONAS: Persona[] = [
  { id: 'per1', name: 'Spiritually Drifting Young Pro', archetype: 'The Reconnector', age_range: '22–32', description: 'Corporate/BPO professional who used to be active in church but drifted away. Feels guilty about spiritual distance.', created_at: '' },
  { id: 'per2', name: 'Anxious Parent', archetype: 'The Protector', age_range: '28–45', description: 'Wakes at 3AM worrying about kids. Wants spiritual coverage when they can\'t be there.', created_at: '' },
  { id: 'per3', name: 'Thoughtful Gift-Seeker', archetype: 'The Connector', age_range: '25–40', description: 'Tired of generic gifts. Wants to give something meaningful they\'ll use and remember.', created_at: '' },
]

type Tab = 'themes' | 'personas' | 'pillars'

export default function PlannerPage() {
  const [tab, setTab] = useState<Tab>('themes')
  const [themes, setThemes] = useState<CampaignTheme[]>(DEFAULT_THEMES)
  const [personas] = useState<Persona[]>(DEFAULT_PERSONAS)
  const [pillars, setPillars] = useState<ContentPillar[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)

  // New item forms
  const [newThemeName, setNewThemeName] = useState('')
  const [newThemeDesc, setNewThemeDesc] = useState('')
  const [newPillarName, setNewPillarName] = useState('')
  const [newPillarDesc, setNewPillarDesc] = useState('')

  useEffect(() => {
    if (!selectedThemeId) return
    fetch(`/api/pillars?theme_id=${selectedThemeId}`).then(r => r.json()).then(d => {
      setPillars(d.pillars ?? [])
    }).catch(() => {})
  }, [selectedThemeId])

  async function createTheme() {
    if (!newThemeName.trim()) return
    const res = await fetch('/api/themes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newThemeName.trim(), description: newThemeDesc.trim() }),
    })
    const data = await res.json()
    if (data.theme) {
      setThemes(prev => [...prev, data.theme])
      setNewThemeName('')
      setNewThemeDesc('')
    }
  }

  async function createPillar() {
    if (!newPillarName.trim() || !selectedThemeId) return
    const res = await fetch('/api/pillars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPillarName.trim(), description: newPillarDesc.trim(), theme_id: selectedThemeId }),
    })
    const data = await res.json()
    if (data.pillar) {
      setPillars(prev => [...prev, data.pillar])
      setNewPillarName('')
      setNewPillarDesc('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Strategy</p>
        <h1 className="text-2xl font-bold text-stone-900">Campaign Planner</h1>
        <p className="text-stone-500 text-sm mt-1">Manage campaign themes, content pillars, and customer personas.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit">
        {([
          { key: 'themes', label: 'Campaign Themes' },
          { key: 'pillars', label: 'Content Pillars' },
          { key: 'personas', label: 'Personas' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Themes Tab */}
      {tab === 'themes' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map(theme => (
              <div key={theme.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full mt-0.5 shrink-0" style={{ background: theme.color ?? '#f59e0b' }} />
                  <div>
                    <p className="font-semibold text-stone-800">{theme.name}</p>
                    {theme.description && <p className="text-sm text-stone-500 mt-0.5">{theme.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedThemeId(theme.id); setTab('pillars') }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium transition-colors"
                  >
                    View Pillars →
                  </button>
                  <a
                    href="/generate"
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 font-medium transition-colors"
                  >
                    Generate
                  </a>
                </div>
              </div>
            ))}

            {/* New Theme Card */}
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-5">
              <p className="text-sm font-semibold text-stone-700 mb-3">New Campaign Theme</p>
              <input
                type="text"
                value={newThemeName}
                onChange={e => setNewThemeName(e.target.value)}
                placeholder="Theme name…"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                value={newThemeDesc}
                onChange={e => setNewThemeDesc(e.target.value)}
                placeholder="Short description…"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={createTheme}
                disabled={!newThemeName.trim()}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold transition-colors"
              >
                Create Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pillars Tab */}
      {tab === 'pillars' && (
        <div>
          {/* Theme selector */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-stone-700 mb-2">Select Theme</label>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedThemeId === t.id ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {selectedThemeId && (
            <div className="space-y-3">
              {pillars.length === 0 && (
                <p className="text-sm text-stone-400 py-4">No pillars yet for this theme. Create one below.</p>
              )}
              {pillars.map(pillar => (
                <div key={pillar.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
                  <p className="font-semibold text-stone-800">{pillar.name}</p>
                  {pillar.description && <p className="text-sm text-stone-500 mt-0.5">{pillar.description}</p>}
                </div>
              ))}

              {/* New Pillar */}
              <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-5">
                <p className="text-sm font-semibold text-stone-700 mb-3">New Content Pillar</p>
                <input
                  type="text"
                  value={newPillarName}
                  onChange={e => setNewPillarName(e.target.value)}
                  placeholder="Pillar name…"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="text"
                  value={newPillarDesc}
                  onChange={e => setNewPillarDesc(e.target.value)}
                  placeholder="What emotional territory does this cover?…"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={createPillar}
                  disabled={!newPillarName.trim()}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold transition-colors"
                >
                  Add Pillar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personas Tab */}
      {tab === 'personas' && (
        <div className="grid sm:grid-cols-3 gap-4">
          {personas.map(persona => (
            <div key={persona.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl mb-3">
                {persona.archetype === 'The Reconnector' ? '🙏' : persona.archetype === 'The Protector' ? '🛡️' : '🎁'}
              </div>
              <p className="font-bold text-stone-800 mb-0.5">{persona.name}</p>
              <p className="text-xs text-amber-600 font-semibold mb-1">{persona.archetype} · {persona.age_range}</p>
              <p className="text-sm text-stone-500">{persona.description}</p>
              <a
                href="/generate"
                className="mt-3 inline-block text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium transition-colors"
              >
                Generate for this persona →
              </a>
            </div>
          ))}
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-5 flex flex-col items-center justify-center text-center">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm font-semibold text-stone-600 mb-1">Custom Persona</p>
            <p className="text-xs text-stone-400 mb-3">Coming soon — add custom audience segments</p>
          </div>
        </div>
      )}
    </div>
  )
}
