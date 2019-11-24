#!/bin/bash
PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."
source "${PROJECT_DIR}/docker/lib.sh"

# Infrastructure docker api image
docker build --tag rdok/graphql-blog-api:infrastructure . -f "${PROJECT_DIR}/docker/api/Dockerfile.infrastructure"
# Prisma Image to deploy new schema
docker build --tag rdok/graphql-blog-api:prisma . -f "${PROJECT_DIR}/docker/api/Dockerfile.prisma"

docker-compose-production build
