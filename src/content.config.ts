import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${BLOG_PATH}`,
    // The file path, so every file is its own entry. Astro's default would use
    // the frontmatter `slug`, and two posts sharing one would overwrite each
    // other. URLs come from getPostPaths, not from the id.
    generateId: ({ entry }) => entry,
  }),
  schema: ({ image }) =>
    z.object({
      // Overrides the URL slug that otherwise comes from the filename
      slug: z
        .string()
        .regex(
          /^[a-z0-9가-힣]+(-[a-z0-9가-힣]+)*$/,
          "slug may only contain lowercase letters, digits, Hangul and single hyphens"
        )
        .optional(),
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      // One category per post, up to 2 levels: "개발" or "개발/Astro".
      // Posts without one go to "기타".
      category: z
        .string()
        .default("기타")
        .refine(
          value => /^[^/]+(\/[^/]+)?$/.test(value.trim()),
          'category must be "Parent" or "Parent/Child"'
        ),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
