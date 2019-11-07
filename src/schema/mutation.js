const mutation = `
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(
            title: String!, body: String!, published: Boolean!, author: ID!
        ): Post!
    }
`

export { mutation }