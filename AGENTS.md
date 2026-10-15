## Language

항상 한국어로 답한다. 코드, 명령어, 파일 경로, 커밋 메시지 접두사 같은 기술 용어는 원문 그대로 둔다.

## 기능 추가

마크다운 문법, 플러그인 같은 기능을 추가하면 사용법을 보여주는 예시 글을 `src/content/posts/<YYYYMMDD>-<기능>-example.md`로 함께 만든다. 날짜는 글의 `pubDatetime`과 같게 한다. 예: `20261001-mermaid-example.md`.

예시 글은 frontmatter를 다른 예시 글과 같은 항목·순서로 적고, `category: 예시`(또는 `예시/<하위 카테고리>`)와 `draft: true`를 넣는다. draft 글은 `pnpm dev`에서만 보이고 배포 빌드(`pnpm build`)에서는 빠지므로, 예시 글이 배포 사이트에 올라가지 않는다.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
