import { GraphQLServer } from 'graphql-yoga'
import { typeDefs } from './schema/typeDefs'
import { resolvers } from './resolvers'

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))