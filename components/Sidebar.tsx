'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_GROUPS = [
  {
    label: 'Create',
    items: [
      { href: '/generate', label: 'Creative Generator', icon: '✨' },
      { href: '/image-ads', label: 'Image Ad Generator', icon: '🖼️' },
    ],
  },
  {
    label: 'Library',
    items: [
      { href: '/library', label: 'Asset Library', icon: '📁' },
      { href: '/saved', label: 'Saved Creatives', icon: '📂' },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { href: '/calendar', label: 'Content Calendar', icon: '📅' },
      { href: '/planner', label: 'Campaign Planner', icon: '🗺️' },
    ],
  },
  {
    label: 'Brand',
    items: [
      { href: '/knowledge', label: 'Brand Knowledge', icon: '🧠' },
      { href: '/settings', label: 'Settings & Seed', icon: '⚙️' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-stone-900 text-white shrink-0">
      <Link href="/" className="px-6 py-6 border-b border-stone-800 block hover:bg-stone-800 transition-colors">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-0.5">Growth OS</p>
        <h1 className="text-base font-bold leading-tight text-white">Daily Devotion Co.</h1>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-amber-500 text-stone-900'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-stone-800">
        <p className="text-xs text-stone-600">Automated Creative Library</p>
      </div>
    </aside>
  )
}
