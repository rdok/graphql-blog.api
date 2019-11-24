#!/bin/bash
PROJECT_DIR="$(
  # shellcheck disable=SC2164
  cd "$(dirname "$0")"
  pwd -P
)/.."
# shellcheck source=docker/lib.sh
source "${PROJECT_DIR}/docker/lib.sh"

if [ $# -eq 0 ]; then
  echo "Required argument missing: production or dev"
  exit 1
fi

docker-compose-"${1}" run --rm api /bin/sh -c "
  npm install
  npm run test
"
