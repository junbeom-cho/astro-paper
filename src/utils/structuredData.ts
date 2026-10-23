import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/**
 * JSON-LD nodes shared across pages, linked by @id: the author is the Person
 * on the About page and the site is the WebSite on the home page.
 */
export function getSchemaRefs(
  site: URL | undefined,
  locale: string = config.site.lang
) {
  const homeUrl = new URL(getRelativeLocaleUrl(locale, ""), site).href;
  const aboutUrl = new URL(getRelativeLocaleUrl(locale, "about"), site).href;

  return {
    homeUrl,
    aboutUrl,
    websiteId: `${homeUrl}#website`,
    author: {
      "@type": "Person",
      "@id": `${aboutUrl}#person`,
      name: config.site.author,
      url: aboutUrl,
      ...(config.site.profile && { sameAs: [config.site.profile] }),
    },
  };
}
