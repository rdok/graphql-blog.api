#!/bin/bash

SCRIPT_DIR="$(
cd "$(dirname "$0")"
pwd -P
)/../"

docker-compose \
   --project-directory "${SCRIPT_DIR}" \
   --file ./docker/docker-compose.yml \
   --file ./docker/docker-compose.dev.yml \
   down
