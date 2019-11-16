#!/bin/bash

SCRIPT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/../"

main() {
  docker-compose \
    --project-directory "${SCRIPT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose."${1}".yml \
    "${@:2}"
}

main "${1}" build --pull
main "${1}" down --remove-orphans
main "${1}" up --detach
