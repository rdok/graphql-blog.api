# graphql-blog [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api/)

Hands on GraphQL using Node.js, Prisma, auth, Apollo Client. 

## Production
$ `./docker/up.sh production`

## Development
Copy .env.example to .env, and fill variables.

$ `./docker/up.sh dev`

> Visit http://localhost:$VIRTUAL_PORT It takes some additional seconds, as the api docker service waits for prisma & the database to be up and running, as well as installing node depedencies.

e.g. `docker logs graphql-blog-api_api_1` 


## Infrastructure
Initially the infrastructure was setup on a custom Linux machine. However, because the prisma docker container is quite memory expensive, and with this project being for hobby purposes; both the prisma and the database docker services were moved to heroku & prisma cloud.

Reference to the initial setup; was quite useful & good learning opportunity for future reference.

https://github.com/rdok/graphql-blog.api/tree/v1.0.0

