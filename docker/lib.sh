docker-compose-dev() {
  docker-compose \
    --project-directory "${PROJECT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose.dev.yml \
    "$@"
}

docker-compose-production() {
  docker-compose \
    --project-directory "${PROJECT_DIR}" \
    --file ./docker/docker-compose.yml \
    --file ./docker/docker-compose.production.yml \
    "$@"
}

prisma-deploy() {
  docker run --rm \
    --env PRISMA_CLOUD_SESSION_KEY="$PRISMA_SECRET" \
    --env PRISMA_SECRET="$PRISMA_SECRET" \
    --env PRISMA_ENDPOINT="$PRISMA_ENDPOINT" \
    rdok/graphql-blog-api:prisma /bin/sh -c "
      prisma login
      prisma deploy
    "
}
