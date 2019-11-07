const typeDefs = `
    type Query {
        users(query: String): [ User! ] !
        currentUser: User!
        post: Post!
        posts(query: String): [ Post! ] !
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
    }
`

export { typeDefs }