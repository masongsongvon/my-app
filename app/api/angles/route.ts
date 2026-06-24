import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { DynamicAngle } from '@/lib/types'

const FALLBACK_ANGLES: Record<string, DynamicAngle[]> = {
  'Faith & Reconnection': [
    { name: 'The Sunday Guilt', hook: 'Nakakahiya pero... ilang months na akong di nag-sisimba.', description: 'Para sa mga taong feel guilty dahil hindi na sila nag-sisimba nang matagal' },
    { name: 'The Gap Feels Too Big', hook: 'Pakiramdam mo ba na ang layo mo na sa Diyos?', description: 'Yung feeling na para ka nang hindi makabalik dahil sobrang tagal na' },
    { name: 'Faith Without Friction', hook: 'Gusto mong malapit sa Diyos pero walang time at energy?', description: 'Zero-friction approach — 2-second reminder, hindi 1-hour devotional' },
    { name: 'The Confession', hook: 'Okay so... confession time. Hindi ko alam kailan ako huling nag-pray.', description: 'Vulnerable admission na nag-drift ka — relatable, honest, walang judgment' },
    { name: 'Small Reminders, Big Shift', hook: 'Hindi kailangan ng perfect. Kailangan mo lang ng paalala.', description: 'Micro-faith moments — bawat tingin sa bracelet = 2-second spiritual reset' },
  ],
  'Protection & Peace': [
    { name: '3AM Parent', hook: 'POV: 3AM ka gising, nag-iisip kung protected ba mga anak mo.', description: 'Para sa mga magulang na nagigising sa gabi dahil sa pag-aalala' },
    { name: 'Kulang Yung Ingat Ka', hook: 'Yung feeling na kulang yung "ingat ka" mo. Ano pa ang magagawa mo?', description: 'Para sa mga magulang na gusto nilang maging nasa lahat ng lugar para sa kanilang anak' },
    { name: 'Spiritual Armor', hook: 'My kids leave the house with something on their wrist. I breathe easier now.', description: 'Prayer coverage para sa pamilya — tangible na extension ng prayer ng magulang' },
    { name: 'The Waiting Season', hook: 'Gaano katagal ka nang naghihintay sa sagot ng Diyos?', description: 'Para sa mga naghihintay at nag-aalalang parang walang nangyayari' },
    { name: 'Not Alone in Fear', hook: 'May takot ka na hindi mo masabi sa kahit sino. Kilala Niya iyon.', description: 'Silent fear — divine presence kahit sa mga bagay na hindi mo sinasabi' },
  ],
  'Gift of Faith': [
    { name: 'The Gift They\'ll Still Wear Next Year', hook: 'POV: You gave a gift na nag-make them cry (good tears).', description: 'Para sa mga naghahanap ng regalo na talagang matandaan' },
    { name: 'Nakakasawa Na', hook: 'Nakakasawa na yung wallet, perfume, Starbucks card cycle.', description: 'Gift amnesia antidote — something they use every single day' },
    { name: 'Daily Reminder of Your Love', hook: 'Bawat umaga, tinginnan nila ito at naalala ka.', description: 'The gift that keeps giving — literal daily presence even when you\'re not there' },
    { name: 'Meaningful > Expensive', hook: 'Best gift hindi yung pinaka-mahal. Ito yung patunay.', description: 'Value framing — ₱349 na may emotional impact na walang katumbas na presyo' },
    { name: 'The Extension of Your Prayer', hook: 'Ibibigay mo sa kanila ng higit pa sa regalo. Ibibigay mo ang iyong prayer.', description: 'Spiritual gifting — giving someone a physical piece of your prayer for them' },
  ],
}

function getFallbackAngles(theme: string): DynamicAngle[] {
  for (const [key, angles] of Object.entries(FALLBACK_ANGLES)) {
    if (theme.toLowerCase().includes(key.toLowerCase().split(' ')[0].toLowerCase())) {
      return angles
    }
  }
  return FALLBACK_ANGLES['Faith & Reconnection']
}

export async function POST(req: NextRequest) {
  const { theme, pillar, persona, persona_description, objective } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ angles: getFallbackAngles(theme) })
  }

  const client = new Anthropic()

  const prompt = `You are a Filipino direct response copywriter for Daily Devotion Co. — a Christian jewelry brand selling Bible verse bracelets (₱349) to Filipino audiences.

Generate 5 specific, emotionally resonant creative ANGLES for a Facebook/Instagram ad campaign with this strategy:
- Campaign Theme: ${theme}
- Content Pillar: ${pillar}
- Customer Persona: ${persona} — ${persona_description}
- Objective: ${objective}

Each angle should be:
- Rooted in a specific emotional truth or pain point the persona experiences
- Different enough from each other (diverse entry points, not 5 variations of the same thing)
- Written in Modern Taglish — natural Filipino voice, not translated English
- The hook should be the literal opening line of the ad (first 125 characters)

Return ONLY valid JSON, no markdown:
{
  "angles": [
    {
      "name": "Short descriptive name for this angle (3-5 words)",
      "hook": "The actual opening line of the ad — Taglish, scroll-stopping, max 125 chars",
      "description": "One sentence describing who this angle speaks to and why it resonates"
    }
  ]
}`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content.find(b => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({ angles: parsed.angles })
  } catch {
    return NextResponse.json({ angles: getFallbackAngles(theme) })
  }
}
