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

## 자신의 도메인으로 적용하기

이 저장소를 자신의 도메인에서 쓸 때 바꿀 곳입니다. 아래의 `blog.example.com`, `<user>/<repo>`, `/path/to/astro-paper`는 각각 자신의 도메인, GitHub 저장소, 서버에 clone한 경로로 바꿔 읽습니다.

| 파일                                                   | 바꿀 내용                                                                                                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `astro-paper.config.ts`                                | `site.url`을 `https://blog.example.com`으로. 제목·설명·작성자(`title`, `description`, `author`, `profile`)와 `socials`도 자신의 것으로                                      |
| `giscus.json`                                          | `origins`를 `https://blog.example.com`으로. giscus는 여기 적힌 사이트에서만 이 저장소의 댓글을 보여 줌                                                                      |
| `src/pages/posts/[...slug]/_components/Comments.astro` | giscus 설정(`repo`, `repoId`, `category`, `categoryId`)을 자신의 저장소 것으로. 저장소에 giscus 앱을 설치하고 Discussions를 켠 뒤 [giscus.app](https://giscus.app)에서 받음 |
| `src/layouts/Layout.astro`                             | Umami 방문 통계. 스크립트 주소와 `websiteId`는 자신의 Umami 것으로, `domains`는 `blog.example.com`으로. 쓰지 않으면 Umami를 넣는 `<script is:inline>` 블록을 지움           |
| `src/content/pages/about.md`, `src/content/posts/`     | About 페이지와 글                                                                                                                                                           |
| `deploy/Caddyfile`                                     | `host`를 `blog.example.com`으로, `root`(두 곳)를 사이트 폴더 경로로 ([배포](#배포) 참고)                                                                                    |
| `deploy/deploy.sh`                                     | 맨 위의 `LIVE`, `CADDY_SNIPPET`을 서버에 맞게 ([배포](#배포) 참고)                                                                                                          |

## 배포

서버에서 빌드하고, 서버의 Caddy가 결과물을 정적 파일로 서빙합니다. 배포에 쓰는 파일은 `deploy/`에 있습니다.

| 파일                                   | 설명                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`deploy/deploy.sh`](deploy/deploy.sh) | 서버 배포. 최신 커밋을 받아 빌드하고, 검사를 통과하면 사이트 폴더(`LIVE`)를 `dist/`와 똑같이 맞춤 |
| [`deploy/cron.sh`](deploy/cron.sh)     | cron용. 아직 배포하지 않은 커밋이 있으면 `deploy.sh`로 배포하고 `deploy/logs/`에 기록             |
| [`deploy/Caddyfile`](deploy/Caddyfile) | 서버 Caddy 설정(`CADDY_SNIPPET`)의 사본 (캐시, 404). 서버 설정과 다르면 배포 때 경고              |

`deploy/deploy.sh` 맨 위의 두 경로는 서버에 맞게 바꿉니다.

- `LIVE`: Caddy가 서빙하는 사이트 폴더입니다. 배포는 root가 아닌 본인 계정으로 하므로 본인 계정이 쓸 수 있어야 합니다. `deploy/Caddyfile`의 `root`에는 Caddy가 보는 이 폴더의 경로를 적습니다. 기본값은 Docker로 띄운 Caddy에 `/data/caddy/site`를 `/srv`로 마운트한 경우라서 `LIVE`는 `/data/caddy/site/blog`, `root`는 `/srv/blog`입니다. Caddy를 서버에 바로 설치했다면 둘이 같습니다.
- `CADDY_SNIPPET`: 서버 Caddy가 불러오는 `deploy/Caddyfile` 사본의 경로입니다. 배포할 때마다 두 파일을 비교해, 없거나 다르면 경고합니다 (배포는 계속함).

처음 한 번:

1. 도메인과 서버 경로를 바꿔 커밋 ([자신의 도메인으로 적용하기](#자신의-도메인으로-적용하기))
2. 서버에 저장소를 clone하고 `mise install`
3. 도메인의 DNS(A 레코드)를 서버 공인 IP로 연결
4. `deploy/Caddyfile`을 `CADDY_SNIPPET` 경로에 복사하고, 서버 Caddy 설정의 사이트 블록에서 불러옴 (아래 예시)
5. 첫 배포: `deploy/deploy.sh`
6. Caddy 설정을 반영: `docker exec caddy caddy reload --config /etc/caddy/Caddyfile` (Docker가 아니면 `sudo systemctl reload caddy`)

`deploy/Caddyfile`은 사이트 블록 안에 넣는 조각입니다. 404 응답에도 보안 헤더를 붙이려고 `import security`를 쓰므로 `(security)` snippet이 함께 있어야 합니다. HTTPS 인증서는 Caddy가 자동으로 받습니다. 예를 들어 `CADDY_SNIPPET`이 Caddy 설정 폴더의 `conf.d/astro-paper.caddy`라면 서버 Caddy 설정은 이렇습니다.

```caddyfile
(security) {
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}
}

blog.example.com {
	import security
	import conf.d/astro-paper.caddy
}
```

직접 배포할 때는 서버의 저장소 폴더에서 실행합니다. 둘 다 먼저 `git pull --ff-only`로 최신 커밋을 받습니다.

```bash
deploy/deploy.sh            # 빌드·검사 후 사이트 교체
deploy/deploy.sh --dry-run  # 빌드·검사까지만 (사이트는 그대로)
```

`dist/`에 없는 파일은 사이트에서도 지워지므로, 사이트에 둘 파일은 `public/`에 넣습니다. 빌드는 `dist/`를 비우고 다시 만들기 때문에, 빌드 중에도 사이트가 끊기지 않도록 Caddy는 `dist/`가 아닌 복사본을 서빙합니다. 같은 이유로 이 폴더의 빌드가 배포와 겹치면 안 되는데, cron이 언제든 배포할 수 있으므로 직접 빌드할 때는 `flock /tmp/astro-paper-deploy.lock pnpm build`처럼 배포 잠금을 잡고 실행합니다.

Caddy 설정을 바꿀 때는 `deploy/Caddyfile`과 서버의 `CADDY_SNIPPET`을 똑같이 고친 뒤 Caddy를 reload해 반영합니다.

CI([`.github/workflows/ci.yml`](.github/workflows/ci.yml))는 `main` push와 PR마다 `deploy/deploy.sh --ci`(설치·타입 검사·빌드·검사), `pnpm run lint`, `pnpm run format:check`를 실행합니다.

### 자동 배포

cron이 5분마다 [`deploy/cron.sh`](deploy/cron.sh)를 실행합니다. origin에 새 커밋이 있거나 서버에서 한 커밋이 아직 배포되지 않았으면 `deploy/deploy.sh`로 배포합니다. 배포할 게 없을 때도 실행할 때마다 결과를 `deploy/logs/deploy-<날짜>.log`에 한 줄씩 남깁니다 ([배포 기록](#배포-기록) 참고).

- `main` 브랜치를 체크아웃하고 있을 때만 배포합니다.
- 커밋하지 않은 변경(새 파일 포함)이 있으면 그것까지 사이트에 올라가므로, 작업 트리가 깨끗해질 때까지 배포를 미룹니다. 쓰는 중인 글은 `draft: true`로 커밋해 두면 배포를 막지 않습니다.
- 배포에 실패한 커밋은 1시간마다 다시 시도합니다. 새 커밋 없이 원인을 고쳤다면(예: 네트워크 문제, 서버 커밋을 버리고 origin에 맞춤) `deploy/deploy.sh`를 직접 실행하면 바로 배포됩니다.
- origin을 force-push해 커밋을 되돌렸다면(예: 잘못 올린 글 지우기) 서버 저장소에 남은 옛 커밋 때문에 사이트가 그대로이므로, 서버에서 `git reset --hard origin/main && deploy/deploy.sh`로 맞춥니다.

crontab(root가 아닌 본인 계정에서 `crontab -e`):

```
*/5 * * * * /path/to/astro-paper/deploy/cron.sh
```

cron에는 SSH 에이전트가 없어서, origin은 HTTPS로 받고 push만 SSH로 합니다 (public 저장소라 받을 때는 인증이 필요 없음).

```bash
git remote set-url origin https://github.com/<user>/<repo>.git
git remote set-url --push origin git@github.com:<user>/<repo>.git
```

### 배포 기록

`cron.sh`와 `deploy.sh`는 `deploy/logs/`(git에서 제외)에 다음 파일을 남깁니다.

| 파일                              | 내용                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `deploy-<날짜>.log`               | `cron.sh`의 기록. 실행할 때마다(5분마다) 결과를 한 줄씩 쓰고, 날마다 새 파일(예: `deploy-2026-10-16.log`)에 씀. 2주가 지난 파일은 `cron.sh`가 지움           |
| `builds/<날짜>_<시각>_<커밋>.log` | `cron.sh`가 배포할 때 돌린 `deploy.sh`의 전체 출력(`git pull`, 설치, 빌드). 배포를 시도할 때마다 하나씩 생기고, 2주가 지난 파일은 `cron.sh`가 지움           |
| `deployed-commit`                 | 사이트에 마지막으로 올린 커밋. `deploy.sh`가 사이트를 교체할 때마다 씀 (직접 실행 포함). `cron.sh`는 배포할 커밋이 이것과 같으면 `변화없음`만 남김           |
| `failed-commit`                   | 배포에 실패한 커밋. 같은 커밋은 이 파일이 쓰이고 1시간이 지난 뒤에 다시 시도하며, `cron.sh`가 배포에 성공하면 지움. 직접 지우면 다음 실행에서 바로 다시 시도 |

`deploy-<날짜>.log`의 줄은 `<시각> <결과>` 형식입니다. `<시각>`은 `cron.sh`가 시작한 시각(`2026-10-16 09:15:01` 형식)이고, 커밋은 앞 7자리입니다.

| 결과                                                               | 뜻                                                                                                                                                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `변화없음 (<커밋>)`                                                | 배포할 새 커밋이 없음. 괄호 안은 사이트에 올라가 있는 커밋                                                                                                                                        |
| `pull 및 빌드 성공: <커밋> → <커밋>, <N> pages, <초>초`            | 배포 성공 (사이트에 있던 커밋 → 새로 올린 커밋, 첫 배포면 새 커밋만). `<N>`은 사이트의 HTML 파일 수                                                                                               |
| `pull 및 빌드 실패: <커밋> → <커밋> (exit <코드>, <초>초): <원인>` | 배포 실패. 사이트는 그대로. `<원인>`은 빌드 오류(Astro·`astro check`·pnpm), 없으면 `deploy.sh`가 막은 이유(`✗` 줄), 그것도 없으면 출력의 마지막 줄. 전체 출력은 같은 시각의 `builds/` 파일에 있음 |
| `⚠ <경고>`                                                         | `deploy.sh`가 남긴 경고(예: `deploy/Caddyfile`이 서버 Caddy 설정과 다름). 결과 줄 바로 아래에 같은 시각으로 붙고, 배포는 계속됨                                                                   |
| `재시도 대기: <커밋> 배포 실패 (1시간마다 다시 시도)`              | 실패한 커밋을 다시 시도할 때까지 기다리는 중                                                                                                                                                      |
| `배포 미룸: 커밋하지 않은 변경이 있음 (<커밋>)`                    | 작업 트리가 깨끗해질 때까지 미룸                                                                                                                                                                  |
| `건너뜀: 다른 배포가 실행 중`                                      | 다른 배포(또는 배포 잠금을 잡은 빌드)가 돌고 있음. 실패로 치지 않고 다음 실행에서 다시 시도                                                                                                       |
| `건너뜀: <브랜치> 체크아웃 중 (배포는 main에서만)`                 | 기본 브랜치가 아닌 브랜치를 체크아웃하고 있어 배포하지 않음                                                                                                                                       |
| `fetch 실패: <오류>`                                               | origin에서 받지 못함. 실패하는 동안 실행할 때마다 남김                                                                                                                                            |
| `origin 기본 브랜치를 알 수 없음 (…)`                              | `origin/HEAD`가 없고 다시 만들지도 못함. 네트워크를 확인하고 `git remote set-head origin -a`                                                                                                      |

```bash
tail -n 30 deploy/logs/deploy-$(date +%F).log              # 오늘 기록
grep -h "실패:" deploy/logs/deploy-*.log                   # 실패한 실행만 모아 보기
ls -t deploy/logs/builds | head -n 3                       # 최근 배포 출력 파일
git log -1 --oneline "$(cat deploy/logs/deployed-commit)"  # 사이트에 올라간 커밋
```

## License

MIT. AstroPaper © Sat Naing.
