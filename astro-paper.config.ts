import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.techbara.dev",
    title: "Tech Blog",
    description: "A minimal, responsive and SEO-friendly Astro blog theme.",
    author: "Junbeom Cho",
    profile: "https://github.com/junbeom-cho",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/junbeom-cho/astro-paper" },
    { name: "wiki",     url: "https://wiki.techbara.dev", linkTitle: "Wiki" },
    { name: "linkedin", url: "https://www.linkedin.com/in/%EC%A4%80%EB%B2%94-%EC%A1%B0-13927b419/" },
    { name: "mail",     url: "mailto:dev.junbeom@gmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});