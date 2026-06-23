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

// ─── Daily Devotion Copywriting Engine ────────────────────────────────────────
//
// Voice: Filipino Facebook advertiser. Modern Taglish. Emotionally honest.
// Framework: Hook → Relatable Moment → Emotional Tension → Product Intro →
//            Verse Connection → Soft CTA
//
// Principles:
//   • Write like a creator talking to a friend, not a brand talking to a customer
//   • Emotional first, product second — product enters naturally mid-copy
//   • The verse supports the emotion, never leads it
//   • Avoid: preachy, formal, corporate, generic AI sound
//   • Use Taglish naturally (mix Filipino + English as Filipinos actually speak)

const BRAND_SYSTEM_PROMPT = `Ikaw ay isang Filipino content creator at copywriter para sa Daily Devotion Co. — isang Christian jewelry brand na nag-se-sell ng Bible verse bracelets, necklaces, at verse jars sa mga Pilipino.

Ang brand voice ng Daily Devotion Co.:
- Parang kaibigan mo na nagsasalita sa'yo, hindi brand
- Modern Taglish — natural na mix ng Filipino at English, tulad ng talagang ginagawa ng mga Pilipino sa Facebook
- Emotional at relatable muna bago ang product
- Hindi preachy, hindi nagmo-moralize
- Hindi corporate, hindi stiff
- Hindi parang ChatGPT o AI

Copywriting framework (sundin ang sequence na ito):
HOOK — Grab attention agad. Relatable na sitwasyon o feeling.
RELATABLE MOMENT — Ilarawan ang feeling/sitwasyon ng reader para maramdaman nila "ito ako 'to"
EMOTIONAL TENSION — Itaas ang emotional stakes. Ano ang pinaka-mahirap dito?
PRODUCT INTRODUCTION — Ipakilala ang product nang natural, hindi forced. Parang natuklasan mo lang ito.
VERSE CONNECTION — Ikonekta ang Bible verse sa emotion, hindi sa product. Verse supports the feeling.
SOFT CTA — Hindi aggressive. Parang nagre-recommend ka sa kaibigan.

Iwasang gamitin:
- "Discover the power of..."
- "Are you struggling with..."
- "In these challenging times..."
- "This powerful piece of jewelry..."
- Anumang bagay na parang ad copy

Gamitin mo:
- "Yung feeling na..."
- "Sabi nga nila..."
- "Alam mo yung..."
- "Totoo bang..."
- Natural na interruptions at ellipsis (...)
- Lowercase para sa casual feel
- Mga emoji na ginagamit ng mga Pilipino (🙏 💛 😭 ✨ 👇)`

async function generateCreativeWithClaude(input: GenerateInput): Promise<GeneratedOutput> {
  const { product, verse, angle, notes } = input
  const client = new Anthropic()

  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'

  const userPrompt = `Generate a complete Daily Devotion Co. creative set for this combination:

PRODUCT: ${product.name}
${isJar
    ? 'Ito ay isang jar na may 52 Bible verses — isa para sa bawat linggo ng taon. Perfect para sa morning devotion o bilang regalo.'
    : `Ito ay isang ${wearNoun} na naka-engrave ng Bible verse — isang pisikal na paalala ng pangako ng Diyos na suot mo araw-araw.`
  }

BIBLE VERSE: "${verse.text}" — ${verse.reference}

CUSTOMER ANGLE: ${angle.name}
${angle.description ? `Context: ${angle.description}` : ''}
${notes ? `\nAdditional notes mula sa user: ${notes}` : ''}

Sundin ang Daily Devotion copywriting framework. Isulat lahat ng copy sa Modern Taglish — natural na parang tunay na Filipino creator, hindi parang translated na English copy.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "primary_text": "Full Meta/Facebook primary text. 4-6 short paragraphs. Framework: Hook → Relatable Moment → Emotional Tension → Product Intro → Verse Connection → Soft CTA. Taglish. Conversational. Max 300 words.",
  "headline": "Short punchy Taglish headline, max 6 words, emotionally specific to the angle",
  "ugc_script": "UGC creator script with [HOOK 0:00-0:03], [RELATABLE MOMENT 0:03-0:12], [EMOTIONAL TENSION 0:12-0:20], [PRODUCT REVEAL 0:20-0:30], [VERSE 0:30-0:38], [SOFT CTA 0:38-0:45] sections. Taglish. Sounds like a real creator, not an actor reading a script.",
  "voiceover_script": "Soft voiceover script. Short sentences. Dramatic pauses marked as [jeda]. Emotional pacing. Taglish. Ends with gentle CTA, not hard sell.",
  "product_description": "E-commerce product description. Start with the feeling/need, not the product. Then introduce the product. Then the verse. Then bullet features. Taglish mixed with English for features. Max 200 words.",
  "hooks": [
    "10 different scroll-stopping hooks for this specific angle + verse combination. Mix formats: questions, statements, POV, confessions, realizations. Taglish. Each hook is 1-2 lines max."
  ],
  "ctas": [
    "10 different CTAs. Soft, friendly, not pushy. Taglish mixed with English. Mix: link in bio style, gift framing, personal recommendation style."
  ]
}

The hooks array must have exactly 10 items. The ctas array must have exactly 10 items.`

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 6000,
    thinking: { type: 'adaptive' },
    system: BRAND_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
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

// ─── Fallback templates (Taglish, Daily Devotion voice) ───────────────────────
// Used when ANTHROPIC_API_KEY is not set. Mirrors the brand voice and framework.

type AngleTemplate = {
  hook: string
  relatable: string
  tension: string
  resolution: string
}

const ANGLE_TEMPLATES: Record<string, AngleTemplate> = {
  'Overthinking': {
    hook: 'Alam mo yung nasa kama ka na pero isip mo naka-on pa din?',
    relatable: 'Yung tipong pagod na pagod ka pero hindi ka makatulog kasi nag-iisip ka pa din ng lahat ng pwedeng mangyari...',
    tension: 'Minsan mas nakakapagod pa yung isip mo kaysa yung nangyayari talaga.',
    resolution: 'Kaya nandito tayo para ipaalala sa isa\'t isa — hindi ka kailangang hawakan lahat.',
  },
  'Silent Struggle': {
    hook: '"Okay lang ako." — pero totoo ba?',
    relatable: 'Yung tipong ngingiti ka sa harap ng lahat pero pag nag-iisa ka na, ibang usapan na...',
    tension: 'Mahirap mag-explain ng feeling na hindi mo pa naiintindihan sa sarili mo.',
    resolution: 'May nakakakita sa\'yo kahit nung hindi mo sinasabi.',
  },
  'Fear': {
    hook: 'Yung takot na hindi mo masabi sa kahit sino...',
    relatable: 'Alam mo yung feeling na gusto mong humakbang pero parang may nagpipigil sa\'yo? Yun.',
    tension: 'Ang pinaka-mahirap na takot ay yung hindi mo alam kung tama ka ba.',
    resolution: 'Sinabi Niya "Huwag kang matakot" — at hindi siya nagsabi nun nang walang dahilan.',
  },
  'Waiting Season': {
    hook: 'Gaano katagal ka na naghihintay?',
    relatable: 'Yung pakiramdam na nagpe-pray ka na nang nagpe-pray pero parang walang lumalabas...',
    tension: 'Minsan ang pinakamahirap na part ng pananampalataya ay yung tahimik na paghihintay.',
    resolution: 'Hindi siya nahuhuli. Hindi rin siya maaga. Perpekto ang timing Niya — palagi.',
  },
  'Nothing Is Impossible': {
    hook: 'Sabi nila imposible. Alam mo na ang sagot mo dun.',
    relatable: 'Yung may pangarap kang hindi pa rin kinikilala ng mga tao sa paligid mo...',
    tension: 'Minsan ang pinakamalaking kalaban mo ay yung sarili mong duda.',
    resolution: 'Sa Diyos, walang impossible. Literal na sinabi iyon.',
  },
  'Gift For Someone': {
    hook: 'Para sa taong hindi mo alam paano tulungan...',
    relatable: 'Yung may mahal kang tao na nagpapagal na at hindi mo alam ang tamang sasabihin...',
    tension: 'Minsan wala talaga tayong tamang salita. At okay lang yun.',
    resolution: 'Minsan ang pinaka-meaningful na regalo ay yung nagpaparamdam sa kanila na nakita sila.',
  },
  'Burnout': {
    hook: 'Kailan ka huling nagpahinga — tunay na nagpahinga?',
    relatable: 'Yung tipong kahit weekend, hindi ka maka-disconnect kasi ang daming dapat gawin...',
    tension: 'Kaya pala nagagalit tayo sa maliit na bagay. Wala na tayong natitira.',
    resolution: 'Hindi ka dinisenyo para maging walang tigil. Kailangan mo ring huminga.',
  },
  'Not Alone': {
    hook: 'Feeling mo ba parang kaya mo lang ito mag-isa?',
    relatable: 'Yung tipong buo pa rin ang grupo mo pero parang nag-iisa ka pa din...',
    tension: 'Ang loneliness ay hindi laging tungkol sa kung may kasama ka o wala.',
    resolution: 'May isang hindi umaalis. Hindi ka kailanman nag-iisa.',
  },
  'Let Go And Trust': {
    hook: 'Anong bagay pa yung hawak mo pero kailangan mo nang bitawan?',
    relatable: 'Yung alam mo na dapat mo nang pakawalan pero natatakot kang walang kukuha sa\'yo pagkatapos...',
    tension: 'Mahirap magtiwala dahil dati kang nasaktan nung nag-trust ka.',
    resolution: 'Pero sa Kanya, ang bitaw ay hindi pagkawala. Simula pa lang iyon.',
  },
  'Daily Reminder': {
    hook: 'Yung umagang feeling mo parang lahat ay laban sa\'yo...',
    relatable: 'Kahit munting bagay lang ang nagpagana sa\'yong gumising — pero nagising ka pa din.',
    tension: 'Minsan kailangan natin ng pisikal na paalala na hindi lang nasa utak natin.',
    resolution: 'Isang bagay na makikita mo araw-araw na magpapaalaala: hawak ka Niya.',
  },
  // Legacy angles — kept for backward compatibility
  'Anxiety / Fear': {
    hook: 'Yung takot na hindi mo rin maintindihan kung saan nanggagaling...',
    relatable: 'Lahat tayo may oras na nag-aalalang sobra. Yung tipong ang liit ng dahilan pero ang laki ng epekto.',
    tension: 'Ang pinaka-mahirap ay yung hindi mo alam kung kailan titigil.',
    resolution: 'Narinig mo ba yung "Huwag kang matakot"? Hindi iyon sinabi nang walang dahilan.',
  },
  'Gift': {
    hook: 'Para sa taong deserving ng something meaningful...',
    relatable: 'May tao sa buhay mo na lagi mong gusto tulungan pero hindi mo alam kung paano.',
    tension: 'Minsan wala talaga tayong tamang salita para sa taong nagmamahal tayo.',
    resolution: 'Ibibigay mo sila ng bagay na magpapaalaala sa kanila araw-araw.',
  },
  'Faith Reminder': {
    hook: 'Kailan ka huling naramdaman na hawak ka talaga ng Diyos?',
    relatable: 'Sa busy ng buhay, napapabayaan natin yung mga bagay na pinakamahalaga.',
    tension: 'Hindi dahil nawala ang pananampalataya mo — nakalimutan lang nating pakinggan.',
    resolution: 'Kailangan mo ng bagay na magpapaalaala sa\'yo kahit pa naka-rush ka.',
  },
  'Breakup / Healing': {
    hook: 'Sabi nila "okay ka na dapat ngayon" — pero totoo ba?',
    relatable: 'Walang set na timeline ang paggaling. Yung sinasabi nilang "move on" — hindi ganoon kadali.',
    tension: 'Minsan ang pinaka-mahirap ay yung umaga. Lalo na yung una.',
    resolution: 'Ang pagmamahal ng Diyos — hindi ito nagalis kasabay niya.',
  },
  'Motivation': {
    hook: 'Anong nangyayari sa\'yo nung parang imposible na lahat?',
    relatable: 'Yung pakiramdam na ginawa mo na lahat pero parang hindi pa rin sapat.',
    tension: 'Yung almost — yung halos na — iyon ang pinaka-mahirap na parte.',
    resolution: 'Sa Kanya, kaya mo. Hindi iyon salita lang — pangako iyon.',
  },
  'Encouragement for Loved One': {
    hook: 'Mahal mo siya pero hindi mo alam kung paano siya tulungan...',
    relatable: 'May taong espesyal sa buhay mo na nagpapagal na at feeling mo gusto mong kumalinga pero hindi mo alam paano.',
    tension: 'Minsan ang pinakamahal mo ay yung taong hindi mo maabot.',
    resolution: 'Ipadama mo sa kanya — hindi sa salita, sa bagay na dala niya araw-araw.',
  },
  "Daily Reminder of God's Promise": {
    hook: 'Kailangan mo ba ng paalala ngayon?',
    relatable: 'Kahit gaano kalakas ang pananampalataya mo, may araw talaga na kailangan mo ng tulong.',
    tension: 'Hindi iyon kahinaan. Iyon ay katotohanan.',
    resolution: 'Isang pangako na dala mo kahit saan ka pumunta.',
  },
}

function getAngleTemplate(angleName: string): AngleTemplate {
  return ANGLE_TEMPLATES[angleName] ?? {
    hook: 'May bagay ka bang dala ngayon na mas mabigat kaysa dapat?',
    relatable: 'Lahat tayo may sandali na pakiramdam natin ay hindi na kaya pa.',
    tension: 'At sa sandaling iyon — ano ang hawak mo?',
    resolution: 'May isang bagay na hindi nagbabago — kahit ang lahat ay nagbabago.',
  }
}

function generateCreativeFallback(input: GenerateInput): GeneratedOutput {
  const { product, verse, angle } = input
  const t = getAngleTemplate(angle.name)
  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearVerb = isJar ? 'buksan' : 'suotin'
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'
  const wearNounEn = isJar ? 'jar' : isBracelet ? 'bracelet' : 'necklace'
  const productShort = isJar ? 'Daily Verse Jar' : product.name

  const primary_text = `${t.hook}

${t.relatable}

${t.tension}

${isJar
    ? `Kaya ginawa ang Daily Devotion Co. ${productShort} — 52 Bible verses, isa para sa bawat linggo ng taon. Para sa mga araw na kailangan mo ng reminder na hindi ka mag-iisa.`
    : `Kaya may mga tao na nagsusuot ng Daily Devotion Co. ${productShort} — hindi para maging fancy, kundi para may dala silang pisikal na paalala araw-araw.`
  }

"${verse.text}" — ${verse.reference}

${t.resolution}

${isJar ? 'I-check ang link sa bio. 🙏' : 'Available sa link sa bio. 🙏'}`

  const headline = `${t.hook.split('—')[0].trim().substring(0, 50)}`

  const ugc_script = `[HOOK 0:00-0:03]
${t.hook}

[RELATABLE MOMENT 0:03-0:12]
${t.relatable}

[EMOTIONAL TENSION 0:12-0:20]
${t.tension}

[PRODUCT REVEAL 0:20-0:30]
*${isJar ? 'kinukuha ang jar' : `itinuturo ang ${wearNounEn}`}*
Ito yung daily devotion co. ${wearNoun}. ${isJar ? 'May 52 verses dito — isa para sa bawat linggo ng taon.' : `Naka-engrave dito: "${verse.text}" — ${verse.reference}.`}

[VERSE 0:30-0:38]
Sabi ng Biblia: "${verse.text}" — ${verse.reference}.
${t.resolution}

[SOFT CTA 0:38-0:45]
${isJar ? 'Patingin sa link sa bio kung gusto mo ito para sa sarili mo o bilang regalo. 🙏' : `Link sa bio. Ships nationwide. 🙏`}`

  const voiceover_script = `${t.hook}

[jeda]

${t.relatable}

[jeda]

${t.tension}

[jeda]

"${verse.text}."

${verse.reference}.

[jeda]

${t.resolution}

[jeda]

${isJar
    ? `Ang Daily Devotion Co. ${productShort} — 52 verses, isang taon, araw-araw na paalala.`
    : `Ang Daily Devotion Co. ${productShort} — isang pisikal na paalala na dala mo kahit saan.`
  }

[jeda]

Link sa bio. 🙏`

  const product_description = `${t.hook}

${t.relatable} ${t.tension}

${isJar
    ? `Ang Daily Devotion Co. Daily Verse Jar ay may 52 hand-picked Bible verses — isa para sa bawat linggo ng taon. Perfect para sa morning devotion, family prayer, o bilang regalo sa taong espesyal.`
    : `Ang Daily Devotion Co. ${product.name} ay isang ${wearNounEn} na naka-engrave ng "${verse.text}" (${verse.reference}) — isang pisikal na pangako na suot mo araw-araw.`
  }

"${verse.text}" — ${verse.reference}

${t.resolution}

• Premium quality, ganda ng packaging
• ${isJar ? '52 Bible verses included' : `Naka-engrave: ${verse.reference}`}
• Ships nationwide, 3-7 days
• Perfect bilang regalo o para sa sarili mo`

  const hooks = [
    t.hook,
    `"${verse.text}" — ${verse.reference} 🙏 Kailangan ko ito marinig ngayon.`,
    `Yung ${angle.name.toLowerCase()} feeling... kilala mo ba ito?`,
    `POV: May nagbigay sa\'yo ng ${wearNounEn} na may nakasulat na "${verse.text}"`,
    `Hindi ko akalain na isang ${wearNounEn} ang makakatulong sa akin...`,
    `Para sa lahat ng nagdadaan sa ${angle.name.toLowerCase()} — para sa\'yo ito 🙏`,
    `Yung feeling na kailangan mo ng reminder na hindi ka mag-iisa...`,
    `${isJar ? '52 verses. Isa para sa bawat linggo.' : `Naka-engrave: ${verse.reference}.`} Ganito nila ito ginagawa.`,
    `Sinabi ng Diyos: "${verse.text}" — ${verse.reference}. Ito ang kailangan ko ngayon.`,
    `Ang pinaka-meaningful na ${wearNounEn} na nakita ko — at ito ang reason.`,
  ]

  const ctas = [
    `Link sa bio kung gusto mo ito para sa sarili mo 🙏`,
    `Available na — i-check ang link sa bio 👇`,
    `${isJar ? 'Perfect regalo — link sa bio.' : `Perfect para sa ${angle.name.toLowerCase()} moments — link sa bio.`}`,
    `I-send sa taong kailangan ito ngayon. Link sa bio. 💛`,
    `Ships nationwide! I-check na ang link. ✨`,
    `Para sa sarili mo o bilang regalo — link sa bio 🙏`,
    `Available pa — link sa bio bago maubusan 👇`,
    `Shop na sa Daily Devotion Co. → link sa bio`,
    `Ang regalo na di malilimutan — link sa bio 💛`,
    `Kunin mo na bago mawala — link sa bio 👇`,
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
