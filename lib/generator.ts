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
  landing_page: string
  ecommerce_page: string
}

const isAnthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY)

export async function generateCreative(input: GenerateInput): Promise<GeneratedOutput> {
  if (!isAnthropicConfigured) {
    return generateCreativeFallback(input)
  }
  return generateCreativeWithClaude(input)
}

// ─── Brand Identity ────────────────────────────────────────────────────────────
//
// Daily Devotion Co. — Filipino Christian jewelry brand
// Products: Bible verse bracelets, necklaces, Daily Verse Jar
// Audience: Filipino women 20–45, faith-first, social media native
// Voice: Modern Taglish, friend-to-friend, emotionally honest
//
// Copywriting framework (all formats):
//   Hook → Relatable Moment → Emotional Tension → Product Intro → Verse → CTA
//
// Skills applied:
//   Ogilvy: specific facts, brand + promise in headline, benefit over feature
//   Meta Ads: hook in first 125 chars, format diversity, creative-as-targeting
//   Marketing Psychology: identity-based ("wear your faith"), loss aversion,
//                         implied social proof, Jobs to be Done
//   CRO: single clear CTA, PAS for landing pages, objection handling
//   Direct Response: long copy for warm audiences, specificity = credibility

const BRAND_SYSTEM_PROMPT = `Ikaw ay isang world-class Filipino direct response copywriter at content creator para sa Daily Devotion Co. — isang Christian jewelry brand na nag-se-sell ng Bible verse bracelets, necklaces, at verse jars sa mga Pilipinong may pananampalataya.

BRAND VOICE:
- Parang pinakamatalik mong kaibigan ang nagsasalita sa iyo — hindi brand, hindi company
- Modern Taglish: natural na mix ng Filipino at English, exactly tulad ng ginagawa ng mga Pilipino sa Facebook at TikTok
- Emotional at relatable MUNA bago ang product — product enters naturally, hindi forced
- Hindi preachy, hindi nagmo-moralize, hindi nagso-sermon
- Hindi corporate, hindi stiff, hindi parang translated na English copy
- Hindi parang ChatGPT o AI — dapat natural na tao ang dating

COPYWRITING FRAMEWORK (sundin ang sequence):
1. HOOK — Grab attention agad. Una mong linya = magiging buhay o patay ang post.
2. RELATABLE MOMENT — "Ito ako 'to" na feeling. Specific, hindi generic.
3. EMOTIONAL TENSION — Itaas ang stakes. Ano ang pinaka-painful dito?
4. PRODUCT INTRO — Natural, organic introduction. Hindi "Buy now!" — parang natuklasan mo lang.
5. VERSE CONNECTION — Verse supports the emotion, hindi ang product. Verse = ang pangako.
6. SOCIAL PROOF — Implied ("hindi ikaw lang") o direct ("libo-libo nang nagsusuot nito")
7. SOFT CTA — Friend recommendation, hindi sales pitch.

OGILVY PRINCIPLES (isama sa lahat ng copy):
- Headline = brand name + specific promise. "Daily Devotion Co. — ang bracelet para sa mga hindi na kaya"
- Specific facts > vague claims: "laser-engraved stainless steel" hindi "beautiful jewelry"
- The more you tell, the more you sell — para sa warm audience, mas detalyado = mas nagtitiwala
- Promise a benefit, not a feature. "Paalala na hindi ka nag-iisa" hindi "may Bible verse"

META ADS RULES:
- Primary text: hook MUST be sa unang 125 characters bago ang "see more"
- Headline: max 40 characters, must contain emotional hook or brand + promise
- Creative = targeting: ang copy mismo ang nag-se-self-select ng audience

PSYCHOLOGY TRIGGERS (gamitin nang natural):
- Identity: "Para sa mga Pilipinong may pananampalataya" — buying = becoming
- Loss aversion: "Huwag hayaan na lumipas ang araw nang walang paalala"
- Social proof: "Libo-libo nang Pilipino ang nagsusuot nito araw-araw"
- Specificity = credibility: exact verse reference, exact product details

IWASAN:
- "Discover the power of..."
- "Are you struggling with..."
- "This powerful piece of jewelry..."
- "In these challenging times..."
- Anumang bagay na parang generic AI ad copy
- Exclamation points sa lahat ng pangungusap
- Formal Filipino (po/opo) sa primary copy — casual lang`

async function generateCreativeWithClaude(input: GenerateInput): Promise<GeneratedOutput> {
  const { product, verse, angle, notes } = input
  const client = new Anthropic()

  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'

  const userPrompt = `Generate a COMPLETE Daily Devotion Co. creative set for this combination:

PRODUCT: ${product.name}
${isJar
    ? 'A jar containing 52 handpicked Bible verses — one for every week of the year. For morning devotion, family prayer time, or as a meaningful gift.'
    : `A ${wearNoun} laser-engraved with a Bible verse — a physical, wearable reminder of God's promise that travels with you every day.`
  }

BIBLE VERSE: "${verse.text}" — ${verse.reference}

CUSTOMER ANGLE: ${angle.name}
${angle.description ? `Sitwasyon ng customer: ${angle.description}` : ''}
${notes ? `\nAdditional context: ${notes}` : ''}

IMPORTANT: Sundin ang brand voice, Ogilvy principles, at Meta Ads rules sa system prompt.

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "primary_text": "Full Meta/Facebook primary text. Hook sa UNANG 125 chars para sa 'see more'. 4-6 short paragraphs. Use the Hook→Relatable→Tension→Product→Verse→CTA framework. Modern Taglish. Max 280 words. End with a soft, friend-style CTA.",

  "headline": "40 chars MAX. Taglish. Emotionally specific to the angle. Include brand promise OR emotional hook. No generic lines.",

  "ugc_script": "Creator-style UGC script with these labeled sections:\\n[HOOK 0:00-0:03] - 1-2 punchy lines, scroll-stopping\\n[RELATABLE MOMENT 0:03-0:12] - creator gets vulnerable, specific situation\\n[EMOTIONAL BEAT 0:12-0:20] - tension builds\\n[PRODUCT REVEAL 0:20-0:30] - natural reveal with physical action note in *asterisks*\\n[VERSE DROP 0:30-0:38] - verse said slowly, meaningfully\\n[SOFT CTA 0:38-0:45] - friend recommendation, not sales\\nTaglish throughout. Should sound like a real Filipino creator, not an actor.",

  "voiceover_script": "Cinematic voiceover for video. Short sentences. Dramatic pauses marked as [jeda]. Emotional pacing — slow, deliberate. Taglish. Ends with gentle, non-pushy CTA. 8-12 sentences max.",

  "product_description": "E-commerce product description. Structure: emotional opening (angle) → product introduction (specific facts) → verse → bullet features → gift suitability → shipping. Taglish mixed with English for specs. Max 200 words.",

  "hooks": [
    "Hook 1: Direct question about the angle (Taglish)",
    "Hook 2: POV statement — starts with 'POV:' (Taglish)",
    "Hook 3: Confession — starts with 'Aminin ko' or 'Totoo?' (Taglish)",
    "Hook 4: Pattern interrupt — short, unexpected opener (Taglish)",
    "Hook 5: Scenario — 'Yung tipong...' (Taglish)",
    "Hook 6: Verse-first — quote then question (Taglish)",
    "Hook 7: Before/after implication (Taglish)",
    "Hook 8: 'This is for you if...' framing (Taglish)",
    "Hook 9: Realization — 'Kaninang umaga ko lang narealize...' (Taglish)",
    "Hook 10: Social proof hook — 'Ang mga nagsusuot nito...' (Taglish)"
  ],

  "ctas": [
    "CTA 1: Friend recommendation style",
    "CTA 2: Gift framing",
    "CTA 3: Value-specific (mention free gift wrap or shipping)",
    "CTA 4: Soft scarcity (not aggressive)",
    "CTA 5: Personal, identity-based CTA",
    "CTA 6: DM-first CTA",
    "CTA 7: Story/link specific",
    "CTA 8: Comment/tag CTA for engagement",
    "CTA 9: Urgency without pressure",
    "CTA 10: Community/shared faith CTA"
  ],

  "landing_page": "Full landing page copy using PAS framework in Taglish. Use ## for section headers.\\n## HERO\\nHeadline: [brand + specific promise, Ogilvy style]\\nSubheadline: [2 sentences expanding the promise]\\nCTA Button: [specific action text]\\n\\n## PAIN\\n[3 relatable pain points for this angle, each 1-2 sentences]\\n\\n## AGITATION\\n[Emotional amplification — what's at stake if nothing changes, 2-3 sentences]\\n\\n## SOLUTION\\n[Natural product introduction — benefit first, product second, 3-4 sentences]\\n\\n## THE VERSE\\n\\"${verse.text}\\" — ${verse.reference}\\n[2 sentences connecting the verse to the pain/emotion]\\n\\n## SOCIAL PROOF\\n[Implied social proof line + 2 short UGC-style testimonial quotes in Filipino]\\n\\n## FEATURES\\n[4-5 bullet points — specific facts, benefit framing, Taglish + English for specs]\\n\\n## OBJECTION HANDLING\\n\\"Mahal ba ito?\\" — [price framing answer, 1-2 sentences]\\n\\"Legit ba ito?\\" — [trust/quality answer, 1-2 sentences]\\n\\"Kailan darating?\\" — [specific shipping info]\\n\\n## FINAL CTA\\n[Strong closing paragraph + specific CTA button text]",

  "ecommerce_page": "Full e-commerce product page copy in Taglish. Use ## for section headers.\\n## PRODUCT TITLE\\n[SEO-friendly + emotionally resonant product name]\\n\\n## TAGLINE\\n[One punchy emotional line — the brand promise for this product]\\n\\n## DESCRIPTION\\n[Paragraph 1: emotional setup using the angle]\\n[Paragraph 2: product introduction with specific facts]\\n[Paragraph 3: verse connection + what it means to wear/use it daily]\\n\\n## WHAT'S INCLUDED\\n[What comes in the package, specific]\\n\\n## PRODUCT FEATURES\\n[5-6 bullet points: specific facts as benefits. Include material, engraving method, size/dimensions if relevant, water resistance, packaging]\\n\\n## PERFECT AS A GIFT\\n[2-3 sentences for gift buyers — who to give it to, how it will make them feel]\\n\\n## SHIPPING & GUARANTEE\\n[Specific shipping timeline, return policy, quality guarantee — in friendly Taglish]"
}

REQUIREMENTS:
- hooks array: exactly 10 items, each a different FORMAT (question, POV, confession, pattern interrupt, scenario, verse-first, before/after, this-is-for-you, realization, social proof)
- ctas array: exactly 10 items, each a different style
- All copy in Modern Taglish — natural as real Filipino Facebook posts, not translated English
- landing_page and ecommerce_page: complete, ready-to-publish copy with all sections filled in`

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
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

  return JSON.parse(jsonMatch[0]) as GeneratedOutput
}

// ─── Fallback Templates (Taglish, Daily Devotion voice) ───────────────────────
// Skills applied: Ogilvy principles, Meta hook-first, psychology triggers,
// CRO/landing page PAS framework, direct response copy formulas

type AngleTemplate = {
  hook: string
  relatable: string
  tension: string
  resolution: string
  hero_headline: string
  pain_points: [string, string, string]
  social_proof: string
  hooks: string[]
  ctas: string[]
}

const ANGLE_TEMPLATES: Record<string, AngleTemplate> = {
  'Overthinking': {
    hook: 'Alam mo yung nasa kama ka na pero isip mo naka-on pa din?',
    relatable: 'Yung tipong pagod na pagod ka pero hindi ka makatulog kasi nag-iisip ka ng lahat ng pwedeng mangyari. Yung conversations na paulit-ulit sa utak mo. Yung "paano kung..." na walang katapusan.',
    tension: 'Minsan mas nakakapagod pa yung isip mo kaysa yung nangyayari talaga. At ang pinaka-mahirap? Kahit gusto mo itaas ang kamay at sabihing "tama na" — hindi mo alam paano.',
    resolution: 'Hindi ka kailangang hawakan lahat. May nagmamahal sa iyo na mas malakas kaysa sa lahat ng iyong iniisip — at nandoon siya kahit tahimik ang gabi.',
    hero_headline: 'Daily Devotion Co. — Para sa mga utak na hindi matahimik',
    pain_points: [
      'Paulit-ulit kang nag-iisip ng mga bagay na wala ka namang control — at alam mo ito, pero hindi ka pa rin makatigil.',
      'Mapagod ka sa sarili mo. Yung gusto mong mag-relax pero hindi mo mapigilan ang isip mong tumakbo.',
      'Kahit nandun ang mga tao sa paligid mo, feeling mo nag-iisa kang nagtatanggal ng load na hindi mo naman kailangang dalhin mag-isa.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsusuot nito bilang pisikal na paalala na pwede silang huminga.',
    hooks: [
      'Gaano katagal ka nang nagpapagod sa sarili mong isip?',
      'POV: 3am ka na pero kasama mo pa rin ang lahat ng iniisip mo ngayong araw.',
      'Aminin ko — ilang beses na akong nanggising sa gabi na puno ng kaba para sa mga bagay na hindi ko pa nangyayari.',
      'Hindi ito para sa lahat. Para lang ito sa mga alam kung ano ang ibig sabihin ng mapagod sa sariling pag-iisip.',
      'Yung tipong sasabihin mo "okay na ako" pero sa utak mo? Iba ang usapan.',
      '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — para sa mga gabi na hindi mo ito maramdaman.',
      'Noon: gabi-gabi akong nag-aalalang sobra. Ngayon: may hawak na akong paalala.',
      'Para sa\'yo ito kung alam mo kung ano ang ibig sabihin ng pagod — hindi sa katawan kundi sa isip.',
      'Kaninang umaga ko lang narealize na wala nang kapaguran na mas grabe kaysa sa pagod sa sariling pag-iisip.',
      'Ang mga nagsusuot nito ay nagsasabi ng iisang bagay: "kailangan ko lang ng paalala na hindi ako mag-iisa sa lahat ng ito."',
    ],
    ctas: [
      'Link sa bio kung kailangan mo ito ngayon 🙏',
      'I-regalo sa taong lagi kang naiisip na nagpapagal nang tahimik. Link sa bio 💛',
      'Libre ang gift wrapping — perfect regalo. Link sa bio 👇',
      'Available pa — kunin mo bago maubos. Link sa bio.',
      'Para sa mga Pilipinong may pananampalataya na kailangan ng pisikal na paalala — link sa bio.',
      'DM mo kami kung gusto mong malaman kung para sa iyo ito. 💬',
      'I-tap ang link sa bio. 3-5 days delivery nationwide.',
      'I-tag ang kaibigan mong kailangan ito ngayon. 🙏',
      'Ships this week pa. Link sa bio bago maubusan. 👇',
      'Para sa komunidad ng mga Pilipinong nagdadala ng pananampalataya kahit sa pinaka-mahirap na gabi — link sa bio.',
    ],
  },

  'Silent Struggle': {
    hook: '"Okay lang ako." — pero totoo ba?',
    relatable: 'Yung tipong ngingiti ka sa harap ng lahat pero pag nag-iisa ka na, ibang usapan na. Hindi ka naman nagsinungaling — gusto mo lang hindi maging burden. Gusto mong hawakan mo ito mag-isa.',
    tension: 'Mahirap mag-explain ng feeling na hindi mo pa naiintindihan sa sarili mo. At mas mahirap pa pag pakiramdam mo na dapat mo nang malampasan ito — pero hindi pa.',
    resolution: 'May nakakakita sa iyo kahit nung hindi mo sinasabi. Kahit tahimik ang iyong laban — hindi ito nakalagpas sa Kanya.',
    hero_headline: 'Daily Devotion Co. — Para sa mga ngingiti kahit pahirap',
    pain_points: [
      '"Okay lang ako" — pero ikaw na ang nakakaalam na hindi ganoon kadali ang totoo.',
      'Gusto mong hindi maging problema sa iba, kaya tinatago mo. Pero ang pagtatago rin ay nakakapagod.',
      'Minsan ang pinaka-malungkot na tao sa kwarto ay yung pinaka-masaya ang ngiti.',
    ],
    social_proof: 'Maraming Pilipino ang nagsusuot nito bilang silent reminder na may nakakakita sa kanila — kahit tahimik ang kanilang laban.',
    hooks: [
      '"Okay lang ako." — Pero alam mo ba kung kailan ka huling tunay na okay?',
      'POV: Smile ka sa lahat but pag alone ka na sa kwarto — iba na ang usapan.',
      'Totoo? Minsan mas madali pang sabihing "okay" kaysa i-explain kung bakit hindi.',
      'Hindi lahat ng laban ay makikita. Yung mga tinatago mo — nakikita rin iyon.',
      'Yung tipong ikaw ang pinaka-masaya sa grupo pero sa loob, iba ang nangyayari.',
      '"Hindi kayo pababayaan ni iniwan." — para sa mga natatago ang laban.',
      'Noon: tinatago ko lahat. Ngayon: may dala akong paalala na may nakakakita sa akin.',
      'Para sa iyo ito kung lagi kang ang strongest sa grupo pero minsan kailangan mo rin ng strength.',
      'Narealize ko lang — ang mga pinakamatapang na tao ay yung nagtatago ng pinaka-mabigat.',
      'Ang mga nagsusuot nito ay may iisang secret: hindi sila nag-iisa kahit pakiramdam nila ganoon.',
    ],
    ctas: [
      'Link sa bio para sa iyo o sa taong alam mong nagtatago ng laban 🙏',
      'Para sa kaibigan mong laging malakas para sa iba — i-regalo mo na. Link sa bio 💛',
      'Kasama ang libreng gift message card. Link sa bio 👇',
      'Available nationwide. Ships 3-5 days. Link sa bio.',
      'Para sa mga Pilipinong silent pero malakas — link sa bio.',
      'DM mo kami at matutulungan ka naming pumili ng tamang regalo. 💬',
      'Tap the link sa bio. Free shipping sa orders above ₱800.',
      'I-tag ang taong kailangan itong marinig ngayon. 💛',
      'Kunin mo na bago maubos ang stocks. Link sa bio 👇',
      'Ikaw at ang iyong pananampalataya — hindi kayo nag-iisa. Link sa bio 🙏',
    ],
  },

  'Fear': {
    hook: 'Yung takot na hindi mo masabi sa kahit sino...',
    relatable: 'Alam mo yung feeling na gusto mong humakbang pero parang may nagpipigil sa iyo? Yung takot na hindi mo pa masabi kahit sa mga pinaka-malapit sa iyo — dahil ayaw mong magmukhang mahina.',
    tension: 'Ang pinaka-mahirap na takot ay yung hindi mo alam kung tama ka ba. Takot na tama pa rin ang pinaka-nakakahadlang sa iyo.',
    resolution: 'Sinabi Niya "Huwag kang matakot" — at hindi iyon sinabi nang basta-basta. Nandoon Siya sa bawat hakbang na kinatakutan mo.',
    hero_headline: 'Daily Devotion Co. — Para sa bawat hakbang na kinatakutan mo',
    pain_points: [
      'May gusto kang gawin — pero nandoon ang takot. Hindi takot ng duwarde — takot ng taong mahal ang mahal niya at ayaw na masaktan ulit.',
      'Minsan ang takot ay hindi pakiramdam — ito ay patuloy na tinig sa utak mo na nagsasabing "paano kung hindi ka sapat?"',
      'Ilang beses ka na nag-hold back dahil sa takot? Ilang bagay na ang hindi mo sinubukan?',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagdadala ng pisikal na paalala na ang takot ay hindi mas malaki kaysa sa Kanya.',
    hooks: [
      'Yung takot na nakakahadlang sa iyo — kakilala mo ba ito?',
      'POV: Gusto mong humakbang pero may boses sa utak mo na nagsasabing "paano kung mabigo ka?"',
      'Aminin ko — ilang pagkakataon na ang napalagi ko dahil sa takot na hindi ko pa sinasabi sa kahit sino.',
      'Hindi ito para sa lahat. Para lang ito sa mga nagsasabi ng "I\'m fine" habang takot na takot sa loob.',
      'Yung tipong alam mong dapat ka nang kumilos pero nandoon pa rin ang takot.',
      '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — Isaiah 41:10. Kailangan mo ba ito ngayon?',
      'Noon: takot ako humakbang. Ngayon: may dala akong paalala na hindi ako humahakbang nang mag-isa.',
      'Para sa iyo ito kung may gusto kang gawin na matagal mo nang tinatago dahil sa takot.',
      'Narealize ko lang — ang pinaka-matapang na mga tao ay yung humakbang kahit takot pa rin sila.',
      'Ang mga nagsusuot nito ay nagsasabi: "gusto ko ng patuloy na paalala na hindi ako kailangang maging matapang para sa sarili ko."',
    ],
    ctas: [
      'Link sa bio — para sa bawat hakbang na kinatatakutan mo 🙏',
      'Para sa kaibigan mong kailangan ng tapang — perfect regalo. Link sa bio 💛',
      'Libre ang gift wrapping at message card. Link sa bio 👇',
      'Ships nationwide, 3-5 days. Link sa bio.',
      'Para sa mga Pilipinong may pananampalataya at may takot — link sa bio.',
      'DM mo kami at i-share mo ang story mo. 💬',
      'Tap link sa bio. Available pa ngayon.',
      'I-tag ang taong kailangan ng tapang ngayon. 🙏',
      'Kunin mo bago maubos. Link sa bio 👇',
      'Sama-sama nating harapin ang takot — sa Kanya. Link sa bio 💛',
    ],
  },

  'Waiting Season': {
    hook: 'Gaano katagal ka nang naghihintay?',
    relatable: 'Yung pakiramdam na nagpe-pray ka na nang nagpe-pray pero parang walang lumalabas. Nagtataka ka kung narinig ka ba talaga. Nagtataka ka kung tama pa ba ang tinatahak mo.',
    tension: 'Minsan ang pinakamahirap na parte ng pananampalataya ay yung tahimik na paghihintay. Hindi ang problema — kundi yung paghihintay ng sagot sa problema.',
    resolution: 'Hindi Siya nahuhuli. Hindi rin Siya maaga. Ang timing Niya ay palaging perpekto — kahit hindi ganoon ang pakiramdam ngayon.',
    hero_headline: 'Daily Devotion Co. — Para sa mga naghihintay sa timing ng Diyos',
    pain_points: [
      'Nagpe-pray ka na nang nagpe-pray pero ang sagot ay parang hindi pa dumarating. Naiisip mo na kung narinig ka ba talaga.',
      'Lahat ng tao sa paligid mo ay parang natanggap na ang kanilang blessings. Ikaw? Naghihintay ka pa rin.',
      'Minsan ang pinaka-nakakapaltos ay yung hindi ka desperate — magtitiwala ka naman. Basta gusto mo na lang mangyari na ito.',
    ],
    social_proof: 'Maraming Pilipino ang nagdadala nito bilang paalala na ang paghihintay ay bahagi ng proseso — hindi katibayan na nakalimutan ka.',
    hooks: [
      'Gaano katagal ka na ring naghihintay sa sagot ng Diyos?',
      'POV: Lahat ng tao sa paligid mo ay parang natanggap na ang prayers nila. Ikaw, naghihintay ka pa.',
      'Totoo? Minsan mas madali pang manalig kaysa maghintay nang may tiwala.',
      'Yung paghihintay — hindi katamaran iyon. Iyon ay pananampalataya sa pinaka-mahirap na anyo.',
      'Yung tipong nagpe-pray ka at naghihintay pero parang wala pa ring lumilipat.',
      '"Kapag ang takdang panahon ay dumating na, Ako, ang Panginoon, ay magbibigay-buhay nito nang mabilis." — Isaiah 60:22. Para sa mga naghihintay.',
      'Noon: nagagalit ako sa paghihintay. Ngayon: may dala akong paalala ng Kanyang timing.',
      'Para sa iyo ito kung matagal ka na ring naghihintay at gusto mo nang sumuko pero hindi mo magawa.',
      'Narealize ko lang — ang mga pinaka-malalim na blessing ay yung pinakamatagal na hinintay.',
      'Ang mga nagsusuot nito ay nagsasabi: "kailangan ko ng daily reminder na ang Kanyang timing ay palaging tama."',
    ],
    ctas: [
      'Para sa mga naghihintay — link sa bio 🙏',
      'I-regalo sa kaibigan mong matagal nang naghihintay at nangangailangan ng paalala. Link sa bio 💛',
      'Kasama ang gift message card — libre. Link sa bio 👇',
      'Available nationwide. Ships 3-5 days. Link sa bio.',
      'Para sa mga Pilipinong nagtitiwala kahit mahirap — link sa bio.',
      'DM mo kami — gusto naming marinig ang iyong story. 💬',
      'Tap link sa bio. Still available.',
      'I-tag ang kaibigan mong naghihintay rin. 🙏',
      'Kunin mo na para sa kanya. Link sa bio 👇',
      'Sa ating paghihintay — hindi tayo nag-iisa. Link sa bio 💛',
    ],
  },

  'Nothing Is Impossible': {
    hook: 'Sabi nila imposible. Alam mo na ang sagot mo dun.',
    relatable: 'Yung may pangarap kang hindi pa rin kinikilala ng mga tao sa paligid mo. Yung narinig mo na ang "realistic ka" at "hindi ganoon kadali ang buhay" pero sa puso mo, may nagsasabing maaari pa rin.',
    tension: 'Minsan ang pinakamalaking kalaban mo ay yung sarili mong duda. Lalo na yung mga araw na halos sumuko ka na pero hindi mo magawa.',
    resolution: 'Sa Diyos, walang imposible. Hindi iyon salita lang — pangako iyon. At ang pangako na iyan ay para sa iyo rin.',
    hero_headline: 'Daily Devotion Co. — Wear the promise. Nothing is impossible.',
    pain_points: [
      'May pangarap kang tinatago na dahil paulit-ulit mong naririnig na "imposible" — at minsan naniniwala ka na rin.',
      'Yung mga araw na halos sumuko ka na at tanging ang maliit na tinig sa loob mo ang nagsasabing "subukan pa."',
      'Minsan mas mahirap harapin ang sariling duda kaysa ang mga tao na nagsasabing hindi mo magagawa.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsusuot nito bilang pisikal na paalala na ang "imposible" ay hindi final na sagot.',
    hooks: [
      'Gaano karaming beses ka nang sinabihang "imposible" ang iyong pangarap?',
      'POV: May nagsasabing hindi mo kaya. May nagsasabi ring makakaya mo — sino ang pakikinggan mo?',
      'Aminin ko — ilang beses na akong naniniwala sa mga nagsasabing "imposible" kaysa sa aking sariling pananampalataya.',
      'Imposible — yan ang sinabi rin nila bago mangyari ang pinakamagandang bagay sa buhay ng mga nagtiwala.',
      'Yung tipong may pangarap ka pero ang sarili mong isip ang pinakamalaking hadlang.',
      '"Sa Diyos, walang imposible." — Lucas 1:37. Ito ang katotohanan kahit hindi ganoon ang pakiramdam ngayon.',
      'Noon: naniniwala ako sa "imposible." Ngayon: may dala akong paalala ng possible.',
      'Para sa iyo ito kung may pangarap kang tinatago na dahil takot kang i-verbalize.',
      'Narealize ko lang — ang mga "imposible" ay nagiging posible sa mga nagtitiwala kahit kailan.',
      'Ang mga nagsusuot nito ay nagsasabi: "kailangan ko ng paalala na ang Diyos ko ay mas malaki kaysa sa lahat ng sinasabing imposible."',
    ],
    ctas: [
      'Para sa mga naniniwala sa imposible — link sa bio 🙏',
      'I-regalo sa taong kailangan ng paalala ng possible. Link sa bio 💛',
      'Libre ang gift wrapping. Link sa bio 👇',
      'Ships nationwide. Link sa bio.',
      'Para sa mga Pilipinong may pangarap at pananampalataya — link sa bio.',
      'DM mo kami ng iyong "imposible" — gusto naming marinig. 💬',
      'Tap link sa bio. Available pa.',
      'I-tag ang taong kailangan ng paalala ngayon. 🙏',
      'Kunin mo na bago maubos. Link sa bio 👇',
      'Walang imposible sa Diyos — at hindi ka nag-iisa. Link sa bio 💛',
    ],
  },

  'Gift For Someone': {
    hook: 'Para sa taong hindi mo alam paano tulungan...',
    relatable: 'Yung may mahal kang tao na nagpapagal na at wala kang mahanap na tamang salita. Gusto mong maging nandoon para sa kanya pero minsan ang presensya mo lang ay hindi sapat — gusto mo siyang may hawak na paalala kahit wala ka.',
    tension: 'Minsan wala talaga tayong tamang salita. At okay lang iyon — hindi lahat ng pagmamahal ay naipapahayag sa salita.',
    resolution: 'Minsan ang pinaka-meaningful na regalo ay yung nagpaparamdam sa kanila na nakita sila. Na iniisip sila. Na hindi sila nag-iisa.',
    hero_headline: 'Daily Devotion Co. — Ang regalo na nagpapaalaala: nakikita ka.',
    pain_points: [
      'May taong espesyal ka sa buhay na nagpapagal na at gusto mong maging nandoon — pero hindi ka alam ng tamang paraan.',
      'Minsan ang "okay ka lang?" ay hindi na sapat. Gusto mong ibigay sa kanya ng isang bagay na nagpapaalaala sa kanya kahit wala ka.',
      'Ang pinakamahal mong regalo ay hindi palaging ang pinakamahal sa pera — kundi yung nagpaparamdam ng pagmamahal nang paulit-ulit.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagbigay nito bilang regalo — at sabi ng mga tumanggap: "ito ang pinaka-meaningful na regalo na natanggap ko."',
    hooks: [
      'May taong gusto mong bigyan ng isang bagay na maaalala nila magpakailanman?',
      'POV: Hindi mo alam ang tamang salita para sa taong nagpapagal — kaya ibinibigay mo sila ng isang bagay na magsasalita para sa iyo.',
      'Aminin ko — may oras na wala na talaga akong masabi sa taong mahal ko. Kaya nag-regalo na lang ako ng isang bagay na nagsasalita para sa kin.',
      'Hindi lahat ng pagmamahal ay naipapahayag sa salita. Minsan kailangan ng bagay na dala nila araw-araw.',
      'Yung tipong gusto mong tulungan ang mahal mo pero wala kang masabi na sapat.',
      '"Huwag kayong mangamba sa anumang bagay." — para sa taong kailangan mong ito marinig.',
      'Noon: regalo ako ng kung anu-ano na hindi sila nag-use. Ngayon: nagbibigay na ako ng bagay na dala nila araw-araw.',
      'Para sa iyo ito kung may taong espesyal ka na nangangailangan ng paalala ngayon.',
      'Narealize ko lang — ang pinakamagandang regalo ay hindi yung pinakamahal kundi yung pinakamahalaga.',
      'Ang mga nagbigay nito ay nagsasabi: "gusto ko siyang may hawak na paalala kahit wala ako."',
    ],
    ctas: [
      'Para sa taong espesyal sa buhay mo — link sa bio 🙏',
      'Perfect regalo na may libreng gift wrapping at personalized message card. Link sa bio 💛',
      'Libre ang gift message at wrapping. Link sa bio 👇',
      'Ships 3-5 days. Order na para makarating pa bago [occasion]. Link sa bio.',
      'Para sa mga naghahanap ng regalo na may meaning — link sa bio.',
      'DM mo kami at tulungan ka naming i-personalize ang regalo. 💬',
      'Tap link sa bio. Gift-ready na.',
      'I-tag ang taong gusto mong bigyan ng meaningful na regalo. 💛',
      'Order na bago maubos ang stocks. Link sa bio 👇',
      'Paunahan na ang meaningful na regalo — link sa bio 💛',
    ],
  },

  'Burnout': {
    hook: 'Kailan ka huling nagpahinga — tunay na nagpahinga?',
    relatable: 'Yung tipong kahit weekend, hindi ka maka-disconnect. Kahit naka-upo ka, nag-iisip ka pa rin. Lahat ng tao sa paligid mo ay parang kaya pa nila — tapos ikaw? Feeling mo pag tumigil ka, mahahuli ka.',
    tension: 'Kaya pala nagagalit ka sa maliit na bagay. Kaya pala walang masaya. Kaya pala kahit tulog ka, pagising mo ay pagod ka pa rin. Wala ka nang natitira para ibigay — kahit sa sarili mo.',
    resolution: 'Hindi ka dinisenyo para maging walang tigil. Kailangan mo ring huminga. At sa paghinga — nandoon Siya.',
    hero_headline: 'Daily Devotion Co. — Para sa mga pagod na pagod sa lahat',
    pain_points: [
      'Kahit nasa pahinga ka, hindi ka talagang nagpapahinga — isip mo ay nasa trabaho pa rin, sa responsibilidad, sa lahat ng dapat gawin.',
      'Yung tipong kahit nag-accomplish ka ng maraming bagay, hindi mo maramdaman ang kasiyahan — kasi wala ka nang natitira para sa sarili mo.',
      'Naiinis ka sa maliit na bagay. Hindi mo ito gusto — pero kapag wala ka nang natitira, ganoon na ang nangyayari.',
    ],
    social_proof: 'Maraming Pilipino ang nagsusuot nito bilang paalala na ang pahinga ay hindi kahinaan — ito ay bahagi ng pananampalataya.',
    hooks: [
      'Kailan ka huling naramdaman na tunay kang pahinga — hindi lang tulog, kundi talaga nang rest?',
      'POV: Lahat ng tao sa paligid mo ay okay — tapos ikaw? Pagod ka na sa pagpapakitang okay ka rin.',
      'Totoo? Minsan ang pinaka-nakakapagod ay hindi ang trabaho — kundi yung pagpapanggap na kaya mo pa.',
      'Yung burnout na hindi mo tinatawag na burnout kasi "kaya mo pa naman."',
      'Yung tipong tulog ka ng 8 oras pero pagising mo, pagod ka pa rin.',
      '"Halina kayo sa akin, kayong lahat na nangagod at nangabibigatan." — para sa mga tunay na pagod.',
      'Noon: tinatago ko ang burnout ko. Ngayon: may paalala akong pinahihintulutan akong huminga.',
      'Para sa iyo ito kung matagal ka nang nagtatago ng burnout at kailangan mo ng pahintulot na magpahinga.',
      'Narealize ko lang — ang pagpapahinga ay hindi katamaran. Ito ay pangangalaga sa sarili — at pananampalataya.',
      'Ang mga nagsusuot nito ay nagsasabi: "kailangan ko ng paalala na okay lang magpahinga."',
    ],
    ctas: [
      'Para sa mga pagod na pagod — link sa bio 🙏',
      'I-regalo sa kaibigan mong kailangan ng pahintulot na magpahinga. Link sa bio 💛',
      'Libre ang gift wrapping. Link sa bio 👇',
      'Ships nationwide, 3-5 days. Link sa bio.',
      'Para sa mga Pilipinong nagtatrabaho nang sobra — link sa bio.',
      'DM mo kami. Dito tayo. 💬',
      'Tap link sa bio. Para sa iyo ito.',
      'I-tag ang kaibigan mong kailangan ng pahinga ngayon. 🙏',
      'Kunin mo na — para sa sarili mo. Link sa bio 👇',
      'Sa pagod mong ito — hindi ka nag-iisa. Link sa bio 💛',
    ],
  },

  'Not Alone': {
    hook: 'Feeling mo ba parang kaya mo lang ito mag-isa?',
    relatable: 'Yung tipong buo pa rin ang grupo mo pero parang nag-iisa ka pa rin. Maraming tao sa paligid mo pero hindi ka makapag-share ng tunay mong nararamdaman. Para ka na lang nanonood sa buhay nila habang nag-iisa kang nagtatanggal ng sarili mong load.',
    tension: 'Ang loneliness ay hindi laging tungkol sa kung may kasama ka o wala. Minsan ang pinakamalungkot na lugar ay yung pinaka-puno ng tao.',
    resolution: 'May isang hindi umaalis. Hindi natutulog. Hindi nagpapagod na maging kasama mo. At hindi ka kailanman nag-iisa sa Kanya.',
    hero_headline: 'Daily Devotion Co. — Hindi ka nag-iisa. Kahit pakiramdam mo ganoon.',
    pain_points: [
      'Puno ang paligid mo ng tao pero feeling mo nag-iisa ka pa rin — at hindi mo alam kung paano i-explain ito.',
      'Minsan ang pinaka-mahirap ay hindi ang problema kundi yung pakiramdam na kailangan mo itong harapin nang mag-isa.',
      'Gusto mong mag-share ng tunay mong nararamdaman pero ayaw mong maging burden sa mga taong mahal mo.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsusuot nito bilang paalala na kahit sa pinakamalungkot na gabi — hindi sila nag-iisa.',
    hooks: [
      'Kailan ka huling naramdaman na may tunay na nakakaunawa sa iyo?',
      'POV: Puno ang kwarto ng tao pero nanonood ka lang — hindi ka talaga presente dahil nag-iisa kang nararamdaman.',
      'Aminin ko — maraming beses akong napapaligiran ng tao pero naramdaman ko pa rin ang pinaka-malungkot na loneliness.',
      'Hindi lahat ng pagkakataon ay mapalad na may taong tunay na naiintindihan ka. Pero May Isa na lagi.',
      'Yung tipong may mga kaibigan ka pero hindi mo pa rin masabi yung tunay mong nararamdaman.',
      '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — para sa mga naramdamang mag-isa kahit hindi nag-iisa.',
      'Noon: naramdaman ko ang pinaka-malungkot na loneliness sa gitna ng grupo. Ngayon: may paalala akong hindi ako talaga nag-iisa.',
      'Para sa iyo ito kung kahit surrounded ka ng tao, may pagkakataon na nararamdaman mong nag-iisa.',
      'Narealize ko lang — yung pinaka-lonely na tao ay minsan yung pinaka-popular sa grupo.',
      'Ang mga nagsusuot nito ay nagsasabi: "gusto kong may hawak akong paalala na hindi ako nag-iisa kahit ano pa ang pakiramdam ko."',
    ],
    ctas: [
      'Hindi ka nag-iisa — link sa bio 🙏',
      'Para sa kaibigan mong nararamdamang mag-iisa — perfect regalo. Link sa bio 💛',
      'Kasama ang libreng gift message. Link sa bio 👇',
      'Ships 3-5 days nationwide. Link sa bio.',
      'Para sa mga Pilipinong nararamdamang nag-iisa kahit hindi — link sa bio.',
      'DM mo kami. Narito tayo. 💬',
      'Tap link sa bio. Para sa iyo ito.',
      'I-tag ang taong kailangan itong marinig ngayon. 🙏',
      'Kunin mo na. Link sa bio 👇',
      'Tayo-tayo — hindi tayo nag-iisa. Link sa bio 💛',
    ],
  },

  'Let Go And Trust': {
    hook: 'Anong bagay pa yung hawak mo pero kailangan mo nang bitawan?',
    relatable: 'Yung alam mo na dapat mo nang pakawalan pero natatakot kang walang kukuha sa iyo pagkatapos. Yung hawak ka sa bagay na nagpapagod sa iyo dahil mas matakot ka sa kalayaan kaysa sa pagpapatuloy.',
    tension: 'Mahirap magtiwala dahil dati kang nasaktan nung nag-trust ka. At ang pagtitiwala ulit ay parang sinasabi mong okay lang na masaktan ka ulit — pero hindi ganoon.',
    resolution: 'Sa Kanya, ang bitaw ay hindi pagkawala. Ang pagbibitiw ay ang simula ng pagpasok ng mas magandang bagay — at Siya ang humahawak sa iyo sa proseso.',
    hero_headline: 'Daily Devotion Co. — Bitaw. Magtiwala. Hawak ka Niya.',
    pain_points: [
      'May hawak kang bagay — relasyon, takot, resulta, plano — na alam mo na dapat mong pakawalan pero hindi mo pa magawa.',
      'Yung magtiwala ay parang sawang-sawa ka nang sumugal sa isang bagay na mabibigo ka ulit — kaya mas ligtas na lang hawakan.',
      'Minsan ang pinaka-nakakahadlang sa blessing ay yung bagay na hawak mo nang masyadong mahigpit.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsusuot nito bilang paalala na ang bitaw ay simula — hindi katapusan.',
    hooks: [
      'Anong bagay ang hawak mo nang masyadong mahigpit na kailangan mo nang bitawan?',
      'POV: Alam mo na dapat mong pakawalan pero mas takot ka sa "paano kung" kaysa sa sama ng loob ng pagbitaw.',
      'Totoo? Minsan mas madaling dalhin ang bigat kaysa bitawan ito — kasi ang bitaw ay kinakatakutan mo.',
      'Yung bitaw na pinaka-mahirap — hindi yung sa taong nawala kundi yung sa bagay na matagal mo nang hawak.',
      'Yung tipong hawak mo pa rin kahit alam mo nang dapat mong pakawalan.',
      '"Sa Diyos, walang imposible." — para sa mga nagtatanong kung kaya pa nilang magtiwala.',
      'Noon: hawak ko ang lahat nang masyadong mahigpit. Ngayon: may paalala akong okay lang ang bitaw.',
      'Para sa iyo ito kung matagal ka nang nagdadala ng bagay na kailangan mo nang ibigay sa Kanya.',
      'Narealize ko lang — ang mga bagay na pinaka-mahirap bitawan ay minsan ang mga bagay na pinaka-kailangan nating pakawalan.',
      'Ang mga nagsusuot nito ay nagsasabi: "kailangan ko ng daily reminder na okay lang ang magtiwala."',
    ],
    ctas: [
      'Para sa mga kailangan ng tapang na bitawan — link sa bio 🙏',
      'I-regalo sa taong kailangan ng paalala ng Kanyang pagmamahal. Link sa bio 💛',
      'Libre ang gift wrapping. Link sa bio 👇',
      'Ships nationwide, 3-5 days. Link sa bio.',
      'Para sa mga Pilipinong natututo pa lang magtiwala — link sa bio.',
      'DM mo kami — narito tayo. 💬',
      'Tap link sa bio. Para sa iyo ito.',
      'I-tag ang kaibigan mong kailangan ng paalala ngayon. 🙏',
      'Kunin mo na. Link sa bio 👇',
      'Bitaw. Magtiwala. Hindi ka nag-iisa. Link sa bio 💛',
    ],
  },

  'Daily Reminder': {
    hook: 'Yung umagang pakiramdam mo ay lahat ay laban sa iyo...',
    relatable: 'Kahit munting bagay lang ang nagpagana sa iyo na gumising — pero nagising ka pa rin. Yung tipong minsan kailangan mo ng bagay na pisikal na makapagpaalaala sa iyo bago pa man mag-open ang phone, bago pa dumating ang lahat ng notification at load ng araw.',
    tension: 'Minsan kailangan natin ng pisikal na paalala — hindi lang sa utak, kundi sa kamay, sa katawan — na may nagmamahal sa atin. Na may naghihintay sa atin. Na hindi tayo nag-iisa.',
    resolution: 'Isang bagay na makikita mo araw-araw. Isang pangako na naka-engrave — na nandoon ka man o hindi maganda ang araw. Hawak ka Niya.',
    hero_headline: 'Daily Devotion Co. — Isang paalala na dala mo kahit saan.',
    pain_points: [
      'Minsan ang pinaka-mahirap na parte ng araw ay ang umaga — bago pa man magsimula ang lahat.',
      'Sa dami ng notifications, responsibilidad, at noise ng buhay, madaling makalimutan ang mga bagay na pinakamahalaga.',
      'Kailangan mo ng bagay na nagpapaalaala sa iyo araw-araw — hindi kapag convenient, kundi kahit sa pinaka-busy na araw.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsasabi na ito ang unang bagay na namamalayan nila umaga — at nagbabago nito ang tono ng kanilang araw.',
    hooks: [
      'Kailan ka huling may bagay na nagpaalaala sa iyo — kahit isang segundo — na mahal ka?',
      'POV: Nagising ka. Nangyari na ang lahat ng dapat mangyari ngayon sa utak mo. Kailangan mo ng paalala na okay ka.',
      'Aminin ko — maraming araw na nagsisimula ako nang walang paalala na may nagmamahal sa akin. Nagbago na iyon.',
      'Hindi lahat ng araw ay maganda. Pero bawat araw ay may pagkakataon para maramdaman na hawak ka.',
      'Yung tipong kailangan mo ng isang bagay na daily na nagpapaalaala sa iyo ng pinaka-importanteng katotohanan.',
      '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — para sa bawat umaga na kailangan mo ng paalala.',
      'Noon: simula ng araw ko ay kung sino ang may pinakamalakas na notification. Ngayon: isang paalala sa aking pulso.',
      'Para sa iyo ito kung kailangan mo ng bagay na nagpapaalaala sa iyo araw-araw — hindi lang kapag dumadalo ka sa simbahan.',
      'Narealize ko lang — ang pinakamagandang paalala ay yung dala mo kahit saan ka pumunta.',
      'Ang mga nagsusuot nito ay nagsasabi: "ito ang unang bagay na namamalayan ko umaga — at nagbabago nito ang lahat."',
    ],
    ctas: [
      'Para sa iyong araw-araw na paalala — link sa bio 🙏',
      'Perfect regalo para sa araw-araw — link sa bio 💛',
      'Libre ang gift wrapping. Link sa bio 👇',
      'Ships 3-5 days nationwide. Link sa bio.',
      'Para sa mga Pilipinong naghahanap ng daily na paalala ng pananampalataya — link sa bio.',
      'DM mo kami. Makikiusap tayo. 💬',
      'Tap link sa bio. Para sa iyo ito.',
      'I-tag ang taong kailangan ng paalala ngayon. 🙏',
      'Kunin mo na. Link sa bio 👇',
      'Bawat umaga, may paalala — hindi ka nag-iisa. Link sa bio 💛',
    ],
  },

  // Legacy angles — backward compatibility
  'Anxiety / Fear': {
    hook: 'Yung takot na hindi mo rin maintindihan kung saan nanggagaling...',
    relatable: 'Lahat tayo may oras na nag-aalalang sobra. Yung tipong ang liit ng dahilan pero ang laki ng epekto. Nagising ka nang hindi mo alam kung bakit kaba ka.',
    tension: 'Ang pinaka-mahirap ay yung hindi mo alam kung kailan titigil. Yung alam mo na dapat ka matulog pero ang katawan mo ay parang ayaw.',
    resolution: 'Narinig mo ba yung "Huwag kang matakot"? Hindi iyon sinabi nang walang dahilan. Nandoon Siya — lalo na sa mga gabing hindi mo alam ang katahimikan.',
    hero_headline: 'Daily Devotion Co. — Para sa mga gabing puno ng kaba',
    pain_points: [
      'Yung kaba na pumupukaw sa iyo kahit sa simpleng bagay — at hindi mo alam kung bakit.',
      'Yung anxiety na hindi mo masabi sa kahit sino dahil pakiramdam mo ay wala naman talagang dahilan.',
      'Yung tipong nag-aalalang sobra ka sa mga bagay na hindi mo pa nangyayari.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsusuot nito bilang paalala na ang kanilang takot ay mas maliit kaysa sa Kanyang pangako.',
    hooks: [
      'Yung anxiety na hindi mo alam kung saan nanggagaling — kilala mo ba ito?',
      'POV: 3am. Pagod ka. Pero ang utak mo ay desididong hindi tumutulog pa.',
      'Aminin ko — ilang beses na akong nag-spiral sa mga bagay na hindi pa naman nangyayari.',
      'Yung kaba na pumupukaw sa iyo sa pinakawalang-kurap na sandali.',
      'Yung tipong pagod ka na pero hindi ka pa rin makatulog — kasi nag-iisip ka ng lahat.',
      '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — Isaiah 41:10. Para sa mga gabing ito.',
      'Noon: nag-aala-ala ako nang sobra. Ngayon: may hawak akong pangako.',
      'Para sa iyo ito kung alam mo kung ano ang ibig sabihin ng anxiety kahit wala namang dahilan.',
      'Narealize ko lang — ang kaba ko ay hindi mas malaki kaysa sa Kanyang pagmamahal.',
      'Ang mga nagsusuot nito ay nagsasabi: "kailangan ko ng pisikal na bagay na nagpapaalaala sa akin na hindi ako nag-iisa."',
    ],
    ctas: [
      'Link sa bio para sa mga gabi ng kaba 🙏',
      'I-regalo sa taong kailangan ng paalala ngayon. Link sa bio 💛',
      'Libre ang gift wrapping. Link sa bio 👇',
      'Ships nationwide. Link sa bio.',
      'Para sa mga Pilipinong may anxiety at pananampalataya — link sa bio.',
      'DM mo kami. 💬',
      'Tap link sa bio. Para sa iyo.',
      'I-tag ang taong kailangan ito. 🙏',
      'Kunin mo na. Link sa bio 👇',
      'Hindi ka nag-iisa kahit sa kaba. Link sa bio 💛',
    ],
  },

  'Gift': {
    hook: 'Para sa taong deserving ng something meaningful...',
    relatable: 'May tao sa buhay mo na lagi mong gusto tulungan pero hindi mo alam kung paano. Gusto mong ibigay sa kanila ng higit pa sa "mananampalataya tayo" — gusto mong may dala silang paalala kahit wala ka.',
    tension: 'Minsan wala talaga tayong tamang salita para sa taong nagmamahal natin. At yung katahimikan na iyon ay hindi katapusan ng pagmamahal — ito ay simula ng paghahanap ng ibang paraan.',
    resolution: 'Ibibigay mo sa kanila ng bagay na magpapaalaala sa kanila araw-araw. Hindi para palitan ang iyong presensya — kundi para dalhin ang iyong pagmamahal kahit wala ka.',
    hero_headline: 'Daily Devotion Co. — Ang regalo na nagsasalita kahit wala ka.',
    pain_points: [
      'May taong espesyal ka na gusto mong bigyan ng higit pa sa salita — ng isang bagay na may kahulugan.',
      'Minsan ang pinaka-matinong regalo ay hindi yung pinakamahal — kundi yung pinakamahalaga.',
      'Gusto mong may dala silang paalala ng iyong pagmamahal kahit malayo ka.',
    ],
    social_proof: 'Libo-libo nang Pilipino ang nagsabing ito ang pinaka-meaningful na regalo na natanggap nila.',
    hooks: [
      'May taong gusto mong bigyan ng regalo na hindi nila malilimutan?',
      'POV: Naghahanap ka ng regalo na may kahulugan — hindi lang maganda, kundi tunay na nagpapaalaala.',
      'Aminin ko — ilang beses na akong bumili ng regalo na hindi naman talagang tama. Ngayon, iba na.',
      'Hindi lahat ng regalo ay may kahulugan. Ito ay isa sa mga may kahulugan.',
      'Yung tipong gusto mong sabihing "mahal kita" sa pamamagitan ng isang bagay na dala nila araw-araw.',
      '"Huwag kayong mangamba sa anumang bagay." — para sa taong mahal mo at kailangan nitong marinig.',
      'Noon: nagbibigay ako ng regalo na nakalagay sa drawer. Ngayon: nagbibigay ako ng bagay na dinadala nila.',
      'Para sa iyo ito kung gusto mong bigyan ng taong espesyal ng regalo na tunay na nagsasalita.',
      'Narealize ko lang — ang pinakamagandang regalo ay yung nagpapaalaala sa kanila araw-araw na sila ay mahal.',
      'Ang mga nagbigay nito ay nagsasabi: "ito ang regalo na lagi nilang sinasabing "salamat" kahit ilang buwan na."',
    ],
    ctas: [
      'Para sa taong espesyal — link sa bio 🙏',
      'Kasama ang libreng gift wrapping at personalized message card. Link sa bio 💛',
      'Libre ang lahat ng packaging. Link sa bio 👇',
      'Ships 3-5 days. Order na. Link sa bio.',
      'Para sa mga regalo na may kahulugan — link sa bio.',
      'DM mo kami para i-customize ang regalo. 💬',
      'Tap link sa bio. Gift-ready na.',
      'I-tag ang taong gusto mong bigyan. 💛',
      'Order na bago maubusan. Link sa bio 👇',
      'Bigyan sila ng regalo na maaalala nila — link sa bio 💛',
    ],
  },
}

const DEFAULT_TEMPLATE: AngleTemplate = {
  hook: 'May bagay ka bang dala ngayon na mas mabigat kaysa dapat?',
  relatable: 'Lahat tayo may sandali na pakiramdam natin ay hindi na kaya pa. Yung tipong gusto mong tumigil pero hindi mo alam kung paano.',
  tension: 'At sa sandaling iyon — ano ang hawak mo? Ano ang nagpapaalaala sa iyo na hindi ka nag-iisa?',
  resolution: 'May isang bagay na hindi nagbabago — kahit ang lahat ay nagbabago. Hawak ka Niya.',
  hero_headline: 'Daily Devotion Co. — Isang paalala na dala mo kahit saan.',
  pain_points: [
    'Minsan ang buhay ay sobrang busy at sobrang mabigat na nakakalimutan mo ang pinaka-importanteng katotohanan.',
    'Kailangan mo ng bagay na nagpapaalaala sa iyo — hindi kapag convenient, kundi araw-araw.',
    'Yung pakiramdam na kailangan mo lang ng isang bagay na magpapaalaala sa iyo na hindi ka nag-iisa.',
  ],
  social_proof: 'Libo-libo nang Pilipino ang nagdadala nito bilang araw-araw na paalala.',
  hooks: [
    'May bagay ka bang kailangan mong marinig ngayon?',
    'POV: Kailangan mo ng isang paalala ngayon.',
    'Totoo? Minsan ang kailangan lang natin ay isang simpleng paalala.',
    'Yung bagay na nagpapaalaala sa iyo araw-araw — mayroon ka ba noon?',
    'Yung tipong kailangan mo lang ng isang bagay na nagsasabing "okay ka."',
    '"Huwag kang matakot, sapagkat ako\'y sumasaiyo." — kailangan mo ba ito ngayon?',
    'Noon: walang nagpapaalaala sa akin. Ngayon: may dala akong pangako.',
    'Para sa iyo ito kung kailangan mo ng pisikal na paalala ng pagmamahal ng Diyos.',
    'Narealize ko lang — ang pinakamagandang paalala ay yung dala mo kahit saan.',
    'Ang mga nagsusuot nito ay nagsasabi: "binago nito ang tono ng aking araw."',
  ],
  ctas: [
    'Link sa bio 🙏',
    'Perfect regalo — link sa bio 💛',
    'Libre ang gift wrapping. Link sa bio 👇',
    'Ships nationwide. Link sa bio.',
    'Para sa mga Pilipinong may pananampalataya — link sa bio.',
    'DM mo kami. 💬',
    'Tap link sa bio.',
    'I-tag ang taong kailangan ito. 🙏',
    'Kunin mo na. Link sa bio 👇',
    'Hindi ka nag-iisa. Link sa bio 💛',
  ],
}

function getAngleTemplate(angleName: string): AngleTemplate {
  return ANGLE_TEMPLATES[angleName] ?? DEFAULT_TEMPLATE
}

function generateCreativeFallback(input: GenerateInput): GeneratedOutput {
  const { product, verse, angle } = input
  const t = getAngleTemplate(angle.name)

  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'
  const productShort = isJar ? 'Daily Verse Jar' : product.name
  const productAction = isJar ? 'i-open mo' : `suotin mo ang ${wearNoun}`

  // Primary Text — Ogilvy: hook first 125 chars, specific facts, benefit-led
  const primary_text = `${t.hook}

${t.relatable}

${t.tension}

${isJar
    ? `Kaya ginawa ang Daily Devotion Co. ${productShort} — 52 handpicked Bible verses, laser-printed, isa para sa bawat linggo ng taon. Para sa mga araw na kailangan mo ng paalala na hindi ka nag-iisa.`
    : `Kaya may mga Pilipino na nagsusuot ng Daily Devotion Co. ${productShort} — hindi para maging fancy, kundi para may hawak silang pisikal na paalala ng pangako ng Diyos kahit saan sila pumunta.`
  }

"${verse.text}" — ${verse.reference}

${t.resolution}

${isJar ? 'I-check ang link sa bio. 3-5 days, ships nationwide. 🙏' : 'Link sa bio. Ships 3-5 days, nationwide. 🙏'}`

  // Headline — Ogilvy: brand + specific promise, max 40 chars, emotional
  const rawHeadline = `${t.hook.split('—')[0].trim().replace(/\?$/, '').trim()}`
  const headline = rawHeadline.length > 40 ? rawHeadline.substring(0, 37) + '...' : rawHeadline

  // UGC Script — creator-authentic, with physical action notes and timing
  const ugc_script = `[HOOK 0:00-0:03]
${t.hook}

[RELATABLE MOMENT 0:03-0:12]
${t.relatable}

[EMOTIONAL BEAT 0:12-0:20]
${t.tension}

[PRODUCT REVEAL 0:20-0:30]
*${isJar ? 'kinukuha ang jar mula sa mesa' : `itinuturo ang ${wearNoun} sa pulso`}*
Ito yung Daily Devotion Co. ${wearNoun}. ${isJar
    ? 'May 52 Bible verses dito — isa para sa bawat linggo ng taon. Laser-printed. Gift-ready.'
    : `Laser-engraved dito: "${verse.text}" — ${verse.reference}. Suot mo ito araw-araw.`
  }

[VERSE DROP 0:30-0:38]
*nagbabasa nang dahan-dahan*
"${verse.text}."
${verse.reference}.
${t.resolution.split('.')[0]}.

[SOFT CTA 0:38-0:45]
${isJar
    ? 'Link sa bio kung para sa iyo ito o para sa taong espesyal mo. Libre ang gift wrapping. 🙏'
    : `Link sa bio. Para sa iyo o bilang regalo — libre ang gift wrapping. Ships nationwide. 🙏`
  }`

  // Voiceover — cinematic, short sentences, paced pauses
  const voiceover_script = `${t.hook}

[jeda]

${t.relatable.split('.')[0]}.

[jeda]

${t.tension.split('.')[0]}.

[jeda]

"${verse.text}."

${verse.reference}.

[jeda]

${t.resolution.split('.')[0]}.

[jeda]

${isJar
    ? `Ang Daily Devotion Co. ${productShort}. 52 verses. Isa para sa bawat linggo ng taon.`
    : `Ang Daily Devotion Co. ${productShort}. Isang pisikal na pangako. Para sa bawat araw.`
  }

[jeda]

Link sa bio. 🙏`

  // Product Description — Ogilvy: emotion first, specific facts, benefit bullets
  const product_description = `${t.hook}

${t.relatable.split('.')[0]}. ${t.tension.split('.')[0]}.

${isJar
    ? `Ang Daily Devotion Co. Daily Verse Jar ay may 52 handpicked Bible verses — isa para sa bawat linggo ng taon. Para sa morning devotion, family prayer time, o bilang meaningful na regalo.`
    : `Ang Daily Devotion Co. ${product.name} ay isang ${wearNoun} na laser-engraved ng "${verse.text}" (${verse.reference}) — isang pisikal na pangako ng Diyos na dala mo kahit saan ka pumunta.`
  }

${t.resolution}

${isJar ? '• 52 handpicked Bible verses, isa para sa bawat linggo' : `• Laser-engraved: ${verse.reference}`}
• Premium quality, matibay na materyales
• ${isJar ? 'Beautiful gift-ready jar, perfect para ibigay' : 'Hypoallergenic, safe para sa sensitive skin'}
• Kasama ang gift box at message card
• Ships nationwide, 3-5 business days
• Perfect bilang regalo o para sa sarili mo`

  return {
    primary_text,
    headline,
    ugc_script,
    voiceover_script,
    product_description,
    hooks: t.hooks,
    ctas: t.ctas,
    landing_page: generateLandingPage(product, verse, angle, t),
    ecommerce_page: generateEcommercePage(product, verse, angle, t),
  }
}

function generateLandingPage(
  product: Product,
  verse: Verse,
  angle: CreativeAngle,
  t: AngleTemplate
): string {
  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'

  return `## HERO
Headline: ${t.hero_headline}
Subheadline: Isang ${wearNoun} na laser-engraved ng "${verse.text}" — ${verse.reference}. Isang pangako ng Diyos na dala mo kahit saan, kahit anong araw.
CTA Button: Kunin Mo Na →

---

## PAIN
${t.pain_points[0]}

${t.pain_points[1]}

${t.pain_points[2]}

---

## AGITATION
${t.tension} At sa bawat araw na lumilipas nang walang paalala, mas nagiging mabigat ang dalahin.

Pero hindi kailangan maging ganoon.

---

## SOLUTION
${isJar
  ? `Ang Daily Devotion Co. Daily Verse Jar ay isang koleksyon ng 52 handpicked Bible verses — isa para sa bawat linggo ng taon. Para sa umaga na kailangan mo ng direksyon, para sa gabi na kailangan mo ng katahimikan, o para sa taong kailangan ng paalala na hindi sila nag-iisa.`
  : `Ang Daily Devotion Co. ${product.name} ay isang ${wearNoun} na laser-engraved ng isang Bible verse — isang pisikal na paalala ng pangako ng Diyos na suot mo araw-araw. Hindi ito jewelry lang. Ito ay isang pangako na dala mo kahit saan.`
}

${t.resolution}

---

## THE VERSE
"${verse.text}"
— ${verse.reference}

${t.resolution} Kaya naka-engrave ito sa bawat ${wearNoun} — para kahit tahimik ang mundo, may nagsasalita sa iyo.

---

## SOCIAL PROOF
${t.social_proof}

"Ito ang pinaka-meaningful na regalo na natanggap ko. Araw-araw ko itong tinitingnan at natatandaan ko na hindi ako nag-iisa." — Ate Marie, Cebu

"Ang bracelet ko ay naging conversation starter. Marami nang nagtanong sa akin at naibahagi ko ang aking pananampalataya." — Kuya Jerome, Manila

---

## FEATURES
${isJar ? '• 52 handpicked Bible verses — isa para sa bawat linggo ng taon' : `• Laser-engraved: "${verse.text}" — ${verse.reference}`}
• Premium quality, tatagal ng maraming taon
• ${isJar ? 'Beautiful gift-ready jar na ready for giving' : 'Hypoallergenic materials, safe para sa daily wear'}
• Kasama ang gift box at personalized message card
• Ships nationwide in 3-5 business days
• 100% satisfaction guarantee

---

## OBJECTION HANDLING
"Mahal ba ito?" — Ang Daily Devotion Co. ay dinisenyo para maging accessible sa lahat. Ito ay isang investment sa isang bagay na magpapaalaala sa iyo araw-araw — hindi lang isang regalo kundi isang patuloy na paalala.

"Legit ba ito?" — Libo-libo nang Pilipino ang nagtitiwala sa Daily Devotion Co. Bawat produkto ay carefully made at inspected bago i-ship. Kasama rin ang 100% satisfaction guarantee.

"Kailan darating?" — Ships nationwide in 3-5 business days. Kasama ang tracking para malaman mo kung nasaan na ang order mo.

---

## FINAL CTA
${t.resolution}

Huwag hayaan na lumipas ang araw pa nang walang paalala na hawak ka Niya.

**Kunin Mo Na →**
Free gift wrapping • Ships 3-5 days • 100% Satisfaction Guarantee`
}

function generateEcommercePage(
  product: Product,
  verse: Verse,
  angle: CreativeAngle,
  t: AngleTemplate
): string {
  const isJar = product.slug === 'daily-verse-jar'
  const isBracelet = product.slug.includes('bracelet')
  const wearNoun = isJar ? 'verse jar' : isBracelet ? 'bracelet' : 'necklace'

  return `## PRODUCT TITLE
${product.name} — "${verse.text}" (${verse.reference})

## TAGLINE
${t.hero_headline.replace('Daily Devotion Co. — ', '')}

---

## DESCRIPTION
${t.hook} ${t.relatable.split('.')[0]}.

${isJar
  ? `Ang Daily Devotion Co. Daily Verse Jar ay may 52 handpicked Bible verses — laser-printed sa premium paper, isa para sa bawat linggo ng taon. Dinisenyo para sa morning devotion, family prayer time, o bilang meaningful na regalo sa taong espesyal.`
  : `Ang Daily Devotion Co. ${product.name} ay isang ${wearNoun} na laser-engraved ng "${verse.text}" — ${verse.reference}. Isang pisikal na pangako ng Diyos na dala mo kahit saan, kahit anong araw, kahit gaano kahirap ang sitwasyon.`
}

${t.resolution} Kaya naka-engrave ang pangako sa bawat ${wearNoun} — para may hawak kang paalala kahit tahimik ang mundo.

---

## WHAT'S INCLUDED
${isJar
  ? '• 1 Daily Verse Jar na may 52 handpicked Bible verses\n• Premium gift box\n• Personalized message card (libreng i-customize ang message)'
  : `• 1 ${product.name} — laser-engraved ng ${verse.reference}\n• Premium gift box\n• Personalized message card (libreng i-customize ang message)`
}

---

## PRODUCT FEATURES
${isJar
  ? '• 52 carefully selected Bible verses — isa para sa bawat linggo\n• Laser-printed sa premium paper, hindi mabubura\n• Beautiful glass/acrylic jar, display-worthy\n• Sukat: [dimensions]\n• Perfect para sa desk, bedside table, o sala'
  : `• Laser-engraved verse: "${verse.reference}" — hindi mabubura\n• Premium hypoallergenic materials — safe para sa daily wear\n• Water-resistant — maaari isuot kahit maliligo\n• Sukat: [dimensions], angkop sa halos lahat ng pulso\n• Tarnish-resistant — matagal ang ganda`
}
• Kasama ang premium gift box at ribbon
• Libreng personalized message card
• Ships nationwide, 3-5 business days

---

## PERFECT AS A GIFT
${t.pain_points[0].split('.')[0]}. Ang Daily Devotion Co. ${product.name} ay perpektong regalo para sa taong espesyal — isang bagay na magpapaalaala sa kanila araw-araw na hindi sila nag-iisa. Kasama ang libreng gift wrapping at personalized message card.

Para sa: Ina, kaibigan, ate, bunso, o kahit sino sa iyong buhay na kailangan ng paalala ng Kanyang pagmamahal.

---

## SHIPPING & GUARANTEE
• Ships nationwide sa Pilipinas, 3-5 business days
• May tracking number — malalaman mo kung nasaan na ang order
• 100% satisfaction guarantee — kung hindi masaya ang tatanggap, palitan namin
• Libre ang gift wrapping at personalized message card
• Para sa bulk orders o customization, DM kami sa @dailydevotion.co`
}
