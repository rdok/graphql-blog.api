const query = `
    type Query {
        users(query: String): [ User! ] !
        currentUser: User!
        post: Post!
        posts(query: String): [ Post! ] !
        comments: [Comment!]!
    }
`

export { query }