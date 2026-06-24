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
  angle_id: string              // text — 'dynamic' or legacy seed angle id, no FK
  dynamic_angle_name?: string  // human-readable name for AI-generated angles
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
  | 'image_ad'

export const CREATIVE_FORMATS: { value: CreativeFormat; label: string }[] = [
  { value: 'full_creative_set', label: 'Full Creative Set' },
  { value: 'meta_ads_primary_text', label: 'Meta Ads Primary Text' },
  { value: 'meta_ads_headline', label: 'Meta Ads Headline' },
  { value: 'ugc_script', label: 'UGC Script' },
  { value: 'voiceover_script', label: 'Voiceover Script' },
  { value: 'product_description', label: 'Product Description' },
  { value: 'hook_variations', label: 'Hook Variations' },
  { value: 'cta_variations', label: 'CTA Variations' },
  { value: 'image_ad', label: 'Image Ad Concept' },
]

// ─── New Growth OS Types ───────────────────────────────────────────────────────

export type AssetCategory =
  | 'product_photos'
  | 'lifestyle'
  | 'packaging'
  | 'logos'
  | 'sample_ads'
  | 'social_proof'

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'product_photos', label: 'Product Photos' },
  { value: 'lifestyle', label: 'Lifestyle Photos' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'logos', label: 'Logos' },
  { value: 'sample_ads', label: 'Sample Ads' },
  { value: 'social_proof', label: 'Social Proof' },
]

export const FOLDER_TO_CATEGORY: Record<string, AssetCategory> = {
  'New Product shoot': 'product_photos',
  'New Product Shoot': 'product_photos',
  'New packaging': 'packaging',
  'New Packaging': 'packaging',
  'Sample image ads': 'sample_ads',
  'Sample Image Ads': 'sample_ads',
  'Logo': 'logos',
  'Website pictures': 'lifestyle',
  'Website Pictures': 'lifestyle',
  'Customer proof of orders': 'social_proof',
  'Customer Proof of Orders': 'social_proof',
}

export type BrandAsset = {
  id: string
  name: string
  original_name?: string
  storage_path?: string
  public_url?: string
  local_path?: string
  category: AssetCategory
  folder?: string
  file_size?: number
  mime_type?: string
  product_tags?: string[]
  verse_tags?: string[]
  campaign_tags?: string[]
  notes?: string
  created_at: string
}

export type CampaignTheme = {
  id: string
  name: string
  description?: string
  color?: string
  created_at: string
}

export type ContentPillar = {
  id: string
  theme_id?: string
  name: string
  description?: string
  created_at: string
}

export type Persona = {
  id: string
  name: string
  archetype?: string
  description?: string
  age_range?: string
  pain_points?: string[]
  desires?: string[]
  hook_phrases?: string[]
  created_at: string
}

export type CampaignPlan = {
  id: string
  name: string
  theme_id?: string
  description?: string
  start_date?: string
  end_date?: string
  status?: string
  notes?: string
  created_at: string
  campaign_themes?: CampaignTheme
}

export type CalendarItem = {
  id: string
  campaign_plan_id?: string
  scheduled_date: string
  theme_id?: string
  pillar_id?: string
  persona_id?: string
  product_id?: string
  verse_id?: string
  angle?: string
  objective?: string
  format?: string
  platform?: string
  status?: string
  notes?: string
  created_at: string
  campaign_themes?: CampaignTheme
  content_pillars?: ContentPillar
  personas?: Persona
  products?: Product
  verses?: Verse
}

export type WinningAd = {
  id: string
  name?: string
  asset_id?: string
  product_id?: string
  verse_id?: string
  theme_id?: string
  angle?: string
  format?: string
  platform?: string
  performance_notes?: string
  created_at: string
}

export type DynamicAngle = {
  name: string
  hook: string
  description: string
}

export const OBJECTIVES = [
  { value: 'awareness', label: 'Awareness', desc: 'Reach new audiences, build brand recognition' },
  { value: 'consideration', label: 'Consideration', desc: 'Drive engagement, shares, and saves' },
  { value: 'conversion', label: 'Conversion', desc: 'Drive purchase, link clicks, add to cart' },
  { value: 'retention', label: 'Retention', desc: 'Re-engage past buyers, loyalty, gifting' },
]

export const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'reels', label: 'Reels' },
]
