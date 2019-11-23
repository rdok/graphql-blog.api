#!/bin/bash

PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."

prisma-deploy() {
  docker run --rm \
    --env PRISMA_CLOUD_SESSION_KEY="$PRISMA_SECRET" \
    --env PRISMA_SECRET="$PRISMA_SECRET" \
    --env PRISMA_ENDPOINT="$PRISMA_ENDPOINT" \
    rdok/graphql-blog-api:prisma /bin/sh -c "
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

# Infrastructure docker api image
docker build --tag rdok/graphql-blog-api:infrastructure . -f "${PROJECT_DIR}/docker/api/Dockerfile.infrastructure"
# Prisma Image to deploy new schema
docker build --tag rdok/graphql-blog-api:prisma . -f "${PROJECT_DIR}/docker/api/Dockerfile.prisma"

docker-compose-app build
# Optimized for the least downtime
prisma-deploy
docker-compose-app down --remove-orphans
docker-compose-app up --detach
