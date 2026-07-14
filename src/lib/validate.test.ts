import { describe, it, expect } from 'vitest';
import {
  findBrokenLinks,
  assertLinksResolve,
  findBrokenWorkRefs,
  assertWorkRefsResolve,
  findBrokenImageRefs,
  assertImageRefsResolve,
} from './validate';

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

// ── Finding 1: work reference integrity ──────────────────────────────────────

const sources = [
  { id: 'src-good', data: { work: 'existing-work' } },
  { id: 'src-bad', data: { work: 'missing-work' } },
];
const workExists = (workId: string) => workId === 'existing-work';

describe('work-reference integrity', () => {
  it('returns only sources whose work does not exist', () => {
    const broken = findBrokenWorkRefs(sources, workExists);
    expect(broken).toEqual([{ sourceId: 'src-bad', work: 'missing-work' }]);
  });

  it('returns empty array when all works exist', () => {
    expect(findBrokenWorkRefs([sources[0]], workExists)).toEqual([]);
  });

  it('throws listing each offending sourceId -> work:<value>', () => {
    expect(() => assertWorkRefsResolve(sources, workExists)).toThrow(
      /src-bad.*work:missing-work/s,
    );
  });

  it('does not throw when everything resolves', () => {
    expect(() => assertWorkRefsResolve([sources[0]], workExists)).not.toThrow();
  });
});

// ── Finding 2: image reference + file integrity ───────────────────────────────

const versesWithImages = [
  { id: 'verse-ok',       data: { image: 'good-image' } },
  { id: 'verse-no-img',  data: { image: 'no-such-image' } },
  { id: 'verse-no-file', data: { image: 'img-missing-file' } },
  { id: 'verse-none',    data: {} },
];
const imageFileMap: Record<string, string> = {
  'good-image': 'good.png',
  'img-missing-file': 'missing.png',
};
const imageExists = (id: string) => id in imageFileMap;
const getImageFile = (id: string) => imageFileMap[id];
const fileExists = (name: string) => name === 'good.png';

describe('image-reference integrity', () => {
  it('reports missing image record', () => {
    const broken = findBrokenImageRefs(versesWithImages, imageExists, getImageFile, fileExists);
    expect(broken).toContainEqual({ verseId: 'verse-no-img', kind: 'image', ref: 'no-such-image' });
  });

  it('reports missing file when record exists but file absent', () => {
    const broken = findBrokenImageRefs(versesWithImages, imageExists, getImageFile, fileExists);
    expect(broken).toContainEqual({ verseId: 'verse-no-file', kind: 'file', ref: 'missing.png' });
  });

  it('does not report verses without an image field', () => {
    const broken = findBrokenImageRefs(versesWithImages, imageExists, getImageFile, fileExists);
    expect(broken.map((b) => b.verseId)).not.toContain('verse-none');
  });

  it('does not report fully-resolved image refs', () => {
    const broken = findBrokenImageRefs(versesWithImages, imageExists, getImageFile, fileExists);
    expect(broken.map((b) => b.verseId)).not.toContain('verse-ok');
  });

  it('throws listing image errors with verseId -> image:<value>', () => {
    expect(() => assertImageRefsResolve(versesWithImages, imageExists, getImageFile, fileExists))
      .toThrow(/verse-no-img.*image:no-such-image/s);
  });

  it('throws listing file errors with verseId -> file:<name>', () => {
    expect(() => assertImageRefsResolve(versesWithImages, imageExists, getImageFile, fileExists))
      .toThrow(/verse-no-file.*file:missing\.png/s);
  });

  it('does not throw when everything resolves', () => {
    expect(() =>
      assertImageRefsResolve([versesWithImages[0]], imageExists, getImageFile, fileExists),
    ).not.toThrow();
  });
});
