import {GraphQLServer} from 'graphql-yoga'

import UserAPI from './dataSources/user'
import PostAPI from './dataSources/post'
import CommentAPI from './dataSources/comment'

import Validator from './validator/index'
import Auth from "./services/auth";
import AuthMiddleware from "./middleware/auth";

import prisma from './prisma'
import {resolvers, fragmentReplacements} from "./resolvers";

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
    resolvers,
    context(app) {
        return {dataSources, prisma, app, auth, validator}
    },
    middlewares: [AuthMiddleware],
    fragmentReplacements
})

export {server as default}
