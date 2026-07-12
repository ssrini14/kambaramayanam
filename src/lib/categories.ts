export const CATEGORIES = [
  'valmiki', 'desikan', 'prabandham', 'gita',
  'upanishad', 'purana', 'annamacharya', 'thyagaraja', 'commentary',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLLECTION: Record<Category, string> = {
  valmiki: 'valmiki',
  desikan: 'desikan',
  prabandham: 'prabandham',
  gita: 'gita',
  upanishad: 'upanishads',
  purana: 'purana',
  annamacharya: 'annamacharya',
  thyagaraja: 'thyagaraja',
  commentary: 'commentaries',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  valmiki: 'Valmiki Ramayana',
  desikan: 'Swami Desikan',
  prabandham: 'Divya Prabandham',
  gita: 'Bhagavad Gita',
  upanishad: 'Upanishads',
  purana: 'Vishnu Purana / Bhagavatam',
  annamacharya: 'Annamacharya Kirtanas',
  thyagaraja: 'Thyagaraja Kirtanas',
  commentary: 'Traditional Commentaries',
};
