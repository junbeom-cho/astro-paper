---
title: 카테고리 아이콘 예시
description: 카테고리마다 이모지나 SVG 아이콘을 붙이는 방법
pubDatetime: 2026-10-24T09:00:00+09:00
modDatetime:
timezone: Asia/Seoul
category: 예시/카테고리
tags:
  - category-icon
featured: false
draft: true
ogImage:
---

카테고리마다 아이콘을 정할 수 있습니다. 아이콘은 카테고리가 보이는 곳마다 이름 앞에 함께 나옵니다.

## 쓰는 법

`astro-paper.config.ts`의 `categoryIcons`에 적습니다. 키는 frontmatter의 `category`와 같은 형식입니다.

```ts
categoryIcons: {
  "개발":       "💻",
  "개발/Astro": "astro",
  "회고":       "🌱",
},
```

- 값이 이모지면 그 이모지를 씁니다.
- 값이 `astro`처럼 영문·숫자·`-`로 된 이름이면 `src/assets/icons/categories/astro.svg` 파일을 씁니다. 파일이 없으면 빌드 에러가 납니다.
- 하위 카테고리에 아이콘이 없으면 상위 카테고리의 아이콘을 씁니다. 둘 다 없으면 폴더 아이콘이 나옵니다.

이 글은 `category: 예시/카테고리`라서 🗂️가 붙습니다. 같은 **예시** 아래의 **URL** 카테고리는 SVG 파일 `link.svg`를 씁니다.

## SVG 아이콘

기술 로고는 [Simple Icons](https://simpleicons.org/)에서 SVG를 받아 `src/assets/icons/categories/`에 넣으면 됩니다. 파일 이름(확장자 빼고)이 설정에 적을 값입니다.

- 색이 지정되지 않은 단색 SVG는 글자색을 따라가서 라이트·다크 모드 모두에서 보입니다. Simple Icons에서 받은 기본 SVG가 이 경우입니다.
- 색이 들어 있는 SVG는 그 색을 그대로 씁니다. 검은색처럼 어두운 로고는 다크 모드에서 잘 안 보일 수 있습니다.

## 보이는 곳

- 홈의 **Categories** 상자: 상위·하위 카테고리 이름, 글 목록의 각 줄
- 글 목록 카드: 날짜와 읽는 시간 옆
- 글 상단: 카테고리 이름 앞
- 메뉴의 **Categories**와 카테고리 페이지 제목
