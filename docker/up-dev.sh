#!/bin/bash
source "./docker/lib.sh"

build-infrastructure-img

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
  # due to bug https://github.com/prisma/prisma/issues/4419
  export PRISMA_ENDPOINT=http://prisma:4466/default/test
  prisma deploy -e .env.testing
  export PRISMA_ENDPOINT=http://prisma:4466/
  npm run get-schema
  npm run dev
"
