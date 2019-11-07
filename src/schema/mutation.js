const mutation = `
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }
`

export { mutation }