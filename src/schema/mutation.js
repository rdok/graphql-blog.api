const mutation = `
    type Mutation {
        createUser( input: CreateUserInput ): User!
        createPost( input: CreatePostInput ): Post!
        createComment( input: CreateCommentInput ): Comment!
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