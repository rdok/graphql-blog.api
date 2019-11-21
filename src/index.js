import {GraphQLServer} from 'graphql-yoga'

import {Prisma} from 'prisma-binding'
import UserAPI from './dataSources/user'
import PostAPI from './dataSources/post'
import CommentAPI from './dataSources/comment'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'

import Validator from './validator/index'
import Auth from "./services/auth";
import AuthMiddleware from "./middleware/auth";

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://prisma:4466",
    secret: process.env.PRISMA_SECRET
})

const validator = new Validator({prisma});
const auth = new Auth({prisma, validator});

const dataSources = () => ({
    blogAPI: () => ({
        users: new UserAPI({prisma, validator, auth}),
        posts: new PostAPI({prisma, validator, auth}),
        comments: new CommentAPI({prisma, validator}),
    })
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {Query, Mutation, Post, User, Comment, Subscription},
    context(app) {
        return {dataSources, prisma, app, auth}
    },
    middlewares: [AuthMiddleware]
})

const options = {
    port: process.env.VIRTUAL_PORT || 4000,
    playground: '/',
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
}

server.start(
    options,
    ({port}) => console.log(`Playground http://localhost:${port}/`)
)
