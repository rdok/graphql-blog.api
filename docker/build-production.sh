#!/bin/bash
PROJECT_DIR="$(
  # shellcheck disable=SC2164
  cd "$(dirname "$0")"
  pwd -P
)/.."
# shellcheck source=docker/lib.sh
source "${PROJECT_DIR}/docker/lib.sh"

# Infrastructure docker api image
docker build --tag rdok/graphql-blog-api:infrastructure . -f "${PROJECT_DIR}/docker/api/Dockerfile-infrastructure"
docker build --tag rdok/graphql-blog-api:prisma . -f "${PROJECT_DIR}/docker/api/Dockerfile-prisma"

docker-compose-production build
