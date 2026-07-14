import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../lib/categories';

const status = z.enum(['draft', 'verified', 'published']);

const link = z.object({
  category: z.enum(CATEGORIES),
  targetId: z.string(),
  citation: z.string(),
  reason: z.string(),
});

const verses = defineCollection({
  type: 'content',
  schema: z.object({
    kandam: z.string(),
    padalam: z.string(),
    verseNumber: z.number().int().positive(),
    tamil: z.string(),
    transliteration: z.string(),
    translationEnglish: z.string(),
    wordByWord: z.array(z.object({ word: z.string(), meaning: z.string() })).optional(),
    literaryAnalysis: z.string().optional(),
    kambanContribution: z
      .object({
        expands: z.string().optional(),
        changes: z.string().optional(),
        poeticDevices: z.string().optional(),
      })
      .optional(),
    links: z.array(link).optional(),
    insights: z
      .object({
        theological: z.string().optional(),
        literary: z.string().optional(),
        philosophical: z.string().optional(),
      })
      .optional(),
    media: z
      .array(
        z.object({
          type: z.enum(['youtube', 'spotify', 'audio']),
          url: z.string().url(),
          label: z.string(),
        }),
      )
      .optional(),
    image: z.string().optional(),
    status,
    verifiedBy: z.string().optional(),
    verifiedOn: z.string().optional(),
    sources: z.array(z.string()).optional(),
  }),
});

const sourceSchema = z.object({
  work: z.string(),
  citation: z.string(),
  textExcerpt: z.string().optional(),
  transliteration: z.string().optional(),
  translation: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  license: z.string(),
  status,
});

const sourceCollection = () => defineCollection({ type: 'content', schema: sourceSchema });

const works = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    tradition: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Per-kandam overview/summary record. `slug` must match a kaandam name in
// src/lib/structure.ts. Canonical reference counts (Valmiki sargas/slokas,
// canonical padalam/pasuram totals) are OPTIONAL — populate only when verified
// against a printed edition; the page shows "pending verification" otherwise.
// Live counts (padalams/pasurams present so far) are computed from content, not
// stored here. Key-verse links point into verse pages / source records.
const kandams = defineCollection({
  type: 'content',
  schema: z.object({
    key: z.string(), // must match a kaandam name in src/lib/structure.ts
    name: z.string(),
    tamil: z.string(),
    order: z.number().int().positive(),
    image: z.string().optional(), // id of a record in `images` (header art)
    intro: z.string().optional(),
    // Canonical reference figures — only when verified. `source` cites where from.
    reference: z
      .object({
        kambanPadalams: z.number().int().nonnegative().optional(),
        kambanPasurams: z.number().int().nonnegative().optional(),
        valmikiSargas: z.number().int().nonnegative().optional(),
        valmikiSlokas: z.number().int().nonnegative().optional(),
        source: z.string().optional(),
      })
      .optional(),
    // Highlighted Kamban pasurams (link to verse pages) and Valmiki slokas.
    keyPasurams: z
      .array(
        z.object({
          verseId: z.string(), // id of a record in `verses` (links to /verse/<id>)
          note: z.string(),
        }),
      )
      .optional(),
    keySlokas: z
      .array(
        z.object({
          citation: z.string(),
          sourceId: z.string().optional(), // id in `valmiki` collection, if present
          sourceUrl: z.string().url().optional(), // deep-link to valmikiramayan.net
          note: z.string(),
        }),
      )
      .optional(),
    status,
  }),
});

const images = defineCollection({
  type: 'data',
  schema: z.object({
    caption: z.string(),
    scene: z.string(),
    tool: z.string(),
    prompt: z.string(),
    license: z.string(),
    // For licensed third-party photos (e.g. Creative Commons): TASL attribution.
    // Required to display a proper credit line. Leave unset for our own AI art.
    attribution: z
      .object({
        author: z.string(),          // photographer / creator
        sourceUrl: z.string().url(), // page the image came from (e.g. Wikimedia file page)
        licenseName: z.string(),     // e.g. "CC BY-SA 4.0"
        licenseUrl: z.string().url().optional(),
      })
      .optional(),
    status,
    file: z.string(),
    touchupNote: z.string().optional(), // manual-correction reminder (e.g. Ravana head/arm count)
  }),
});

// Śrīmad Rāmāyaṇa Sarvasvam — Srimad Uttamur Veeraraghavachariar Swamy's commentary
// on the Sankshepa Ramayana (the 101 slokas of Valmiki Bala Kanda Sarga 1). Each sloka
// record carries the 12 study layers. Commentary/philosophical text must come from his
// book (never reconstructed); the Kamba Ramayanam connection is this project's own
// contribution. Cross-refs reuse the verse `links` shape.
const sarvasvam = defineCollection({
  type: 'content',
  schema: z.object({
    number: z.number().int().positive(), // sloka number 1..101
    part: z.string(),                     // e.g. "The Ideal Person", "Bala Kanda"
    kandamSlug: z.string().optional(),     // kandam this sloka's episode maps to
    sanskrit: z.string(),
    transliteration: z.string(),
    padaccheda: z.string().optional(),     // word separation
    anvaya: z.string().optional(),         // prose order
    grammar: z.string().optional(),        // vibhakti / samasa / dhatu / lakara notes
    literalTranslation: z.string().optional(),
    translation: z.string().optional(),    // elegant English
    commentary: z.string().optional(),     // Uttamur Swamy's commentary (from his book)
    philosophicalNotes: z.string().optional(), // Vishishtadvaita: tattva / hita / purushartha
    literaryNotes: z.string().optional(),  // alankara / meter / poetic beauty
    summary: z.string().optional(),        // modern reader's one-paragraph takeaway
    // The project's unique contribution: the corresponding Kamba Ramayanam verse(s).
    // Each id points to a record in `verses`; the page links to the rich /verse/<id> page.
    kambanVerses: z.array(z.object({ verseId: z.string(), note: z.string().optional() })).optional(),
    links: z.array(link).optional(),       // other scriptural refs (Valmiki, Desika, Gita, ...)
    status,
    sources: z.array(z.string()).optional(),
  }),
});

export const collections = {
  verses,
  sarvasvam,
  valmiki: sourceCollection(),
  desikan: sourceCollection(),
  prabandham: sourceCollection(),
  gita: sourceCollection(),
  upanishads: sourceCollection(),
  purana: sourceCollection(),
  annamacharya: sourceCollection(),
  thyagaraja: sourceCollection(),
  commentaries: sourceCollection(),
  works,
  images,
  kandams,
};
