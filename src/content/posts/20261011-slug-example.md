---
title: 파일명과 URL 예시
description: 파일명 앞에 날짜를 붙여 정렬하고, URL은 날짜 없이 쓰는 방법
pubDatetime: 2026-10-11T01:00:00+09:00
category: 예시/URL
tags:
  - slug
---

글의 URL은 파일명으로 정해집니다. 파일명 앞에 날짜를 붙이면 에디터의 파일 목록이 날짜순으로 정렬되고, URL에서는 그 날짜가 빠집니다.

## 파일명 → URL

이 글의 파일명은 `20261011-slug-example.md`이고, URL은 `/posts/slug-example/`입니다.

| 파일명                        | URL                       |
| ----------------------------- | ------------------------- |
| `20261011-slug-example.md`    | `/posts/slug-example/`    |
| `2026-10-11-slug-example.md`  | `/posts/slug-example/`    |
| `slug-example.md`             | `/posts/slug-example/`    |
| `20261011-My Post.md`         | `/posts/my-post/`         |
| `개발/20261011-astro-tips.md` | `/posts/개발/astro-tips/` |

- 날짜는 `YYYYMMDD-` 또는 `YYYY-MM-DD-` 형식으로 맨 앞에 붙입니다. 날짜 뒤의 `-`까지 빠지고, 다른 형식(`2024-2025-회고.md` 등)은 그대로 남습니다.
- 나머지 부분은 소문자로 바뀌고, 공백은 `-`가 되며, 대부분의 기호는 빠집니다.
- 폴더 안에 넣으면 폴더 이름도 URL에 들어갑니다. `_`로 시작하는 폴더는 URL에서 빠집니다.
- 파일명의 날짜는 파일 정렬용입니다. 글에 표시되는 날짜와 사이트의 글 순서는 frontmatter의 `pubDatetime`(수정일 `modDatetime`이 있으면 그 값)을 따릅니다.
- `title`과 `category`는 URL에 영향을 주지 않습니다.

## URL 직접 정하기

frontmatter에 `slug`를 적으면 파일명과 상관없이 그 값이 URL이 됩니다.

```md
---
title: Astro 블로그 이전기
slug: moving-to-astro
---
```

파일명이 `20261011-이전기.md`여도 URL은 `/posts/moving-to-astro/`입니다. 폴더 안에 있으면 폴더 이름은 그대로 붙으므로, 폴더가 다르면 같은 `slug`를 써도 됩니다.

- 영문 소문자, 숫자, 한글, `-`만 쓸 수 있습니다. 대문자나 공백, `/`가 들어가면 빌드 에러가 납니다.
- `slug`는 적힌 그대로 쓰이므로 날짜로 시작해도 빠지지 않습니다.

## 주의할 점

- **두 글이 같은 URL이 되면 빌드 에러가 납니다.** `draft` 글도 포함합니다. 예를 들어 `20261011-til.md`와 `20261012-til.md`, `_2025/20251011-til.md`는 모두 `/posts/til/`이 됩니다. 파일명을 바꾸거나 한쪽에 `slug`를 적어 주세요. dev 서버에서는 글 페이지를 열 때 같은 에러가 보입니다.
- **게시한 뒤에는 URL을 바꾸지 마세요.** 파일명의 날짜 뒷부분이나 `slug`를 바꾸면 URL이 바뀌어 기존 링크와 댓글 연결이 끊깁니다. 날짜 접두사만 붙이거나 바꾸는 건 URL에 영향이 없습니다.
