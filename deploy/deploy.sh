#!/usr/bin/env bash
# 서버 배포: 최신 커밋을 받아 빌드하고, 검사를 통과하면 Caddy가 서빙하는 폴더를 교체한다
# 사용법: deploy/deploy.sh [--dry-run | --ci]
#   --dry-run  최신 커밋을 받아 빌드와 검사까지만 하고 사이트는 교체하지 않음
#   --ci       CI용. checkout한 커밋 그대로 빌드하고 검사만 함
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

# sudo로 실행하면 root 소유 파일(node_modules 등)이 남아 다음 배포가 실패한다
if [[ $EUID -eq 0 ]]; then
  echo "✗ root가 아닌 본인 계정으로 실행하세요" >&2
  exit 1
fi

cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.."

# 두 실행이 겹치면 한쪽의 pull·빌드가 다른 쪽이 복사 중인 빌드 결과를 바꿔, rsync가 사이트 파일까지 지울 수 있다
exec 9>/tmp/astro-paper-deploy.lock
if ! flock -n 9; then
  echo "✗ 다른 배포가 실행 중입니다" >&2
  exit 1
fi

# 최신 커밋 받기 (서버에서 직접 고친 내용 때문에 merge가 필요하면 여기서 멈춤)
# bash는 이미 연 스크립트를 계속 읽으므로, pull로 바뀐 내용이 이번 실행부터 적용되게 다시 실행한다
if [[ $mode != ci && ${DEPLOY_PULLED:-} != 1 ]]; then
  git pull --ff-only 9>&- # git이 백그라운드로 띄우는 gc가 잠금(fd 9)을 물고 남지 않게 닫는다
  DEPLOY_PULLED=1 exec bash deploy/deploy.sh "$@"
fi

# mise.toml의 Node·pnpm 버전 사용 (스크립트에서는 mise가 자동으로 켜지지 않음)
mise install
eval "$(mise env -s bash)"

# 빌드는 dist/를 비우고 다시 만든다. Caddy는 dist/가 아니라 LIVE를 서빙하므로 빌드 중에도 사이트는 그대로
pnpm install --frozen-lockfile
pnpm build

# deploy/Caddyfile은 서버 Caddy 설정의 사본이다. 서버 설정이 없거나 한쪽만 고쳤으면 알려준다 (배포는 계속함)
if [[ $mode != ci ]]; then
  if [[ ! -f $CADDY_SNIPPET ]]; then
    echo "⚠ 서버 Caddy 설정($CADDY_SNIPPET)이 없습니다. Caddy가 blog를 서빙하지 않습니다" >&2
  elif ! cmp -s deploy/Caddyfile "$CADDY_SNIPPET"; then
    echo "⚠ deploy/Caddyfile이 서버 Caddy 설정($CADDY_SNIPPET)과 다릅니다. 둘을 같게 맞추세요" >&2
  fi
fi
# Caddy 설정은 index.html과 404.html이 있다고 보고 서빙하므로, 없으면 빌드가 잘못된 것
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

# 빌드는 매번 모든 파일을 새로 쓰므로, 내용이 같은 파일은 건드리지 않아(--checksum, --no-times) mtime을 유지한다
# Caddy의 ETag는 mtime으로 만들어지므로, 그래야 바뀌지 않은 페이지·폰트·이미지를 브라우저가 304로 다시 쓴다
# 바뀐 파일은 다 받은 뒤 마지막에 연달아 제자리로 옮기고(--delay-updates), 없어진 파일은 그다음에 지운다(--delete-after)
# 중간에 끊기면 다시 실행하면 된다. 끊긴 실행이 남긴 임시 폴더(.~tmp~)는 다음 실행에서 지운다 (--filter R)
# 복사하는 동안 이 폴더에서 pnpm build를 따로 돌리지 않는다: 빌드가 dist/를 먼저 비운다
rsync -a --no-times --checksum --delay-updates --delete-after --filter='R .~tmp~/' dist/ "$LIVE/"

echo "✅ $(date -Is) — $(find "$LIVE" -name '*.html' | wc -l) pages"
