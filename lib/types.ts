export type Product = {
  id: string
  name: string
  slug: string
  description: string
  created_at?: string
}

export type Verse = {
  id: string
  reference: string
  text: string
  created_at?: string
}

export type CreativeAngle = {
  id: string
  name: string
  description?: string
  created_at?: string
}

export type GeneratedCreative = {
  id: string
  product_id: string
  verse_id: string
  angle_id: string
  format: string
  primary_text: string
  headline: string
  ugc_script: string
  voiceover_script: string
  product_description: string
  hooks: string[]
  ctas: string[]
  landing_page?: string
  ecommerce_page?: string
  notes?: string
  created_at: string
  // joined fields
  products?: Product
  verses?: Verse
  creative_angles?: CreativeAngle
}

export type CreativeFormat =
  | 'meta_ads_primary_text'
  | 'meta_ads_headline'
  | 'ugc_script'
  | 'voiceover_script'
  | 'product_description'
  | 'hook_variations'
  | 'cta_variations'
  | 'full_creative_set'

export const CREATIVE_FORMATS: { value: CreativeFormat; label: string }[] = [
  { value: 'meta_ads_primary_text', label: 'Meta Ads Primary Text' },
  { value: 'meta_ads_headline', label: 'Meta Ads Headline' },
  { value: 'ugc_script', label: 'UGC Script' },
  { value: 'voiceover_script', label: 'Voiceover Script' },
  { value: 'product_description', label: 'Product Description' },
  { value: 'hook_variations', label: 'Hook Variations' },
  { value: 'cta_variations', label: 'CTA Variations' },
  { value: 'full_creative_set', label: 'Full Creative Set' },
]
