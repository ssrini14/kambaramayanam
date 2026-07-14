import { describe, it, expect } from 'vitest';
import { resolveLinks } from './links';

const target = {
  id: 'valmiki-5-1-1',
  data: { citation: 'Sundara Kandam 1.1', sourceUrl: 'https://x', translation: 't', status: 'published' },
};
const lookup = (collection: string, id: string) =>
  collection === 'valmiki' && id === 'valmiki-5-1-1' ? target : undefined;

describe('resolveLinks', () => {
  it('resolves a valid link and attaches label + target', () => {
    const [r] = resolveLinks(
      [{ category: 'valmiki', targetId: 'valmiki-5-1-1', citation: 'VR 5.1.1', reason: 'same scene' }],
      lookup,
    );
    expect(r.found).toBe(true);
    expect(r.label).toBe('Valmiki Ramayana');
    expect(r.target?.id).toBe('valmiki-5-1-1');
  });

  it('marks an unresolved link as not found', () => {
    const [r] = resolveLinks(
      [{ category: 'valmiki', targetId: 'missing', citation: 'x', reason: 'y' }],
      lookup,
    );
    expect(r.found).toBe(false);
    expect(r.target).toBeUndefined();
  });

  it('returns an empty array when links is undefined', () => {
    expect(resolveLinks(undefined, lookup)).toEqual([]);
  });
});
