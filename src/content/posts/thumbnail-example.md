---
title: 썸네일 예시
description: frontmatter의 ogImage가 글 목록 카드의 썸네일과 SNS 공유 이미지로 함께 쓰이는 모습
pubDatetime: 2026-10-09T18:00:00+09:00
category: 예시
ogImage: ../../assets/images/thumbnail-example.png
tags:
  - thumbnail
---

글 목록(홈, Archives, 태그·카테고리 페이지)의 카드 오른쪽에 썸네일이 보입니다. 이 글의 카드에 보이는 이미지가 썸네일입니다.

## 쓰는 법

frontmatter에 `ogImage`로 이미지를 지정합니다. 경로는 글 파일 기준 상대 경로입니다.

```md
---
title: 글 제목
ogImage: ../../assets/images/cover.png
---
```

- 같은 이미지가 SNS 공유 이미지(OG 이미지)로도 쓰입니다.
- `src/assets/images/`에 넣은 이미지는 빌드할 때 썸네일 크기로 줄이고 webp로 바꿔서 가볍게 내보냅니다.
- 1200×630처럼 가로가 긴 이미지가 잘 맞습니다. 비율이 다르면 가운데를 기준으로 잘립니다.
- `ogImage`를 지정하지 않은 글은 썸네일 없이 글 정보만 보이고, 공유 이미지는 제목으로 자동 생성됩니다.
