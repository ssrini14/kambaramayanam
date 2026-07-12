import { CATEGORY_COLLECTION, CATEGORY_LABEL, type Category } from './categories';

export type SourceEntry = {
  id: string;
  data: {
    citation: string;
    sourceUrl?: string;
    translation?: string;
    textExcerpt?: string;
    status: string;
  };
};

export type LinkInput = {
  category: Category;
  targetId: string;
  citation: string;
  reason: string;
};

export type ResolvedLink = {
  category: Category;
  label: string;
  citation: string;
  reason: string;
  targetId: string;
  found: boolean;
  target?: SourceEntry;
};

export function resolveLinks(
  links: LinkInput[] | undefined,
  lookup: (collection: string, id: string) => SourceEntry | undefined,
): ResolvedLink[] {
  if (!links) return [];
  return links.map((l) => {
    const target = lookup(CATEGORY_COLLECTION[l.category], l.targetId);
    return {
      category: l.category,
      label: CATEGORY_LABEL[l.category],
      citation: l.citation,
      reason: l.reason,
      targetId: l.targetId,
      found: Boolean(target),
      target,
    };
  });
}
