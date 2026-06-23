import Anthropic from '@anthropic-ai/sdk'
import type { Product, Verse, CreativeAngle } from './types'

type GenerateInput = {
  product: Product
  verse: Verse
  angle: CreativeAngle
  notes?: string
}

export type GeneratedOutput = {
  primary_text: string
  headline: string
  ugc_script: string
  voiceover_script: string
  product_description: string
  hooks: string[]
  ctas: string[]
}

const isAnthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY)

export async function generateCreative(input: GenerateInput): Promise<GeneratedOutput> {
  if (!isAnthropicConfigured) {
    return generateCreativeFallback(input)
  }
  return generateCreativeWithClaude(input)
}

async function generateCreativeWithClaude(input: GenerateInput): Promise<GeneratedOutput> {
  const { product, verse, angle, notes } = input
  const client = new Anthropic()

  const prompt = `You are a world-class faith-based brand copywriter for Daily Devotion Co., a Christian jewelry and devotional products brand. You write emotionally resonant, conversion-optimized ad copy that feels authentic, not salesy.

BRAND VOICE: Warm, faith-filled, emotionally honest. Never preachy. Speaks to real human struggles with Biblical hope.

PRODUCT: ${product.name}
PRODUCT DESCRIPTION: ${product.description}

BIBLE VERSE: "${verse.text}" — ${verse.reference}

CUSTOMER ANGLE: ${angle.name}${angle.description ? ` — ${angle.description}` : ''}
${notes ? `\nADDITIONAL NOTES: ${notes}` : ''}

Generate a complete creative set. Return ONLY valid JSON with this exact structure:
{
  "primary_text": "Full Meta ads primary text (3–5 paragraphs, emotional hook → verse → product → CTA)",
  "headline": "Short punchy headline under 40 characters",
  "ugc_script": "UGC creator script with [Hook], [Story], [Product Reveal], [Emotional Payoff], [CTA] sections with timestamps",
  "voiceover_script": "Voiceover script with [tone note], poetic pacing, verse, product, CTA",
  "product_description": "E-commerce product description with verse, emotional angle, bullet points",
  "hooks": ["hook1", "hook2", "hook3", "hook4", "hook5", "hook6", "hook7", "hook8", "hook9", "hook10"],
  "ctas": ["cta1", "cta2", "cta3", "cta4", "cta5", "cta6", "cta7", "cta8", "cta9", "cta10"]
}

Make the copy feel human, emotionally resonant, and specific to this verse + angle combination. The hooks array must have exactly 10 hooks. The ctas array must have exactly 10 CTAs.`

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: prompt }],
  })

  const message = await stream.finalMessage()

  const textContent = message.content.find((b) => b.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response')
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response')
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedOutput
  return parsed
}

// Template fallback used when ANTHROPIC_API_KEY is not set
const ANGLE_EMOTIONS: Record<string, { opening: string; bridge: string; resolution: string }> = {
  'Anxiety / Fear': {
    opening: "When anxiety takes over and fear feels suffocating",
    bridge: "there's a reminder that cuts through the noise",
    resolution: "You are not alone. You never were.",
  },
  'Gift': {
    opening: "The most meaningful gifts aren't the biggest ones",
    bridge: "they're the ones that remind someone they are loved and held",
    resolution: "Give them something they'll carry every day.",
  },
  'Faith Reminder': {
    opening: "In the rush of everyday life, it's easy to forget",
    bridge: "but some truths are worth wearing close to you",
    resolution: "Let your faith travel with you.",
  },
  'Breakup / Healing': {
    opening: "Healing isn't linear — some days it feels impossible",
    bridge: "but you were made for more than this pain",
    resolution: "God's love doesn't leave when people do.",
  },
  'Motivation': {
    opening: "The moment before the breakthrough is the hardest one",
    bridge: "but you were built to push through",
    resolution: "Wear the reminder that nothing is impossible with Him.",
  },
  'Feeling Alone': {
    opening: "When the room is full but you still feel invisible",
    bridge: "God sees you — fully, completely, deeply",
    resolution: "You are never truly alone.",
  },
  'Hard Season': {
    opening: "Some seasons of life are just hard — no other word for it",
    bridge: "but hard seasons don't have the final word",
    resolution: "Wear the promise that carries you through.",
  },
  'Waiting Season': {
    opening: "Waiting on God's timing is one of the hardest acts of faith",
    bridge: "but His timing has never been wrong",
    resolution: "Hold on. He hasn't forgotten you.",
  },
  'Encouragement for Loved One': {
    opening: "Sometimes the people we love most are carrying the heaviest loads",
    bridge: "and the smallest reminder can mean everything",
    resolution: "Send them a piece of hope they can wear.",
  },
  "Daily Reminder of God's Promise": {
    opening: "Every morning you wake up is a promise kept",
    bridge: "wear a reminder of the One who keeps every promise",
    resolution: "A promise you can wear — every single day.",
  },
}

function generateCreativeFallback(input: GenerateInput): GeneratedOutput {
  const { product, verse, angle } = input
  const emotion = ANGLE_EMOTIONS[angle.name] ?? {
    opening: 'In the moments that matter most',
    bridge: 'faith becomes your anchor',
    resolution: 'Wear the reminder that changes everything.',
  }
  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const productArticle = isJar ? 'the' : 'a'
  const wearVerb = isJar ? 'open' : 'wear'
  const wearNoun = isJar ? 'jar' : isBracelet ? 'bracelet' : 'necklace'

  return {
    primary_text: `${emotion.opening} — ${emotion.bridge}.

"${verse.text}" — ${verse.reference}

${emotion.resolution}

The Daily Devotion Co. ${product.name} is more than jewelry. It's ${productArticle} daily reminder of who God says you are.

${isJar ? `Every verse inside this jar was chosen to meet you exactly where you are.` : `Engraved with ${verse.reference}, this ${wearNoun} travels with you everywhere.`}

Tap the link to shop — because some truths are worth carrying.`,
    headline: `"${verse.text}" — ${verse.reference} | ${product.name}`,
    ugc_script: `[Hook — 0:00–0:03]\n${emotion.opening.toUpperCase()}...\n\n[Personal Story — 0:03–0:15]\nI remember when I was going through a ${angle.name.toLowerCase()} moment. I didn't know what to hold onto. Then someone gave me this — the Daily Devotion Co. ${product.name}.\n\n[Product Reveal — 0:15–0:25]\n*holds up ${wearNoun}*\nIt says "${verse.text}" — ${verse.reference}. And honestly? I read it every single day. It's not just a ${wearNoun}. It's a promise.\n\n[Emotional Payoff — 0:25–0:40]\n${emotion.resolution} If you know someone going through a ${angle.name.toLowerCase()} season, get them this.\n\n[CTA — 0:40–0:45]\nLink in bio. It ships fast and the packaging is honestly beautiful.`,
    voiceover_script: `[Soft, warm tone]\n\n${emotion.opening}...\n\nGod's word says: "${verse.text}."\n\n${verse.reference}.\n\n${emotion.bridge} — and ${emotion.resolution.toLowerCase()}\n\nThe Daily Devotion Co. ${product.name}.\n\n${isJar ? `Fifty-two verses. One for every week of the year.` : `Engraved in metal. Worn close to your heart.`}\n\nA promise you can ${wearVerb}.\n\n[Pause]\n\nShop at the link below.`,
    product_description: `${product.name} — Daily Devotion Co.\n\n"${verse.text}" — ${verse.reference}\n\n${emotion.opening}. ${emotion.bridge}. This ${wearNoun} was made for moments exactly like this.\n\n${isJar ? `Each Daily Verse Jar holds 52 hand-selected Bible verses — one for every week of the year. Perfect for morning devotions, family prayer, or a meaningful gift.` : `Engraved with ${verse.reference}, this ${product.name} is a wearable promise — a daily reminder that God is with you.`}\n\n• Premium quality, beautifully packaged\n• Perfect for ${angle.name.toLowerCase()} moments\n• Ships in 2–4 business days\n• A meaningful, faith-filled gift\n\n${emotion.resolution}`,
    hooks: [
      `POV: You're going through a ${angle.name.toLowerCase()} season and someone gives you this 👇`,
      `"${verse.text}" — ${verse.reference} // This verse hits different when you need it most`,
      `The most meaningful ${wearNoun} I've ever owned and here's why...`,
      `If you know someone dealing with ${angle.name.toLowerCase()}, send them this 🙏`,
      `This isn't just a ${wearNoun}. It's a daily reminder from God.`,
      `${emotion.opening}... until I found this.`,
      `A ${wearNoun} that changed how I start every morning ✨`,
      `Why I never take my Daily Devotion ${wearNoun} off`,
      `"${verse.text}" — ${verse.reference} now lives on my ${isBracelet ? 'wrist' : 'neck'} every day`,
      `The gift that made someone cry — in the best way 💛`,
    ],
    ctas: [
      `Shop the ${product.name} → link in bio`,
      `Get yours — tap the link below 👇`,
      `Perfect gift for someone in a ${angle.name.toLowerCase()} season — link in bio`,
      `Free shipping + beautiful packaging → link in bio`,
      `Tap the link to shop — ships in 2–4 days 🙏`,
      `Give someone a promise they can ${wearVerb} — link below`,
      `Order today — meaningful gifts sell out fast`,
      `Shop now at Daily Devotion Co. → link in bio`,
      `This is the gift they didn't know they needed → link in bio`,
      `Get the ${product.name} before it sells out → link in bio`,
    ],
  }
}
