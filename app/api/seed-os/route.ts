import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const DEFAULT_THEMES = [
  { name: 'Faith & Reconnection', description: 'For people drifting from God', color: '#f59e0b' },
  { name: 'Protection & Peace', description: 'For anxious parents and fearful hearts', color: '#3b82f6' },
  { name: 'Gift of Faith', description: 'Meaningful faith-based gifting', color: '#10b981' },
  { name: 'Strength & Career', description: 'Faith meets professional life', color: '#8b5cf6' },
  { name: 'Love & Relationships', description: 'Faith as foundation for relationships', color: '#ec4899' },
  { name: 'New Beginnings', description: 'Fresh start, new year, new goals', color: '#06b6d4' },
]

const DEFAULT_PERSONAS = [
  {
    name: 'Spiritually Drifting Young Pro',
    archetype: 'The Reconnector',
    age_range: '22–32',
    description: 'Corporate/BPO professional who used to be active in church but drifted away. Feels guilty about spiritual distance.',
    pain_points: ['Sunday guilt', 'Prayer inadequacy', 'The gap feels too big to go back', 'No time for devotionals'],
    hook_phrases: ['Nakakahiya pero... ilang months na akong di nag-sisimba', 'Real talk: Kailan ka huling nag-feel na malapit ka sa Diyos?'],
  },
  {
    name: 'Anxious Parent',
    archetype: 'The Protector',
    age_range: '28–45',
    description: 'Working parent who wakes at 3AM worrying about kids. Wants spiritual coverage when they can\'t be there.',
    pain_points: ['3AM worry spirals', 'Can\'t be everywhere', 'Kulang yung ingat ka', 'Spiritual legacy for children'],
    hook_phrases: ['POV: 3AM ka gising, nag-iisip kung protected ba mga anak mo', 'My kids leave the house with something on their wrist. I breathe easier now.'],
  },
  {
    name: 'Thoughtful Gift-Seeker',
    archetype: 'The Connector',
    age_range: '25–40',
    description: 'Active social life, frequent gift-giver. Tired of wallet/perfume/Starbucks cycle. Wants meaningful gifts.',
    pain_points: ['Gift amnesia', 'Generic gift fatigue', 'Pressure to be the thoughtful one', 'Multiple occasions to cover'],
    hook_phrases: ['POV: You gave a gift na nag-make them cry (good tears)', 'Nakakasawa na yung wallet at perfume—ito different'],
  },
]

export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const results: Record<string, unknown> = {}

  // Seed campaign themes
  const { data: themes, error: te } = await supabase
    .from('campaign_themes')
    .upsert(DEFAULT_THEMES, { onConflict: 'name' })
    .select()
  results.themes = te ? { error: te.message } : { ok: true, count: themes?.length }

  // Seed personas
  const { data: personas, error: pe } = await supabase
    .from('personas')
    .upsert(DEFAULT_PERSONAS, { onConflict: 'name' })
    .select()
  results.personas = pe ? { error: pe.message } : { ok: true, count: personas?.length }

  // Seed content pillars (requires themes to exist first)
  if (themes?.length) {
    const themeMap = Object.fromEntries(themes.map((t: { id: string; name: string }) => [t.name, t.id]))
    const pillars = [
      { theme_id: themeMap['Faith & Reconnection'], name: 'Overcoming Spiritual Guilt', description: 'Sunday guilt, prayer inadequacy, feeling far from God' },
      { theme_id: themeMap['Faith & Reconnection'], name: 'Small Acts of Faith', description: 'Zero-friction devotion, micro-faith moments' },
      { theme_id: themeMap['Faith & Reconnection'], name: 'The Journey Back', description: 'Returning to faith, fresh start energy' },
      { theme_id: themeMap['Protection & Peace'], name: 'Parent Anxiety & Trust', description: '3AM worry, spiritual protection for family' },
      { theme_id: themeMap['Protection & Peace'], name: 'Fear & Courage', description: 'Overcoming fear, divine courage' },
      { theme_id: themeMap['Gift of Faith'], name: 'Meaningful Gifting', description: 'Gift amnesia antidote, lasting impact' },
      { theme_id: themeMap['Gift of Faith'], name: 'Gift Occasions', description: 'Birthdays, Christmas, graduation, baptism' },
      { theme_id: themeMap['Strength & Career'], name: 'Career Confidence', description: 'Promotions, presentations, daily grind' },
      { theme_id: themeMap['Strength & Career'], name: 'Burnout & Purpose', description: 'Burnout, spiritual grounding in work' },
      { theme_id: themeMap['New Beginnings'], name: 'New Year Intentions', description: 'Resolution energy, fresh start, goals' },
    ].filter(p => p.theme_id)

    const { data: pillarData, error: ple } = await supabase
      .from('content_pillars')
      .upsert(pillars, { onConflict: 'name' })
      .select()
    results.pillars = ple ? { error: ple.message } : { ok: true, count: pillarData?.length }
  }

  return NextResponse.json({ results })
}
