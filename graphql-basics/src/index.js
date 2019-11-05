import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`

const resolvers = {
    Query: {
        me() {
            return {
                id: 2077,
                name: 'Cyberpunk',
                email: 'cyber@moon.space'
            }
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))

