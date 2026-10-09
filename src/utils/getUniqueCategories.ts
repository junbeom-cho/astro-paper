import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  category: string;
  categoryName: string;
  count: number;
};

/**
 * Builds a sorted category list with post counts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `category` is the slug used in URLs; `categoryName` is the label to display
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories = new Map<string, Category>();
  for (const { data } of posts.filter(postFilter)) {
    const category = slugifyStr(data.category);
    const entry = categories.get(category);
    if (entry) entry.count++;
    else
      categories.set(category, {
        category,
        categoryName: data.category,
        count: 1,
      });
  }
  return [...categories.values()].sort((a, b) =>
    a.category.localeCompare(b.category)
  );
}
