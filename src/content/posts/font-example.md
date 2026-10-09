---
title: 폰트 예시
description: 본문은 Pretendard, 코드는 JetBrains Mono로 보이는 모습
pubDatetime: 2026-10-09T17:00:00+09:00
tags:
  - font
---

본문은 **Pretendard**, 코드는 **JetBrains Mono**로 표시됩니다. 두 폰트 모두 기기와 상관없이 같은 모양으로 보입니다.

## 본문 (Pretendard)

한글과 English가 섞인 문장도 높이와 굵기가 고르게 맞습니다. Astro 7에서 LaTeX와 Mermaid를 쓰는 방법을 정리했습니다.

- 보통 굵기: 다람쥐 헌 쳇바퀴에 타고파. The quick brown fox jumps over the lazy dog.
- **굵게: 다람쥐 헌 쳇바퀴에 타고파. The quick brown fox jumps over the lazy dog.**
- _기울임: 한글은 기울임 글꼴이 없어 브라우저가 기울여 그립니다._
- 숫자: 0123456789, 1,234,567원, 2026년 10월 9일

## 인라인 코드

문장 안에서 `const answer = 42;`처럼 쓰는 코드는 JetBrains Mono로 보입니다.

## 코드블록 (JetBrains Mono)

```ts
// 한글 주석은 Pretendard로 대신 표시됩니다
function greet(name: string): string {
  return `안녕하세요, ${name}님!`;
}

const isSame = a === b && c !== d; // 기호가 합쳐지지 않고 그대로 보입니다
const add = (x: number) => x + 1;
```

### 헷갈리기 쉬운 글자

```txt
0O o  1lI|  rn m  {} [] ()  ;:  ,.  '"`
```

JetBrains Mono는 숫자 `0`과 영문 `O`, 숫자 `1`과 소문자 `l`, 대문자 `I`가 확실히 구분됩니다.

### 리거처 꺼짐

`=>`, `!=`, `===`, `>=`, `<=`, `->` 같은 기호를 하나로 합쳐 보여주는 리거처는 꺼 두었습니다. 독자가 코드를 보이는 그대로 따라 칠 수 있습니다.
