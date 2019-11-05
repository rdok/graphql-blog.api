import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

const resolvers = {
    Query: {
        title() { return 'Product Title' },
        price() { return 15.99 },
        releaseYear() { return 1969 },
        rating() { return null },
        inStock() { return false }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on http://localhost:4000'))

