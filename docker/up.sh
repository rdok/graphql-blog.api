#!/bin/bash

PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/../"

main() {
  docker build --tag rdok/graphql-blog-api:build . \
    -f "${PROJECT_DIR}docker/api/Dockerfile.infrastructure"

  docker-compose \
    --project-directory "${PROJECT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose."${1}".yml \
    "${@:2}"
}

main "${1}" build
main "${1}" down --remove-orphans

main "${1}" up --detach
