import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.techbara.dev",
    title: "Techbara Blog",
    description: "개발자 조준범이 일하며 부딪힌 문제와 해결 과정, 회고를 기록하는 기술 블로그",
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
    { name: "github",   url: "https://github.com/junbeom-cho" },
    { name: "wiki",     url: "https://wiki.techbara.dev", linkTitle: "Wiki" },
    { name: "status",   url: "https://kuma.techbara.dev/status/blog", linkTitle: "Service status" },
    { name: "linkedin", url: "https://www.linkedin.com/in/%EC%A4%80%EB%B2%94-%EC%A1%B0-13927b419/" },
    { name: "mail",     url: "mailto:dev.junbeom@gmail.com" },
  ],
  shareLinks: [
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=", linkTitle: "Share this post on LinkedIn" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});