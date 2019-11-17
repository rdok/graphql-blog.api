# graphql-blog [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api/)

Hands on GraphQL using Node.js, Prisma, auth, Apollo Client. 

## Production
$ `./docker/up production`

## Development
$ `./docker/up.sh dev`
$ `docker exec -it graphql-blog-api_api_1 sh`
$ `npm install -g prisma`
$ `npm install`
$ `prisma deploy`
$ `npm run get-schema`
$ `npm run dev`
