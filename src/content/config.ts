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

const images = defineCollection({
  type: 'data',
  schema: z.object({
    caption: z.string(),
    scene: z.string(),
    tool: z.string(),
    prompt: z.string(),
    license: z.string(),
    status,
    file: z.string(),
  }),
});

export const collections = {
  verses,
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
};
