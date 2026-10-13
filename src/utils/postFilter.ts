import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - In production, excludes drafts
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin
 * - In dev, shows every post (drafts and scheduled ones too) to make authoring easier
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return import.meta.env.DEV || (!data.draft && isPublishTimePassed);
}
