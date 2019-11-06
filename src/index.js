import { GraphQLServer } from 'graphql-yoga'

import { typeDefs } from './typeDefs'
import { usersResolver } from './resolvers/users'
import { currentUser } from './resolvers/currentUser'
import { post } from './resolvers/post'

const resolvers = {
    Query: {
        users(parent, args) { return usersResolver(args) },
        currentUser() { return currentUser() },
        post() { return post() },
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))