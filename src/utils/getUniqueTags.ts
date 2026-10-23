import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
  /** Number of posts with this tag */
  count: number;
};

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]) {
  const tags = new Map<string, Tag>();
  for (const tagName of posts.filter(postFilter).flatMap(p => p.data.tags)) {
    const tag = slugifyStr(tagName);
    const entry = tags.get(tag);
    if (entry) entry.count++;
    else tags.set(tag, { tag, tagName, count: 1 });
  }
  return [...tags.values()].sort((tagA, tagB) =>
    tagA.tag.localeCompare(tagB.tag)
  );
}
