import Link from 'next/link'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'

const STATS = [
  { label: 'Products', value: SEED_PRODUCTS.length, icon: '📦' },
  { label: 'Bible Verses', value: SEED_VERSES.length, icon: '✝️' },
  { label: 'Angles', value: SEED_ANGLES.length, icon: '🎯' },
  { label: 'Creative Formats', value: 8, icon: '✨' },
]

const QUICK_ACTIONS = [
  {
    href: '/generate',
    icon: '✨',
    title: 'Generate Creative',
    desc: 'Campaign Theme → Persona → Dynamic Angle → Full creative set in seconds.',
    cta: 'Start generating →',
    accent: 'bg-amber-500',
  },
  {
    href: '/image-ads',
    icon: '🖼️',
    title: 'Image Ad Generator',
    desc: 'Get overlay text, headline, caption, CTA, and UGC shot direction.',
    cta: 'Create image ad →',
    accent: 'bg-violet-500',
  },
  {
    href: '/library',
    icon: '📁',
    title: 'Asset Library',
    desc: 'Upload brand photos, import from your local folder, tag and search.',
    cta: 'Open library →',
    accent: 'bg-blue-500',
  },
  {
    href: '/calendar',
    icon: '📅',
    title: 'Content Calendar',
    desc: 'AI-generated weekly content plan with themes, angles, and personas.',
    cta: 'Build calendar →',
    accent: 'bg-emerald-500',
  },
  {
    href: '/planner',
    icon: '🗺️',
    title: 'Campaign Planner',
    desc: 'Manage campaign themes, content pillars, and customer personas.',
    cta: 'Plan campaigns →',
    accent: 'bg-rose-500',
  },
  {
    href: '/knowledge',
    icon: '🧠',
    title: 'Brand Knowledge Base',
    desc: 'All brand context, product specs, voice, and copy guidelines.',
    cta: 'View knowledge →',
    accent: 'bg-stone-700',
  },
  {
    href: '/saved',
    icon: '📂',
    title: 'Saved Creatives',
    desc: 'Browse and copy all previously generated creatives.',
    cta: 'View saved →',
    accent: 'bg-sky-500',
  },
  {
    href: '/settings',
    icon: '⚙️',
    title: 'Settings',
    desc: 'Connect Supabase and seed your database.',
    cta: 'Go to settings →',
    accent: 'bg-stone-500',
  },
]

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
          Growth Operating System
        </p>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Daily Devotion Growth OS</h1>
        <p className="text-stone-500 max-w-xl">
          Taglish ad copy, UGC scripts, image ad concepts, content calendar, asset library — all powered by Claude.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${action.accent} flex items-center justify-center text-white text-lg mb-3`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-stone-900 mb-1 text-sm">{action.title}</h3>
            <p className="text-xs text-stone-500 mb-3 leading-relaxed">{action.desc}</p>
            <span className="text-xs font-medium text-amber-600 group-hover:underline">{action.cta}</span>
          </Link>
        ))}
      </div>

      {/* Brand Context */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Brand Context</p>
        <h2 className="text-lg font-bold mb-2">Daily Devotion Co. — Zero-Friction Faith</h2>
        <p className="text-stone-300 text-sm mb-4">
          Faith that fits your real life. No pressure. Just presence.{' '}
          <em className="text-amber-400">Small reminders, big shifts.</em> ₱349 · Filipino Christians 22–45.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SEED_VERSES.map((v) => (
            <div key={v.id} className="bg-stone-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-400">{v.reference}</p>
              <p className="text-sm text-stone-200 mt-1">"{v.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
