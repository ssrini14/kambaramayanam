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
