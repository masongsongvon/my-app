import type { GeneratedOutput as CreativeOutput } from "./generator";

type Vars = {
  verse_text: string;
  verse_reference: string;
  product_name: string;
};

type AngleTemplate = {
  primary_text: string;
  headline: string;
  ugc_script: string;
  voiceover_script: string;
  product_description: string;
  hooks: string[];
  ctas: string[];
};

function fill(str: string, vars: Vars): string {
  return str
    .replaceAll("{verse_text}", vars.verse_text)
    .replaceAll("{verse_reference}", vars.verse_reference)
    .replaceAll("{product_name}", vars.product_name);
}

const angleTemplates: Record<string, AngleTemplate> = {
  "Anxiety / Fear": {
    primary_text: `When the panic rises and your chest gets tight — you don't have to fight it alone.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is more than jewelry. It's a prayer around your wrist. A promise you can hold onto when the fear gets loud.\n\nBecause sometimes faith looks like reaching down and touching something real.\n\n✨ A promise you can wear.`,
    headline: `For the moments fear feels louder than faith.`,
    ugc_script: `Okay I have to be honest with you. I've been struggling with anxiety really bad lately. Like the kind where you wake up at 3am and your mind just won't stop.\n\nMy mom got me this {product_name} and it has {verse_reference} on it — "{verse_text}"\n\nI know it sounds simple. But every time I feel that panic start, I hold onto this and something shifts.\n\nI just had to share it. Because if you're going through it too — this might help. Daily Devotion Co. — link in bio.`,
    voiceover_script: `Fear is real. Anxiety is real. But so is this promise.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — a daily reminder that you are not alone.\n\nWear the promise. Daily Devotion Co.`,
    product_description: `For the days when anxiety feels overwhelming — this {product_name} carries a reminder that you don't face it alone. Engraved with {verse_reference}: "{verse_text}" — a promise from God that travels with you everywhere you go. Made for the quiet moments when you need to feel held.\n\n✨ A promise you can wear.`,
    hooks: [
      `When anxiety hits at 3am, this is what I reach for...`,
      `For anyone who knows what it feels like to be afraid of your own thoughts...`,
      `The panic was rising. Then I looked down at my wrist.`,
      `What do you do when fear won't leave you alone?`,
      `I used to think faith and anxiety couldn't coexist. I was wrong.`,
      `This one verse changed how I handle my anxiety...`,
      `If fear has been following you around lately, this is for you.`,
      `She was shaking. Then her daughter handed her this.`,
      `The day I stopped white-knuckling my fear and wore this instead.`,
      `"{verse_text}" — the words I needed when fear took over.`,
    ],
    ctas: [
      `Wear the promise. Shop Daily Devotion Co. — link in bio.`,
      `Get yours and carry His peace everywhere you go.`,
      `Shop now. Free shipping on orders over $35.`,
      `Give yourself — or someone you love — a reminder that God is near.`,
      `Tap the link. Let faith be louder than fear.`,
      `Order today. Ships in 2–3 business days.`,
      `Find your verse. Wear your promise. Shop the link.`,
      `You don't have to fight it alone. Shop Daily Devotion Co.`,
      `Save this. Share this. Someone needs it today.`,
      `Click the link to wear your faith.`,
    ],
  },

  "Gift": {
    primary_text: `Looking for a gift that actually means something?\n\nNot another candle. Not another gift card. Something that will stay with them.\n\nThe {product_name} from Daily Devotion Co. comes engraved with {verse_reference}: "{verse_text}"\n\nIt's the kind of gift that says "I see you, I love you, and I want you to carry God's promises with you."\n\nPerfect for:\n→ Birthdays\n→ Mother's Day\n→ Graduations\n→ Hard seasons\n→ "Just because I love you"\n\n✨ A promise you can wear.`,
    headline: `The gift that keeps speaking — long after the day is over.`,
    ugc_script: `I am SO bad at finding meaningful gifts. Like I always end up with a generic gift card and I hate it.\n\nBut I found Daily Devotion Co. and I got my best friend this {product_name} with {verse_reference} on it — "{verse_text}"\n\nShe literally cried when she opened it. It's the most meaningful thing I've ever given her.\n\nIf you need a gift for someone who could use some encouragement — this is it. Link in bio.`,
    voiceover_script: `Some gifts are forgotten by morning.\n\nThis one they'll wear every day.\n\nThe {product_name} — engraved with {verse_reference}: "{verse_text}"\n\nA gift that says: I love you, and God loves you more.\n\nShop Daily Devotion Co. The perfect gift for the people who matter most.`,
    product_description: `Give the gift of God's promises. The {product_name} is engraved with {verse_reference}: "{verse_text}" — a meaningful, wearable reminder that faith travels with them wherever they go. Perfect for birthdays, graduations, Mother's Day, or any moment when someone needs to feel seen and loved.\n\n✨ A promise you can wear.`,
    hooks: [
      `Stop giving boring gifts. Give something that actually means something.`,
      `She cried when she opened it. Here's what I got her.`,
      `The best gift I've ever given — and it costs less than dinner out.`,
      `What do you give someone who's been through so much?`,
      `I finally found a meaningful gift and I need everyone to know.`,
      `The gift she'll wear every single day.`,
      `For the person in your life who needs a reminder that God sees them.`,
      `Gift-giving panic ended the day I found Daily Devotion Co.`,
      `They said it was the most meaningful gift they'd ever received.`,
      `A gift that says "I love you" in the language of faith.`,
    ],
    ctas: [
      `Order now — ships in time for any occasion.`,
      `Shop the perfect gift. Link in bio.`,
      `Give a promise they can wear. Shop Daily Devotion Co.`,
      `Tap the link to find the perfect gift today.`,
      `Free gift wrapping available. Shop now.`,
      `Give something that lasts. Shop the link.`,
      `The gift they'll thank you for every time they wear it.`,
      `Shop now. Free shipping over $35.`,
      `Click the link. Give the gift of faith.`,
      `Order today. Give it with love.`,
    ],
  },

  "Faith reminder": {
    primary_text: `Faith isn't always a feeling. Sometimes it's a choice.\n\nA choice to remember who God is — even when circumstances say otherwise.\n\nThe {product_name} from Daily Devotion Co. carries {verse_reference}: "{verse_text}"\n\nWear it as your daily declaration. Let it be the thing that catches your eye in the middle of a hard moment and pulls you back to what's true.\n\nBecause faith grows when we tend to it daily.\n\n✨ A promise you can wear.`,
    headline: `Wear your faith. Live your faith. Every single day.`,
    ugc_script: `Can I tell you something that changed my daily walk with God?\n\nI started wearing this {product_name} with {verse_reference} — "{verse_text}" — and something shifted.\n\nLike, I'm getting dressed and I put it on and I'm already starting my day with intention. I'm already declaring truth over myself before the day even begins.\n\nIt sounds small but it's made such a difference. Daily Devotion Co. — the link is in my bio if you want one.`,
    voiceover_script: `Faith isn't just for Sundays.\n\nIt's for Monday mornings. Tuesday afternoons. The quiet drive home.\n\nThe {product_name} — engraved with {verse_reference}: "{verse_text}"\n\nYour daily reminder of who God is — and who you are because of Him.\n\nWear your faith. Daily Devotion Co.`,
    product_description: `Faith is a daily practice — and this {product_name} helps you live it out. Engraved with {verse_reference}: "{verse_text}" — it's a wearable declaration, a prayer on your wrist, a reminder that God's promises are true whether you feel them or not. Start every day anchored in truth.\n\n✨ A promise you can wear.`,
    hooks: [
      `What if your jewelry could remind you of who God is every single day?`,
      `Faith is a daily choice. Here's how I make mine.`,
      `I wear this verse every morning before I check my phone.`,
      `The one habit that's deepened my faith more than anything.`,
      `Your accessories can do more than look good — they can speak truth.`,
      `This {product_name} is the first thing I put on every morning.`,
      `A daily reminder that changes everything.`,
      `What you wear speaks to who you are. Wear your faith.`,
      `"{verse_text}" — the verse I need to see every single day.`,
      `Faith isn't a feeling. It's a decision I make when I put this on.`,
    ],
    ctas: [
      `Start your daily faith practice. Shop Daily Devotion Co.`,
      `Wear your faith every day. Shop the link.`,
      `Find your verse. Wear your promise.`,
      `Tap the link and shop today.`,
      `Your daily reminder is waiting. Order now.`,
      `Shop now — free shipping over $35.`,
      `Make faith a daily habit. Shop Daily Devotion Co.`,
      `Click the link. Wear the word.`,
      `Your declaration. Your promise. Shop the link.`,
      `Order today. Wear your faith tomorrow.`,
    ],
  },

  "Breakup / Healing": {
    primary_text: `Healing is not linear. And it is not something you rush.\n\nIf you're walking through the kind of pain that makes it hard to breathe — this is for you.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is a gentle reminder that God sees your heartbreak. He is not absent from it. And He promises to be with you through every single moment of the healing process.\n\nYou are not broken. You are becoming.\n\n✨ A promise you can wear.`,
    headline: `For the healing seasons that feel like they'll never end.`,
    ugc_script: `I wasn't going to share this but I think someone needs to hear it.\n\nI went through a really painful breakup and there were days I genuinely couldn't function. My sister got me this {product_name} from Daily Devotion Co. and it has {verse_reference} on it — "{verse_text}"\n\nEvery time I wanted to spiral, I'd look down at this and remember. I'm not alone in this. God's got me.\n\nIf you're in a healing season right now — this might be exactly what you need. Link in bio.`,
    voiceover_script: `Grief is real. Heartbreak is real. But so is God's presence in the middle of it.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — for the healing seasons when you need to remember: you are not alone.\n\nDaily Devotion Co. A promise you can wear.`,
    product_description: `For the seasons when healing feels impossibly slow — this {product_name} carries a reminder that you are not alone. Engraved with {verse_reference}: "{verse_text}" — God's promise to be with you through every heartbreak, every loss, every long night. Worn by women who are healing, growing, and becoming.\n\n✨ A promise you can wear.`,
    hooks: [
      `For the girl who is healing from something that broke her heart.`,
      `Grief doesn't have a timeline. But God stays through all of it.`,
      `The thing that got me through my hardest heartbreak.`,
      `She was shattered. Then she found this.`,
      `You are not broken. You are becoming.`,
      `For the season after the loss you're still figuring out how to carry.`,
      `Healing is not linear — and that's okay.`,
      `What I wish someone had given me when my heart was breaking.`,
      `The verse that held me together when I had nothing left.`,
      `For anyone who needs to know: you're not alone in this.`,
    ],
    ctas: [
      `Send this to someone who's healing. Shop Daily Devotion Co.`,
      `You are not alone. Shop the link.`,
      `Give someone healing a promise they can hold onto.`,
      `Tap the link. Let God's word carry you.`,
      `Shop now. Someone needs this today.`,
      `Order for yourself — or the one you love who's hurting.`,
      `Find your promise. Wear it through the healing.`,
      `Click the link. You are not alone.`,
      `Shop Daily Devotion Co. — a promise for every season.`,
      `Order now. Free shipping over $35.`,
    ],
  },

  "Motivation": {
    primary_text: `Some days you wake up ready to conquer. Other days, you need a reminder of what you're capable of — because of who's inside you.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is your daily declaration. Not just jewelry. A statement of faith and strength that you carry into every room, every challenge, every moment where you need to remember: you were made for this.\n\n✨ A promise you can wear.`,
    headline: `Wear the reminder that you were made for this.`,
    ugc_script: `Real talk — I've been wearing this {product_name} every single day and I genuinely think it's changed my mindset.\n\nIt has {verse_reference} on it — "{verse_text}" — and there is something powerful about putting it on first thing in the morning and just declaring that over yourself.\n\nLike, the day hits different when you start it anchored in truth.\n\nIf you want to level up your mindset from the inside out — Daily Devotion Co., link in bio.`,
    voiceover_script: `You were not made to shrink.\n\nYou were made to rise.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — your daily reminder that with God, you are more capable than you know.\n\nWear the promise. Daily Devotion Co.`,
    product_description: `For the days when you need to remember what you're made of — this {product_name} is your armor. Engraved with {verse_reference}: "{verse_text}" — it's a declaration of strength and possibility worn by women who refuse to give up. Start your day anchored in what God says about you.\n\n✨ A promise you can wear.`,
    hooks: [
      `Your morning routine is missing one thing.`,
      `The mindset shift that changed everything for me.`,
      `What does it look like to wear your faith into battle?`,
      `I put this on every morning before I do anything else.`,
      `"{verse_text}" — the declaration I make before the day begins.`,
      `She was told she couldn't. She wore this and did it anyway.`,
      `Your jewelry can be your daily declaration. Here's mine.`,
      `For the woman who needs to be reminded: you were made for this.`,
      `Motivation fades. God's promises don't. Wear one.`,
      `The one thing I add to my morning routine that changes everything.`,
    ],
    ctas: [
      `Wear your declaration. Shop Daily Devotion Co.`,
      `Start every day anchored in strength. Shop the link.`,
      `Tap the link. Wear your faith into battle.`,
      `Order your {product_name} today. Free shipping over $35.`,
      `Find your verse. Wear your promise.`,
      `Shop now. Be reminded every day of what you're made of.`,
      `Click the link. Wear the word.`,
      `Your daily declaration is waiting. Order now.`,
      `Shop Daily Devotion Co. — strength you can wear.`,
      `Order today. Arrive motivated every morning.`,
    ],
  },

  "Feeling alone": {
    primary_text: `Loneliness is one of the heaviest things a person can carry.\n\nAnd it doesn't always mean you're by yourself. Sometimes you feel completely alone in a room full of people.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is a reminder for those moments: you are never truly alone. God's presence is not conditional on how you feel. He is with you — always.\n\n✨ A promise you can wear.`,
    headline: `For the moments you feel invisible — He still sees you.`,
    ugc_script: `I went through a season where I felt completely invisible. Like no one really knew me or cared.\n\nAnd one night I was crying and I just kept thinking — even God feels far.\n\nI found Daily Devotion Co. and I got this {product_name} with {verse_reference} on it — "{verse_text}" — and I wore it like a prayer. Like a reminder to myself that the feeling isn't the truth.\n\nIf you've ever felt alone — really alone — this is for you. Link in bio.`,
    voiceover_script: `Loneliness tells you that you're forgotten.\n\nGod says otherwise.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — a reminder for the lonely moments that He has never left your side.\n\nWear the truth. Daily Devotion Co.`,
    product_description: `For the seasons of loneliness — when the silence feels too loud — this {product_name} carries a reminder: you are never truly alone. Engraved with {verse_reference}: "{verse_text}" — a promise that God's presence is constant, even when His nearness is hard to feel. Wear this as a declaration against the lie of isolation.\n\n✨ A promise you can wear.`,
    hooks: [
      `For the girl who feels alone even in a crowded room.`,
      `Loneliness is a liar. Wear the truth instead.`,
      `The night I felt completely invisible — and found this.`,
      `You are not forgotten. You are not unseen.`,
      `For anyone who's been feeling like no one truly knows them.`,
      `He sees you. Even in the seasons when you can't feel it.`,
      `The verse I hold onto when the loneliness gets loud.`,
      `She felt alone. Then she read this verse.`,
      `God has never left your side — wear the reminder.`,
      `For the quiet moments when you need to know: you are not alone.`,
    ],
    ctas: [
      `You are not alone. Wear the reminder. Shop Daily Devotion Co.`,
      `Send this to someone who needs to know they're seen.`,
      `Tap the link. Wear God's nearness.`,
      `Shop now — free shipping over $35.`,
      `Find your verse. Carry His presence.`,
      `Order for yourself or someone who needs this today.`,
      `Click the link. You are never truly alone.`,
      `Shop Daily Devotion Co. — a promise for the lonely seasons.`,
      `Order now. Wear the truth that you are seen.`,
      `Give someone the gift of knowing God is near.`,
    ],
  },

  "Hard season": {
    primary_text: `Some seasons are just hard. There's no sugarcoating it.\n\nAnd in the middle of the hard — you don't need more advice. You need an anchor.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. doesn't promise to fix the hard season. It promises to walk with you through it. A reminder on your wrist that you are held — even when you feel like you're falling apart.\n\n✨ A promise you can wear.`,
    headline: `For the hard seasons — wear the reminder that He holds you.`,
    ugc_script: `I'm not going to pretend this season has been easy. Because it hasn't.\n\nI've been going through something really hard and there are days I genuinely don't know how I'm going to keep going.\n\nBut I put on this {product_name} every morning with {verse_reference} on it — "{verse_text}" — and it reminds me that this season doesn't get the final word.\n\nIf you're in a hard season right now — you're not alone. And this might help. Daily Devotion Co., link in bio.`,
    voiceover_script: `Hard seasons come for everyone.\n\nBut they don't get the final word.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — for the hard seasons when you need to remember: God hasn't forgotten you.\n\nWear the anchor. Daily Devotion Co.`,
    product_description: `For the hard seasons — the ones you didn't see coming and can't seem to get through — this {product_name} is your anchor. Engraved with {verse_reference}: "{verse_text}" — a promise that God is present in the middle of your hardest days. Worn as a reminder that this season has an end, and He is walking you through it.\n\n✨ A promise you can wear.`,
    hooks: [
      `For the season you didn't sign up for.`,
      `When life gets hard — this is what I hold onto.`,
      `In the middle of the hardest year of my life, I wear this.`,
      `Hard seasons deserve more than a motivational quote.`,
      `She's been through so much. This is what keeps her going.`,
      `For anyone who's been wondering if this season will ever end.`,
      `The anchor I wear through every storm.`,
      `"{verse_text}" — the words I need in this hard season.`,
      `When nothing is working and you're running out of strength.`,
      `For the season that's breaking you — wear what holds you together.`,
    ],
    ctas: [
      `Wear the anchor through the storm. Shop Daily Devotion Co.`,
      `Hard seasons don't last. Wear the reminder. Shop now.`,
      `Tap the link. Let faith carry you through.`,
      `Order for yourself or someone going through something hard.`,
      `Shop now — free shipping over $35.`,
      `Click the link. Wear God's promises through this season.`,
      `Find your verse. Wear your anchor.`,
      `Shop Daily Devotion Co. — for the seasons that test you.`,
      `Order today. Let faith go where you go.`,
      `Give someone in a hard season something to hold onto.`,
    ],
  },

  "Waiting season": {
    primary_text: `Waiting is one of the hardest acts of faith.\n\nWhen you've prayed. When you've believed. When you've done everything right — and you're still waiting.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is for the in-between. The not-yet. The season where God is doing something you can't see yet, but you choose to trust anyway.\n\nWear the reminder that His timing is perfect.\n\n✨ A promise you can wear.`,
    headline: `For the not-yet seasons — His timing is never late.`,
    ugc_script: `I've been in a waiting season for a while now. And I won't lie — it's been one of the hardest things I've ever done.\n\nI got this {product_name} with {verse_reference} on it — "{verse_text}" — and I wear it as a daily act of trust. Like, I'm choosing to believe that God's timing is better than mine even when I can't see it.\n\nIf you're waiting for something — a relationship, a job, a healing, a breakthrough — this is for you. Daily Devotion Co., link in bio.`,
    voiceover_script: `Waiting is not wasted time.\n\nIt is sacred time.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — for the waiting seasons when you choose to trust God's timing over your own.\n\nWear the wait. Daily Devotion Co.`,
    product_description: `For the waiting seasons — when the breakthrough feels overdue and trust feels thin — this {product_name} is a daily declaration of surrender. Engraved with {verse_reference}: "{verse_text}" — a reminder that God's timing is always perfect, even when it doesn't feel that way. Worn by women who are trusting in the not-yet.\n\n✨ A promise you can wear.`,
    hooks: [
      `For the girl who has been praying for the same thing for years.`,
      `Waiting on God doesn't mean God forgot you.`,
      `The thing that's getting me through this waiting season.`,
      `In the in-between seasons — wear this.`,
      `"{verse_text}" — the verse for every waiting season.`,
      `She waited. She trusted. She wore this the whole time.`,
      `Waiting is not wasted. Wear the reminder.`,
      `For anyone who feels like their breakthrough is overdue.`,
      `Trust doesn't always feel like certainty. Sometimes it looks like this.`,
      `God's timing is perfect — even when yours feels overdue.`,
    ],
    ctas: [
      `Wear your trust through the wait. Shop Daily Devotion Co.`,
      `His timing is perfect. Wear the reminder. Shop now.`,
      `Tap the link. Let faith carry you through the not-yet.`,
      `Order now — free shipping over $35.`,
      `Find your verse. Trust the process.`,
      `Shop Daily Devotion Co. — for the seasons of sacred waiting.`,
      `Click the link. His timing is never late.`,
      `Order for yourself or someone trusting God's timing.`,
      `Shop now. Wear the waiting well.`,
      `Give someone in a waiting season a reminder to trust.`,
    ],
  },

  "Encouragement for loved one": {
    primary_text: `You know someone who needs to hear this today.\n\nNot tomorrow. Today.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is the kind of gift that says more than words can. It says: I see what you're carrying. I love you. And I want you to know that God's promises are true for you too.\n\nSend someone a promise they can wear.\n\n✨ A promise you can wear.`,
    headline: `Send the one you love a reminder that God's got them.`,
    ugc_script: `I got this {product_name} for my best friend because she's been going through something really hard and I just wanted her to have something tangible to hold onto.\n\nIt has {verse_reference} on it — "{verse_text}" — and when I gave it to her she just started crying.\n\nShe said it was exactly what she needed to hear.\n\nIf you have someone in your life who needs encouragement right now — this is the gift. Daily Devotion Co., link in bio.`,
    voiceover_script: `There's someone in your life who needs to know they're not alone.\n\nGive them a promise they can wear.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} from Daily Devotion Co. — the most meaningful gift you can give someone who needs to feel God's love today.\n\nShop Daily Devotion Co.`,
    product_description: `For the person in your life who needs encouragement — this {product_name} says it better than words. Engraved with {verse_reference}: "{verse_text}" — it's a wearable reminder of God's love and presence, given from your hands to theirs. The perfect gift for the person you want to encourage, support, and remind that they are deeply loved.\n\n✨ A promise you can wear.`,
    hooks: [
      `Someone in your life needs to hear this today.`,
      `The gift that made her cry happy tears.`,
      `You know exactly who you're going to send this to.`,
      `For the person who's been carrying too much for too long.`,
      `What if you could send someone God's word wrapped in gold?`,
      `She needed encouragement. I got her this. She hasn't taken it off.`,
      `The most meaningful gift I've ever given — and it took 2 minutes to order.`,
      `For the friend who keeps showing up for everyone else.`,
      `Tag someone who needs to read {verse_reference} today.`,
      `Give the one you love a promise they can wear every day.`,
    ],
    ctas: [
      `Send someone you love a promise they can wear. Shop now.`,
      `Shop Daily Devotion Co. — gifts that speak faith.`,
      `Tap the link. Someone needs this today.`,
      `Order now — ships fast. Free shipping over $35.`,
      `Give the gift of God's promises. Shop the link.`,
      `Click to order. Make someone's day.`,
      `Shop now. Be the encouragement someone is praying for.`,
      `Order for the person who deserves to feel loved today.`,
      `Shop Daily Devotion Co. — a promise for the people you love.`,
      `Give them something to hold onto. Shop the link.`,
    ],
  },

  "Daily reminder of God's promise": {
    primary_text: `God's promises don't have expiration dates.\n\nThey were true yesterday. They are true today. They will be true tomorrow.\n\n"{verse_text}" — {verse_reference}\n\nThe {product_name} from Daily Devotion Co. is your daily reminder to return to what's true. In the rush of the morning, the chaos of the afternoon, the quiet of the evening — look down and remember: His promises stand.\n\n✨ A promise you can wear.`,
    headline: `His promises don't expire. Wear the reminder.`,
    ugc_script: `Can I show you something I wear every single day?\n\nIt's this {product_name} from Daily Devotion Co. and it has {verse_reference} on it — "{verse_text}"\n\nAnd I've made it part of my daily routine. I put it on and I declare that verse over myself. Over my day. Over whatever I'm walking into.\n\nGod's promises are for us every day — not just when we feel it. This is how I keep that truth in front of me. Link in bio.`,
    voiceover_script: `His promises are for today.\n\nNot someday. Today.\n\n"{verse_text}"\n\n{verse_reference}\n\nThe {product_name} — your daily reminder that every promise God made, He will keep.\n\nWear the word. Daily Devotion Co.`,
    product_description: `God's promises are for every day — not just the mountaintop moments. This {product_name} is a daily reminder to return to what's true. Engraved with {verse_reference}: "{verse_text}" — wear it as a declaration that His word is alive and active in your life, today and every day.\n\n✨ A promise you can wear.`,
    hooks: [
      `God's promises don't have an expiration date.`,
      `The one thing I put on every morning before anything else.`,
      `What if you started every day anchored in God's word?`,
      `This verse has carried me through more than I can explain.`,
      `Daily devotion isn't just a practice — it's a promise.`,
      `She wears her faith every single day. Here's how.`,
      `"{verse_text}" — the promise I need every morning.`,
      `What does it look like to live in God's promises daily?`,
      `Make His promises part of your daily routine.`,
      `For the woman who wants to walk in faith — every single day.`,
    ],
    ctas: [
      `Wear His promises every day. Shop Daily Devotion Co.`,
      `Make faith part of your daily routine. Shop the link.`,
      `Tap the link. Wear the word.`,
      `Order now — free shipping over $35.`,
      `Find your daily promise. Shop Daily Devotion Co.`,
      `Click the link. Wear His word every day.`,
      `Shop now. Start every morning with faith.`,
      `Your daily reminder is waiting. Order now.`,
      `Shop Daily Devotion Co. — a promise for every day.`,
      `Order today. Wear His promises tomorrow.`,
    ],
  },
};

export function generateCreativeSet(
  verse: { reference: string; text: string },
  product: { name: string },
  angleName: string
): Omit<CreativeOutput, 'landing_page' | 'ecommerce_page'> {
  const vars: Vars = {
    verse_text: verse.text,
    verse_reference: verse.reference,
    product_name: product.name,
  };

  const template = angleTemplates[angleName] ?? angleTemplates["Faith reminder"];

  return {
    primary_text: fill(template.primary_text, vars),
    headline: fill(template.headline, vars),
    ugc_script: fill(template.ugc_script, vars),
    voiceover_script: fill(template.voiceover_script, vars),
    product_description: fill(template.product_description, vars),
    hooks: template.hooks.map((h) => fill(h, vars)),
    ctas: template.ctas.map((c) => fill(c, vars)),
  };
}
