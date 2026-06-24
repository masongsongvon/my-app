import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const { week_start, month, products, verses, themes, objective } = await req.json()

  const period = month ? `Month of ${month}` : `Week starting ${week_start}`

  if (!process.env.ANTHROPIC_API_KEY) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return NextResponse.json({
      items: days.map((day, i) => ({
        day,
        date: week_start,
        platform: i % 2 === 0 ? 'facebook' : 'instagram',
        theme: themes?.[0] ?? 'Faith & Reconnection',
        angle: ['Overthinking', 'Silent Struggle', 'Fear', 'Waiting Season', 'Gift For Someone', 'Burnout', 'Not Alone'][i % 7],
        persona: ['Spiritually Drifting Young Pro', 'Anxious Parent', 'Thoughtful Gift-Seeker'][i % 3],
        product: products?.[i % (products?.length ?? 1)] ?? 'Original Bible Verse Bracelet',
        verse: verses?.[i % (verses?.length ?? 1)] ?? 'Isaiah 41:10',
        format: ['primary_text', 'ugc_script', 'voiceover_script', 'hook_variations', 'primary_text', 'ugc_script', 'primary_text'][i],
        objective: objective ?? 'conversion',
      }))
    })
  }

  const client = new Anthropic()

  const prompt = `You are a social media content strategist for Daily Devotion Co. — a Filipino Christian jewelry brand.

Generate a content calendar for: ${period}
- Products available: ${(products ?? ['Original Bible Verse Bracelet', 'Silver Edition Bracelet', 'Bible Verse Necklace', 'Daily Verse Jar']).join(', ')}
- Verses to use: ${(verses ?? ['Isaiah 41:10', 'Philippians 4:13', 'Luke 1:37', 'Matthew 19:26']).join(', ')}
- Campaign themes: ${(themes ?? ['Faith & Reconnection', 'Protection & Peace', 'Gift of Faith']).join(', ')}
- Primary objective: ${objective ?? 'conversion'}

Create 7 days of content (Mon-Sun). For each day:
- Vary platform (facebook/instagram), persona, angle, and format
- Monday/Wednesday/Friday: heavier content (primary text, UGC script)
- Tuesday/Thursday: lighter content (hooks, stories)
- Saturday/Sunday: social proof, gift angles

Return ONLY valid JSON:
{
  "items": [
    {
      "day": "Mon",
      "platform": "facebook",
      "theme": "theme name",
      "angle": "specific angle name",
      "persona": "persona name",
      "product": "product name",
      "verse": "verse reference",
      "format": "format type",
      "objective": "awareness|consideration|conversion|retention",
      "hook_preview": "Short preview of the opening hook (Taglish, max 80 chars)"
    }
  ]
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

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
