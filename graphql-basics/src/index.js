import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
        me: User!,
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
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
        },
        post() {
            return {
                id: 2049,
                title: 'NextGen',
                body: 'Description Value',
                published: true,
            }
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))

