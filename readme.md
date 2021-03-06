# Graphql-Blog.API 
> Dev project hands-on GraphQL practise and showcasing the full pipeline, from develop to production. 
>
API Production [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api/) 

API Test [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi-test)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api-test/)

[Client](https://graphql-blog.rdok.dev/)

- [GraphQL Yoga](https://github.com/prisma-labs/graphql-yoga)
- [Prisma Cloud as ORM](https://www.prisma.io/cloud)
- [Prisma Server on Heroku](https://rdok-graphqlblogapi-c55c12f92a.herokuapp.com/)
- [Jenkins CI/CD](https://jenkins.rdok.dev/view/Training/job/graphql-blog/)
- [Docker for Web Node Server & DNS & SSL](https://github.com/rdok/graphql-blog.api/tree/master/docker)
- [Alternative Approach: All services through docker](https://github.com/rdok/graphql-blog.api/tree/v1.0.0)
- [Custom Docker Images](https://hub.docker.com/repository/docker/rdok/prisma-cli)
- [Udemy - The Modern GraphQL Bootcamp](https://www.udemy.com/course/graphql-bootcamp/)


## Development
Copy .env.example to .env, and modify as per your needs.

The following script will run all the developer dependency commands. Creating web server, db server, and prisma server through docker containers.
When finished, you may interact with the web server for your dev needs, e.g. pressing `rs` will restart the nodemod server.

$ `./docker/up-dev.sh`

When you want to execute a command you may use the running container 
`graphql-blog-api_api_1`. E.g.: 
$ `docker exec -it graphql-blog-api_api_1 {npm install|prisma deploy|etc}`


#### Useful commands 
- $ `prisma login|token|deploy`
- $ `npm run get-schema`


## Infrastructure
Initially the infrastructure was setup on a custom Linux machine, with all dependency provided by docker services. However, because the prisma docker container is quite memory expensive even when idle, and with this project primary intent being hands on experience; both the prisma and the database docker services were moved to prisma cloud & heroku respectively.
As for the node web server, that still lives on premises.

Reference to the initial setup; useful & good learning opportunity for future reference.
https://github.com/rdok/graphql-blog.api/blob/v1.0.0/docker/docker-compose.yml
