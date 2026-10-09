import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type CategoryNode = {
  /** URL slug of this level, e.g. "astro" */
  slug: string;
  /** Label as written in frontmatter, e.g. "Astro" */
  name: string;
  /** Posts in this category, including its subcategories */
  count: number;
  children: CategoryNode[];
};

type CategoryLevel = { slug: string; name: string };

/** "개발/Astro" → [{ slug: "개발", name: "개발" }, { slug: "astro", name: "Astro" }] */
export function parseCategory(category: string): CategoryLevel[] {
  return category.split("/").map(part => {
    const name = part.trim();
    return { slug: slugifyStr(name), name };
  });
}

/** URL path below /categories/, e.g. "개발/astro" */
export function getCategoryPath(levels: CategoryLevel[]): string {
  return levels.map(({ slug }) => slug).join("/");
}

/**
 * Builds the two-level category tree with post counts, sorted by slug.
 * Drafts and scheduled posts are excluded via `postFilter()`.
 */
export function getCategoryTree(posts: CollectionEntry<"posts">[]) {
  const tree: CategoryNode[] = [];

  const count = (nodes: CategoryNode[], { slug, name }: CategoryLevel) => {
    let node = nodes.find(n => n.slug === slug);
    if (!node) nodes.push((node = { slug, name, count: 0, children: [] }));
    node.count++;
    return node;
  };

  for (const { data } of posts.filter(postFilter)) {
    const [parent, child] = parseCategory(data.category);
    const node = count(tree, parent);
    if (child) count(node.children, child);
  }

  const bySlug = (a: CategoryNode, b: CategoryNode) =>
    a.slug.localeCompare(b.slug);
  tree.sort(bySlug).forEach(node => node.children.sort(bySlug));
  return tree;
}

/** Posts whose category starts with the given levels (parent includes children). */
export function getPostsInCategory(
  posts: CollectionEntry<"posts">[],
  levels: string[]
) {
  return posts.filter(({ data }) => {
    const slugs = parseCategory(data.category).map(({ slug }) => slug);
    return levels.every((slug, i) => slugs[i] === slug);
  });
}
