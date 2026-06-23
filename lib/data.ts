import type { Product, Verse, CreativeAngle } from './types'

export const SEED_PRODUCTS: Omit<Product, 'created_at'>[] = [
  {
    id: 'prod-1',
    name: 'Original Bible Verse Bracelet',
    slug: 'original-bible-verse-bracelet',
    description: 'A beautiful bracelet engraved with your chosen Bible verse — a wearable reminder of God\'s promises.',
  },
  {
    id: 'prod-2',
    name: 'Silver Edition Bible Verse Bracelet',
    slug: 'silver-edition-bible-verse-bracelet',
    description: 'Premium sterling silver bracelet engraved with your chosen Bible verse — faith meets elegance.',
  },
  {
    id: 'prod-3',
    name: 'Bible Verse Necklace',
    slug: 'bible-verse-necklace',
    description: 'A delicate necklace engraved with your chosen Bible verse — wear your faith close to your heart.',
  },
  {
    id: 'prod-4',
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
  { id: 'angle-1', name: 'Anxiety / Fear', description: 'For those struggling with worry, fear, or anxiety' },
  { id: 'angle-2', name: 'Gift', description: 'Buying as a meaningful gift for someone special' },
  { id: 'angle-3', name: 'Faith Reminder', description: 'A daily reminder to stay grounded in faith' },
  { id: 'angle-4', name: 'Breakup / Healing', description: 'For those healing from a relationship or loss' },
  { id: 'angle-5', name: 'Motivation', description: 'Inspiring action and perseverance through faith' },
  { id: 'angle-6', name: 'Feeling Alone', description: 'For those who feel isolated or unseen' },
  { id: 'angle-7', name: 'Hard Season', description: 'For those going through a difficult time in life' },
  { id: 'angle-8', name: 'Waiting Season', description: 'For those waiting on God\'s timing and promises' },
  { id: 'angle-9', name: 'Encouragement for Loved One', description: 'Gifting hope and love to someone you care about' },
  { id: 'angle-10', name: 'Daily Reminder of God\'s Promise', description: 'Wearing a constant reminder of God\'s faithfulness' },
]
