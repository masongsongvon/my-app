import Link from 'next/link'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'

const STATS = [
  { label: 'Products', value: SEED_PRODUCTS.length, icon: '📦' },
  { label: 'Bible Verses', value: SEED_VERSES.length, icon: '✝️' },
  { label: 'Customer Angles', value: SEED_ANGLES.length, icon: '🎯' },
  { label: 'Creative Formats', value: 8, icon: '✨' },
]

const QUICK_ACTIONS = [
  {
    href: '/generate',
    icon: '✨',
    title: 'Generate Creative',
    desc: 'Pick a verse, product, angle, and format — get a full creative set instantly.',
    cta: 'Start generating →',
    accent: 'bg-amber-500',
  },
  {
    href: '/saved',
    icon: '📂',
    title: 'Saved Creatives',
    desc: 'Browse, filter, and copy all your previously generated creatives.',
    cta: 'View library →',
    accent: 'bg-blue-500',
  },
  {
    href: '/settings',
    icon: '⚙️',
    title: 'Settings & Seed Data',
    desc: 'Connect Supabase and seed your database with products, verses, and angles.',
    cta: 'Go to settings →',
    accent: 'bg-stone-500',
  },
]

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
          Automated Creative Library
        </p>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Daily Devotion Growth OS</h1>
        <p className="text-stone-500 max-w-xl">
          Generate faith-based ad copy, UGC scripts, product descriptions, hooks, and more — in seconds. Built for Daily Devotion Co.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${action.accent} flex items-center justify-center text-white text-xl mb-4`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">{action.title}</h3>
            <p className="text-sm text-stone-500 mb-4">{action.desc}</p>
            <span className="text-sm font-medium text-amber-600 group-hover:underline">{action.cta}</span>
          </Link>
        ))}
      </div>

      {/* Brand Context */}
      <div className="bg-stone-900 rounded-2xl p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Brand Context</p>
        <h2 className="text-lg font-bold mb-2">Daily Devotion Co.</h2>
        <p className="text-stone-300 text-sm mb-4">
          Faith-based, emotional, comforting, and giftable jewelry and devotional products. The main promise:{' '}
          <em className="text-amber-400">"A promise you can wear."</em>
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
