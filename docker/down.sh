#!/bin/bash
PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."
source "${PROJECT_DIR}/docker/lib.sh"

docker-compose-production down
