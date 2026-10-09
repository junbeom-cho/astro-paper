---
title: 카테고리 예시
description: frontmatter의 category로 글을 큰 분류에 넣는 방법
pubDatetime: 2026-10-09T17:00:00+09:00
category: 예시
tags:
  - category
---

글 하나는 카테고리 하나에 속합니다. 태그는 여러 개 달 수 있는 세부 분류이고, 카테고리는 글이 속한 큰 분류입니다.

## 쓰는 법

frontmatter에 `category`를 적습니다.

```md
---
title: 글 제목
category: 개발
tags:
  - astro
  - css
---
```

- 이 글은 `category: 예시`로 **예시** 카테고리에 들어 있습니다. 제목 아래 날짜 옆의 카테고리 이름을 누르면 같은 카테고리의 글 목록으로 이동합니다.
- `category`를 적지 않은 글은 **기타** 카테고리에 들어갑니다.
- 카테고리 이름은 한글도 됩니다. 주소는 `/categories/개발/`처럼 만들어집니다.

## 보이는 곳

- 상단 메뉴의 **Categories**: 모든 카테고리와 카테고리별 글 수
- 카테고리 페이지: 그 카테고리에 속한 글 목록 (글이 많으면 페이지로 나뉨)
- 글 상단: 날짜 옆에 카테고리 이름
