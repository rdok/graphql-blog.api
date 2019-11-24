#!/bin/bash
PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."
source "${PROJECT_DIR}/docker/lib.sh"

if [ $# -eq 0 ]; then
  echo "Required argument missing: production or local"
  exit 1
fi

docker-compose-"${1}" run api npm run test
