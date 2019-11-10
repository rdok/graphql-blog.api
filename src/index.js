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

import PostEvent from './events/post'
import CommentEvent from './events/comment'

const pubsub = new PubSub()
const postEvent = new PostEvent({ pubsub })
const commentEvent = new CommentEvent({ pubsub })

const dataSources = () => ({
    blogAPI: () => ({
        users: new UserAPI({ db, pubsub }),
        posts: new PostAPI({ db, postEvent }),
        comments: new CommentAPI({ db, commentEvent }),
    })
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: { Query, Mutation, Post, User, Comment, Subscription },
    context: { dataSources, postEvent, commentEvent }
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
