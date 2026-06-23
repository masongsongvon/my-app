'use client'

import { useState } from 'react'
import { SEED_PRODUCTS, SEED_VERSES, SEED_ANGLES } from '@/lib/data'

type SeedStatus = 'idle' | 'loading' | 'success' | 'error'

export default function SettingsPage() {
  const [seedStatus, setSeedStatus] = useState<SeedStatus>('idle')
  const [seedResult, setSeedResult] = useState<string | null>(null)

  async function handleSeed() {
    setSeedStatus('loading')
    setSeedResult(null)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setSeedStatus('error')
        setSeedResult(data.error ?? 'Seed failed')
      } else {
        setSeedStatus('success')
        setSeedResult(JSON.stringify(data.results, null, 2))
      }
    } catch {
      setSeedStatus('error')
      setSeedResult('Network error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Settings</p>
        <h1 className="text-2xl font-bold text-stone-900">Settings & Seed Data</h1>
        <p className="text-stone-500 mt-1 text-sm">Configure your Supabase connection and seed your database.</p>
      </div>

      {/* Supabase Config */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-1">Supabase Configuration</h2>
        <p className="text-sm text-stone-500 mb-4">
          Set these environment variables in your <code className="bg-stone-100 px-1 rounded">.env.local</code> file or in your Vercel project settings.
        </p>
        <div className="space-y-3">
          {[
            { name: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'Your Supabase project URL' },
            { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', desc: 'Your Supabase anon/public key' },
          ].map((v) => (
            <div key={v.name} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <code className="text-sm font-mono text-amber-700">{v.name}</code>
              <p className="text-xs text-stone-500 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seed Data */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-1">Seed Database</h2>
        <p className="text-sm text-stone-500 mb-4">
          Populate your Supabase tables with the default products, verses, and customer angles. Run this once after creating your tables.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-2xl font-bold text-stone-900">{SEED_PRODUCTS.length}</p>
            <p className="text-sm text-stone-500">Products</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-2xl font-bold text-stone-900">{SEED_VERSES.length}</p>
            <p className="text-sm text-stone-500">Bible Verses</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <p className="text-2xl font-bold text-stone-900">{SEED_ANGLES.length}</p>
            <p className="text-sm text-stone-500">Customer Angles</p>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seedStatus === 'loading'}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold text-sm transition-colors"
        >
          {seedStatus === 'loading' ? 'Seeding…' : 'Seed Database'}
        </button>

        {seedStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-semibold text-green-700 mb-2">✓ Seed complete</p>
            <pre className="text-xs text-green-600 overflow-auto">{seedResult}</pre>
          </div>
        )}
        {seedStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-semibold text-red-700 mb-1">Seed failed</p>
            <p className="text-xs text-red-600">{seedResult}</p>
          </div>
        )}
      </section>

      {/* Product list */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Products</h2>
        <div className="space-y-2">
          {SEED_PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verses */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Bible Verses</h2>
        <div className="space-y-2">
          {SEED_VERSES.map((v) => (
            <div key={v.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-xs font-semibold text-amber-600">{v.reference}</p>
              <p className="text-sm text-stone-700 mt-1">"{v.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Angles */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Customer Angles</h2>
        <div className="flex flex-wrap gap-2">
          {SEED_ANGLES.map((a) => (
            <span key={a.id} className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
              {a.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
