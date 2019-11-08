const Mutation = {
    createUser(_, { input }, { dataSources }) {
        return dataSources().blogAPI().users.create(input)
    },
    updateUser(_, { id, input }, { dataSources }) {
        return dataSources().blogAPI().users.update(id, input)
    },
    deleteUser(_, args, { dataSources }) {
        return dataSources().blogAPI().users.delete(args)
    },
    createPost(_, args, { dataSources }) {
        return dataSources().blogAPI().posts.create(args.input)
    },
    updatePost(_, { id, input }, { dataSources }) {
        return dataSources().blogAPI().posts.update(id, input)
    },
    deletePost(_, args, { dataSources }) {
        return dataSources().blogAPI().posts.delete(args)
    },
    createComment(_, args, { dataSources }) {
        return dataSources().blogAPI().comments.create(args.input)
    },
    updateComment(_, { id, input }, { dataSources }) {
        return dataSources().blogAPI().comments.update(id, input)
    },
    deleteComment(_, args, { dataSources }) {
        return dataSources().blogAPI().comments.delete(args)
    },
}

export { Mutation as default }