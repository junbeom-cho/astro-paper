---
title: Mermaid 다이어그램 예시
description: 마크다운 코드블록 하나로 그리는 Mermaid 다이어그램 모음
pubDatetime: 2026-10-08T10:00:00+09:00
category: 예시
tags:
  - mermaid
---

코드블록 언어를 `mermaid`로 지정하면 다이어그램으로 그려집니다. 테마를 바꾸면 다이어그램 색도 같이 바뀝니다.

````md
```mermaid
flowchart LR
  A[글 작성] --> B{빌드}
```
````

## 순서도 (flowchart)

```mermaid
flowchart LR
  A[글 작성] --> B{빌드}
  B -->|성공| C[배포]
  B -->|실패| D[수정]
  D --> A
```

## 시퀀스 다이어그램 (sequence)

```mermaid
sequenceDiagram
  participant U as 사용자
  participant B as 브라우저
  participant S as 서버
  U->>B: 글 클릭
  B->>S: GET /posts/mermaid-example/
  S-->>B: HTML
  B->>B: mermaid 로드 후 렌더링
  B-->>U: 다이어그램 표시
```

## 클래스 다이어그램 (class)

```mermaid
classDiagram
  class Post {
    +string title
    +Date pubDatetime
    +string[] tags
    +render()
  }
  class Tag {
    +string name
  }
  Post "1" --> "*" Tag
```

## 상태 다이어그램 (state)

```mermaid
stateDiagram-v2
  [*] --> 초안
  초안 --> 예약: pubDatetime 미래
  초안 --> 게시: draft false
  예약 --> 게시: 시간 도래
  게시 --> [*]
```

## ER 다이어그램 (entity relationship)

```mermaid
erDiagram
  AUTHOR ||--o{ POST : writes
  POST }o--o{ TAG : has
  POST {
    string title
    date pubDatetime
  }
```

## 간트 차트 (gantt)

```mermaid
gantt
  title 블로그 준비
  dateFormat YYYY-MM-DD
  section 설정
  템플릿 정리     :done, a1, 2026-10-08, 1d
  Mermaid 추가    :done, a2, after a1, 1d
  section 콘텐츠
  첫 글 작성      :active, b1, after a2, 3d
  배포            :b2, after b1, 1d
```

## 파이 차트 (pie)

```mermaid
pie title 글 주제 비율
  "개발" : 50
  "회고" : 30
  "기타" : 20
```

## Git 그래프 (gitGraph)

```mermaid
gitGraph
  commit id: "init"
  branch feature
  checkout feature
  commit id: "mermaid"
  checkout main
  merge feature
  commit id: "first post"
```

## 문법 오류일 때

다이어그램 문법이 틀리면 빈칸 대신 원문이 그대로 보입니다.

```mermaid
flowchart LR
  A -->
```
