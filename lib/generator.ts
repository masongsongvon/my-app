import type { Product, Verse, CreativeAngle } from './types'

type GenerateInput = {
  product: Product
  verse: Verse
  angle: CreativeAngle
}

type GeneratedOutput = {
  primary_text: string
  headline: string
  ugc_script: string
  voiceover_script: string
  product_description: string
  hooks: string[]
  ctas: string[]
}

// Emotion mapping for each angle
const ANGLE_EMOTIONS: Record<string, { opening: string; bridge: string; resolution: string }> = {
  'Anxiety / Fear': {
    opening: 'When anxiety takes over and fear feels suffocating',
    bridge: 'there\'s a reminder that cuts through the noise',
    resolution: 'You are not alone. You never were.',
  },
  'Gift': {
    opening: 'The most meaningful gifts aren\'t the biggest ones',
    bridge: 'they\'re the ones that remind someone they are loved and held',
    resolution: 'Give them something they\'ll carry every day.',
  },
  'Faith Reminder': {
    opening: 'In the rush of everyday life, it\'s easy to forget',
    bridge: 'but some truths are worth wearing close to you',
    resolution: 'Let your faith travel with you.',
  },
  'Breakup / Healing': {
    opening: 'Healing isn\'t linear — some days it feels impossible',
    bridge: 'but you were made for more than this pain',
    resolution: 'God\'s love doesn\'t leave when people do.',
  },
  'Motivation': {
    opening: 'The moment before the breakthrough is the hardest one',
    bridge: 'but you were built to push through',
    resolution: 'Wear the reminder that nothing is impossible with Him.',
  },
  'Feeling Alone': {
    opening: 'When the room is full but you still feel invisible',
    bridge: 'God sees you — fully, completely, deeply',
    resolution: 'You are never truly alone.',
  },
  'Hard Season': {
    opening: 'Some seasons of life are just hard — no other word for it',
    bridge: 'but hard seasons don\'t have the final word',
    resolution: 'Wear the promise that carries you through.',
  },
  'Waiting Season': {
    opening: 'Waiting on God\'s timing is one of the hardest acts of faith',
    bridge: 'but His timing has never been wrong',
    resolution: 'Hold on. He hasn\'t forgotten you.',
  },
  'Encouragement for Loved One': {
    opening: 'Sometimes the people we love most are carrying the heaviest loads',
    bridge: 'and the smallest reminder can mean everything',
    resolution: 'Send them a piece of hope they can wear.',
  },
  'Daily Reminder of God\'s Promise': {
    opening: 'Every morning you wake up is a promise kept',
    bridge: 'wear a reminder of the One who keeps every promise',
    resolution: 'A promise you can wear — every single day.',
  },
}

function getEmotion(angleName: string) {
  return ANGLE_EMOTIONS[angleName] ?? {
    opening: 'In the moments that matter most',
    bridge: 'faith becomes your anchor',
    resolution: 'Wear the reminder that changes everything.',
  }
}

export function generateCreative(input: GenerateInput): GeneratedOutput {
  const { product, verse, angle } = input
  const emotion = getEmotion(angle.name)
  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const productArticle = isJar ? 'the' : 'a'
  const wearVerb = isJar ? 'open' : 'wear'
  const wearNoun = isJar ? 'jar' : isBracelet ? 'bracelet' : 'necklace'

  const primary_text = `${emotion.opening} — ${emotion.bridge}.

"${verse.text}" — ${verse.reference}

${emotion.resolution}

The Daily Devotion Co. ${product.name} is more than jewelry. It's ${productArticle} daily reminder of who God says you are.

${isJar
    ? `Every verse inside this jar was chosen to meet you exactly where you are.`
    : `Engraved with ${verse.reference}, this ${wearNoun} travels with you everywhere.`
  }

Tap the link to shop — because some truths are worth carrying.`

  const headline = `"${verse.text}" — ${verse.reference} | ${product.name}`

  const ugc_script = `[Hook — 0:00–0:03]
${emotion.opening.toUpperCase()}...

[Personal Story — 0:03–0:15]
I remember when I was going through a ${angle.name.toLowerCase()} moment. I didn't know what to hold onto. Then someone gave me this — the Daily Devotion Co. ${product.name}.

[Product Reveal — 0:15–0:25]
*holds up ${wearNoun}*
It says "${verse.text}" — ${verse.reference}. And honestly? I read it every single day. It's not just a ${wearNoun}. It's a promise.

[Emotional Payoff — 0:25–0:40]
${emotion.resolution} If you know someone going through a ${angle.name.toLowerCase()} season, get them this. They need to hear this verse.

[CTA — 0:40–0:45]
Link in bio. It ships fast and the packaging is honestly beautiful.`

  const voiceover_script = `[Soft, warm tone]

${emotion.opening}...

God's word says: "${verse.text}."

${verse.reference}.

${emotion.bridge} — and ${emotion.resolution.toLowerCase()}

The Daily Devotion Co. ${product.name}.

${isJar
    ? `Fifty-two verses. One for every week of the year.`
    : `Engraved in metal. Worn close to your heart.`
  }

A promise you can ${wearVerb}.

[Pause]

Shop at the link below.`

  const product_description = `${product.name} — Daily Devotion Co.

"${verse.text}" — ${verse.reference}

${emotion.opening}. ${emotion.bridge}. This ${wearNoun} was made for moments exactly like this.

${isJar
    ? `Each Daily Verse Jar holds 52 hand-selected Bible verses — one for every week of the year. Perfect for morning devotions, family prayer, or a meaningful gift for someone going through a hard season.`
    : `Engraved with ${verse.reference}, this ${product.name} is a wearable promise — a daily reminder that God is with you, strengthening you, and making all things possible.`
  }

• Premium quality, beautifully packaged
• Perfect for ${angle.name.toLowerCase()} moments
• Ships in 2–4 business days
• A meaningful, faith-filled gift

${emotion.resolution}

This is more than a ${wearNoun}. It's a promise you can ${wearVerb}.`

  const hooks = [
    `POV: You're going through a ${angle.name.toLowerCase()} season and someone gives you this 👇`,
    `"${verse.text}" — ${verse.reference} // This verse hits different when you need it most`,
    `The most meaningful ${wearNoun} I've ever owned and here's why...`,
    `If you know someone dealing with ${angle.name.toLowerCase()}, send them this 🙏`,
    `This isn't just a ${wearNoun}. It's a daily reminder from God.`,
    `${emotion.opening}... until I found this.`,
    `A ${wearNoun} that changed how I start every morning ✨`,
    `Why I never take my Daily Devotion ${wearNoun} off`,
    `"${verse.text}" — ${verse.reference} now lives on my wrist/neck every day`,
    `The gift that made someone cry — in the best way 💛`,
  ]

  const ctas = [
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
  ]

  return {
    primary_text,
    headline,
    ugc_script,
    voiceover_script,
    product_description,
    hooks,
    ctas,
  }
}
