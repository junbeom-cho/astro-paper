# astro-paper

[AstroPaper](https://github.com/satnaing/astro-paper) 테마를 기반으로 한 개인 블로그입니다. [Astro](https://astro.build/) 7과 Tailwind CSS로 만들었습니다.

## 실행 방법

[mise](https://mise.jdx.dev/)로 Node 24와 pnpm을 맞춘 뒤 실행합니다.

```bash
mise install    # Node 24, pnpm 설치
pnpm install    # 의존성 설치
pnpm dev        # 개발 서버 (http://localhost:4321)
```

| 명령어         | 설명                                          |
| -------------- | --------------------------------------------- |
| `pnpm dev`     | 개발 서버 실행                                |
| `pnpm build`   | 타입 검사 + 빌드 + 검색 인덱스 생성 (`dist/`) |
| `pnpm preview` | 빌드 결과 미리보기                            |
| `pnpm lint`    | ESLint 검사                                   |
| `pnpm format`  | Prettier 포맷 적용                            |

글은 `src/content/posts/`에 마크다운 파일로 추가합니다.

## License

MIT. AstroPaper © Sat Naing.
