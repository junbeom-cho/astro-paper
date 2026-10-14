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

## 배포

서버에서 빌드하고, 서버의 Caddy가 결과물을 정적 파일로 서빙합니다.

처음 한 번:

1. 서버에 저장소를 clone하고 `mise install`
2. [`Caddyfile`](Caddyfile)의 사이트 블록을 서버 Caddy 설정에 붙여넣거나 `import`한 뒤 `caddy reload`
3. `blog.techbara.dev` DNS를 서버로 연결 (HTTPS 인증서는 Caddy가 자동 발급)

배포할 때마다 저장소 폴더에서:

```bash
git pull
pnpm install --frozen-lockfile
pnpm build
rsync -a --delete dist/ /srv/blog/
```

빌드는 `dist/`를 비우고 다시 만들기 때문에, 빌드 중에도 사이트가 끊기지 않도록 Caddy는 `dist/`가 아닌 복사본(`/srv/blog`)을 서빙합니다.

## License

MIT. AstroPaper © Sat Naing.
