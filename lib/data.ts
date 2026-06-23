import type { Product, Verse, CreativeAngle } from './types'

export const SEED_PRODUCTS: Omit<Product, 'created_at'>[] = [
  {
    id: 'product-1',
    name: 'Original Bible Verse Bracelet',
    slug: 'original-bible-verse-bracelet',
    description: 'A beautiful bracelet engraved with your chosen Bible verse — a wearable reminder of God\'s promises.',
  },
  {
    id: 'product-2',
    name: 'Silver Edition Bible Verse Bracelet',
    slug: 'silver-edition-bible-verse-bracelet',
    description: 'Premium sterling silver bracelet engraved with your chosen Bible verse — faith meets elegance.',
  },
  {
    id: 'product-3',
    name: 'Bible Verse Necklace',
    slug: 'bible-verse-necklace',
    description: 'A delicate necklace engraved with your chosen Bible verse — wear your faith close to your heart.',
  },
  {
    id: 'product-4',
    name: 'Daily Verse Jar',
    slug: 'daily-verse-jar',
    description: 'A charming jar filled with 52 Bible verses — one for every week of the year, to inspire daily devotion.',
  },
]

export const SEED_VERSES: Omit<Verse, 'created_at'>[] = [
  {
    id: 'verse-1',
    reference: 'Isaiah 41:10',
    text: 'Do not fear, for I am with you',
  },
  {
    id: 'verse-2',
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ who strengthens me',
  },
  {
    id: 'verse-3',
    reference: 'Luke 1:37',
    text: 'For with God nothing will be impossible',
  },
  {
    id: 'verse-4',
    reference: 'Matthew 19:26',
    text: 'With God all things are possible',
  },
  {
    id: 'verse-5',
    reference: 'Isaiah 60:22',
    text: 'When the time is right, I, the Lord, will make it happen',
  },
]

export const SEED_ANGLES: Omit<CreativeAngle, 'created_at'>[] = [
  { id: 'angle-1', name: 'Overthinking', description: 'Para sa mga taong hindi mapanatag ang isip, laging nag-aala-ala' },
  { id: 'angle-2', name: 'Silent Struggle', description: 'Para sa mga nagsasabing okay lang sila pero hindi talaga' },
  { id: 'angle-3', name: 'Fear', description: 'Para sa mga may takot na hindi nila masabi sa kahit sino' },
  { id: 'angle-4', name: 'Waiting Season', description: 'Para sa mga naghihintay sa timing ng Diyos at pakiramdam ay walang nangyayari' },
  { id: 'angle-5', name: 'Nothing Is Impossible', description: 'Para sa mga may pangarap na sinasabing imposible ng iba' },
  { id: 'angle-6', name: 'Gift For Someone', description: 'Para sa mga gustong magbigay ng meaningful na regalo sa taong espesyal' },
  { id: 'angle-7', name: 'Burnout', description: 'Para sa mga pagod na pagod na — sa trabaho, sa buhay, sa lahat' },
  { id: 'angle-8', name: 'Not Alone', description: 'Para sa mga pakiramdam na nag-iisa kahit nasa gitna ng mga tao' },
  { id: 'angle-9', name: 'Let Go And Trust', description: 'Para sa mga naghahold-on sa bagay na kailangan na nilang pakawalan' },
  { id: 'angle-10', name: 'Daily Reminder', description: 'Para sa mga kailangan ng pisikal na paalala ng pangako ng Diyos araw-araw' },
]
