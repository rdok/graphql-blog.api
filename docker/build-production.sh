#!/bin/bash
# shellcheck source=docker/lib.sh
source "./docker/lib.sh"

# Infrastructure docker api image
build-infrastructure-img
build-prisma-img

docker-compose-production build
