import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
        hello( name: String): String!
        name: String!
        location: String!
        bio: String!
    }
`

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        name() {
            return 'name'
        },
        location() {
            return 'loocatoin'
        },
        bio() {
            return 'bio'
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))