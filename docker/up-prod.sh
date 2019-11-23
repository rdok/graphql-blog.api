#!/bin/bash

PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."

docker-prisma-img-build() {
  docker build --tag rdok/graphql-blog-api:master . \
    -f "${PROJECT_DIR}/docker/api/Dockerfile"
}

prisma-deploy() {
  docker run --rm --env PRISMA_CLOUD_SESSION_KEY="$PRISMA_CLOUD_SESSION_KEY" \
    rdok/graphql-blog-api:master /bin/sh -c "
    prisma login
    prisma deploy
"
}

docker-compose-app() {
  docker-compose \
    --project-directory "${PROJECT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose.production.yml \
    "$@"
}

docker-prisma-img-build
docker-compose-app build

# Optimized for the least downtime
prisma-deploy
docker-compose-app down --remove-orphans
docker-compose-app up --detach
