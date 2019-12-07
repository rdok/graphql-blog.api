#!/bin/bash

source "./docker/lib.sh"

containerName='graphql-blog-api-test'
stateStatus=$(docker inspect -f '{{.State.Status}}' $containerName)
until [ "$stateStatus" == "running" ]; do sleep 1; done

docker exec $containerName npm install -g prisma
docker exec $containerName npm install
docker exec $containerName /bin/sh -c "
  echo '---> Waiting Prisma...'
  ./docker/wait-for-it.sh 'prisma:4466'
  # due to bug https://github.com/prisma/prisma/issues/4419
  export PRISMA_ENDPOINT=http://prisma:4466/default/test
  prisma deploy -e .env.testing
  npm run get-schema
"
