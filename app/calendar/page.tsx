'use client'

import { useState } from 'react'
import { SEED_PRODUCTS, SEED_VERSES } from '@/lib/data'
import { PLATFORMS } from '@/lib/types'

type CalendarDay = {
  day: string
  date?: string
  platform: string
  theme: string
  angle: string
  persona: string
  product: string
  verse: string
  format: string
  objective: string
  hook_preview?: string
}

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-stone-100 text-stone-600',
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-purple-100 text-purple-700',
  tiktok: 'bg-stone-900 text-white',
  reels: 'bg-pink-100 text-pink-700',
}

const FORMAT_SHORT: Record<string, string> = {
  primary_text: 'FB Copy',
  ugc_script: 'UGC',
  voiceover_script: 'VO',
  hook_variations: 'Hooks',
  full_creative_set: 'Full Set',
  image_ad: 'Image Ad',
}

const THEMES = [
  'Faith & Reconnection',
  'Protection & Peace',
  'Gift of Faith',
  'Strength & Career',
  'Love & Relationships',
  'New Beginnings',
]

export default function CalendarPage() {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Faith & Reconnection', 'Gift of Faith'])

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)

  async function generateCalendar() {
    setLoading(true)
    try {
      const res = await fetch('/api/calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_start: weekStart.toISOString().split('T')[0],
          products: SEED_PRODUCTS.map(p => p.name),
          verses: SEED_VERSES.map(v => v.reference),
          themes: selectedThemes,
          objective: 'conversion',
        }),
      })
      const data = await res.json()
      setCalendarDays(data.items ?? [])
    } finally {
      setLoading(false)
    }
  }

  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  function getDayDate(dayName: string): Date {
    const idx = DAYS_OF_WEEK.indexOf(dayName)
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + idx)
    return d
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Content Strategy</p>
          <h1 className="text-2xl font-bold text-stone-900">Content Calendar</h1>
          <p className="text-stone-500 text-sm mt-1">AI-generated weekly content plan with themes, angles, and personas.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl overflow-hidden border border-stone-200">
            {(['week', 'month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                  viewMode === mode ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            onClick={generateCalendar}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Generating…' : '✨ Generate Calendar'}
          </button>
        </div>
      </div>

      {/* Theme selector */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-stone-700 mb-3">Campaign Themes to Include</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedThemes(prev =>
                prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
              )}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedThemes.includes(theme)
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      {calendarDays.length > 0 ? (
        <div className="grid grid-cols-7 gap-3 mb-6">
          {DAYS_OF_WEEK.map(day => {
            const item = calendarDays.find(d => d.day === day)
            const date = getDayDate(day)
            const isToday = date.toDateString() === today.toDateString()
            return (
              <div
                key={day}
                className={`rounded-2xl border ${isToday ? 'border-amber-400' : 'border-stone-200'} bg-white shadow-sm overflow-hidden`}
              >
                {/* Day header */}
                <div className={`px-3 py-2.5 border-b ${isToday ? 'bg-amber-500 border-amber-400' : 'bg-stone-50 border-stone-200'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-white' : 'text-stone-500'}`}>{day}</p>
                  <p className={`text-sm font-bold ${isToday ? 'text-white' : 'text-stone-800'}`}>{date.getDate()}</p>
                </div>
                {/* Day content */}
                <button
                  className="w-full text-left p-3 hover:bg-stone-50 transition-colors min-h-[160px]"
                  onClick={() => item && setSelectedDay(item)}
                >
                  {item ? (
                    <div className="space-y-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.platform] ?? STATUS_COLORS.planned}`}>
                        {item.platform}
                      </span>
                      <p className="text-xs font-semibold text-stone-700 leading-tight">{item.angle}</p>
                      {item.hook_preview && (
                        <p className="text-xs text-stone-400 italic leading-tight">"{item.hook_preview}"</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {item.format && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 text-xs">
                            {FORMAT_SHORT[item.format] ?? item.format}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-300 text-center mt-4">Empty</p>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-semibold text-stone-700 mb-1">No calendar yet</p>
          <p className="text-sm text-stone-400 mb-4">Select your themes above and click "Generate Calendar" to create a weekly content plan with AI-suggested angles, personas, and formats.</p>
          <button onClick={generateCalendar} disabled={loading} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {loading ? 'Generating…' : '✨ Generate Calendar'}
          </button>
        </div>
      )}

      {/* Legend */}
      {calendarDays.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-stone-500">
          {PLATFORMS.map(p => (
            <span key={p.value} className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.value] ?? STATUS_COLORS.planned}`}>{p.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-stone-900">{selectedDay.day} — {selectedDay.angle}</p>
              <button onClick={() => setSelectedDay(null)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Platform', value: selectedDay.platform },
                { label: 'Theme', value: selectedDay.theme },
                { label: 'Persona', value: selectedDay.persona },
                { label: 'Product', value: selectedDay.product },
                { label: 'Verse', value: selectedDay.verse },
                { label: 'Format', value: FORMAT_SHORT[selectedDay.format] ?? selectedDay.format },
                { label: 'Objective', value: selectedDay.objective },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-stone-400 w-20 shrink-0">{label}</span>
                  <span className="text-stone-800 font-medium">{value}</span>
                </div>
              ))}
              {selectedDay.hook_preview && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-600 font-semibold mb-1">Hook Preview</p>
                  <p className="text-sm text-stone-700 italic">"{selectedDay.hook_preview}"</p>
                </div>
              )}
            </div>
            <a
              href={`/generate`}
              className="mt-4 block w-full text-center py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
            >
              Generate This Creative →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
