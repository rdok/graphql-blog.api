const mutation = `
    type Mutation {
        createUser( input: CreateUserInput! ): User!
        deleteUser(id: ID!): User!
        createPost( input: CreatePostInput! ): Post!
        deletePost(id: ID!): Post!
        createComment( input: CreateCommentInput! ): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int 
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        author: ID!
        post: ID!
        text: String! 
    }
`

export { mutation }