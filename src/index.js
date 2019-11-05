import { GraphQLServer } from 'graphql-yoga'
import { setupMaster } from 'cluster'

const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
        add(firstNumber: Float!, secondNumber: Float!): Float!
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
        },
        greeting(parent, args, context, info) {
            console.log(args)
            return `Greetings ${args.name || 'Hello World'}. ${args.position} is awesome!`
        },
        add(_, args) {
            return args.firstNumber + args.secondNumber
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))