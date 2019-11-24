#!/bin/bash
PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."
source "${PROJECT_DIR}/docker/lib.sh"

# Optimized for the least downtime
prisma-deploy
docker-compose-production down --remove-orphans
docker-compose-production up --detach
