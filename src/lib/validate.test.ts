import { describe, it, expect } from 'vitest';
import { findBrokenLinks, assertLinksResolve } from './validate';

const verses = [
  { id: 'v1', data: { links: [{ category: 'valmiki', targetId: 'ok', citation: 'c', reason: 'r' }] } },
  { id: 'v2', data: { links: [{ category: 'desikan', targetId: 'nope', citation: 'c', reason: 'r' }] } },
];
const exists = (collection: string, id: string) => collection === 'valmiki' && id === 'ok';

describe('cross-reference integrity', () => {
  it('lists only the broken links', () => {
    const broken = findBrokenLinks(verses as any, exists);
    expect(broken).toEqual([{ verseId: 'v2', category: 'desikan', targetId: 'nope' }]);
  });

  it('throws with the broken reference in the message', () => {
    expect(() => assertLinksResolve(verses as any, exists)).toThrow(/v2.*desikan.*nope/s);
  });

  it('does not throw when everything resolves', () => {
    expect(() => assertLinksResolve([verses[0]] as any, exists)).not.toThrow();
  });
});
