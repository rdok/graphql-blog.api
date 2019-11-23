#!/bin/bash

PROJECT_DIR="$(
  cd "$(dirname "$0")"
  pwd -P
)/../"

docker-compose-app() {
  docker-compose \
    --project-directory "${PROJECT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose.dev.yml \
    "$@"
}

docker-compose-app build
docker-compose-app down --remove-orphans
docker-compose-app up --detach


containerName='graphql-blog-api_api_1'
stateStatus=$(docker inspect -f '{{.State.Status}}' $containerName)

until [ "$stateStatus" == "running" ]; do sleep 1; done


docker exec -it $containerName npm install -g prisma
docker exec -it $containerName npm install
docker exec -it $containerName /bin/sh -c "
  ./docker/wait-for-it.sh 'prisma:4466'
  prisma deploy
  npm run get-schema
  npm run dev
"
