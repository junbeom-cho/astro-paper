---
title: 댓글 예시
description: 글 하단의 giscus 댓글이 GitHub Discussions에 저장되는 방식
pubDatetime: 2026-10-10T03:30:00+09:00
category: 예시
tags:
  - comments
---

모든 글 하단에 댓글 영역이 있습니다. 이 글 맨 아래에서 직접 댓글을 남겨 볼 수 있습니다.

## 동작 방식

- [giscus](https://giscus.app)를 사용합니다. 댓글은 블로그 저장소의 GitHub Discussions에 저장됩니다.
- 댓글을 남기려면 GitHub로 로그인해야 합니다. 글에 반응(이모지)만 남길 수도 있습니다.
- 글마다 첫 댓글이 달릴 때 `Commnets` 카테고리에 글 주소(`/posts/comments-example/` 같은 pathname) 이름의 Discussion이 자동으로 생깁니다.
- 사이트에서 다크/라이트 테마를 바꾸면 댓글 영역도 같은 테마로 바뀝니다.
- 스크롤해서 댓글 영역에 가까워질 때 불러옵니다.

## 관리

- 댓글 수정, 삭제, 숨기기는 저장소의 Discussions 탭에서 합니다.
- 새 댓글 알림은 저장소의 Watch → Custom → Discussions로 받습니다.

## 주의

- 댓글은 글 **주소** 기준으로 연결됩니다. 글 제목은 바꿔도 되지만, 파일 이름을 바꾸면 주소가 달라져 기존 댓글과 연결이 끊깁니다.
- 설정값(저장소, 카테고리 ID 등)은 `src/pages/posts/[...slug]/_components/Comments.astro`에 있습니다.
