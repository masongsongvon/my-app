'use client'

import { useState } from 'react'
import type { GeneratedCreative } from '@/lib/types'

type Props = {
  creative: GeneratedCreative
  onDelete?: (id: string) => void
}

type Tab =
  | 'primary_text'
  | 'headline'
  | 'ugc_script'
  | 'voiceover_script'
  | 'product_description'
  | 'hooks'
  | 'ctas'
  | 'landing_page'
  | 'ecommerce_page'

const TABS: { key: Tab; label: string }[] = [
  { key: 'primary_text', label: 'Primary Text' },
  { key: 'headline', label: 'Headline' },
  { key: 'ugc_script', label: 'UGC Script' },
  { key: 'voiceover_script', label: 'Voiceover' },
  { key: 'product_description', label: 'Product Desc.' },
  { key: 'hooks', label: 'Hooks (10)' },
  { key: 'ctas', label: 'CTAs (10)' },
  { key: 'landing_page', label: 'Landing Page' },
  { key: 'ecommerce_page', label: 'Shop Page' },
]

export default function CreativeCard({ creative, onDelete }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('primary_text')
  const [copied, setCopied] = useState(false)

  const product = creative.products?.name ?? creative.product_id
  const verse = creative.verses ? `${creative.verses.reference}` : creative.verse_id
  const angle = creative.creative_angles?.name ?? creative.angle_id

  function getContent(): string {
    switch (activeTab) {
      case 'primary_text': return creative.primary_text
      case 'headline': return creative.headline
      case 'ugc_script': return creative.ugc_script
      case 'voiceover_script': return creative.voiceover_script
      case 'product_description': return creative.product_description
      case 'hooks': return (creative.hooks ?? []).map((h, i) => `${i + 1}. ${h}`).join('\n')
      case 'ctas': return (creative.ctas ?? []).map((c, i) => `${i + 1}. ${c}`).join('\n')
      case 'landing_page': return creative.landing_page ?? '(No landing page copy generated)'
      case 'ecommerce_page': return creative.ecommerce_page ?? '(No e-commerce page copy generated)'
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const date = new Date(creative.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-stone-50 border-b border-stone-200">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-stone-800 truncate">{product}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                {verse}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {angle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700">
                {creative.format.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-400">{date}</span>
            {onDelete && (
              <button
                onClick={() => onDelete(creative.id)}
                className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none"
                title="Delete"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-stone-200 bg-white">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        <pre className="whitespace-pre-wrap text-sm text-stone-700 font-sans leading-relaxed min-h-[100px]">
          {getContent()}
        </pre>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 flex justify-end">
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
