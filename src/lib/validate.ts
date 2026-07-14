import { CATEGORY_COLLECTION, type Category } from './categories';
import type { LinkInput } from './links';

export type VerseLike = { id: string; data: { links?: LinkInput[] } };

export function findBrokenLinks(
  verses: VerseLike[],
  exists: (collection: string, id: string) => boolean,
): { verseId: string; category: string; targetId: string }[] {
  const broken: { verseId: string; category: string; targetId: string }[] = [];
  for (const v of verses) {
    for (const l of v.data.links ?? []) {
      const collection = CATEGORY_COLLECTION[l.category as Category];
      if (!exists(collection, l.targetId)) {
        broken.push({ verseId: v.id, category: l.category, targetId: l.targetId });
      }
    }
  }
  return broken;
}

export function assertLinksResolve(
  verses: VerseLike[],
  exists: (collection: string, id: string) => boolean,
): void {
  const broken = findBrokenLinks(verses, exists);
  if (broken.length > 0) {
    const lines = broken.map((b) => `  - verse "${b.verseId}" -> ${b.category}:${b.targetId}`);
    throw new Error(`Broken cross-references (build aborted):\n${lines.join('\n')}`);
  }
}

// ── Finding 1: work reference integrity ──────────────────────────────────────

export type SourceLike = { id: string; data: { work: string } };

export function findBrokenWorkRefs(
  sources: SourceLike[],
  workExists: (workId: string) => boolean,
): { sourceId: string; work: string }[] {
  return sources
    .filter((s) => !workExists(s.data.work))
    .map((s) => ({ sourceId: s.id, work: s.data.work }));
}

export function assertWorkRefsResolve(
  sources: SourceLike[],
  workExists: (workId: string) => boolean,
): void {
  const broken = findBrokenWorkRefs(sources, workExists);
  if (broken.length > 0) {
    const lines = broken.map((b) => `  - source "${b.sourceId}" -> work:${b.work}`);
    throw new Error(`Broken work references (build aborted):\n${lines.join('\n')}`);
  }
}

// ── Finding 2: image reference + file integrity ───────────────────────────────

export type VerseLikeWithImage = { id: string; data: { image?: string } };

export function findBrokenImageRefs(
  verses: VerseLikeWithImage[],
  imageExists: (imageId: string) => boolean,
  getImageFile: (imageId: string) => string | undefined,
  fileExists: (fileName: string) => boolean,
): { verseId: string; kind: 'image' | 'file'; ref: string }[] {
  const broken: { verseId: string; kind: 'image' | 'file'; ref: string }[] = [];
  for (const v of verses) {
    const imageId = v.data.image;
    if (!imageId) continue;
    if (!imageExists(imageId)) {
      broken.push({ verseId: v.id, kind: 'image', ref: imageId });
    } else {
      const fileName = getImageFile(imageId);
      if (fileName && !fileExists(fileName)) {
        broken.push({ verseId: v.id, kind: 'file', ref: fileName });
      }
    }
  }
  return broken;
}

export function assertImageRefsResolve(
  verses: VerseLikeWithImage[],
  imageExists: (imageId: string) => boolean,
  getImageFile: (imageId: string) => string | undefined,
  fileExists: (fileName: string) => boolean,
): void {
  const broken = findBrokenImageRefs(verses, imageExists, getImageFile, fileExists);
  if (broken.length > 0) {
    const lines = broken.map((b) => `  - verse "${b.verseId}" -> ${b.kind}:${b.ref}`);
    throw new Error(`Broken image references (build aborted):\n${lines.join('\n')}`);
  }
}
