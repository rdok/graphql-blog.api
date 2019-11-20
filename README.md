# graphql-blog [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api/)

Hands on GraphQL using Node.js, Prisma, auth, Apollo Client. 

## Production
$ `./docker/up production`

## Development
Copy .env.example to .env, and fill variables.

$ `./docker/up.sh dev`

> Visit http://localhost:$VIRTUAL_PORT It takes some additional seconds, as the api docker service waits for prisma & the database to be up and running, as well as installing node depedencies.

e.g. `docker logs graphql-blog-api_api_1` 

### Info
- Generate auth token for accessing local prisma $ `prisma token`. Pass this value as an authorization header (bearer)

