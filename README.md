# graphql-blog [![Build Status](https://jenkins.rdok.dev/buildStatus/icon?job=graphql-blog%2Fapi)](https://jenkins.rdok.dev/view/Training/job/graphql-blog/job/api/)
Hands on practise: 
- GraphQL using Node.js, Prisma, auth, Apollo Client. 
- [Udemy - The Modern GraphQL Bootcamp](https://www.udemy.com/course/graphql-bootcamp/)
- [GraphQL Yoga](https://github.com/prisma-labs/graphql-yoga)
- [Prisma Cloud as ORM](https://www.prisma.io/cloud)
- [Prisma Server on Heroku](https://www.prisma.io/blog/heroku-integration-homihof6eifi)
- [Jenkins CI/CD](https://jenkins.rdok.dev/view/Training/job/graphql-blog/)
- [Docker for Web Node Server & DNS & SSL](https://github.com/rdok/graphql-blog.api/tree/master/docker)
- [Alternative Approach: All services through docker](https://github.com/rdok/graphql-blog.api/tree/v1.0.0)

## Production
See Jenkinsfile

## Development
The following script will run all the developer dependency commands. 
And at the end it starts the web server. Which you can interact with, e.g. pressing rs will restart the server.

When you want to execute a command you may use the running container 
`graphql-blog-api_api_1`. E.g.: 
$ `docker exec -it graphql-blog-api_api_1 {npm run dev|prisma deploy|etc}`

Copy .env.example to .env, and fill variables.
$ `./docker/up-dev.sh`

#### Useful commands 
- $ `prisma login|token|deploy`
- $ `npm run get-schema`


## Infrastructure
Initially the infrastructure was setup on a custom Linux machine, with all dependency provided by docker services. However, because the prisma docker container is quite memory expensive even when idle, and with this project being for dev purposes; both the prisma and the database docker services were moved to prisma cloud & heroku respectively.
As for the node web server, that still lives on premises, due to SSL support from docker.

Reference to the initial setup; useful & good learning opportunity for future reference.
https://github.com/rdok/graphql-blog.api/tree/v1.0.0

