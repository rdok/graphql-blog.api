import {GraphQLServer, PubSub} from 'graphql-yoga'

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

import PostEvent from './events/post'
import CommentEvent from './events/comment'

import Validator from './validator/index'

const pubsub = new PubSub()
const postEvent = new PostEvent({pubsub})
const commentEvent = new CommentEvent({pubsub})

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://prisma:4466"
})

const validator = new Validator({prisma});

const dataSources = () => ({
    blogAPI: () => ({
        users: new UserAPI({prisma, validator}),
        posts: new PostAPI({prisma, validator, postEvent}),
        comments: new CommentAPI({prisma, validator, commentEvent}),
    })
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {Query, Mutation, Post, User, Comment, Subscription},
    context: {dataSources, postEvent, commentEvent}
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
