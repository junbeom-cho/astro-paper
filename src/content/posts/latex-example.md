---
title: LaTeX 수식 예시
description: 마크다운에서 KaTeX로 그리는 LaTeX 수식 모음
pubDatetime: 2026-10-08T18:00:00+09:00
category: 예시
tags:
  - latex
---

달러 기호로 감싸면 LaTeX 수식으로 그려집니다. 빌드할 때 HTML로 변환되므로 JavaScript 없이도 보입니다.

```md
인라인 수식 $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 인라인 수식

문장 중간에 `$...$`로 씁니다. 질량-에너지 등가식 $E = mc^2$, 근의 공식 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, 오일러 등식 $e^{i\pi} + 1 = 0$.

## 블록 수식

`$$...$$`로 감싸면 가운데 정렬된 블록으로 그려집니다.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}
$$

## 여러 줄 정렬 (aligned)

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\left(\mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}\right)
\end{aligned}
$$

## 행렬

$$
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix},
\quad
\det(A) = a_{11}a_{22} - a_{12}a_{21}
$$

## 경우 나누기 (cases)

$$
|x| = \begin{cases}
x & \text{if } x \geq 0 \\
-x & \text{if } x < 0
\end{cases}
$$

## math 코드블록

` ```math ` 코드블록도 블록 수식으로 그려집니다.

```math
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
```

## 기호

- 그리스 문자: $\alpha$, $\beta$, $\gamma$, $\pi$, $\Omega$
- 연산자: $\sum$, $\prod$, $\int$, $\partial$, $\nabla$
- 관계: $\leq$, $\geq$, $\approx$, $\neq$, $\propto$
- 논리: $\forall$, $\exists$, $\neg$, $\wedge$, $\vee$

## 긴 수식

화면보다 긴 수식은 가로로 스크롤됩니다.

$$
f(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3 + a_4 x^4 + a_5 x^5 + a_6 x^6 + a_7 x^7 + a_8 x^8 + a_9 x^9 + a_{10} x^{10}
$$

## 달러 기호를 그대로 쓰려면

한 문단에 `$`가 두 번 나오면 그 사이가 수식이 됩니다. 가격처럼 기호를 그대로 쓰려면 `\$`로 씁니다: \$5에서 \$10으로 올랐다.
