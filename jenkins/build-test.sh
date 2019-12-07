#!/bin/bash

source "../docker/lib.sh"

build-infrastructure-img

docker-compose-dev build

