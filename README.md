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

서버에서 빌드하고, 서버의 Caddy(Docker 컨테이너)가 결과물을 정적 파일로 서빙합니다. 배포에 쓰는 파일은 `deploy/`에 있습니다.

| 파일                                   | 설명                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [`deploy/deploy.sh`](deploy/deploy.sh) | 서버 배포. 최신 커밋을 받아 빌드하고, 검사를 통과하면 `/data/caddy/site/blog`(Caddy 컨테이너의 `/srv/blog`)를 `dist/`와 똑같이 맞춤 |
| [`deploy/Caddyfile`](deploy/Caddyfile) | 서버 Caddy의 blog 설정(homelab `docker/caddy/conf/conf.d/18-astro-paper.caddy`) 사본 (캐시, 404). 서버 설정과 다르면 배포 때 경고   |

처음 한 번:

1. 서버에 저장소를 clone하고 `mise install`
2. `blog.techbara.dev` DNS를 서버 공인 IP로 연결 (HTTPS는 Caddy의 `*.techbara.dev` 와일드카드 인증서로 처리)
3. 첫 배포: `deploy/deploy.sh`
4. homelab의 Caddy 설정을 반영: `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`

배포할 때마다 서버의 저장소 폴더에서 실행합니다. 둘 다 먼저 `git pull --ff-only`로 최신 커밋을 받습니다.

```bash
deploy/deploy.sh            # 빌드·검사 후 사이트 교체
deploy/deploy.sh --dry-run  # 빌드·검사까지만 (사이트는 그대로)
```

`dist/`에 없는 파일은 사이트에서도 지워지므로, 사이트에 둘 파일은 `public/`에 넣습니다. 빌드는 `dist/`를 비우고 다시 만들기 때문에, 빌드 중에도 사이트가 끊기지 않도록 Caddy는 `dist/`가 아닌 복사본을 서빙합니다. 같은 이유로 배포하는 동안에는 이 폴더에서 `pnpm build`를 따로 실행하지 않습니다.

Caddy 설정을 바꿀 때는 `deploy/Caddyfile`과 homelab의 `conf.d/18-astro-paper.caddy`를 똑같이 고친 뒤 `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`로 반영합니다.

CI([`.github/workflows/ci.yml`](.github/workflows/ci.yml))는 `main` push와 PR마다 `deploy/deploy.sh --ci`(설치·타입 검사·빌드·검사), `pnpm run lint`, `pnpm run format:check`를 실행합니다.

## License

MIT. AstroPaper © Sat Naing.
