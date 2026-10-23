import type { CollectionEntry } from "astro:content";
import config from "@/config";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type CategoryNode = {
  /** URL slug of this level, e.g. "astro" */
  slug: string;
  /** Label as written in frontmatter, e.g. "Astro" */
  name: string;
  /** Emoji or SVG name from categoryIcons, see getCategoryIcon */
  icon?: string;
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

// Keyed by path like the tree, so "개발/Astro" and "개발/astro" both match
const categoryIcons = new Map(
  Object.entries(config.categoryIcons).map(([category, icon]) => [
    getCategoryPath(parseCategory(category)),
    icon,
  ])
);

/**
 * Icon for the category these levels name: its own from `categoryIcons`,
 * else its parent's. Undefined when neither has one.
 */
export function getCategoryIcon(levels: CategoryLevel[]) {
  for (let depth = levels.length; depth > 0; depth--) {
    const icon = categoryIcons.get(getCategoryPath(levels.slice(0, depth)));
    if (icon) return icon;
  }
}

/**
 * Builds the two-level category tree with post counts, sorted by slug.
 * Drafts and scheduled posts are excluded via `postFilter()`.
 */
export function getCategoryTree(posts: CollectionEntry<"posts">[]) {
  const tree: CategoryNode[] = [];

  const count = (nodes: CategoryNode[], levels: CategoryLevel[]) => {
    const { slug, name } = levels[levels.length - 1];
    let node = nodes.find(n => n.slug === slug);
    if (!node) {
      const icon = getCategoryIcon(levels);
      nodes.push((node = { slug, name, icon, count: 0, children: [] }));
    }
    node.count++;
    return node;
  };

  for (const { data } of posts.filter(postFilter)) {
    const levels = parseCategory(data.category);
    const node = count(tree, levels.slice(0, 1));
    if (levels.length > 1) count(node.children, levels);
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
