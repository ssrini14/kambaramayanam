import { describe, it, expect } from 'vitest';
import { CATEGORIES, CATEGORY_COLLECTION, CATEGORY_LABEL } from './categories';

describe('category registry', () => {
  it('defines all nine cross-reference categories', () => {
    expect(CATEGORIES).toEqual([
      'valmiki', 'desikan', 'prabandham', 'gita',
      'upanishad', 'purana', 'annamacharya', 'thyagaraja', 'commentary',
    ]);
  });

  it('maps every category to a collection name and a label', () => {
    for (const c of CATEGORIES) {
      expect(CATEGORY_COLLECTION[c]).toBeTruthy();
      expect(CATEGORY_LABEL[c]).toBeTruthy();
    }
  });

  it('pluralizes the upanishad collection name', () => {
    expect(CATEGORY_COLLECTION.upanishad).toBe('upanishads');
  });
});
