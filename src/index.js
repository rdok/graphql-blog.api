import { GraphQLServer, PubSub } from 'graphql-yoga'

import db from './db'
import UserAPI from './dataSources/user'
import PostAPI from './dataSources/post'
import CommentAPI from './dataSources/comment'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'

const dataSources = () => ({
    blogAPI: () => ({
        users: new UserAPI({ db }),
        posts: new PostAPI({ db }),
        comments: new CommentAPI({ db }),
    })
})

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: { Query, Mutation, Post, User, Comment, Subscription },
    context: { dataSources, pubsub }
})

const options = {
    port: process.env.VIRTUAL_PORT || 4000,
    playground: '/',
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
}

server.start(
    options,
    ({ port }) => console.log(`Playground http://localhost:${port}/`)
)
