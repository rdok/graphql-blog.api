#!/bin/bash
PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/.."
source "${PROJECT_DIR}/docker/lib.sh"

docker-compose-dev build
docker-compose-dev down --remove-orphans
docker-compose-dev up --detach

containerName='graphql-blog-api_api_1'
stateStatus=$(docker inspect -f '{{.State.Status}}' $containerName)
until [ "$stateStatus" == "running" ]; do sleep 1; done

docker exec -it $containerName [[ -d node_modules ]] || npm install -g prisma
docker exec -it $containerName [[ -d node_modules ]] || npm install
docker exec -it $containerName /bin/sh -c "
  echo '---> Waiting Prisma...'
  ./docker/wait-for-it.sh 'prisma:4466'
  prisma deploy
  echo '---> Token'
  prisma token
  prisma deploy -e .env.testing
  npm run get-schema
  npm run dev
"
