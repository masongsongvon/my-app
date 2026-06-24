'use client'

import { useState } from 'react'

const INITIAL_KNOWLEDGE = {
  website_url: 'https://www.grabnow.store/DailyDevotion',
  brand_promise: 'Faith that fits your real life. No pressure. Just presence. Small reminders, big shifts.',
  brand_tagline: 'Faith & Inspiration',
  brand_positioning: 'Zero-Friction Faith — eliminating Spiritual Friction (the invisible barrier between intention and consistent faith practice). Each glance at the bracelet = 2-second spiritual reset.',
  target_market: 'Filipino Christians aged 22–45 — spiritually drifting young professionals, anxious parents, and thoughtful gift-seekers. Urban centers (Metro Manila, Cebu, Davao) and provincial cities.',
  price_points: '₱349 per bracelet | Family set of 4: ₱1,050 | Daily Verse Jar: ₱349',
  product_lineup: `1. Original Bible Verse Bracelet — black silicone band, stainless steel engraved plate, cross logo + verse
2. Silver Edition Bible Verse Bracelet — silver mesh band, mirrored plate
3. Bible Verse Necklace — matte black cross pendant on chain, verse engraved
4. Daily Verse Jar — 52 handpicked Bible verses, one per week of the year`,
  product_specs: `Material: High-grade stainless steel (non-tarnish, hypoallergenic)
Engraving: Precision laser etching (permanent, fade-resistant, deep carve)
Finish: Brushed silver or gold with protective coating
Closure: Adjustable sliding knot (fits wrist sizes 15–22cm)
Weight: Ultra-lightweight 12–15g
Width: 6mm band
Water-resistant, sweat-proof, scratch-resistant, corrosion-resistant`,
  four_verses: `Luke 1:37 — "For with God nothing will be impossible" — Hope, impossible situations, career challenges
Isaiah 41:10 — "Do not fear, for I am with you" — Anxiety, fear, loneliness, uncertainty
Philippians 4:13 — "I can do all things through Christ who strengthens me" — Strength, self-doubt, exhaustion
Matthew 19:26 — "With God all things are possible" — Dreams, goals, aspirations`,
  packaging: `White gift box with botanical line-art illustration (wheat/grain field pattern)
"Daily Devotion Co. — Faith & Inspiration" in cursive + serif combo with gold foil logo
Clear window variant available. Branded canvas pouch included.`,
  brand_voice: `Parang pinakamatalik mong kaibigan ang nagsasalita — hindi brand, hindi company
Modern Taglish — natural mix ng Filipino at English, exactly tulad ng ginagawa ng mga Pilipino sa Facebook
Emotional at relatable MUNA bago ang product — product enters naturally, hindi forced
Hindi preachy, hindi nagmo-moralize, hindi nagso-sermon`,
  ugc_principles: `Best UGC doesn't feel like an ad. Structure: Hook (0–5s) → Build (5–25s) → Turn (25–40s) → Verse Drop (40–50s) → Subtle CTA (50–60s)
Hook must be scroll-stopping in first 3 seconds
CTA is text-overlay only at end — no hard sell in voiceover
Raw, authentic, imperfect. First-person, vulnerable, specific.`,
  winning_hooks: `"Nakakahiya pero... ilang months na akong di nag-sisimba."
"POV: 3AM ka gising, nag-iisip kung protected ba mga anak mo."
"My kids leave the house with something on their wrist. I breathe easier now."
"Yung feeling na kulang yung 'ingat ka' mo? Ito yung extension ng prayers mo."
"POV: You gave a gift na nag-make them cry (good tears)."
"Real talk: Kailan ka huling nag-feel na malapit ka sa Diyos?"`,
}

type KnowledgeKey = keyof typeof INITIAL_KNOWLEDGE

const SECTIONS: { key: KnowledgeKey; label: string; multiline: boolean; description: string }[] = [
  { key: 'website_url', label: 'Brand Website URL', multiline: false, description: 'Live store URL' },
  { key: 'brand_promise', label: 'Brand Promise', multiline: false, description: 'Core brand promise statement' },
  { key: 'brand_tagline', label: 'Brand Tagline', multiline: false, description: 'Short tagline used on packaging' },
  { key: 'brand_positioning', label: 'Brand Positioning', multiline: true, description: '"Zero-Friction Faith" core positioning statement' },
  { key: 'target_market', label: 'Target Market', multiline: true, description: 'Who we sell to — demographics and locations' },
  { key: 'price_points', label: 'Price Points', multiline: true, description: 'All product prices' },
  { key: 'product_lineup', label: 'Product Lineup', multiline: true, description: 'All products with brief descriptions' },
  { key: 'product_specs', label: 'Product Specifications', multiline: true, description: 'Technical specs for all bracelets' },
  { key: 'four_verses', label: 'The Four Verses', multiline: true, description: 'All 4 laser-engraved verses and their emotional use cases' },
  { key: 'packaging', label: 'Packaging Description', multiline: true, description: 'What the packaging looks like — for copy and UGC direction' },
  { key: 'brand_voice', label: 'Brand Voice Guidelines', multiline: true, description: 'How we sound — for Claude and creators' },
  { key: 'ugc_principles', label: 'UGC Principles', multiline: true, description: 'UGC structure and authenticity guidelines' },
  { key: 'winning_hooks', label: 'Winning Hooks', multiline: true, description: 'Proven hook phrases from the UGC doc' },
]

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState(INITIAL_KNOWLEDGE)
  const [editing, setEditing] = useState<KnowledgeKey | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSave(key: KnowledgeKey, value: string) {
    setKnowledge(prev => ({ ...prev, [key]: value }))
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Brand System</p>
          <h1 className="text-2xl font-bold text-stone-900">Brand Knowledge Base</h1>
          <p className="text-stone-500 text-sm mt-1">All brand context, product details, and copy guidelines in one place. Used by the Creative Generator as context.</p>
        </div>
        {saved && (
          <span className="text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium">Saved ✓</span>
        )}
      </div>

      {/* Quick brand card */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-2xl shrink-0">✝️</div>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-0.5">Daily Devotion Co.</p>
            <p className="font-bold text-white mb-1">{knowledge.brand_tagline}</p>
            <p className="text-stone-300 text-sm">{knowledge.brand_promise}</p>
            <a href={knowledge.website_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-xs hover:underline mt-1 block">{knowledge.website_url}</a>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map(section => (
          <div key={section.key} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-stone-100">
              <div>
                <p className="text-sm font-semibold text-stone-800">{section.label}</p>
                <p className="text-xs text-stone-400">{section.description}</p>
              </div>
              <button
                onClick={() => setEditing(editing === section.key ? null : section.key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  editing === section.key
                    ? 'bg-stone-100 text-stone-600'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {editing === section.key ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="px-5 py-4">
              {editing === section.key ? (
                <EditField
                  initialValue={knowledge[section.key]}
                  multiline={section.multiline}
                  onSave={value => handleSave(section.key, value)}
                />
              ) : (
                <p className="text-sm text-stone-700 whitespace-pre-line">{knowledge[section.key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditField({ initialValue, multiline, onSave }: {
  initialValue: string
  multiline: boolean
  onSave: (v: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={Math.max(4, value.split('\n').length + 1)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          autoFocus
        />
      )}
      <button
        onClick={() => onSave(value)}
        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
      >
        Save
      </button>
    </div>
  )
}
