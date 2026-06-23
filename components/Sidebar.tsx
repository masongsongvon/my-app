'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/generate', label: 'Generate Creative', icon: '✨' },
  { href: '/saved', label: 'Saved Creatives', icon: '📂' },
  { href: '/settings', label: 'Settings & Seed', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-stone-900 text-white">
      <div className="px-6 py-8 border-b border-stone-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">Growth OS</p>
        <h1 className="text-lg font-bold leading-tight">Daily Devotion Co.</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-500 text-stone-900'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-stone-700">
        <p className="text-xs text-stone-500">Automated Creative Library</p>
        <p className="text-xs text-stone-600 mt-1">v1.0.0</p>
      </div>
    </aside>
  )
}
