#!/usr/bin/env bash
# 서버 배포: 최신 커밋을 받아 빌드하고, 검사를 통과하면 Caddy가 서빙하는 폴더를 교체한다
# 사용법: deploy/deploy.sh [--dry-run | --ci]   (--dry-run: 교체하지 않음, --ci: pull 없이 빌드·검사만)
set -euo pipefail

LIVE=/data/caddy/site/blog
CADDY_SNIPPET=/home/techbara/homelab/docker/caddy/conf/conf.d/18-astro-paper.caddy

case "$#:${1-}" in
  0:) mode=deploy ;;
  1:--dry-run) mode=dry-run ;;
  1:--ci) mode=ci ;;
  *)
    echo "사용법: deploy/deploy.sh [--dry-run | --ci]" >&2
    exit 2
    ;;
esac

# root로 돌리면 root 소유 파일이 남아 다음 배포가 실패한다
if [[ $EUID -eq 0 ]]; then
  echo "✗ root가 아닌 본인 계정으로 실행하세요" >&2
  exit 1
fi

cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.."

# 동시에 돌면(이 폴더에서 따로 돌린 pnpm build 포함) 한쪽이 다른 쪽의 빌드 결과를 지워 rsync가 사이트 파일을 지울 수 있다
exec 9>/tmp/astro-paper-deploy.lock
if ! flock -n 9; then
  echo "✗ 다른 배포가 실행 중입니다" >&2
  exit 75 # cron.sh는 다음 실행에서 다시 시도한다
fi

# pull로 바뀐 이 스크립트를 이번 실행부터 쓰도록 다시 실행한다
if [[ $mode != ci && ${DEPLOY_PULLED:-} != 1 ]]; then
  timeout -v 2m git pull --ff-only 9>&- # 네트워크가 멈춰도 잠금을 문 채 기다리지 않게, git이 띄운 gc가 잠금을 물고 남지 않게
  DEPLOY_PULLED=1 exec bash deploy/deploy.sh "$@"
fi
commit=$(git rev-parse HEAD) # 끝에서 HEAD를 다시 읽으면 빌드 중에 생긴 커밋까지 배포된 것으로 기록된다

mise install
eval "$(mise env -s bash)"

# 빌드가 dist/를 비우고 다시 만드는 동안에도 Caddy는 LIVE를 서빙하므로 사이트는 그대로다
pnpm install --frozen-lockfile
pnpm build

if [[ $mode != ci ]]; then
  if [[ ! -f $CADDY_SNIPPET ]]; then
    echo "⚠ 서버 Caddy 설정($CADDY_SNIPPET)이 없습니다. Caddy가 blog를 서빙하지 않습니다" >&2
  elif ! cmp -s deploy/Caddyfile "$CADDY_SNIPPET"; then
    echo "⚠ deploy/Caddyfile이 서버 Caddy 설정($CADDY_SNIPPET)과 다릅니다. 둘을 같게 맞추세요" >&2
  fi
fi
for f in index.html 404.html; do
  if [[ ! -s "dist/$f" ]]; then
    echo "✗ 빌드 결과에 $f 파일이 없어 배포를 중단합니다" >&2
    exit 1
  fi
done

if [[ $mode != deploy ]]; then
  echo "✓ 검사 통과 ($1: 사이트는 교체하지 않음)"
  exit 0
fi

# 내용이 같은 파일은 mtime(=Caddy ETag)을 유지하고(--checksum --no-times), 바뀐 파일은 끝에 한꺼번에 교체한다
# 끊긴 실행이 남긴 임시 폴더(.~tmp~)는 다음 실행에서 지운다
rsync -a --no-times --checksum --delay-updates --delete-after --filter='R .~tmp~/' dist/ "$LIVE/"

mkdir -p deploy/logs
echo "$commit" > deploy/logs/deployed-commit # cron.sh가 이미 배포한 커밋인지 판단하는 데 쓴다
# cron.sh가 이 줄에서 페이지 수를 읽어 로그에 남긴다
echo "✅ $(date -Is) — $(find "$LIVE" -name '*.html' | wc -l) pages"
