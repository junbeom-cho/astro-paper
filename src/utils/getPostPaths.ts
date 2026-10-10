import type { CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { slug as githubSlug } from "github-slugger";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

type PostRef = Pick<CollectionEntry<"posts">, "id" | "filePath"> & {
  data: Pick<CollectionEntry<"posts">["data"], "slug">;
};

// "20261011-my-post" or "2026-10-11-my-post": the date only sorts files
const DATE_PREFIX = /^(?:\d{8}|\d{4}-\d{2}-\d{2})-(?=.)/;

/**
 * Folders (minus `_`-prefixed ones) followed by the frontmatter `slug`, or
 * else the filename without its date prefix.
 * e.g. `개발/20261011-My Post.md` → `개발/my-post`
 */
function getPostSlugPath({ id, filePath, data }: PostRef): string {
  const segments = (filePath?.replace(BLOG_PATH, "") ?? id)
    .split("/")
    .filter(segment => segment !== "");
  const fileName = (segments.pop() ?? "").replace(/\.[^.]+$/, "");
  const folders = segments
    .filter(segment => !segment.startsWith("_"))
    .map(segment => slugifyStr(segment));
  const slug =
    data.slug ??
    (githubSlug(fileName.replace(DATE_PREFIX, "")) || githubSlug(fileName));
  return [...folders, slug].join("/");
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(post: PostRef): string {
  return `/${getPostSlugPath(post)}`;
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Applies both locale routing and the configured Astro base via
 * `getRelativeLocaleUrl`.
 * e.g. `/posts/my-post` or `/en/posts/my-post`
 */
export function getPostUrl(
  post: PostRef,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `posts/${getPostSlugPath(post)}`);
}

/**
 * Throws if two posts, drafts included, resolve to the same URL. Otherwise
 * the build keeps one of them and every link to the other opens the wrong post.
 */
export function assertUniquePostSlugs(posts: PostRef[]) {
  const owners = new Map<string, string>();
  for (const post of posts) {
    const slug = getPostSlug(post);
    const owner = owners.get(slug);
    if (owner) {
      throw new Error(
        `"${owner}" and "${post.filePath ?? post.id}" both resolve to /posts${slug}/. Rename one of them or set a different \`slug\` in its frontmatter.`
      );
    }
    owners.set(slug, post.filePath ?? post.id);
  }
}
