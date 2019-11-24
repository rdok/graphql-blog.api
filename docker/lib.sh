PROJECT_DIR="$(
  # shellcheck disable=SC2164
  cd "$(dirname "$0")"
  pwd -P
)/.."

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

build-infrastructure-img() {
  docker build --tag rdok/graphql-blog-api:infrastructure . -f "${PROJECT_DIR}/docker/api/Dockerfile-infrastructure"
}

build-prisma-img() {
  docker build --tag rdok/graphql-blog-api:prisma . -f "${PROJECT_DIR}/docker/api/Dockerfile-prisma"
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
