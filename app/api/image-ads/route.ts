import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export type ImageAdOutput = {
  concept: string
  overlay_text: string
  headline: string
  caption: string
  cta: string
  ugc_shot_direction: string
  recommended_asset_category: string
  recommended_asset_description: string
  color_palette: string
  hook_variation: string
}

export async function POST(req: NextRequest) {
  const { theme, product, verse, persona, objective, notes, asset_context } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      ad: {
        concept: `${theme} — ${persona} ad concept for ${product}. Show bracelet in natural light with verse visible.`,
        overlay_text: `"${verse}"`,
        headline: 'Faith You Can Wear — ₱349',
        caption: `Para sa mga ${persona} — ang Daily Devotion Co. bracelet ay isang pisikal na paalala na hawak ka Niya. Link sa bio. 🙏`,
        cta: 'Order Now — Link in Bio',
        ugc_shot_direction: 'Close-up of wrist with bracelet, natural morning light, coffee or journal in background. Show verse clearly. Creator reads verse slowly.',
        recommended_asset_category: 'product_photos',
        recommended_asset_description: 'Clean studio product shot on dark slate or warm beige background with dried wheat/orchid props',
        color_palette: 'Black (#1c1917), Amber (#f59e0b), White (#fafaf9)',
        hook_variation: `POV: May nagbibigay sa'yo ng pisikal na paalala na hawak ka ng Diyos araw-araw.`,
      }
    })
  }

  const client = new Anthropic()

  const prompt = `You are a Filipino creative director for Daily Devotion Co. — a Christian jewelry brand selling Bible verse bracelets (₱349) to Filipino audiences on Facebook and Instagram.

Generate a complete IMAGE AD CONCEPT for:
- Campaign Theme: ${theme}
- Product: ${product}
- Bible Verse: ${verse}
- Persona: ${persona}
- Objective: ${objective}
${notes ? `- Additional notes: ${notes}` : ''}
${asset_context ? `- Available assets: ${asset_context}` : ''}

Return ONLY valid JSON:
{
  "concept": "2-3 sentences describing the overall ad concept — what scene, what emotion, what story is told visually",
  "overlay_text": "Text that appears ON the image (max 6 words, Taglish, emotionally punchy)",
  "headline": "Facebook/Instagram headline (max 40 chars, Taglish)",
  "caption": "Full caption/primary text (4-6 short paragraphs, Modern Taglish, hook in first 125 chars, ends with soft CTA)",
  "cta": "Button CTA text (max 6 words, action-oriented)",
  "ugc_shot_direction": "Specific camera and performance direction for a UGC creator shooting this ad — what to film, how to hold the product, facial expression, voiceover style",
  "recommended_asset_category": "Which asset category to use: product_photos | lifestyle | packaging | social_proof",
  "recommended_asset_description": "Describe the ideal image to use or shoot for this ad",
  "color_palette": "Color palette recommendation for any graphic design elements",
  "hook_variation": "Alternative hook to test as a second variant (Taglish, different format from the caption hook)"
}`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content.find(b => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON')

    return NextResponse.json({ ad: JSON.parse(jsonMatch[0]) })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
